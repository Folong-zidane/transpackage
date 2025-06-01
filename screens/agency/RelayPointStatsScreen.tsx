
import { StyleSheet, ScrollView, View, Dimensions } from "react-native"
import { Text, Card, Title, Paragraph, Divider } from "react-native-paper"
import { useRoute } from "@react-navigation/native"
import { useRelayPoints } from "../../contexts/RelayPointContext"
import * as Animatable from "react-native-animatable"
import { Ionicons } from "@expo/vector-icons"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"

const RelayPointStatsScreen = () => {
  const route = useRoute()
  const { relayPointId } = route.params as { relayPointId: string }
  const { getRelayPointById } = useRelayPoints()

  const relayPoint = getRelayPointById(relayPointId)

  if (!relayPoint) {
    return (
      <View style={styles.errorContainer}>
        <Text>Point relais non trouvé</Text>
      </View>
    )
  }

  // Données simulées pour les graphiques
  const monthlyData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }

  const packageTypeData = [
    {
      name: "Standard",
      population: 65,
      color: "#2196F3",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Express",
      population: 25,
      color: "#FF6B00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Volumineux",
      population: 10,
      color: "#4CAF50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ]

  const statusData = {
    labels: ["En attente", "En transit", "Livrés"],
    datasets: [
      {
        data: [
          relayPoint.stats.packagesProcessed - relayPoint.stats.packagesInTransit - relayPoint.stats.packagesDelivered,
          relayPoint.stats.packagesInTransit,
          relayPoint.stats.packagesDelivered,
        ],
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={800}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.relayPointName}>{relayPoint.name}</Title>
            <Paragraph style={styles.relayPointAddress}>{relayPoint.address}</Paragraph>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: relayPoint.isActive ? "#4CAF50" : "#FF3B30",
                  },
                ]}
              />
              <Text style={styles.statusText}>{relayPoint.isActive ? "Actif" : "Inactif"}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Statistiques générales</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="cube" size={24} color="#FF6B00" />
                <Text style={styles.statValue}>{relayPoint.stats.packagesProcessed}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time" size={24} color="#2196F3" />
                <Text style={styles.statValue}>{relayPoint.stats.packagesInTransit}</Text>
                <Text style={styles.statLabel}>En transit</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-done" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>{relayPoint.stats.packagesDelivered}</Text>
                <Text style={styles.statLabel}>Livrés</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Activité mensuelle</Title>
            <Text style={styles.chartSubtitle}>Nombre de colis traités par mois</Text>
            <LineChart
              data={monthlyData}
              width={Dimensions.get("window").width - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
              }}
              bezier
              style={styles.chart}
              accessible={true}
              accessibilityLabel="Graphique d'activité mensuelle"
            />
          </Card.Content>
        </Card>

        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Types de colis</Title>
            <PieChart
              data={packageTypeData}
              width={Dimensions.get("window").width - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
              accessible={true}
              accessibilityLabel="Graphique des types de colis"
            />
          </Card.Content>
        </Card>

        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Statut des colis</Title>
            <BarChart
              data={statusData}
              width={Dimensions.get("window").width - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              }}
              style={styles.chart}
              accessible={true}
              accessibilityLabel="Graphique des statuts de colis"
            />
          </Card.Content>
        </Card>

        <Card style={styles.performanceCard}>
          <Card.Content>
            <Title>Indicateurs de performance</Title>
            <Divider style={styles.divider} />
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Taux de livraison:</Text>
              <Text style={styles.performanceValue}>
                {Math.round((relayPoint.stats.packagesDelivered / relayPoint.stats.packagesProcessed) * 100)}%
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Temps moyen de traitement:</Text>
              <Text style={styles.performanceValue}>1.2 jours</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Satisfaction client:</Text>
              <Text style={styles.performanceValue}>4.8/5</Text>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  relayPointName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  relayPointAddress: {
    color: "#666",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontWeight: "bold",
  },
  statsCard: {
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
  chartCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  chartSubtitle: {
    color: "#666",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  performanceCard: {
    margin: 16,
    marginBottom: 16,
    elevation: 2,
  },
  divider: {
    marginVertical: 10,
  },
  performanceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  performanceLabel: {
    fontSize: 16,
    color: "#666",
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default RelayPointStatsScreen
