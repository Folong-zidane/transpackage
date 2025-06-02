import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert, Modal, Image, TouchableOpacity } from "react-native"
import { TextInput, Button, Text, HelperText, Divider, Card, Title, Checkbox, RadioButton, ProgressBar } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { usePackages } from "../../contexts/PackageContext"
import { useAuth } from "../../contexts/AuthContext"
import { useRelayPoints } from "../../contexts/RelayPointContext"
import * as Animatable from "react-native-animatable"
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from 'expo-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const SendPackageScreen = () => {
  const navigation = useNavigation()
  const { addPackage } = usePackages()
  const { user } = useAuth()
  const { relayPoints, getActiveRelayPoints } = useRelayPoints()

  // État pour l'étape actuelle (0-3)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)

  // Étape 1 : Informations du colis
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [volume, setVolume] = useState("0")
  const [description, setDescription] = useState("")
  const [packageImage, setPackageImage] = useState(null)
  const [characteristics, setCharacteristics] = useState({
    fragile: false,
    liquid: false,
    dangerous: false,
    valuable: false
  })

  // Étape 2 : Informations acteurs
  const [senderInfo, setSenderInfo] = useState({
    name: "",
    firstName: "",
    address: "",
    phone: ""
  })
  const [receiverInfo, setReceiverInfo] = useState({
    name: "",
    firstName: "",
    email: "",
    phone: ""
  })
  const [selectedRelayPoint, setSelectedRelayPoint] = useState("")

  // Étape 3 : Paiement et livreur
  const [paymentMethod, setPaymentMethod] = useState("")
  const [needDelivery, setNeedDelivery] = useState(false)
  const [basePrice, setBasePrice] = useState(0)
  const [deliveryPrice, setDeliveryPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  
  // Liste des livreurs disponibles
  const [availableDeliverers, setAvailableDeliverers] = useState([
    { id: "d1", name: "Express Delivery", percentage: 60 },
    { id: "d2", name: "Rapid Transit", percentage: 50 },
    { id: "d3", name: "Safe Hands", percentage: 45 },
    { id: "d4", name: "Quick Move", percentage: 55 }
  ])
  const [selectedDeliverer, setSelectedDeliverer] = useState(null)

  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  // Global a la page
  const activeRelayPoints = getActiveRelayPoints()
  const stepLabels = ['Colis', 'Acteurs', 'Paiement', 'Confirmation']

  // Calcul automatique du volume
  useEffect(() => {
    if (length && width && height) {
      const calculatedVolume = (parseFloat(length) * parseFloat(width) * parseFloat(height) / 1000000).toFixed(3)
      setVolume(calculatedVolume)
    } else {
      setVolume("0")
    }
  }, [length, width, height])

  // Calcul du prix
  useEffect(() => {
    if (weight && volume) {
      let price = parseFloat(weight) * 2 + parseFloat(volume) * 1000 // Base de calcul

      // Majoration selon les caractéristiques
      if (characteristics.fragile) price *= 1.2
      if (characteristics.liquid) price *= 1.3
      if (characteristics.dangerous) price *= 1.5
      if (characteristics.valuable) price *= 1.4

      setBasePrice(Math.round(price))

      // Calcul du prix de livraison en fonction du livreur sélectionné
      if (needDelivery && selectedDeliverer) {
        setDeliveryPrice(Math.round(price * selectedDeliverer.percentage / 100))
        setTotalPrice(Math.round(price + (price * selectedDeliverer.percentage / 100)))
      } else if (needDelivery) {
        // Prix par défaut si aucun livreur n'est sélectionné
        setDeliveryPrice(Math.round(price * 0.5))
        setTotalPrice(Math.round(price + (price * 0.5)))
      } else {
        setDeliveryPrice(0)
        setTotalPrice(Math.round(price))
      }
    }
  }, [weight, volume, characteristics, needDelivery, selectedDeliverer])

  // Ouvrir modal quand le paiement change
  useEffect(() => {
    if (paymentMethod === 'mobile_money' || paymentMethod === 'card') {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [paymentMethod]);

  // Validation des étapes
  const validateStep = (step) => {
    switch (step) {
      case 0: // Colis
        return weight && length && width && height && description.trim() && packageImage
      case 1: // Acteurs
        return (senderInfo.name && senderInfo.firstName && senderInfo.address && senderInfo.phone &&
                receiverInfo.name && receiverInfo.firstName && receiverInfo.email && receiverInfo.phone &&
                selectedRelayPoint)
      case 2: // Paiement
        // Si livraison à domicile est sélectionnée, un livreur doit être choisi
        if (needDelivery) {
          return paymentMethod && selectedDeliverer
        }
        return paymentMethod
      case 3: // Confirmation
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      Alert.alert("Informations manquantes", "Veuillez remplir tous les champs requis avant de continuer.")
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Fonctions pour les images
  const selectImage = () => {
    Alert.alert(
      'Sélectionner une image',
      'Comment souhaitez-vous ajouter votre photo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: () => openImageLibrary() },
        { text: 'Caméra', onPress: () => openCamera() }
      ]
    )
  }

  const openImageLibrary = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionResult.granted) {
        Alert.alert('Permission refusée', 'Permission d\'accès à la galerie requise')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPackageImage(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la sélection de l\'image')
    }
  }

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

      if (!permissionResult.granted) {
        Alert.alert('Permission refusée', 'Permission d\'accès à la caméra requise')
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPackageImage(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la prise de photo')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const newPackage = await addPackage({
        weight: Number(weight),
        volume: Number(volume),
        length: Number(length),
        width: Number(width),
        height: Number(height),
        description,
        characteristics,
        image: packageImage,
        senderInfo,
        receiverInfo,
        relayPointId: selectedRelayPoint,
        paymentMethod,
        needDelivery,
        delivererId: selectedDeliverer?.id,
        delivererName: selectedDeliverer?.name,
        delivererPercentage: selectedDeliverer?.percentage,
        totalPrice,
        status: "pending",
        senderId: user.id,
      })

      setLoading(false)
      Alert.alert("Succès", `Votre colis a été enregistré avec le numéro de suivi ${newPackage.trackingNumber}`, [
        {
          text: "Voir les détails",
          onPress: () => navigation.navigate("DetailColis", { packageId: newPackage.id } as never),
        },
        {
          text: "OK",
          onPress: () => navigation.navigate("MesColis"),
        },
      ])
    } catch (error) {
      setLoading(false)
      Alert.alert("Erreur", "Impossible d'envoyer le colis. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.stepTitle}>Informations du colis</Text>

            <TextInput
              label="Poids (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="weight" />}
            />

            <Text style={styles.sectionLabel}>Dimensions (cm)</Text>
            <View style={styles.dimensionsRow}>
              <TextInput
                label="Longueur"
                value={length}
                onChangeText={setLength}
                keyboardType="numeric"
                mode="outlined"
                style={styles.dimensionInput}
              />
              <TextInput
                label="Largeur"
                value={width}
                onChangeText={setWidth}
                keyboardType="numeric"
                mode="outlined"
                style={styles.dimensionInput}
              />
              <TextInput
                label="Hauteur"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                mode="outlined"
                style={styles.dimensionInput}
              />
            </View>

            <Text style={styles.volumeText}>Volume calculé: {volume} m³</Text>

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="text" />}
            />

            <Text style={styles.sectionLabel}>Caractéristiques</Text>
            <View style={styles.characteristicsContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={characteristics.fragile ? 'checked' : 'unchecked'}
                  onPress={() => setCharacteristics({ ...characteristics, fragile: !characteristics.fragile })}
                />
                <Text style={styles.checkboxLabel}>Fragile</Text>
              </View>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={characteristics.liquid ? 'checked' : 'unchecked'}
                  onPress={() => setCharacteristics({ ...characteristics, liquid: !characteristics.liquid })}
                />
                <Text style={styles.checkboxLabel}>Liquide</Text>
              </View>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={characteristics.dangerous ? 'checked' : 'unchecked'}
                  onPress={() => setCharacteristics({ ...characteristics, dangerous: !characteristics.dangerous })}
                />
                <Text style={styles.checkboxLabel}>Dangereux</Text>
              </View>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={characteristics.valuable ? 'checked' : 'unchecked'}
                  onPress={() => setCharacteristics({ ...characteristics, valuable: !characteristics.valuable })}
                />
                <Text style={styles.checkboxLabel}>Précieux</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>Photo du colis</Text>
            {packageImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: packageImage }} style={styles.image} />
                <Button mode="outlined" onPress={selectImage} style={styles.changeImageButton}>
                  Changer la photo
                </Button>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadArea} onPress={selectImage}>
                <Icon name="camera-plus" size={48} color="#FF6B00" />
                <Text style={styles.uploadText}>Toucher pour ajouter une photo</Text>
              </TouchableOpacity>
            )}
          </Animatable.View>
        )

      case 1:
        return (
          <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.stepTitle}>Informations des acteurs</Text>

            <Card style={styles.actorCard}>
              <Card.Content>
                <Title>Expéditeur (Point relais)</Title>
                <TextInput
                  label="Nom"
                  value={senderInfo.name}
                  onChangeText={(text) => setSenderInfo({ ...senderInfo, name: text })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Prénom"
                  value={senderInfo.firstName}
                  onChangeText={(text) => setSenderInfo({ ...senderInfo, firstName: text })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Adresse"
                  value={senderInfo.address}
                  onChangeText={(text) => setSenderInfo({ ...senderInfo, address: text })}
                  mode="outlined"
                  style={styles.input}
                  multiline
                />
                <TextInput
                  label="Téléphone"
                  value={senderInfo.phone}
                  onChangeText={(text) => setSenderInfo({ ...senderInfo, phone: text })}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </Card.Content>
            </Card>

            <Card style={styles.actorCard}>
              <Card.Content>
                <Title>Client</Title>
                <TextInput
                  label="Nom"
                  value={receiverInfo.name}
                  onChangeText={(text) => setReceiverInfo({ ...receiverInfo, name: text })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Prénom"
                  value={receiverInfo.firstName}
                  onChangeText={(text) => setReceiverInfo({ ...receiverInfo, firstName: text })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Email"
                  value={receiverInfo.email}
                  onChangeText={(text) => setReceiverInfo({ ...receiverInfo, email: text })}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="email-address"
                />
                <TextInput
                  label="Téléphone"
                  value={receiverInfo.phone}
                  onChangeText={(text) => setReceiverInfo({ ...receiverInfo, phone: text })}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </Card.Content>
            </Card>

            <Text style={styles.pickerLabel}>Selectionner un Point relais Pick&Drop</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedRelayPoint}
                onValueChange={setSelectedRelayPoint}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionnez un point relais" value="" />
                {activeRelayPoints.map((point) => (
                  <Picker.Item key={point.id} label={point.name} value={point.id} />
                ))}
              </Picker>
            </View>
          </Animatable.View>
        )

      case 2:
        return (
          <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.stepTitle}>Paiement</Text>

            <Card style={styles.priceCard}>
              <Card.Content>
                <Title>Tarification</Title>
                <View style={styles.priceRow}>
                  <Text>Prix de base:</Text>
                  <Text style={styles.priceText}>{basePrice} FCFA</Text>
                </View>
                {needDelivery && (
                  <View style={styles.priceRow}>
                    <Text>Livraison à domicile:</Text>
                    <Text style={styles.priceText}>+{deliveryPrice} FCFA</Text>
                  </View>
                )}
                <Divider style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalPrice}>{totalPrice} FCFA</Text>
                </View>
              </Card.Content>
            </Card>

            <View style={styles.deliveryOption}>
              <Checkbox
                status={needDelivery ? 'checked' : 'unchecked'}
                onPress={() => {
                  const newValue = !needDelivery;
                  setNeedDelivery(newValue);
                  if (!newValue) {
                    setSelectedDeliverer(null);
                  }
                }}
              />
              <View style={styles.deliveryContainer}>
                <Text style={styles.deliveryLabel}>Un livreur sera envoyé à domicile</Text>
                <Text style={styles.deliveryLabel}>(prix selon le livreur choisi)</Text>
              </View>
            </View>

            {needDelivery && (
              <View style={styles.deliverersSection}>
                <Text style={styles.sectionLabel}>Choisissez un livreur</Text>
                {availableDeliverers.map((deliverer) => (
                  <TouchableOpacity
                    key={deliverer.id}
                    style={[styles.delivererCard, selectedDeliverer?.id === deliverer.id && styles.selectedDelivererCard]}
                    onPress={() => setSelectedDeliverer(deliverer)}
                  >
                    <View style={styles.delivererInfo}>
                      <Text style={styles.delivererName}>{deliverer.name}</Text>
                      <View style={styles.delivererDetails}>
                        <Text style={styles.delivererPercentage}>+{deliverer.percentage}% du prix de base</Text>
                      </View>
                    </View>
                    <RadioButton
                      value={deliverer.id}
                      status={selectedDeliverer?.id === deliverer.id ? 'checked' : 'unchecked'}
                      onPress={() => setSelectedDeliverer(deliverer)}
                    />
                  </TouchableOpacity>
                ))}
                {!selectedDeliverer && needDelivery && (
                  <HelperText type="error">Veuillez sélectionner un livreur</HelperText>
                )}
              </View>
            )}

            <Text style={styles.sectionLabel}>Mode de paiement</Text>
            <RadioButton.Group onValueChange={setPaymentMethod} value={paymentMethod}>
              <View style={styles.radioRow}>
                <RadioButton value="mobile_money" />
                <Text style={styles.radioLabel}>Mobile Money</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="card" />
                <Text style={styles.radioLabel}>Carte bancaire</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="cash-dépot" />
                <Text style={styles.radioLabel}>Espèces (payé comptant au dépôt)</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="cash-livraison" />
                <Text style={styles.radioLabel}>Espèces (payé à la livraison)</Text>
              </View>
            </RadioButton.Group>

            {/* MODAL */}
            <Modal visible={showModal} animationType="slide" transparent={true}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  {paymentMethod === 'mobile_money' && (
                    <>
                      <Text style={styles.modalTitle}>Entrez votre numéro Mobile Money</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Numéro de téléphone"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />
                    </>
                  )}

                  {paymentMethod === 'card' && (
                    <>
                      <Text style={styles.modalTitle}>Informations de carte bancaire</Text>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Numéro de carte"
                        keyboardType="number-pad"
                        value={cardInfo.number}
                        onChangeText={(text) => setCardInfo({ ...cardInfo, number: text })}
                      />
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Date d’expiration (MM/AA)"
                        value={cardInfo.expiry}
                        onChangeText={(text) => setCardInfo({ ...cardInfo, expiry: text })}
                      />
                      <TextInput
                        style={styles.modalInput}
                        placeholder="CVV"
                        keyboardType="number-pad"
                        secureTextEntry
                        value={cardInfo.cvv}
                        onChangeText={(text) => setCardInfo({ ...cardInfo, cvv: text })}
                      />
                    </>
                  )}

                  <Button mode="contained" onPress={() => setShowModal(false)}>Valider</Button>
                </View>
              </View>
            </Modal>
          </Animatable.View>
        )

      case 3:
        return (
          <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.stepTitle}>Confirmation</Text>

            <Card style={styles.summaryCard}>
              <Card.Content>
                <Title>Résumé de votre Dépôt</Title>

                <Text style={styles.summaryLabel}>Colis:</Text>
                <Text>• Poids: {weight} kg</Text>
                <Text>• Dimensions: {length}×{width}×{height} cm</Text>
                <Text>• Volume: {volume} m³</Text>
                <Text>• Description: {description}</Text>

                <Text style={styles.summaryLabel}>Expéditeur (Point relais):</Text>
                <Text>Nom: {senderInfo.firstName} {senderInfo.name}</Text>
                <Text>Numéro de téléphone: {senderInfo.phone}</Text>

                <Text style={styles.summaryLabel}>Destinataire (Client):</Text>
                <Text>Nom: {receiverInfo.firstName} {receiverInfo.name}</Text>
                <Text>Numéro de téléphone: {receiverInfo.phone}</Text>
                <Text>Email: {receiverInfo.email}</Text>

                <Text style={styles.summaryLabel}>Point relais Pick&Drop sélectionné:</Text>
                <Text>{activeRelayPoints.find(p => p.id === selectedRelayPoint)?.name}</Text>

                <Text style={styles.summaryLabel}>Paiement:</Text>
                <Text>Mode: {paymentMethod}</Text>
                <Text>Total: {totalPrice} FCFA</Text>
                {needDelivery && (
                  <>
                    <Text>Avec livraison à domicile</Text>
                    {selectedDeliverer && (
                      <Text>Livreur: {selectedDeliverer.name} (+{selectedDeliverer.percentage}%)</Text>
                    )}
                  </>
                )}
              </Card.Content>
            </Card>
          </Animatable.View>
        )

      default:
        return null
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Déposer un colis</Text>

        {/* Barre de progression */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={(currentStep + 1) / 4}
            color="#FF6B00"
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            Étape {currentStep + 1} sur 4: {stepLabels[currentStep]}
          </Text>
        </View>

        {/* Indicateurs d'étapes */}
        <View style={styles.stepsIndicator}>
          {stepLabels.map((label, index) => (
            <View key={index} style={styles.stepIndicator}>
              <View style={[
                styles.stepCircle,
                index <= currentStep && styles.stepCircleActive
              ]}>
                <Text style={[
                  styles.stepNumber,
                  index <= currentStep && styles.stepNumberActive
                ]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={styles.stepLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {renderStepContent()}

        {/* Boutons de navigation */}
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <Button
              mode="outlined"
              onPress={prevStep}
              style={styles.prevButton}
            >
              Précédent
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              mode="contained"
              onPress={nextStep}
              style={styles.nextButton}
              disabled={!validateStep(currentStep)}
            >
              Suivant
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
              icon="send"
            >
              Déposer le colis
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  deliverersSection: {
    marginTop: 15,
    marginBottom: 15,
  },
  delivererCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDelivererCard: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFF8F2',
  },
  delivererInfo: {
    flex: 1,
  },
  delivererName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  delivererDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  delivererPercentage: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FF6B00",
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  stepCircleActive: {
    backgroundColor: '#FF6B00',
  },
  stepNumber: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  dimensionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dimensionInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  volumeText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 15,
  },
  characteristicsContainer: {
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#FF6B00',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    marginBottom: 20,
  },
  uploadText: {
    marginTop: 8,
    color: '#FF6B00',
    fontSize: 14,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  changeImageButton: {
    borderColor: '#FF6B00',
  },
  actorCard: {
    marginBottom: 15,
    elevation: 2,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  priceCard: {
    marginBottom: 20,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  priceText: {
    fontWeight: 'bold',
  },
  priceDivider: {
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  deliveryContainer: {
    flexDirection: 'column', // empile verticalement (valeur par défaut, mais explicite ici)
    alignItems: 'flex-start', // aligne le texte à gauche
    marginVertical: 8,        // espace autour du bloc
  },
  deliveryLabel: {
    fontSize: 16,
    color: '#333',           // ou une autre couleur de texte
    marginBottom: 4,         // espace entre les lignes
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },


  summaryCard: {
    marginBottom: 20,
    elevation: 2,
  },
  summaryLabel: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#FF6B00',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  prevButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#FF6B00',
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#FF6B00',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FF6B00',
  },
})

export default SendPackageScreen