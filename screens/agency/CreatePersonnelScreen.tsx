import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert, Modal, Image, TouchableOpacity } from "react-native"
import { TextInput, Button, Text, HelperText, Switch, Card, RadioButton, Chip, ProgressBar } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../contexts/AuthContext"
import * as Animatable from "react-native-animatable"
import { Picker } from '@react-native-picker/picker'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

import { useRelayPoints } from "../../contexts/RelayPointContext"

export default function CreatePersonnelScreen() {
  const navigation = useNavigation()
  const { user } = useAuth()
  
  // État pour les étapes
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(0.2) // 20% pour la première étape
  
  // États de base
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [personnelCategory, setPersonnelCategory] = useState("")
  const [role, setRole] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  
  // États pour les photos
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [idCardPhoto, setIdCardPhoto] = useState(null)
  
  // États spécifiques selon le rôle
  const [relayPointId, setRelayPointId] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [workZone, setWorkZone] = useState("")
  const [managedRelayPoints, setManagedRelayPoints] = useState([])
  const [specializations, setSpecializations] = useState([])

  // Étapes du processus
  const steps = [
    { id: 1, title: "Informations personnelles", icon: "person" },
    { id: 2, title: "Catégorie et rôle", icon: "briefcase" },
    { id: 3, title: "Informations spécifiques", icon: "settings" },
    { id: 4, title: "Photos", icon: "camera" },
    { id: 5, title: "Confirmation", icon: "checkmark-circle" }
  ]

  // Mise à jour de la barre de progression
  useEffect(() => {
    setProgress(currentStep / steps.length)
  }, [currentStep])

  // Définition des catégories et rôles
  const personnelCategories = {
    relais: {
      label: "Personnel de point relais",
      icon: "store",
      roles: [
        { value: "agent_relais", label: "Agent de point relais", description: "Réceptionne les colis, enregistre les livraisons et retraits" },
        { value: "responsable_relais", label: "Responsable de point relais", description: "Gère le personnel du relais, supervise les opérations" },
        { value: "assistant_client", label: "Assistant client / Guichetier", description: "Accueille les clients, aide pour les envois/retraits" },
        { value: "preparateur", label: "Préparateur de colis", description: "Organise les colis pour retrait, trie les arrivées" }
      ]
    },
    entreprise: {
      label: "Personnel d'entreprise",
      icon: "office-building",
      roles: [
        { value: "gestionnaire_reseau", label: "Gestionnaire de réseau de relais", description: "Supervise plusieurs points relais" },
        { value: "responsable_logistique", label: "Responsable logistique", description: "Organise les flux de colis" },
        { value: "support_technique", label: "Agent de support technique", description: "Aide technique pour l'application et scanners" },
        { value: "relation_relais", label: "Chargé de relation relais", description: "Négocie pour ouvrir de nouveaux relais" },
        { value: "controle_qualite", label: "Agent de contrôle qualité", description: "Effectue inspections et audits" }
      ]
    },
    itinerant: {
      label: "Personnel itinérant",
      icon: "truck",
      roles: [
        { value: "livreur", label: "Livreur / Chauffeur", description: "Transfère les colis vers les points relais" },
        { value: "agent_collecte", label: "Agent de collecte", description: "Collecte les colis depuis les expéditeurs" }
      ]
    }
  }

  const vehicleTypes = ["Vélo", "Scooter", "Voiture", "Camionnette", "Camion"]
  const workZones = ["Centre-ville", "Région"]

  // Fonctions pour les photos
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à vos photos.')
      return false
    }
    return true
  }

  const pickImage = async (type) => {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) return

    Alert.alert(
      "Sélectionner une photo",
      "Choisissez une option",
      [
        { text: "Appareil photo", onPress: () => openCamera(type) },
        { text: "Galerie", onPress: () => openGallery(type) },
        { text: "Annuler", style: "cancel" }
      ]
    )
  }

  const openCamera = async (type) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de la permission pour utiliser l\'appareil photo.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      if (type === 'profile') {
        setProfilePhoto(result.assets[0])
      } else {
        setIdCardPhoto(result.assets[0])
      }
    }
  }

  const openGallery = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      if (type === 'profile') {
        setProfilePhoto(result.assets[0])
      } else {
        setIdCardPhoto(result.assets[0])
      }
    }
  }

  // Validation pour chaque étape
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
          return { valid: false, message: "Veuillez remplir tous les champs requis" }
        }
        break
      case 2:
        if (!personnelCategory || !role) {
          return { valid: false, message: "Veuillez sélectionner une catégorie et un rôle" }
        }
        break
      case 3:
        if (personnelCategory === "relais" && !relayPointId) {
          return { valid: false, message: "Veuillez sélectionner un point relais" }
        }
        if (personnelCategory === "itinerant") {
          if (!vehicleType || !licenseNumber.trim() || !workZone) {
            return { valid: false, message: "Veuillez remplir tous les champs pour le personnel itinérant" }
          }
        }
        break
      case 4:
        // Les photos sont optionnelles, donc toujours valide
        break
    }
    return { valid: true }
  }

  const nextStep = () => {
    const validation = validateStep(currentStep)
    if (!validation.valid) {
      Alert.alert("Erreur", validation.message)
      return
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Erreur", "Vous devez être connecté pour créer un personnel")
      return
    }

    setLoading(true)

    try {
      const personnelData = {
        firstName,
        lastName,
        email,
        phone,
        category: personnelCategory,
        role,
        isActive,
        profilePhoto: profilePhoto?.uri,
        idCardPhoto: idCardPhoto?.uri,
        ...(personnelCategory === "relais" && { relayPointId }),
        ...(personnelCategory === "itinerant" && { 
          vehicleType, 
          licenseNumber, 
          workZone 
        }),
        ...(personnelCategory === "entreprise" && { 
          managedRelayPoints,
          specializations 
        }),
        createdBy: user.id
      }

      // Ici vous appelleriez votre API pour créer le personnel
      // await createPersonnel(personnelData)

      setLoading(false)
      Alert.alert("Succès", "Le personnel a été créé avec succès", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      setLoading(false)
      Alert.alert("Erreur", "Impossible de créer le personnel. Veuillez réessayer.")
    }
  }

  // Rendu de la barre de progression
  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Étape {currentStep} sur {steps.length}
      </Text>
      <ProgressBar progress={progress} color="#FF6B00" style={styles.progressBar} />
      <View style={styles.stepsIndicator}>
        {steps.map((step) => (
          <View
            key={step.id}
            style={[
              styles.stepIndicator,
              currentStep >= step.id && styles.activeStepIndicator
            ]}
          >
            <Ionicons
              name={step.icon}
              size={16}
              color={currentStep >= step.id ? "#fff" : "#ccc"}
            />
          </View>
        ))}
      </View>
    </View>
  )

  // Rendu des étapes
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo()
      case 2:
        return renderCategoryAndRole()
      case 3:
        return renderSpecificFields()
      case 4:
        return renderPhotos()
      case 5:
        return renderConfirmation()
      default:
        return null
    }
  }

  const renderPersonalInfo = () => (
    <Animatable.View animation="slideInRight" duration={300}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <TextInput
            label="Prénom *"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Nom *"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
            keyboardType="email-address"
          />

          <TextInput
            label="Téléphone *"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
            keyboardType="phone-pad"
          />
        </Card.Content>
      </Card>
    </Animatable.View>
  )

  const renderCategoryAndRole = () => (
    <Animatable.View animation="slideInRight" duration={300}>
      {/* Sélection de catégorie */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Catégorie de personnel</Text>
          {Object.entries(personnelCategories).map(([key, category]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.categoryOption,
                personnelCategory === key && styles.selectedCategory
              ]}
              onPress={() => {
                setPersonnelCategory(key)
                setRole("") // Reset role when category changes
              }}
            >
              <RadioButton
                value={key}
                status={personnelCategory === key ? 'checked' : 'unchecked'}
              />
              <View style={styles.categoryContent}>
                <Text style={styles.categoryLabel}>{category.label}</Text>
                <Text style={styles.categoryDescription}>
                  {category.roles.length} rôles disponibles
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      {/* Sélection de rôle */}
      {personnelCategory && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Rôle spécifique</Text>
            {personnelCategories[personnelCategory].roles.map((roleOption) => (
              <TouchableOpacity
                key={roleOption.value}
                style={[
                  styles.roleOption,
                  role === roleOption.value && styles.selectedRole
                ]}
                onPress={() => setRole(roleOption.value)}
              >
                <RadioButton
                  value={roleOption.value}
                  status={role === roleOption.value ? 'checked' : 'unchecked'}
                />
                <View style={styles.roleContent}>
                  <Text style={styles.roleLabel}>{roleOption.label}</Text>
                  <Text style={styles.roleDescription}>{roleOption.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}
    </Animatable.View>
  )


  {/** partie pour selectionner le point relais */}

  const [selectedRelayPoint, setSelectedRelayPoint] = useState(user?.activeRelayPointId || "")
  const { updateUserPreferences } = useAuth()
  const { relayPoints, getActiveRelayPoints } = useRelayPoints()
  const activeRelayPoints = getActiveRelayPoints()


  const handleRelayPointChange = async (relayPointId: string) => {
    setSelectedRelayPoint(relayPointId)
    try {
      await updateUserPreferences({ activeRelayPointId: relayPointId })
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour votre point relais")
    }
  }

  const renderSpecificFields = () => {
    if (!personnelCategory || !role) return null

    return (
      <Animatable.View animation="slideInRight" duration={300}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Informations spécifiques</Text>
            
            {/* Champs pour personnel de relais */}
            {personnelCategory === "relais" && (
              <TextInput
                label="Point relais assigné *"
                value={relayPointId}
                onChangeText={setRelayPointId}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="store" />}
                placeholder="Sélectionner un point relais"
              />
            )}

            {/* Champs pour personnel itinérant */}
            {personnelCategory === "itinerant" && (
              <>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Type de véhicule *</Text>
                  <Picker
                    selectedValue={vehicleType}
                    onValueChange={setVehicleType}
                    style={styles.picker}
                  >
                    <Picker.Item label="Sélectionner un véhicule" value="" />
                    {vehicleTypes.map((type) => (
                      <Picker.Item key={type} label={type} value={type} />
                    ))}
                  </Picker>
                </View>

                <TextInput
                  label="Numéro de permis de conduire *"
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="card-account-details" />}
                />

                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Zone de travail *</Text>
                  <Picker
                    selectedValue={workZone}
                    onValueChange={setWorkZone}
                    style={styles.picker}
                  >
                    <Picker.Item label="Sélectionner une zone" value="" />
                    {workZones.map((zone) => (
                      <Picker.Item key={zone} label={zone} value={zone} />
                    ))}
                  </Picker>
                </View>
              </>
            )}

            {/* Champs pour personnel d'entreprise */}
            {personnelCategory === "entreprise" && (
              <>
                <TextInput
                  label="Spécialisations"
                  value={specializations.join(", ")}
                  onChangeText={(text) => setSpecializations(text.split(", "))}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="star" />}
                  placeholder="Ex: Audit, Formation, Support technique"
                  multiline
                />

                {(role === "gestionnaire_reseau" || role === "responsable_logistique") && (
                  <TextInput
                    label="Points relais gérés"
                    value={managedRelayPoints.join(", ")}
                    onChangeText={(text) => setManagedRelayPoints(text.split(", "))}
                    mode="outlined"
                    style={styles.input}
                    left={<TextInput.Icon icon="store-marker" />}
                    placeholder="IDs des points relais séparés par des virgules"
                    multiline
                  />
                )}
              </>
            )}

            <View style={styles.switchContainer}>
              <Text>Activer ce personnel</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                color="#4CAF50"
              />
            </View>
          </Card.Content>
        </Card>

        <Card.Content>
          <Text style={styles.pickerLabel}>Sélectionnez votre point relais assigné:</Text>
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
         
        </Card.Content>

      </Animatable.View>
    )
  }

  const renderPhotos = () => (
    <Animatable.View animation="slideInRight" duration={300}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Photos du personnel</Text>
          <Text style={styles.photoDescription}>
            Ajoutez une photo de profil et une photo de la carte d'identité (optionnel)
          </Text>

          {/* Photo de profil */}
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Photo de profil</Text>
            <TouchableOpacity
              style={styles.photoContainer}
              onPress={() => pickImage('profile')}
            >
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto.uri }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="person" size={50} color="#ccc" />
                  <Text style={styles.photoPlaceholderText}>Ajouter une photo</Text>
                </View>
              )}
            </TouchableOpacity>
            {profilePhoto && (
              <Button
                mode="text"
                onPress={() => setProfilePhoto(null)}
                style={styles.removePhotoButton}
              >
                Supprimer
              </Button>
            )}
          </View>

          {/* Photo CNI */}
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Photo de la carte d'identité</Text>
            <TouchableOpacity
              style={styles.photoContainer}
              onPress={() => pickImage('id')}
            >
              {idCardPhoto ? (
                <Image source={{ uri: idCardPhoto.uri }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="card" size={50} color="#ccc" />
                  <Text style={styles.photoPlaceholderText}>Ajouter une photo CNI</Text>
                </View>
              )}
            </TouchableOpacity>
            {idCardPhoto && (
              <Button
                mode="text"
                onPress={() => setIdCardPhoto(null)}
                style={styles.removePhotoButton}
              >
                Supprimer
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    </Animatable.View>
  )

  const renderConfirmation = () => (
    <Animatable.View animation="slideInRight" duration={300}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Confirmation des informations</Text>
          
          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>Informations personnelles</Text>
            <Text style={styles.confirmationText}>{firstName} {lastName}</Text>
            <Text style={styles.confirmationText}>{email}</Text>
            <Text style={styles.confirmationText}>{phone}</Text>
          </View>

          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>Fonction</Text>
            <Text style={styles.confirmationText}>
              {personnelCategories[personnelCategory]?.label}
            </Text>
            <Text style={styles.confirmationText}>
              {personnelCategories[personnelCategory]?.roles.find(r => r.value === role)?.label}
            </Text>
          </View>

          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>Photos</Text>
            <Text style={styles.confirmationText}>
              Photo de profil: {profilePhoto ? "✓ Ajoutée" : "✗ Non ajoutée"}
            </Text>
            <Text style={styles.confirmationText}>
              Photo CNI: {idCardPhoto ? "✓ Ajoutée" : "✗ Non ajoutée"}
            </Text>
          </View>

          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>Statut</Text>
            <Text style={styles.confirmationText}>
              {isActive ? "✓ Personnel actif" : "✗ Personnel inactif"}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </Animatable.View>
  )

  // Rendu des boutons de navigation
  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      {currentStep > 1 && (
        <Button
          mode="outlined"
          onPress={previousStep}
          style={styles.navButton}
          icon="arrow-left"
        >
          Précédent
        </Button>
      )}
      
      {currentStep < steps.length ? (
        <Button
          mode="contained"
          onPress={nextStep}
          style={[styles.navButton, styles.nextButton]}
          icon="arrow-right"
          contentStyle={styles.nextButtonContent}
        >
          Suivant
        </Button>
      ) : (
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={[styles.navButton, styles.submitButton]}
          icon="check"
          contentStyle={styles.submitButtonContent}
        >
          Créer le personnel
        </Button>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      {renderProgressBar()}
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          {renderStep()}
        </View>
      </ScrollView>

      {renderNavigationButtons()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  progressContainer: {
    backgroundColor: "#fff",
    padding: 16,
    elevation: 2,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  stepsIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepIndicator: {
    backgroundColor: "#FF6B00",
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#FF6B00",
  },
  input: {
    marginBottom: 12,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: "#FFF3E0",
  },
  categoryContent: {
    marginLeft: 8,
    flex: 1,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  categoryDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedRole: {
    backgroundColor: "#E8F5E8",
  },
  roleContent: {
    marginLeft: 8,
    flex: 1,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  roleDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  picker: {
    backgroundColor: "#f8f8f8",
    borderRadius: 4,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 12,
  },
  photoDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  photoSection: {
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  photoPreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    resizeMode: "cover",
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  removePhotoButton: {
    marginTop: 4,
  },
  confirmationSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  confirmationLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B00",
    marginBottom: 4,
  },
  confirmationText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: "#FF6B00",
  },
  nextButtonContent: {
    flexDirection: "row-reverse",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
})