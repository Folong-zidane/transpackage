
import { useState } from "react"
import { View, StyleSheet, ScrollView, Alert, Modal, Image, TouchableOpacity } from "react-native"
import { TextInput, Button, Text, HelperText, Switch, Card, RadioButton, Chip } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../contexts/AuthContext"
import * as Animatable from "react-native-animatable"
import { Picker } from '@react-native-picker/picker'


export default function CreatePersonnelScreen() {

  const navigation = useNavigation()
  const { user } = useAuth()
  
  // États de base
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [personnelCategory, setPersonnelCategory] = useState("")
  const [role, setRole] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  
  // États spécifiques selon le rôle
  const [relayPointId, setRelayPointId] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [workZone, setWorkZone] = useState("")
  const [managedRelayPoints, setManagedRelayPoints] = useState([])
  const [specializations, setSpecializations] = useState([])

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

  const validateForm = () => {
    if (!firstName.trim()) {
      return { valid: false, message: "Veuillez entrer le prénom" }
    }

    if (!lastName.trim()) {
      return { valid: false, message: "Veuillez entrer le nom" }
    }

    if (!email.trim()) {
      return { valid: false, message: "Veuillez entrer l'email" }
    }

    if (!phone.trim()) {
      return { valid: false, message: "Veuillez entrer le téléphone" }
    }

    if (!personnelCategory) {
      return { valid: false, message: "Veuillez sélectionner une catégorie" }
    }

    if (!role) {
      return { valid: false, message: "Veuillez sélectionner un rôle" }
    }

    // Validations spécifiques
    if (personnelCategory === "relais" && !relayPointId) {
      return { valid: false, message: "Veuillez sélectionner un point relais" }
    }

    if (personnelCategory === "itinerant") {
      if (!vehicleType) {
        return { valid: false, message: "Veuillez sélectionner un type de véhicule" }
      }
      if (!licenseNumber.trim()) {
        return { valid: false, message: "Veuillez entrer le numéro de permis" }
      }
      if (!workZone) {
        return { valid: false, message: "Veuillez sélectionner une zone de travail" }
      }
    }

    return { valid: true }
  }

  const handleSubmit = async () => {
    const validation = validateForm()

    if (!validation.valid) {
      Alert.alert("Erreur", validation.message)
      return
    }

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

  const renderCategorySelection = () => (
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
  )

  const renderRoleSelection = () => {
    if (!personnelCategory) return null

    const categoryRoles = personnelCategories[personnelCategory].roles

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Rôle spécifique</Text>
          {categoryRoles.map((roleOption) => (
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
    )
  }

  const renderSpecificFields = () => {
    if (!personnelCategory || !role) return null

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Informations spécifiques</Text>
          
          {/* Champs pour personnel de relais */}
          {personnelCategory === "relais" && (
            <TextInput
              label="Point relais assigné"
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
                <Text style={styles.pickerLabel}>Type de véhicule</Text>
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
                label="Numéro de permis de conduire"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="card-account-details" />}
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Zone de travail</Text>
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
        </Card.Content>
      </Card>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={800} style={styles.formContainer}>
        {/* Informations personnelles */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            
            <TextInput
              label="Prénom"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Nom"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
              keyboardType="email-address"
            />

            <TextInput
              label="Téléphone"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
              keyboardType="phone-pad"
            />
          </Card.Content>
        </Card>

        {/* Sélection de catégorie */}
        {renderCategorySelection()}

        {/* Sélection de rôle */}
        {renderRoleSelection()}

        {/* Champs spécifiques */}
        {renderSpecificFields()}

        {/* Options finales */}
        <Card style={styles.card}>
          <Card.Content>
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

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
          icon="check"
        >
          Créer le personnel
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

