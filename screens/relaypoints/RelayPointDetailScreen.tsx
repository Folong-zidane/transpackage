
import { useState } from "react"
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native"
import { Text, Card, Button, Divider } from "react-native-paper"
import { useRoute, useNavigation } from "@react-navigation/native"
import { useRelayPoints } from "../../contexts/RelayPointContext"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import MapView, { Marker } from "react-native-maps"

const RelayPointDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { relayPointId } = route.params as { relayPointId: string }
  const { getRelayPointById, toggleRelayPointStatus } = useRelayPoints()
  const [loading, setLoading] = useState(false)

  const relayPoint = getRelayPointById(relayPointId)

  if (!relayPoint) {
    return (
      <View style={styles.errorContainer}>
        <Text>Point relais non trouvé</Text>
      </View>
    )
  }

  const handleToggleStatus = async () => {
    setLoading(true)
    try {
      await toggleRelayPointStatus(relayPointId)
      Alert.alert("Succès", `Le point relais a été ${relayPoint.isActive ? "désactivé" : "activé"}`)
    } catch (error) {
      Alert.alert("Erreur", "Impossible de modifier le statut du point relais")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={800}>
        <Card style={styles.card}>

          {/** ici le code de la petite carte qui indique le lieu de point relais
            <Card.Cover source={{ uri: relayPoint.imageUrl }} style={styles.coverImage} /> 
          */}
          
          <Card.Content>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.title}>{relayPoint.name}</Text>
                <Text style={styles.address}>{relayPoint.address}</Text>
              </View>
              {/** 
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>{relayPoint.isActive ? "Actif" : "Inactif"}</Text>
                  <Switch
                    value={relayPoint.isActive}
                    onValueChange={handleToggleStatus}
                    disabled={loading}
                    color="#2196F3"
                  />
                </View>
              */}
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color="#666" style={styles.infoIcon} />
                <View>
                  <Text style={styles.infoLabel}>Horaires d'ouverture</Text>
                  <Text style={styles.infoValue}>{relayPoint.openingHours}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="cube-outline" size={20} color="#666" style={styles.infoIcon} />
                <View>
                  <Text style={styles.infoLabel}>Colis traités</Text>
                  <Text style={styles.infoValue}>{relayPoint.stats.packagesProcessed}</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Localisation" />
          <Card.Content>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: relayPoint.location.latitude,
                  longitude: relayPoint.location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={relayPoint.location}
                  title={relayPoint.name}
                  description={relayPoint.address}
                  pinColor={relayPoint.isActive ? "#4CAF50" : "#FF5722"}
                />
              </MapView>
            </View>

            <Button mode="outlined" onPress={() => {}} style={styles.directionsButton} icon="directions">
              Itinéraire
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Services disponibles" />
          <Card.Content>
            <View style={styles.servicesContainer}>
              <View style={styles.serviceItem}>
                <Ionicons name="cube" size={24} color="#2196F3" />
                <Text style={styles.serviceText}>Envoi de colis</Text>
              </View>
              <View style={styles.serviceItem}>
                <Ionicons name="archive" size={24} color="#FF6B00" />
                <Text style={styles.serviceText}>Réception de colis</Text>
              </View>
              <TouchableOpacity style={styles.serviceItem} onPress={() => {navigation.goBack()}}> 
                <Ionicons name="return-down-back" size={24} color="#4CAF50" />
                <Text style={styles.serviceText}>Retours</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon="phone"
            onPress={() => {}}
            style={[styles.actionButton, { backgroundColor: "#FF6B00" }]}
          >
            Appeler
          </Button>
          <Button
            mode="contained"
            icon="email"
            onPress={() => {}}
            style={[styles.actionButton, { backgroundColor: "#2196F3" }]}
          >
            Email
          </Button>
          <Button
            mode="contained"
            icon="chat"
            onPress={() => {navigation.navigate("Chat" as never)}}
            style={[styles.actionButton, { backgroundColor: "#FF6B00" }]}
          >
            Chater
          </Button>
        </View>
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
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  coverImage: {
    height: 150,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  address: {
    color: "#666",
  },
  statusContainer: {
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  divider: {
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  map: {
    height: "100%",
    width: "100%",
  },
  directionsButton: {
    marginTop: 5,
  },
  servicesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  serviceItem: {
    alignItems: "center",
    width: "30%",
    marginBottom: 15,
  },
  serviceText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
})

export default RelayPointDetailScreen
