
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Text, Card, Button, Avatar } from "react-native-paper"
import { useAuth } from "../contexts/AuthContext"
import { usePackages } from "../contexts/PackageContext"
import { useRelayPoints } from "../contexts/RelayPointContext"
import { useNavigation } from "@react-navigation/native"
import * as Animatable from "react-native-animatable"
import { Ionicons } from "@expo/vector-icons"

const HomeScreen = () => {
  const { user } = useAuth()
  const { packages, getPackagesByUser } = usePackages()
  const { relayPoints, getActiveRelayPoints } = useRelayPoints()
  const navigation = useNavigation()

  const userPackages = user ? getPackagesByUser(user.id) : []
  const activeRelayPoints = getActiveRelayPoints()

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={800} style={[styles.header, { flexDirection: 'row', alignItems: 'center' }]}>

        <View>
          <Text style={styles.greeting}>Bonjour, {user?.name}</Text>
          <Text style={styles.subGreeting}>Bienvenue sur Pick&Drop Link</Text>
        </View>
        <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate("Assistant" as never)}>
          <Ionicons name="people-outline" size={20} color="white" />
          {/* 
          person-add-outline
          person-outline
          */}
        </TouchableOpacity>
      </Animatable.View>


      <Animatable.View animation="fadeInUp" delay={300} duration={800}>
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Colis", { screen: "EnvoyerColis" } as never)}
            style={[styles.actionButton, styles.sendButton]}
            contentStyle={styles.buttonContent}
            icon={({ size, color }) => <Ionicons name="paper-plane" size={size} color={color} />}
          >
            Déposer un colis
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate("Colis", { screen: "RecevoirColis" } as never)}
            style={[styles.actionButton, styles.receiveButton]}
            contentStyle={styles.buttonContent}
            icon={({ size, color }) => <Ionicons name="archive" size={size} color={color} />}
          >
            Recevoir un colis
          </Button>
        </View>

        <Card style={styles.statsCard}>
          <Card.Title title="Vos statistiques" />
          <Card.Content style={styles.statsContent}>
            <View style={styles.statItem}>
              <Ionicons name="cube" size={24} color="#FF6B00" />
              <Text style={styles.statValue}>{userPackages.length}</Text>
              <Text style={styles.statLabel}>Colis</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{userPackages.filter((pkg) => pkg.status === "delivered").length}</Text>
              <Text style={styles.statLabel}>Expédié</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color="#2196F3" />
              <Text style={styles.statValue}>{userPackages.filter((pkg) => pkg.status === "in_transit").length}</Text>
              <Text style={styles.statLabel}>En transit</Text>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Vos colis récents</Text>
        {userPackages.length > 0 ? (
          userPackages.slice(0, 3).map((pkg) => (
            <Card
              key={pkg.id}
              style={styles.packageCard}
              onPress={() =>  navigation.navigate("Colis", { screen: "DetailColis",  params: { packageId: pkg.id },  } as never) }
            >
              <Card.Title
                title={`Colis #${pkg.trackingNumber}`}
                subtitle={`Statut: ${
                  pkg.status === "pending" ? "En attente" : pkg.status === "in_transit" ? "En transit" : "Livré"
                }`}
                left={(props) => <Avatar.Icon {...props} icon="cube" style={{ backgroundColor: "#FF6B00" }} />}
              />
              <Card.Content>
                <Text>{pkg.description}</Text>
                <Text>Poids: {pkg.weight} kg</Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>Vous n'avez pas encore de colis</Text>
        )}

        {userPackages.length > 3 && (
          <Button mode="text" onPress={() => navigation.navigate("Colis" as never)} style={styles.viewAllButton}>
            Voir tous les colis
          </Button>
        )}

        <Text style={styles.sectionTitle}>Points relais à proximité</Text>
        {activeRelayPoints.length > 0 ? (
          activeRelayPoints.slice(0, 2).map((point) => (
            <Card
              key={point.id}
              style={styles.relayPointCard}
              onPress={() =>  navigation.navigate("Points Relais", {  screen: "DetailPointRelais",  params: { relayPointId: point.id },  } as never) }
            >
              <Card.Title
                title={point.name}
                subtitle={point.address}
                left={(props) => <Avatar.Icon {...props} icon="map-marker" style={{ backgroundColor: "#2196F3" }} />}
              />
              <Card.Content>
                <Text>Horaires: {point.openingHours}</Text>
                <Text>Colis traités: {point.stats.packagesProcessed}</Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>Aucun point relais actif trouvé</Text>
        )}

        <Button mode="text" onPress={() => navigation.navigate("Points Relais" as never)} style={styles.viewAllButton}>
          Voir tous les points relais
        </Button>
        
        <Button mode="contained" onPress={() => navigation.navigate("NewPointRelais" as never)} style={styles.viewAllButton} >
          Devenir un point relais
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
  chatButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FF6B00",
    padding: 10,
    borderRadius: 50,
    borderColor: "#FFF",
    borderWidth: 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
    marginHorizontal: 16,
  },

  header: {
    padding: 20,
    backgroundColor: "#FF6B00",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'flex-start',
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  sendButton: {
    backgroundColor: "#FF6B00",
  },
  receiveButton: {
    backgroundColor: "#2196F3",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  statsCard: {
    margin: 16,
    elevation: 4,
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  packageCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    elevation: 2,
  },
  relayPointCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    elevation: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginVertical: 10,
  },
  viewAllButton: {
    alignSelf: "center",
    marginVertical: 5,
  },
})

export default HomeScreen
