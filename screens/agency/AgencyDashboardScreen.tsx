
import { StyleSheet, ScrollView, View } from "react-native"
import { Text, Card, Button, Title, ProgressBar } from "react-native-paper"
import { useAuth } from "../../contexts/AuthContext"
import { useRelayPoints } from "../../contexts/RelayPointContext"
import { usePackages } from "../../contexts/PackageContext"
import { useNavigation } from "@react-navigation/native"
import * as Animatable from "react-native-animatable"
import { Ionicons } from "@expo/vector-icons"
import { PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

const AgencyDashboardScreen = () => {
  const { user } = useAuth()
  const { relayPoints, getManagedRelayPoints } = useRelayPoints()
  const { packages } = usePackages()
  const navigation = useNavigation()

  const managedRelayPoints = getManagedRelayPoints()
  const activeRelayPoints = managedRelayPoints.filter((point) => point.isActive)
  const inactiveRelayPoints = managedRelayPoints.filter((point) => !point.isActive)

  // Calculer les statistiques globales
  const totalPackagesProcessed = managedRelayPoints.reduce((sum, point) => sum + point.stats.packagesProcessed, 0)
  const totalPackagesInTransit = managedRelayPoints.reduce((sum, point) => sum + point.stats.packagesInTransit, 0)
  const totalPackagesDelivered = managedRelayPoints.reduce((sum, point) => sum + point.stats.packagesDelivered, 0)

  // Données pour le graphique
  const chartData = [
    {
      name: "En transit",
      population: totalPackagesInTransit,
      color: "#2196F3",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Livrés",
      population: totalPackagesDelivered,
      color: "#4CAF50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ]

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={800} style={styles.header}>
        <Text style={styles.greeting}>Bonjour, {user?.name}</Text>
        <Text style={styles.subGreeting}>Tableau de bord de l'agence</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300} duration={800}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Aperçu des points relais</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="location" size={24} color="#FF6B00" />
                <Text style={styles.statValue}>{managedRelayPoints.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{activeRelayPoints.length}</Text>
                <Text style={styles.statLabel}>Actifs</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
                <Text style={styles.statValue}>{inactiveRelayPoints.length}</Text>
                <Text style={styles.statLabel}>Inactifs</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("RelayPointManagement" as never)}
              style={styles.actionButton}
            >
              Gérer les points relais
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Statistiques des colis</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="cube" size={24} color="#FF6B00" />
                <Text style={styles.statValue}>{totalPackagesProcessed}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time" size={24} color="#2196F3" />
                <Text style={styles.statValue}>{totalPackagesInTransit}</Text>
                <Text style={styles.statLabel}>En transit</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-done" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{totalPackagesDelivered}</Text>
                <Text style={styles.statLabel}>Livrés</Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <PieChart
                data={chartData}
                width={Dimensions.get("window").width - 64}
                height={180}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Points relais les plus actifs</Text>
        {managedRelayPoints.length > 0 ? (
          managedRelayPoints
            .sort((a, b) => b.stats.packagesProcessed - a.stats.packagesProcessed)
            .slice(0, 3)
            .map((point) => (
              <Card
                key={point.id}
                style={styles.relayPointCard}
                onPress={() => navigation.navigate("RelayPointStats", { relayPointId: point.id } as never)}
              >
                <Card.Content>
                  <View style={styles.relayPointHeader}>
                    <View>
                      <Text style={styles.relayPointName}>{point.name}</Text>
                      <Text style={styles.relayPointAddress}>{point.address}</Text>
                    </View>
                    <View
                      style={[styles.statusIndicator, { backgroundColor: point.isActive ? "#4CAF50" : "#FF3B30" }]}
                    />
                  </View>

                  <View style={styles.progressSection}>
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>Colis traités:</Text>
                      <Text style={styles.progressValue}>{point.stats.packagesProcessed}</Text>
                    </View>
                    <ProgressBar
                      progress={point.stats.packagesProcessed / (totalPackagesProcessed || 1)}
                      color="#FF6B00"
                      style={styles.progressBar}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))
        ) : (
          <Text style={styles.emptyText}>Aucun point relais géré</Text>
        )}

        <Button
          mode="outlined"
          onPress={() => navigation.navigate("CreateRelayPoint" as never)}
          style={styles.createButton}
          icon="plus"
        >
          Créer un nouveau point relais
        </Button>
      </Animatable.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#FF6B00",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subGreeting: {
    fontSize: 16,
    color: "white",
    opacity: 0.8,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  actionButton: {
    marginLeft: "auto",
    backgroundColor: "#FF6B00",
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  relayPointCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  relayPointHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  relayPointName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  relayPointAddress: {
    fontSize: 14,
    color: "#666",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressSection: {
    marginTop: 8,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginVertical: 16,
  },
  createButton: {
    margin: 16,
    borderColor: "#FF6B00",
    borderWidth: 2,
  },
})

export default AgencyDashboardScreen
