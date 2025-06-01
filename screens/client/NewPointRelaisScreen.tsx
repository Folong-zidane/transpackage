import { useNavigation } from 'expo-router'
import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Alert,KeyboardAvoidingView, Platform } from 'react-native'
import { Text, TextInput, Button, Card, Title, Paragraph, HelperText } from 'react-native-paper'



const NewPointRelaisScreen = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    cni: '',
    telephone: '',
    email: '',
    
    // Adresse
    adresse: '',
    quartier: '',
    ville: '',
    region: '',
    
    // Informations commerciales
    nomCommerce: '',
    typeCommerce: '',
    numeroCommerce: '',
    experience: '',
    
    // Documents
    photoCNI: null,
    photoCommerce: null,
    autorisation: null
  })
  
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    // Validation des champs obligatoires
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est obligatoire'
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire'
    if (!formData.cni.trim()) newErrors.cni = 'Le numéro CNI est obligatoire'
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est obligatoire'
    if (!formData.email.trim()) newErrors.email = 'L\'email est obligatoire'
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est obligatoire'
    if (!formData.ville.trim()) newErrors.ville = 'La ville est obligatoire'
    if (!formData.nomCommerce.trim()) newErrors.nomCommerce = 'Le nom du commerce est obligatoire'
    if (!formData.typeCommerce.trim()) newErrors.typeCommerce = 'Le type de commerce est obligatoire'
    
    // Validation format téléphone
    if (formData.telephone && !/^[0-9+\-\s]{8,15}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide'
    }
    
    // Validation email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    // Validation CNI (format camerounais)
    if (formData.cni && formData.cni.length < 8) {
      newErrors.cni = 'Le numéro CNI doit contenir au moins 8 caractères'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

{/** 
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire')
      return
    }
    
    setLoading(true)
    
    try {
      // Simulation d'envoi des données
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      Alert.alert(
        'Demande envoyée',
        'Votre demande pour devenir point relais a été envoyée avec succès. Vous recevrez une réponse dans les 48h.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form ou navigation
              setFormData({
                nom: '', prenom: '', dateNaissance: '', lieuNaissance: '',
                cni: '', telephone: '', email: '', adresse: '', quartier: '',
                ville: '', region: '', nomCommerce: '', typeCommerce: '',
                numeroCommerce: '', experience: '', photoCNI: null,
                photoCommerce: null, autorisation: null
              })
            }
          }
        ]
      )
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }
*/}

    {/** Navigation simple pour tester le statut sans la verification du formulaire */}
    const navigation = useNavigation()

    const handleSubmit = async () => {
    // Simulation d'envoi des données
    await new Promise(resolve => setTimeout(resolve, 2000))
    navigation.navigate('StatutPointRelais')
    
    Alert.alert(
    'Demande envoyée',
    'Votre demande pour devenir point relais a été envoyée avec succès. Vous recevrez une réponse dans les 48h.'
    )
  }
  
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Efface l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={styles.title}>Devenir Point Relais</Title>
          <Paragraph style={styles.subtitle}>
            Rejoignez notre réseau de partenaires et développez votre activité
          </Paragraph>
        </View>

        {/* Informations personnelles */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Informations Personnelles</Title>
            
            <TextInput
              label="Nom *"
              value={formData.nom}
              onChangeText={(value) => updateField('nom', value)}
              style={styles.input}
              error={!!errors.nom}
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.nom}>
              {errors.nom}
            </HelperText>

            <TextInput
              label="Prénom *"
              value={formData.prenom}
              onChangeText={(value) => updateField('prenom', value)}
              style={styles.input}
              error={!!errors.prenom}
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.prenom}>
              {errors.prenom}
            </HelperText>

            <TextInput
              label="Date de naissance"
              value={formData.dateNaissance}
              onChangeText={(value) => updateField('dateNaissance', value)}
              style={styles.input}
              placeholder="JJ/MM/AAAA"
              mode="outlined"
            />

            <TextInput
              label="Lieu de naissance"
              value={formData.lieuNaissance}
              onChangeText={(value) => updateField('lieuNaissance', value)}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Numéro CNI *"
              value={formData.cni}
              onChangeText={(value) => updateField('cni', value)}
              style={styles.input}
              error={!!errors.cni}
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.cni}>
              {errors.cni}
            </HelperText>

            <TextInput
              label="Téléphone *"
              value={formData.telephone}
              onChangeText={(value) => updateField('telephone', value)}
              style={styles.input}
              error={!!errors.telephone}
              keyboardType="phone-pad"
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.telephone}>
              {errors.telephone}
            </HelperText>

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              style={styles.input}
              error={!!errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
          </Card.Content>
        </Card>

        {/* Adresse */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Adresse</Title>
            
            <TextInput
              label="Adresse complète *"
              value={formData.adresse}
              onChangeText={(value) => updateField('adresse', value)}
              style={styles.input}
              error={!!errors.adresse}
              multiline
              numberOfLines={2}
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.adresse}>
              {errors.adresse}
            </HelperText>

            <TextInput
              label="Quartier"
              value={formData.quartier}
              onChangeText={(value) => updateField('quartier', value)}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Ville *"
              value={formData.ville}
              onChangeText={(value) => updateField('ville', value)}
              style={styles.input}
              error={!!errors.ville}
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.ville}>
              {errors.ville}
            </HelperText>

            <TextInput
              label="Région"
              value={formData.region}
              onChangeText={(value) => updateField('region', value)}
              style={styles.input}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Informations commerciales */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Informations Commerciales</Title>
            
            <TextInput
              label="Nom du commerce *"
              value={formData.nomCommerce}
              onChangeText={(value) => updateField('nomCommerce', value)}
              style={styles.input}
              error={!!errors.nomCommerce}
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.nomCommerce}>
              {errors.nomCommerce}
            </HelperText>

            <TextInput
              label="Type de commerce *"
              value={formData.typeCommerce}
              onChangeText={(value) => updateField('typeCommerce', value)}
              style={styles.input}
              error={!!errors.typeCommerce}
              placeholder="Ex: Boutique, Pharmacie, Superette..."
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.typeCommerce}>
              {errors.typeCommerce}
            </HelperText>

            <TextInput
              label="Numéro de registre de commerce"
              value={formData.numeroCommerce}
              onChangeText={(value) => updateField('numeroCommerce', value)}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Années d'expérience dans le commerce"
              value={formData.experience}
              onChangeText={(value) => updateField('experience', value)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Documents requis */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Documents Requis</Title>
            <Paragraph style={styles.infoText}>
              Les documents suivants seront requis pour finaliser votre inscription :
            </Paragraph>
            
            <View style={styles.documentList}>
              <Text style={styles.documentItem}>• Copie de la CNI (recto-verso)</Text>
              <Text style={styles.documentItem}>• Photo du commerce</Text>
              <Text style={styles.documentItem}>• Autorisation de fonctionnement (si applicable)</Text>
              <Text style={styles.documentItem}>• Registre de commerce (si applicable)</Text>
            </View>
            
            <Paragraph style={styles.noteText}>
              Ces documents pourront être fournis après validation de votre demande.
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Conditions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Conditions</Title>
            <View style={styles.conditionsList}>
              <Text style={styles.conditionItem}>✓ Avoir un commerce physique</Text>
              <Text style={styles.conditionItem}>✓ Être disponible pendant les heures d'ouverture</Text>
              <Text style={styles.conditionItem}>✓ Disposer d'un espace de stockage sécurisé</Text>
              <Text style={styles.conditionItem}>✓ Accepter les termes et conditions du service</Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
          </Button>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FF6B00',
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  infoText: {
    marginBottom: 12,
    color: '#666',
  },
  documentList: {
    marginLeft: 8,
    marginBottom: 16,
  },
  documentItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  conditionsList: {
    marginLeft: 8,
  },
  conditionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
  },
  submitButton: {
    backgroundColor: '#FF6B00',
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  bottomSpace: {
    height: 20,
  },
})

export default NewPointRelaisScreen