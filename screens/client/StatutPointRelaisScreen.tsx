
import React, { useState, useEffect } from 'react'
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  RefreshControl,
  Alert 
} from 'react-native'
import { 
  Text, 
  Card, 
  Title, 
  Paragraph, 
  Button,
  Chip,
  Timeline,
  Divider,
  IconButton,
  Surface
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const StatutPointRelaisScreen = ({ route, navigation }) => {
  const [refreshing, setRefreshing] = useState(false)
  const [demande, setDemande] = useState({
    id: 'PR2025001',
    dateCreation: '2025-05-30',
    statut: 'en_cours', // en_attente, en_cours, approuve, rejete
    nom: 'Jean KAMGA',
    commerce: 'Boutique Moderne',
    ville: 'Yaoundé',
    telephone: '+237 677 123 456',
    email: 'jean.kamga@email.com',
    documentsManquants: ['Registre de commerce', 'Photo du commerce'],
    commentaires: 'Dossier en cours de vérification. Documents complémentaires requis.',
    dateReponse: null,
    etapes: [
      {
        titre: 'Demande soumise',
        date: '2025-05-30 14:30',
        statut: 'complete',
        description: 'Votre demande a été reçue avec succès'
      },
      {
        titre: 'Vérification des informations',
        date: '2025-05-30 16:45',
        statut: 'complete',
        description: 'Vos informations personnelles ont été vérifiées'
      },
      {
        titre: 'Analyse des documents',
        date: '2025-05-31 09:15',
        statut: 'en_cours',
        description: 'Vérification des documents fournis en cours'
      },
      {
        titre: 'Visite de terrain',
        date: null,
        statut: 'en_attente',
        description: 'Visite de votre commerce pour validation'
      },
      {
        titre: 'Décision finale',
        date: null,
        statut: 'en_attente',
        description: 'Notification de la décision'
      }
    ]
  })

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulation du refresh
    setTimeout(() => {
      setRefreshing(false)
      Alert.alert('Mis à jour', 'Statut de votre demande mis à jour')
    }, 1500)
  }

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'en_attente': return '#FFA500'
      case 'en_cours': return '#2196F3'
      case 'approuve': return '#4CAF50'
      case 'rejete': return '#F44336'
      default: return '#9E9E9E'
    }
  }

  const getStatutText = (statut) => {
    switch (statut) {
      case 'en_attente': return 'En attente'
      case 'en_cours': return 'En cours'
      case 'approuve': return 'Approuvé'
      case 'rejete': return 'Rejeté'
      default: return 'Inconnu'
    }
  }

  const getEtapeIcon = (statut) => {
    switch (statut) {
      case 'complete': return 'check-circle'
      case 'en_cours': return 'clock'
      case 'en_attente': return 'circle-outline'
      default: return 'circle-outline'
    }
  }

  const uploadDocuments = () => {
    navigation.navigate('UploadDocuments', { demandeId: demande.id })
  }

  const contactSupport = () => {
    Alert.alert(
      'Contacter le support',
      'Comment souhaitez-vous nous contacter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Téléphone', onPress: () => console.log('Appel support') },
        { text: 'Email', onPress: () => console.log('Email support') }
      ]
    )
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* En-tête avec statut */}
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <Title style={styles.headerTitle}>Suivi de demande</Title>
          <Text style={styles.demandeId}>#{demande.id}</Text>
          <Chip 
            style={[styles.statutChip, { backgroundColor: getStatutColor(demande.statut) }]}
            textStyle={styles.statutText}
          >
            {getStatutText(demande.statut)}
          </Chip>
        </View>
      </Surface>

      {/* Informations de base */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Informations de la demande</Title>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color="#666" />
            <Text style={styles.infoText}>{demande.nom}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="store" size={20} color="#666" />
            <Text style={styles.infoText}>{demande.commerce}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#666" />
            <Text style={styles.infoText}>{demande.ville}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.infoText}>Soumise le {demande.dateCreation}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Timeline des étapes */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Progression</Title>
          {demande.etapes.map((etape, index) => (
            <View key={index} style={styles.etapeContainer}>
              <View style={styles.etapeIconContainer}>
                <Icon 
                  name={getEtapeIcon(etape.statut)} 
                  size={24} 
                  color={etape.statut === 'complete' ? '#4CAF50' : 
                         etape.statut === 'en_cours' ? '#2196F3' : '#9E9E9E'} 
                />
              </View>
              <View style={styles.etapeContent}>
                <Text style={[
                  styles.etapeTitre,
                  etape.statut === 'complete' && styles.etapeTitreComplete
                ]}>
                  {etape.titre}
                </Text>
                <Text style={styles.etapeDescription}>{etape.description}</Text>
                {etape.date && (
                  <Text style={styles.etapeDate}>{etape.date}</Text>
                )}
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Documents manquants */}
      {demande.documentsManquants.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Documents requis</Title>
            <Paragraph style={styles.warningText}>
              Les documents suivants sont nécessaires pour finaliser votre demande :
            </Paragraph>
            {demande.documentsManquants.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <Icon name="file-document-outline" size={20} color="#FF6B00" />
                <Text style={styles.documentText}>{doc}</Text>
              </View>
            ))}
            <Button
              mode="contained"
              onPress={uploadDocuments}
              style={styles.uploadButton}
              icon="upload"
            >
              Télécharger les documents
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Commentaires */}
      {demande.commentaires && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Commentaires</Title>
            <View style={styles.commentContainer}>
              <Icon name="message-text" size={20} color="#666" />
              <Text style={styles.commentText}>{demande.commentaires}</Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Actions</Title>
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={contactSupport}
              style={styles.actionButton}
              icon="headset"
            >
              Contacter le support
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('PointRelaisApproval', { id: demande.id })}
              style={styles.actionButton}
              icon="eye"
            >
              Consulter l'approbation
            </Button>
          </View>
        </Card.Content>
      </Card>

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
    elevation: 4,
    marginBottom: 16,
  },
  headerContent: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FF6B00',
    fontSize: 24,
    marginBottom: 4,
  },
  demandeId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  statutChip: {
    paddingHorizontal: 12,
  },
  statutText: {
    color: 'white',
    fontWeight: 'bold',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  etapeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  etapeIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  etapeContent: {
    flex: 1,
    marginLeft: 12,
  },
  etapeTitre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  etapeTitreComplete: {
    color: '#4CAF50',
  },
  etapeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  etapeDate: {
    fontSize: 12,
    color: '#999',
  },
  warningText: {
    color: '#FF6B00',
    marginBottom: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#FF6B00',
    marginTop: 12,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    borderColor: '#FF6B00',
  },
  bottomSpace: {
    height: 20,
  },
})

export default StatutPointRelaisScreen