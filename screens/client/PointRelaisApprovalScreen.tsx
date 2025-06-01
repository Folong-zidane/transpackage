import React, { useState, useEffect } from 'react'
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Dimensions,
  Animated
} from 'react-native'
import { 
  Text, 
  Card, 
  Title, 
  Button,
  Paragraph,
  Surface,
  Chip,
  TextInput,
  Switch,
  Divider,
  List
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const PointRelaisApprovalScreen = ({ route, navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.8))
  const [saving, setSaving] = useState(false)
  
  const [pointRelaisData, setPointRelaisData] = useState({
    id: 'PR2025001',
    nom: 'Jean KAMGA',
    commerce: 'Boutique Moderne',
    adresse: 'Rue 1.234, Quartier Essos, Yaoundé',
    telephone: '+237 677 123 456',
    email: 'jean.kamga@email.com',
    dateApprobation: new Date().toLocaleDateString('fr-FR'),
    codePointRelais: 'YDE001',
    commission: 2.5, // pourcentage
    statut: 'actif'
  })
  
  const [configuration, setConfiguration] = useState({
    heuresOuverture: {
      lundi: { ouvert: true, debut: '08:00', fin: '18:00' },
      mardi: { ouvert: true, debut: '08:00', fin: '18:00' },
      mercredi: { ouvert: true, debut: '08:00', fin: '18:00' },
      jeudi: { ouvert: true, debut: '08:00', fin: '18:00' },
      vendredi: { ouvert: true, debut: '08:00', fin: '18:00' },
      samedi: { ouvert: true, debut: '08:00', fin: '17:00' },
      dimanche: { ouvert: false, debut: '', fin: '' }
    },
    servicesOfferts: {
      reception: true,
      expedition: true,
      paiement: true,
      stockage: true
    },
    capaciteStockage: '50', // nombre de colis
    fraisService: '500', // FCFA par colis
    notificationsEmail: true,
    notificationsSMS: true
  })

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  const updateHeuresOuverture = (jour, field, value) => {
    setConfiguration(prev => ({
      ...prev,
      heuresOuverture: {
        ...prev.heuresOuverture,
        [jour]: {
          ...prev.heuresOuverture[jour],
          [field]: value
        }
      }
    }))
  }

  const updateService = (service, value) => {
    setConfiguration(prev => ({
      ...prev,
      servicesOfferts: {
        ...prev.servicesOfferts,
        [service]: value
      }
    }))
  }



  {/**
  const sauvegarderConfiguration = async () => {
    setSaving(true)
    
    try {
      // Validation
      if (!configuration.capaciteStockage || parseInt(configuration.capaciteStockage) < 10) {
        Alert.alert('Erreur', 'La capacité de stockage doit être d\'au moins 10 colis')
        return
      }
      
      if (!configuration.fraisService || parseInt(configuration.fraisService) < 100) {
        Alert.alert('Erreur', 'Les frais de service doivent être d\'au moins 100 FCFA')
        return
      }
      
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      Alert.alert(
        'Configuration sauvegardée',
        'Votre point relais est maintenant opérationnel !',
        [
          {
            text: 'Commencer',
            onPress: () => navigation.replace('PointRelaisDashboard')
          }
        ]
      )
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }
 */}

  const sauvegarderConfiguration = () => {
    alert("Configuration sauvegardée")
  }

  const voirContrat = () => {
    {/*navigation.navigate('ContratPointRelais', { pointRelaisId: pointRelaisData.id })*/}
    alert("contrat vue")
  }

  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
  const joursLabels = {
    lundi: 'Lundi',
    mardi: 'Mardi', 
    mercredi: 'Mercredi',
    jeudi: 'Jeudi',
    vendredi: 'Vendredi',
    samedi: 'Samedi',
    dimanche: 'Dimanche'
  }

  return (
    <ScrollView style={styles.container}>
      {/* En-tête de félicitations */}
      <Animated.View 
        style={[
          styles.celebrationHeader,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Surface style={styles.celebrationCard}>
          <Icon name="party-popper" size={64} color="#4CAF50" />
          <Title style={styles.celebrationTitle}>Félicitations !</Title>
          <Paragraph style={styles.celebrationText}>
            Votre demande a été approuvée. Vous êtes maintenant un point relais officiel !
          </Paragraph>
          <Chip 
            style={styles.statusChip}
            textStyle={styles.statusChipText}
            icon="check-circle"
          >
            APPROUVÉ
          </Chip>
        </Surface>
      </Animated.View>

      {/* Informations du point relais */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Vos informations</Title>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Code Point Relais</Text>
              <Text style={styles.infoValue}>{pointRelaisData.codePointRelais}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Commission</Text>
              <Text style={styles.infoValue}>{pointRelaisData.commission}%</Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Icon name="account" size={20} color="#666" />
              <Text style={styles.detailText}>{pointRelaisData.nom}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="store" size={20} color="#666" />
              <Text style={styles.detailText}>{pointRelaisData.commerce}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="map-marker" size={20} color="#666" />
              <Text style={styles.detailText}>{pointRelaisData.adresse}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="calendar-check" size={20} color="#666" />
              <Text style={styles.detailText}>Approuvé le {pointRelaisData.dateApprobation}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Configuration des horaires */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Heures d'ouverture</Title>
          <Paragraph style={styles.sectionDescription}>
            Définissez vos heures d'ouverture pour le service point relais
          </Paragraph>
          
          {jours.map(jour => (
            <View key={jour} style={styles.horaireRow}>
              <View style={styles.jourContainer}>
                <Text style={styles.jourLabel}>{joursLabels[jour]}</Text>
                <Switch
                  value={configuration.heuresOuverture[jour].ouvert}
                  onValueChange={(value) => updateHeuresOuverture(jour, 'ouvert', value)}
                  color="#FF6B00"
                />
              </View>
              
              {configuration.heuresOuverture[jour].ouvert && (
                <View style={styles.heuresContainer}>
                  <TextInput
                    label="Ouverture"
                    value={configuration.heuresOuverture[jour].debut}
                    onChangeText={(value) => updateHeuresOuverture(jour, 'debut', value)}
                    style={styles.heureInput}
                    placeholder="08:00"
                    mode="outlined"
                    dense
                  />
                  <Text style={styles.separateur}>à</Text>
                  <TextInput
                    label="Fermeture"
                    value={configuration.heuresOuverture[jour].fin}
                    onChangeText={(value) => updateHeuresOuverture(jour, 'fin', value)}
                    style={styles.heureInput}
                    placeholder="18:00"
                    mode="outlined"
                    dense
                  />
                </View>
              )}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Services offerts */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Services offerts</Title>
          
          <List.Item
            title="Réception de colis"
            description="Recevoir des colis pour vos clients"
            left={() => <Icon name="package-variant" size={24} color="#FF6B00" />}
            right={() => (
              <Switch
                value={configuration.servicesOfferts.reception}
                onValueChange={(value) => updateService('reception', value)}
                color="#FF6B00"
              />
            )}
          />
          
          <List.Item
            title="Expédition de colis"
            description="Permettre l'envoi de colis depuis votre point"
            left={() => <Icon name="truck-delivery" size={24} color="#FF6B00" />}
            right={() => (
              <Switch
                value={configuration.servicesOfferts.expedition}
                onValueChange={(value) => updateService('expedition', value)}
                color="#FF6B00"
              />
            )}
          />
          
          <List.Item
            title="Paiement de services"
            description="Accepter les paiements pour divers services"
            left={() => <Icon name="credit-card" size={24} color="#FF6B00" />}
            right={() => (
              <Switch
                value={configuration.servicesOfferts.paiement}
                onValueChange={(value) => updateService('paiement', value)}
                color="#FF6B00"
              />
            )}
          />
          
          <List.Item
            title="Stockage temporaire"
            description="Stocker des colis en attente de retrait"
            left={() => <Icon name="warehouse" size={24} color="#FF6B00" />}
            right={() => (
              <Switch
                value={configuration.servicesOfferts.stockage}
                onValueChange={(value) => updateService('stockage', value)}
                color="#FF6B00"
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Configuration avancée */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Configuration</Title>
          
          <TextInput
            label="Capacité de stockage (nombre de colis)"
            value={configuration.capaciteStockage}
            onChangeText={(value) => setConfiguration(prev => ({ ...prev, capaciteStockage: value }))}
            style={styles.input}
            keyboardType="numeric"
            mode="outlined"
          />
          
          <TextInput
            label="Frais de service par colis (FCFA)"
            value={configuration.fraisService}
            onChangeText={(value) => setConfiguration(prev => ({ ...prev, fraisService: value }))}
            style={styles.input}
            keyboardType="numeric"
            mode="outlined"
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Notifications par email"
            description="Recevoir les notifications par email"
            left={() => <Icon name="email" size={24} color="#666" />}
            right={() => (
              <Switch
                value={configuration.notificationsEmail}
                onValueChange={(value) => setConfiguration(prev => ({ ...prev, notificationsEmail: value }))}
                color="#FF6B00"
              />
            )}
          />
          
          <List.Item
            title="Notifications par SMS"
            description="Recevoir les notifications par SMS"
            left={() => <Icon name="message" size={24} color="#666" />}
            right={() => (
              <Switch
                value={configuration.notificationsSMS}
                onValueChange={(value) => setConfiguration(prev => ({ ...prev, notificationsSMS: value }))}
                color="#FF6B00"
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          mode="outlined"
          onPress={voirContrat}
          style={styles.contractButton}
          icon="file-document"
        >
          Voir le contrat
        </Button>
        
        <Button
          mode="contained"
          onPress={sauvegarderConfiguration}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
        >
          {saving ? 'Finalisation...' : 'Finaliser la configuration'}
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
  celebrationHeader: {
    margin: 16,
    marginBottom: 8,
  },
  celebrationCard: {
    padding: 32,
    alignItems: 'center',
    elevation: 4,
    borderRadius: 12,
  },
  celebrationTitle: {
    fontSize: 28,
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  celebrationText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  statusChip: {
    backgroundColor: '#4CAF50',
  },
  statusChipText: {
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
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#666',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  divider: {
    marginVertical: 16,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  horaireRow: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  jourContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jourLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  heuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heureInput: {
    flex: 1,
    height: 40,
  },
  separateur: {
    color: '#666',
    paddingHorizontal: 8,
  },
  input: {
    marginBottom: 12,
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  contractButton: {
    borderColor: '#FF6B00',
  },
  saveButton: {
    backgroundColor: '#FF6B00',
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  bottomSpace: {
    height: 20,
  },
})

export default PointRelaisApprovalScreen