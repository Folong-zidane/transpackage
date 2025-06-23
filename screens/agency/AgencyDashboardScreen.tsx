
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

import { LineChart } from "react-native-chart-kit";


const AgencyDashboardScreen = () => {
  const { user } = useAuth()
  const { relayPoints, getManagedRelayPoints } = useRelayPoints()
  const { packages } = usePackages()
  const navigation = useNavigation()

  const managedRelayPoints = getManagedRelayPoints()
  const activeRelayPoints = managedRelayPoints.filter((point) => point.isActive)
  const inactiveRelayPoints = managedRelayPoints.filter((point) => !point.isActive)

  // Calculer les statistiques globales
  {/** 
  const totalPackagesProcessed = managedRelayPoints.reduce((sum, point) => sum + point.stats.packagesProcessed, 0)
  const totalPackagesInTransit = managedRelayPoints.reduce((sum, point) => sum + point.stats.packagesInTransit, 0)
  const totalPackagesDelivered = managedRelayPoints.reduce((sum, point) => sum + point.stats.packagesDelivered, 0)

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  }


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

  */}
  

  {/** la partie des stats des colis en dur */}

  const totalPackagesProcessed = 349;
  const totalPackagesInTransit = 235;
  const totalPackagesDelivered = 114;

  const historyDates = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const historyProcessed = [20, 45, 28, 80, 99, 43, 50];
  const historyInTransit = [10, 30, 20, 60, 70, 25, 40];
  const historyDelivered = [5, 25, 15, 50, 60, 20, 35];

  const screenWidth = Dimensions.get("window").width - 32;

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,        // bleu
    labelColor: () => "#333333",
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#2196F3",
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // lignes pleines
    },
  };

  const data = {
    labels: historyDates,
    datasets: [
      {
        data: historyProcessed,
        color: () => "rgba(255,107,0, 1)", // orange
        strokeWidth: 2,
        withDots: true,
      },
      {
        data: historyInTransit,
        color: () => "rgba(33,150,243, 1)", // bleu
        strokeWidth: 2,
      },
      {
        data: historyDelivered,
        color: () => "rgba(76,175,80, 1)",  // vert
        strokeWidth: 2,
      },
    ],
    legend: ["Total", "En transit", "Livrés"],
  };



  return (
    <ScrollView style={styles.container}>
      {/**  partie non importante
        <Animatable.View animation="fadeIn" duration={800} style={styles.header}>
          <Text style={styles.greeting}>Bonjour, {user?.name}</Text>
          <Text style={styles.subGreeting}>Tableau de bord de l'agence</Text>
        </Animatable.View>
      */}

      <Animatable.View animation="fadeInUp" delay={300} duration={800}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Aperçu des points relais</Title>
            {/**  bonne partie mais le contexte qui gere l'activation
                 des points ne fonctionnen pas bien... a faire plus tard
             
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
            </View>*/}

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="location" size={24} color="#FF6B00" />
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.statValue}>4</Text>
                <Text style={styles.statLabel}>Actifs</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
                <Text style={styles.statValue}>1</Text>
                <Text style={styles.statLabel}>Inactifs</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/** la partie pour la gestion */}
        <View style={styles.actionButtonContainer}>
          <Button
              mode="contained"
              onPress={() => navigation.navigate("Logistique" as never)}
              style={styles.actionButton}
            >
              Créer ma logistique
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("RelayPointManagement" as never)}
              style={styles.actionButton}
            >
              Gérer les points relais
            </Button>
        </View>

        {/** Partie pour les statistiques des colis */}

        <Card style={styles.card}>
          <Card.Content>
            <Title>Statistiques des colis</Title>
  
            {/* Résumé rapide */}
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
  
            {/* Courbes d'évolution */}
            <LineChart
              data={data}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
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
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("CreatePersonnel" as never)}
          style={styles.createButton}
          icon="plus"
        >
          Ajouter un nouveau personnel
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
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
   
    padding: 8,
   
  },
  actionButton: {
    backgroundColor: "#FF6B00",
    marginHorizontal: 4,
    
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
