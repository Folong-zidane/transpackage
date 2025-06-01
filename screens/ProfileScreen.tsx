import { useState } from "react"
import { StyleSheet, ScrollView, Alert, View } from "react-native"
import { Text, Card, Button, Avatar, List, Divider, Switch } from "react-native-paper"
import { useAuth } from "../contexts/AuthContext"
import { useRelayPoints } from "../contexts/RelayPointContext"
import * as Animatable from "react-native-animatable"
import { Picker } from "@react-native-picker/picker"
import LottieView from "lottie-react-native"

const ProfileScreen = () => {
  const { user, logout, updateUserPreferences, isClient } = useAuth()
  const { relayPoints, getActiveRelayPoints } = useRelayPoints()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedRelayPoint, setSelectedRelayPoint] = useState(user?.activeRelayPointId || "")

  const activeRelayPoints = getActiveRelayPoints()

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        onPress: () => logout(),
        style: "destructive",
      },
    ])
  }

  const handleRelayPointChange = async (relayPointId: string) => {
    setSelectedRelayPoint(relayPointId)
    try {
      await updateUserPreferences({ activeRelayPointId: relayPointId })
      Alert.alert("Succès", "Votre point relais préféré a été mis à jour")
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour votre point relais préféré")
    }
  }

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
    // Dans une vraie application, vous enregistreriez cette préférence
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={800} style={styles.header}>
        <Avatar.Text size={80} label={user?.name.substring(0, 2).toUpperCase() || "U"} style={styles.avatar} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.userType}>{user?.type === "client" ? "Client" : "Agence"}</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300} duration={800}>
        {isClient() && (
          <Card style={styles.card}>
            <Card.Title title="Point relais préféré" />
            <Card.Content>
              <Text style={styles.pickerLabel}>Sélectionnez votre point relais préféré:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedRelayPoint}
                  onValueChange={handleRelayPointChange}
                  style={styles.picker}
                  accessibilityLabel="Sélectionner un point relais préféré"
                >
                  <Picker.Item label="Aucun point relais sélectionné" value="" />
                  {activeRelayPoints.map((point) => (
                    <Picker.Item key={point.id} label={point.name} value={point.id} />
                  ))}
                </Picker>
              </View>
              <Text style={styles.pickerHelp}>
                Ce point relais sera utilisé par défaut pour vos envois et réceptions de colis.
              </Text>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Title title="Paramètres du compte" />
          <Card.Content>
            <List.Item
              title="Modifier le profil"
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
              accessible={true}
              accessibilityLabel="Modifier le profil"
              accessibilityHint="Appuyez pour modifier vos informations personnelles"
            />
            <Divider />
            <List.Item
              title="Changer le mot de passe"
              left={(props) => <List.Icon {...props} icon="lock-reset" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
              accessible={true}
              accessibilityLabel="Changer le mot de passe"
              accessibilityHint="Appuyez pour modifier votre mot de passe"
            />
            <Divider />
            <List.Item
              title="Notifications"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              accessible={true}
              accessibilityLabel={`Notifications ${notificationsEnabled ? "activées" : "désactivées"}`}
              accessibilityHint="Appuyez pour activer ou désactiver les notifications"
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Préférences" />
          <Card.Content>
            <List.Item
              title="Langue"
              description="Français"
              left={(props) => <List.Icon {...props} icon="translate" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
              accessible={true}
              accessibilityLabel="Changer la langue"
              accessibilityHint="Appuyez pour modifier la langue de l'application"
            />
            <Divider />
            <List.Item
              title="Thème"
              description="Clair"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
              accessible={true}
              accessibilityLabel="Changer le thème"
              accessibilityHint="Appuyez pour modifier le thème de l'application"
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Aide et support" />
          <Card.Content>
            <List.Item
              title="Centre d'aide"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
              accessible={true}
              accessibilityLabel="Centre d'aide"
              accessibilityHint="Appuyez pour accéder au centre d'aide"
            />
            <Divider />
            <List.Item
              title="Contactez-nous"
              left={(props) => <List.Icon {...props} icon="email" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
              accessible={true}
              accessibilityLabel="Contactez-nous"
              accessibilityHint="Appuyez pour nous contacter"
            />
            <Divider />
            <List.Item
              title="À propos"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
              accessible={true}
              accessibilityLabel="À propos"
              accessibilityHint="Appuyez pour en savoir plus sur l'application"
            />
          </Card.Content>
        </Card>

        <View style={styles.lottieContainer}>
          <LottieView
            source={require("../assets/package-animation.json")}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
          icon="logout"
          accessible={true}
          accessibilityLabel="Déconnexion"
          accessibilityHint="Appuyez pour vous déconnecter de l'application"
        >
          Déconnexion
        </Button>

        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FF6B00",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  email: {
    fontSize: 16,
    color: "white",
    opacity: 0.8,
  },
  userType: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
    marginTop: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  picker: {
    height: 50,
  },
  pickerHelp: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  lottieContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: "#FF3B30",
    // Augmenter la taille du bouton pour l'accessibilité
    paddingVertical: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  versionText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
})

export default ProfileScreen
