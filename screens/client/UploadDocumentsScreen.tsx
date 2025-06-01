import React, { useState } from 'react'
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native'
import { 
  Text, 
  Card, 
  Title, 
  Button,
  Paragraph,
  Surface,
  ActivityIndicator,
  ProgressBar
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker'

const UploadDocumentsScreen = ({ route, navigation }) => {
  const { demandeId } = route.params
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const [documents, setDocuments] = useState([
    {
      id: 'cni_recto',
      titre: 'CNI - Recto',
      description: 'Face avant de votre carte nationale d\'identité',
      requis: true,
      status: 'pending', // pending, uploaded, verified, rejected
      uri: null,
      error: null
    },
    {
      id: 'cni_verso',
      titre: 'CNI - Verso',
      description: 'Face arrière de votre carte nationale d\'identité',
      requis: true,
      status: 'pending',
      uri: null,
      error: null
    },
    {
      id: 'registre_commerce',
      titre: 'Registre de commerce',
      description: 'Document officiel d\'enregistrement de votre commerce',
      requis: true,
      status: 'pending',
      uri: null,
      error: null
    },
    {
      id: 'photo_commerce',
      titre: 'Photo du commerce',
      description: 'Photo de la façade de votre commerce',
      requis: true,
      status: 'pending',
      uri: null,
      error: null
    },
    {
      id: 'autorisation',
      titre: 'Autorisation de fonctionnement',
      description: 'Autorisation municipale ou administrative (si applicable)',
      requis: false,
      status: 'pending',
      uri: null,
      error: null
    }
  ])

  const selectImage = (documentId) => {
    Alert.alert(
      'Sélectionner une image',
      'Comment souhaitez-vous ajouter votre document ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Galerie', onPress: () => openImageLibrary(documentId) },
        { text: 'Caméra', onPress: () => openCamera(documentId) }
      ]
    )
  }

  const openImageLibrary = async (documentId) => {
    try {
      // Demander la permission d'accès à la galerie
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission refusée',
          'Permission d\'accès à la galerie requise pour sélectionner une image'
        )
        return
      }

      // Lancer la sélection d'image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        allowsMultipleSelection: false,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        updateDocument(documentId, { uri: asset.uri, status: 'uploaded' })
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error)
      Alert.alert('Erreur', 'Erreur lors de la sélection de l\'image')
    }
  }

  const openCamera = async (documentId) => {
    try {
      // Demander la permission d'accès à la caméra
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission refusée',
          'Permission d\'accès à la caméra requise pour prendre une photo'
        )
        return
      }

      // Lancer la caméra
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        updateDocument(documentId, { uri: asset.uri, status: 'uploaded' })
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error)
      Alert.alert('Erreur', 'Erreur lors de la prise de photo')
    }
  }

  const updateDocument = (documentId, updates) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, ...updates } : doc
    ))
  }

  const removeDocument = (documentId) => {
    Alert.alert(
      'Supprimer le document',
      'Êtes-vous sûr de vouloir supprimer ce document ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => updateDocument(documentId, { uri: null, status: 'pending', error: null })
        }
      ]
    )
  }

  const uploadAllDocuments = async () => {
    const requiredDocs = documents.filter(doc => doc.requis && !doc.uri)
    if (requiredDocs.length > 0) {
      Alert.alert(
        'Documents manquants',
        `Veuillez ajouter tous les documents requis (${requiredDocs.length} manquant(s))`
      )
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulation d'upload avec progression
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i / 100)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Marquer tous les documents comme vérifiés
      setDocuments(prev => prev.map(doc => 
        doc.uri ? { ...doc, status: 'verified' } : doc
      ))

      Alert.alert(
        'Documents envoyés',
        'Vos documents ont été envoyés avec succès. Ils seront vérifiés dans les 24h.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      )
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de l\'envoi des documents')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded': return { name: 'check-circle', color: '#4CAF50' }
      case 'verified': return { name: 'shield-check', color: '#2196F3' }
      case 'rejected': return { name: 'alert-circle', color: '#F44336' }
      default: return { name: 'plus-circle', color: '#FF6B00' }
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'uploaded': return 'Téléchargé'
      case 'verified': return 'Vérifié'
      case 'rejected': return 'Rejeté'
      default: return 'En attente'
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* En-tête */}
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>Documents requis</Title>
        <Paragraph style={styles.headerSubtitle}>
          Demande #{demandeId}
        </Paragraph>
      </Surface>

      {/* Instructions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Instructions</Title>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>• Photos claires et lisibles</Text>
            <Text style={styles.instructionItem}>• Format JPG ou PNG accepté</Text>
            <Text style={styles.instructionItem}>• Taille maximum : 5 MB par fichier</Text>
            <Text style={styles.instructionItem}>• Évitez les reflets et ombres</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Progression d'upload */}
      {uploading && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Envoi en cours...</Title>
            <ProgressBar 
              progress={uploadProgress} 
              color="#FF6B00" 
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {Math.round(uploadProgress * 100)}% terminé
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Liste des documents */}
      {documents.map((document) => {
        const statusIcon = getStatusIcon(document.status)
        
        return (
          <Card key={document.id} style={styles.card}>
            <Card.Content>
              <View style={styles.documentHeader}>
                <View style={styles.documentTitleContainer}>
                  <Text style={styles.documentTitle}>
                    {document.titre}
                    {document.requis && <Text style={styles.required}> *</Text>}
                  </Text>
                  <Text style={styles.documentDescription}>
                    {document.description}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <Icon 
                    name={statusIcon.name} 
                    size={24} 
                    color={statusIcon.color} 
                  />
                  <Text style={[styles.statusText, { color: statusIcon.color }]}>
                    {getStatusText(document.status)}
                  </Text>
                </View>
              </View>

              {document.uri ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: document.uri }} style={styles.documentImage} />
                  <View style={styles.imageActions}>
                    <Button
                      mode="outlined"
                      compact
                      onPress={() => selectImage(document.id)}
                      style={styles.changeButton}
                    >
                      Changer
                    </Button>
                    <Button
                      mode="outlined"
                      compact
                      onPress={() => removeDocument(document.id)}
                      style={styles.removeButton}
                      textColor="#F44336"
                    >
                      Supprimer
                    </Button>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadArea}
                  onPress={() => selectImage(document.id)}
                  disabled={uploading}
                >
                  <Icon name="camera-plus" size={48} color="#FF6B00" />
                  <Text style={styles.uploadText}>
                    Toucher pour ajouter une photo
                  </Text>
                </TouchableOpacity>
              )}

              {document.error && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#F44336" />
                  <Text style={styles.errorText}>{document.error}</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )
      })}

      {/* Bouton d'envoi */}
      <View style={styles.submitContainer}>
        <Button
          mode="contained"
          onPress={uploadAllDocuments}
          loading={uploading}
          disabled={uploading}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          {uploading ? 'Envoi en cours...' : 'Envoyer tous les documents'}
        </Button>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    elevation: 2,
    marginBottom: 16,
  },
  headerTitle: {
    color: '#FF6B00',
    fontSize: 24,
    textAlign: 'center',
  },
  headerSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
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
  instructionsList: {
    marginLeft: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  documentTitleContainer: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  required: {
    color: '#F44336',
  },
  documentDescription: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  statusText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#FF6B00',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
  uploadText: {
    marginTop: 8,
    color: '#FF6B00',
    fontSize: 14,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  documentImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
  },
  changeButton: {
    borderColor: '#FF6B00',
  },
  removeButton: {
    borderColor: '#F44336',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
  },
  errorText: {
    marginLeft: 8,
    color: '#F44336',
    fontSize: 12,
  },
  submitContainer: {
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

export default UploadDocumentsScreen