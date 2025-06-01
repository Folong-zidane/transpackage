import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { TextInput, Button, Text, HelperText, Switch } from "react-native-paper"
import { useRoute, useNavigation } from "@react-navigation/native"
import { useRelayPoints } from "../../contexts/RelayPointContext"
import * as Animatable from "react-native-animatable"
import * as Location from "expo-location"
import MapView, { Marker } from "react-native-maps"

const EditRelayPointScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { relayPointId } = route.params as { relayPointId: string }
  const { getRelayPointById, updateRelayPoint, toggleRelayPointStatus } = useRelayPoints()

  const relayPoint = getRelayPointById(relayPointId)

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [openingHours, setOpeningHours] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [location, setLocation] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
  })
  const [loading, setLoading] = useState(false)
  const [mapRegion, setMapRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })

  useEffect(() => {
    if (relayPoint) {
      setName(relayPoint.name)
      setAddress(relayPoint.address)
      setOpeningHours(relayPoint.openingHours)
      setIsActive(relayPoint.isActive)
      setLocation(relayPoint.location)
      setMapRegion({
        ...relayPoint.location,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    }
  }, [relayPoint])

  const validateForm = () => {
    if (!name.trim()) {
      return { valid: false, message: "Veuillez entrer un nom" }
    }

    if (!address.trim()) {
      return { valid: false, message: "Veuillez entrer une adresse" }
    }

    if (!openingHours.trim()) {
      return { valid: false, message: "Veuillez entrer les horaires d'ouverture" }
    }

    return { valid: true }
  }

  const handleLocationSearch = async () => {
    if (!address.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une adresse pour la recherche")
      return
    }

    setLoading(true)
    try {
      const result = await Location.geocodeAsync(address)
      if (result.length > 0) {
        const { latitude, longitude } = result[0]
        setLocation({ latitude, longitude })
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
      } else {
        Alert.alert("Erreur", "Adresse introuvable")
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de trouver la localisation")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    const validation = validateForm()

    if (!validation.valid) {
      Alert.alert("Erreur", validation.message)
      return
    }

    setLoading(true)

    try {
      await updateRelayPoint(relayPointId, {
        name,
        address,
        openingHours,
        location,
      })

      // Mettre à jour le statut si nécessaire
      if (relayPoint && relayPoint.isActive !== isActive) {
        await toggleRelayPointStatus(relayPointId)
      }

      setLoading(false)
      Alert.alert("Succès", "Le point relais a été mis à jour avec succès", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      setLoading(false)
      Alert.alert("Erreur", "Impossible de mettre à jour le point relais. Veuillez réessayer.")
    }
  }

  if (!relayPoint) {
    return (
      <View style={styles.errorContainer}>
        <Text>Point relais non trouvé</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={800} style={styles.formContainer}>
        <Text style={styles.title}>Modifier le point relais</Text>

        <TextInput
          label="Nom du point relais"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="store" />}
          accessible={true}
          accessibilityLabel="Nom du point relais"
          accessibilityHint="Modifiez le nom du point relais"
        />

        <TextInput
          label="Adresse"
          value={address}
          onChangeText={setAddress}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="map-marker" />}
          accessible={true}
          accessibilityLabel="Adresse du point relais"
          accessibilityHint="Modifiez l'adresse du point relais"
        />

        <Button
          mode="outlined"
          onPress={handleLocationSearch}
          loading={loading}
          style={styles.locationButton}
          icon="map-search"
          accessible={true}
          accessibilityLabel="Rechercher la localisation"
          accessibilityHint="Appuyez pour rechercher la localisation à partir de l'adresse"
        >
          Rechercher la localisation
        </Button>

        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={mapRegion}>
            <Marker coordinate={location} draggable onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)} />
          </MapView>
          <HelperText type="info">Vous pouvez déplacer le marqueur pour ajuster la position</HelperText>
        </View>

        <TextInput
          label="Horaires d'ouverture"
          value={openingHours}
          onChangeText={setOpeningHours}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="clock" />}
          placeholder="Ex: Lun-Ven: 9h-18h, Sam: 10h-16h"
          accessible={true}
          accessibilityLabel="Horaires d'ouverture"
          accessibilityHint="Modifiez les horaires d'ouverture du point relais"
        />

        <View style={styles.switchContainer}>
          <Text>Activer ce point relais</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            color="#4CAF50"
            accessible={true}
            accessibilityLabel={`Point relais ${isActive ? "actif" : "inactif"}`}
            accessibilityHint="Appuyez pour activer ou désactiver le point relais"
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
          icon="check"
          accessible={true}
          accessibilityLabel="Enregistrer les modifications"
          accessibilityHint="Appuyez pour enregistrer les modifications du point relais"
        >
          Enregistrer les modifications
        </Button>
      </Animatable.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  locationButton: {
    marginBottom: 15,
  },
  mapContainer: {
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "#FF6B00",
    marginTop: 10,
    paddingVertical: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
})

export default EditRelayPointScreen
