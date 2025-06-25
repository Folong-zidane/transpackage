import { useState } from "react"
import { StyleSheet, ScrollView, Alert, View, Linking } from "react-native"
import { Text, Card, Button, Avatar, List, Divider, Switch, Modal, Portal, TextInput } from "react-native-paper"
import { useAuth } from "../contexts/AuthContext"
import { useRelayPoints } from "../contexts/RelayPointContext"
import { useTheme } from "../contexts/ThemeContext"
import { useLanguage } from "../contexts/LanguageContext"
import * as Animatable from "react-native-animatable"
import { Picker } from "@react-native-picker/picker"
import LottieView from "lottie-react-native"

export default function ProfileScreen() {
  const { user, logout, updateUserPreferences, updateUserProfile, isClient } = useAuth()
  const { relayPoints, getActiveRelayPoints } = useRelayPoints()
  const { themeMode, setThemeMode, isDarkMode } = useTheme()
  const { currentLanguage, setLanguage, t, availableLanguages } = useLanguage()
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedRelayPoint, setSelectedRelayPoint] = useState(user?.activeRelayPointId || "")

  // États pour les modals
  const [editProfileVisible, setEditProfileVisible] = useState(false)
  const [changePasswordVisible, setChangePasswordVisible] = useState(false)
  const [languageModalVisible, setLanguageModalVisible] = useState(false)
  const [themeModalVisible, setThemeModalVisible] = useState(false)
  const [helpCenterVisible, setHelpCenterVisible] = useState(false)
  const [contactUsVisible, setContactUsVisible] = useState(false)
  const [aboutVisible, setAboutVisible] = useState(false)

  // États pour les formulaires
  const [editName, setEditName] = useState(user?.name || "")
  const [editEmail, setEditEmail] = useState(user?.email || "")
  const [editPhone, setEditPhone] = useState(user?.phone || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const activeRelayPoints = getActiveRelayPoints()

  const themes = [
    { code: "light", name: t('lightTheme') },
    { code: "dark", name: t('darkTheme') },
    { code: "auto", name: t('autoTheme') }
  ]

  const helpTopics = [
    { 
      title: t('helpSendPackage') , 
      content: t('helpSendPackageContent')
    },
    { 
      title: t('helpTrackPackage') , 
      content: t('helpTrackPackageContent') 
    },
    { 
      title: t('helpLostPackage') , 
      content: t('helpLostPackageContent') 
    },
    { 
      title: t('helpModifyDelivery') , 
      content: t('helpModifyDeliveryContent') 
    }
  ]

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      {
        text: t('cancel'),
        style: "cancel",
      },
      {
        text: t('logout'),
        onPress: () => logout(),
        style: "destructive",
      },
    ])
  }

  const handleRelayPointChange = async (relayPointId: string) => {
    setSelectedRelayPoint(relayPointId)
    try {
      await updateUserPreferences({ activeRelayPointId: relayPointId })
      Alert.alert(t('success'), t('relayPointUpdated'))
    } catch (error) {
      Alert.alert(t('error'), t('relayPointUpdateError') || "Impossible de mettre à jour votre point relais préféré")
    }
  }

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
    // Dans une vraie application, vous enregistreriez cette préférence
  }

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        name: editName,
        email: editEmail,
        phone: editPhone
      })
      setEditProfileVisible(false)
      Alert.alert(t('success'), t('profileUpdated'))
    } catch (error) {
      Alert.alert(t('error'), t('profileUpdateError') || "Impossible de mettre à jour votre profil")
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert(t('error'), t('passwordMismatch'))
      return
    }
    if (newPassword.length < 6) {
      Alert.alert(t('error'), t('passwordTooShort'))
      return
    }
    try {
      // Logique pour changer le mot de passe
      setChangePasswordVisible(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      Alert.alert(t('success'), t('passwordChanged'))
    } catch (error) {
      Alert.alert(t('error'), t('passwordChangeError') || "Impossible de changer votre mot de passe")
    }
  }

  const handleLanguageChange = async (langCode: string) => {
    try {
      setLanguage(langCode)
      await updateUserPreferences({ language: langCode })
      setLanguageModalVisible(false)
      Alert.alert(t('success'), t('languageUpdated'))
    } catch (error) {
      Alert.alert(t('error'), t('languageUpdateError') || "Impossible de changer la langue")
    }
  }

  const handleThemeChange = async (themeCode: string) => {
    try {
      setThemeMode(themeCode as any)
      await updateUserPreferences({ theme: themeCode })
      setThemeModalVisible(false)
      Alert.alert(t('success'), t('themeUpdated'))
    } catch (error) {
      Alert.alert(t('error'), t('themeUpdateError') || "Impossible de changer le thème")
    }
  }

  const handleContactEmail = () => {
    Linking.openURL(`mailto:${t('supportEmail')}?subject=Support%20Client`)
  }

  const handleContactPhone = () => {
    Linking.openURL(`tel:${t('supportPhone')}`)
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={800} style={styles.header}>
        <Avatar.Text size={80} label={user?.name.substring(0, 2).toUpperCase() || "U"} style={styles.avatar} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.userType}>{user?.type === "client" ? t('client') : t('agency')}</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300} duration={800}>
        {isClient() && (
          <Card style={styles.card}>
            <Card.Title title={t('preferredRelayPoint')} />
            <Card.Content>
              <Text style={styles.pickerLabel}>{t('selectRelayPoint')}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedRelayPoint}
                  onValueChange={handleRelayPointChange}
                  style={styles.picker}
                  accessibilityLabel={t('selectRelayPoint')}
                >
                  <Picker.Item label={t('noRelaySelected')} value="" />
                  {activeRelayPoints.map((point) => (
                    <Picker.Item key={point.id} label={point.name} value={point.id} />
                  ))}
                </Picker>
              </View>
              <Text style={styles.pickerHelp}>
                {t('relayPointHelp')}
              </Text>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Title title={t('accountSettings')} />
          <Card.Content>
            <List.Item
              title={t('editProfile')}
              left={(props) => <List.Icon {...props} icon="account-edit" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setEditProfileVisible(true)}
              accessible={true}
              accessibilityLabel={t('editProfile')}
              accessibilityHint={t('editProfileHint') || "Appuyez pour modifier vos informations personnelles"}
            />
            <Divider />
            <List.Item
              title={t('changePassword')}
              left={(props) => <List.Icon {...props} icon="lock-reset" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setChangePasswordVisible(true)}
              accessible={true}
              accessibilityLabel={t('changePassword')}
              accessibilityHint={t('changePasswordHint') || "Appuyez pour modifier votre mot de passe"}
            />
            <Divider />
            <List.Item
              title={t('notifications')}
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              accessible={true}
              accessibilityLabel={`${t('notifications')} ${notificationsEnabled ? t('enabled') || "activées" : t('disabled') || "désactivées"}`}
              accessibilityHint={t('notificationsHint') || "Appuyez pour activer ou désactiver les notifications"}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title={t('preferences')} />
          <Card.Content>
            <List.Item
              title={t('language')}
              description={availableLanguages.find(l => l.code === currentLanguage)?.name || t('french')}
              left={(props) => <List.Icon {...props} icon="translate" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setLanguageModalVisible(true)}
              accessible={true}
              accessibilityLabel={t('language')}
              accessibilityHint={t('languageHint') || "Appuyez pour modifier la langue de l'application"}
            />
            <Divider />
            <List.Item
              title={t('theme')}
              description={themes.find(t => t.code === themeMode)?.name || t('lightTheme')}
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setThemeModalVisible(true)}
              accessible={true}
              accessibilityLabel={t('theme')}
              accessibilityHint={t('themeHint') || "Appuyez pour modifier le thème de l'application"}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title={t('helpSupport')} />
          <Card.Content>
            <List.Item
              title={t('helpCenter')}
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setHelpCenterVisible(true)}
              accessible={true}
              accessibilityLabel={t('helpCenter')}
              accessibilityHint={t('helpCenterHint') || "Appuyez pour accéder au centre d'aide"}
            />
            <Divider />
            <List.Item
              title={t('contactUs')}
              left={(props) => <List.Icon {...props} icon="email" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setContactUsVisible(true)}
              accessible={true}
              accessibilityLabel={t('contactUs')}
              accessibilityHint={t('contactUsHint') || "Appuyez pour nous contacter"}
            />
            <Divider />
            <List.Item
              title={t('about')}
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setAboutVisible(true)}
              accessible={true}
              accessibilityLabel={t('about')}
              accessibilityHint={t('aboutHint') || "Appuyez pour en savoir plus sur l'application"}
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
          accessibilityLabel={t('logout')}
          accessibilityHint={t('logoutHint') || "Appuyez pour vous déconnecter de l'application"}
        >
          {t('logout')}
        </Button>

        <Text style={styles.versionText}>{t('version')} 1.0.0</Text>
      </Animatable.View>

      {/* Modal Modifier le profil */}
      <Portal>
        <Modal
          visible={editProfileVisible}
          onDismiss={() => setEditProfileVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{t('editProfile')}</Text>
          <TextInput
            label={t('fullName')}
            value={editName}
            onChangeText={setEditName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label={t('email')}
            value={editEmail}
            onChangeText={setEditEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
          />
          <TextInput
            label={t('phone')}
            value={editPhone}
            onChangeText={setEditPhone}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setEditProfileVisible(false)}
              style={styles.modalButton}
            >
              {t('cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveProfile}
              style={styles.modalButton}
            >
              {t('save')}
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Modal Changer le mot de passe */}
      <Portal>
        <Modal
          visible={changePasswordVisible}
          onDismiss={() => setChangePasswordVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{t('changePassword')}</Text>
          <TextInput
            label={t('currentPassword')}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
          />
          <TextInput
            label={t('newPassword')}
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
          />
          <TextInput
            label={t('confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setChangePasswordVisible(false)
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
              }}
              style={styles.modalButton}
            >
              {t('cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.modalButton}
            >
              {t('change')}
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Modal Langue */}
      <Portal>
        <Modal
          visible={languageModalVisible}
          onDismiss={() => setLanguageModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{t('selectLanguage') || "Choisir la langue"}</Text>
          {availableLanguages.map((lang) => (
            <List.Item
              key={lang.code}
              title={lang.name}
              left={(props) => (
                <List.Icon 
                  {...props} 
                  icon={currentLanguage === lang.code ? "radiobox-marked" : "radiobox-blank"} 
                />
              )}
              onPress={() => handleLanguageChange(lang.code)}
              style={styles.listItem}
            />
          ))}
          <Button
            mode="outlined"
            onPress={() => setLanguageModalVisible(false)}
            style={styles.closeButton}
          >
            {t('close')}
          </Button>
        </Modal>
      </Portal>

      {/* Modal Thème */}
      <Portal>
        <Modal
          visible={themeModalVisible}
          onDismiss={() => setThemeModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{t('selectTheme') || "Choisir le thème"}</Text>
          {themes.map((theme) => (
            <List.Item
              key={theme.code}
              title={theme.name}
              left={(props) => (
                <List.Icon 
                  {...props} 
                  icon={themeMode === theme.code ? "radiobox-marked" : "radiobox-blank"} 
                />
              )}
              onPress={() => handleThemeChange(theme.code)}
              style={styles.listItem}
            />
          ))}
          <Button
            mode="outlined"
            onPress={() => setThemeModalVisible(false)}
            style={styles.closeButton}
          >
            {t('close')}
          </Button>
        </Modal>
      </Portal>

      {/* Modal Centre d'aide */}
      <Portal>
        <Modal
          visible={helpCenterVisible}
          onDismiss={() => setHelpCenterVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{t('helpCenter')}</Text>
          <ScrollView style={styles.helpContent}>
            {helpTopics.map((topic, index) => (
              <Card key={index} style={styles.helpCard}>
                <Card.Title title={topic.title} />
                <Card.Content>
                  <Text>{topic.content}</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
          <Button
            mode="outlined"
            onPress={() => setHelpCenterVisible(false)}
            style={styles.closeButton}
          >
            {t('close')}
          </Button>
        </Modal>
      </Portal>

      {/* Modal Contactez-nous */}
      <Portal>
        <Modal
          visible={contactUsVisible}
          onDismiss={() => setContactUsVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{t('contactUs')}</Text>
          <List.Item
            title={t('email')}
            description={t('supportEmail')}
            left={(props) => <List.Icon {...props} icon="email" />}
            onPress={handleContactEmail}
            style={styles.contactItem}
          />
          <List.Item
            title={t('phone')}
            description={t('supportPhone')}
            left={(props) => <List.Icon {...props} icon="phone" />}
            onPress={handleContactPhone}
            style={styles.contactItem}
          />
          <List.Item
            title={t('businessHoursTitle') || "Horaires d'ouverture"}
            description={t('businessHours')}
            left={(props) => <List.Icon {...props} icon="clock" />}
            style={styles.contactItem}
          />
          <Button
            mode="outlined"
            onPress={() => setContactUsVisible(false)}
            style={styles.closeButton}
          >
            {t('close')}
          </Button>
        </Modal>
      </Portal>

      {/* Modal À propos */}
      <Portal>
        <Modal
          visible={aboutVisible}
          onDismiss={() => setAboutVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{t('about')}</Text>
          <ScrollView style={styles.aboutContent}>
            <Text style={styles.aboutText}>
              <Text style={styles.boldText}>Pick&Drop</Text> {t('appDescription')}
            </Text>
            <Text style={styles.aboutText}>
              {t('networkDescription')}
            </Text>
            <Text style={styles.aboutText}>
              <Text style={styles.boldText}>{t('version')}:</Text> 1.0.0
            </Text>
            <Text style={styles.aboutText}>
              <Text style={styles.boldText}>{t('developedBy')}:</Text> {t('developmentTeam')}
            </Text>
            <Text style={styles.aboutText}>
              <Text style={styles.boldText}>{t('termsOfService')}:</Text> {t('termsDescription')}
            </Text>
            <Text style={styles.aboutText}>
              <Text style={styles.boldText}>{t('privacyPolicy')}:</Text> {t('privacyDescription')}
            </Text>
          </ScrollView>
          <Button
            mode="outlined"
            onPress={() => setAboutVisible(false)}
            style={styles.closeButton}
          >
            {t('close')}
          </Button>
        </Modal>
      </Portal>
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
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  closeButton: {
    marginTop: 20,
  },
  listItem: {
    paddingVertical: 5,
  },
  helpContent: {
    maxHeight: 300,
  },
  helpCard: {
    marginBottom: 10,
  },
  contactItem: {
    marginBottom: 10,
  },
  aboutContent: {
    maxHeight: 300,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  boldText: {
    fontWeight: "bold",
  },
})