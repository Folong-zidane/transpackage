
import { useState } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { Text, FAB, Card } from "react-native-paper"
import { useRelayPoints } from "../../contexts/RelayPointContext"
import { useNavigation } from "@react-navigation/native"
import MapView, { Marker, Callout } from "react-native-maps"
import * as Location from "expo-location"

const RelayPointMapScreen = () => {
  const { relayPoints } = useRelayPoints()
  const navigation = useNavigation()
  const [userLocation, setUserLocation] = useState(null)
  const [mapRegion, setMapRegion] = useState({
    latitude: 3.848,
    longitude: 11.5021,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({})
        const { latitude, longitude } = location.coords

        setUserLocation({
          latitude,
          longitude,
        })

        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      }
    } catch (error) {
      console.error("Error getting location", error)
    }
  }

  const getMarkerColor = (isActive) => {
    return isActive ? "#4CAF50" : "#FF5722"
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion} showsUserLocation={true}>
        {relayPoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={point.location}
            pinColor={getMarkerColor(point.isActive)}
            title={point.name}
            description={point.address}
            onCalloutPress={() => navigation.navigate("DetailPointRelais", { relayPointId: point.id } as never)}
          >
            <Callout tooltip>
              <Card style={styles.calloutCard}>
                <Card.Content>
                  <Text style={styles.calloutTitle}>{point.name}</Text>
                  <Text style={styles.calloutAddress}>{point.address}</Text>
                  <Text style={styles.calloutHours}>{point.openingHours}</Text>
                  <Text style={[styles.calloutStatus, { color: point.isActive ? "#4CAF50" : "#FF5722" }]}>
                    {point.isActive ? "Actif" : "Inactif"}
                  </Text>
                </Card.Content>
              </Card>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <FAB style={styles.fab} icon="crosshairs-gps" onPress={requestLocationPermission} color="#fff" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  calloutCard: {
    width: 200,
    borderRadius: 8,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  calloutAddress: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  calloutHours: {
    fontSize: 12,
    color: "#666",
  },
  calloutStatus: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#2196F3",
  },
})

export default RelayPointMapScreen
