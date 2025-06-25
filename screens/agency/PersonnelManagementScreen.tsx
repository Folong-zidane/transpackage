import { useState, useEffect } from "react"
import { StyleSheet, View, ScrollView, Alert, RefreshControl, Modal } from "react-native"
import { Text, Card, Button, Searchbar, Chip, Avatar, IconButton, Menu, Divider, Badge, Portal, Dialog, TextInput, Switch } from "react-native-paper"
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Animatable from "react-native-animatable"

export default function PersonnelManagementScreen({ navigation }) {
  // États
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("tous")
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [menuVisible, setMenuVisible] = useState({})
  const [dialogVisible, setDialogVisible] = useState(false)
  const [actionType, setActionType] = useState("")
  const [notificationText, setNotificationText] = useState("")

  // Données simulées du personnel
  const [personnelList, setPersonnelList] = useState([
    {
      id: 1,
      firstName: "Jean",
      lastName: "Mballa",
      email: "jean.mballa@relais.cm",
      phone: "+237 6XX XX XX XX",
      category: "relais",
      role: "agent_relais",
      roleLabel: "Agent de point relais",
      isActive: true,
      relayPoint: "Douala Bonamoussadi",
      lastConnection: "2024-06-23T14:20:00",
      weeklyPackages: 92,
      monthlyPackages: 380,
      avatar: null,
      performance: {
        processed: 92,
        errors: 2,
        rating: 4.7
      },
      workHours: {
        start: "08:00",
        end: "17:00",
        hoursWorked: 8.5
      }
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Nguema",
      email: "marie.nguema@relais.cm",
      phone: "+237 6XX XX XX XX",
      category: "itinerant",
      role: "livreur",
      roleLabel: "Livreur / Chauffeur",
      isActive: true,
      vehicleType: "Camionnette",
      workZone: "Zone Centre",
      lastConnection: "2024-06-23T16:45:00",
      weeklyPackages: 156,
      monthlyPackages: 620,
      avatar: null,
      performance: {
        processed: 156,
        errors: 1,
        rating: 4.9
      }
    },
    {
      id: 3,
      firstName: "Paul",
      lastName: "Atangana",
      email: "paul.atangana@relais.cm",
      phone: "+237 6XX XX XX XX",
      category: "entreprise",
      role: "gestionnaire_reseau",
      roleLabel: "Gestionnaire de réseau",
      isActive: false,
      managedRelayPoints: ["Yaoundé Centre", "Yaoundé Melen"],
      lastConnection: "2024-06-20T10:30:00",
      weeklyPackages: 0,
      monthlyPackages: 45,
      avatar: null,
      performance: {
        processed: 0,
        errors: 0,
        rating: 4.2
      }
    },
    {
      id: 4,
      firstName: "Clarisse",
      lastName: "Mbarga",
      email: "clarisse.mbarga@relais.cm",
      phone: "+237 6XX XX XX XX",
      category: "itinerant",
      role: "livreur",
      roleLabel: "Livreuse / Motocycliste",
      isActive: true,
      vehicleType: "Moto",
      workZone: "Zone Littoral",
      lastConnection: "2024-06-24T14:15:00",
      weeklyPackages: 132,
      monthlyPackages: 508,
      avatar: null,
      performance: {
        processed: 132,
        errors: 3,
        rating: 4.7
      }
    },
    {
      id: 5,
      firstName: "Jean",
      lastName: "Ewondo",
      email: "jean.ewondo@relais.cm",
      phone: "+237 6XX XX XX XX",
      category: "entreprise",
      role: "gestionnaire_reseau",
      roleLabel: "Gestionnaire de réseau",
      isActive: false,
      managedRelayPoints: ["Douala Akwa", "Douala Bonamoussadi"],
      lastConnection: "2024-06-18T09:00:00",
      weeklyPackages: 0,
      monthlyPackages: 37,
      avatar: null,
      performance: {
        processed: 0,
        errors: 0,
        rating: 4.0
      }
    }
    
  ])

  // Filtres
  const filters = [
    { key: "tous", label: "Tous", count: personnelList.length },
    { key: "actif", label: "Actifs", count: personnelList.filter(p => p.isActive).length },
    { key: "inactif", label: "Inactifs", count: personnelList.filter(p => !p.isActive).length },
    { key: "relais", label: "Point relais", count: personnelList.filter(p => p.category === "relais").length },
    { key: "itinerant", label: "Itinérant", count: personnelList.filter(p => p.category === "itinerant").length },
    { key: "entreprise", label: "Entreprise", count: personnelList.filter(p => p.category === "entreprise").length }
  ]

  // Fonctions utilitaires
  const formatLastConnection = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return "À l'instant"
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays === 1) return "Hier"
    return `Il y a ${diffDays} jours`
  }

  const getStatusColor = (isActive) => isActive ? "#4CAF50" : "#F44336"
  const getStatusText = (isActive) => isActive ? "Actif" : "Inactif"

  const getCategoryIcon = (category) => {
    switch (category) {
      case "relais": return "cart"
      case "itinerant": return "car"
      case "entreprise": return "business"
      default: return "account"
    }
  }

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return "#4CAF50"
    if (rating >= 4.0) return "#FF9800"
    return "#F44336"
  }

  // Filtrage du personnel
  const filteredPersonnel = personnelList.filter(person => {
    const matchesSearch = 
      person.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.roleLabel.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = 
      selectedFilter === "tous" ||
      (selectedFilter === "actif" && person.isActive) ||
      (selectedFilter === "inactif" && !person.isActive) ||
      selectedFilter === person.category

    return matchesSearch && matchesFilter
  })

  // Actions
  const handleRefresh = async () => {
    setRefreshing(true)
    // Simuler le rechargement des données
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const showMenu = (personnelId) => {
    setMenuVisible({ ...menuVisible, [personnelId]: true })
  }

  const hideMenu = (personnelId) => {
    setMenuVisible({ ...menuVisible, [personnelId]: false })
  }

  const handleAction = (action, personnel) => {
    setSelectedPersonnel(personnel)
    setActionType(action)
    setDialogVisible(true)
    hideMenu(personnel.id)
  }

  const executeAction = () => {
    switch (actionType) {
      case "toggle_status":
        togglePersonnelStatus()
        break
      case "reset_password":
        resetPassword()
        break
      case "send_notification":
        sendNotification()
        break
      case "delete":
        deletePersonnel()
        break
    }
    setDialogVisible(false)
    setNotificationText("")
  }

  const togglePersonnelStatus = () => {
    setPersonnelList(prev => prev.map(p => 
      p.id === selectedPersonnel.id 
        ? { ...p, isActive: !p.isActive }
        : p
    ))
    Alert.alert(
      "Statut modifié", 
      `${selectedPersonnel.firstName} ${selectedPersonnel.lastName} est maintenant ${selectedPersonnel.isActive ? 'inactif' : 'actif'}`
    )
  }

  const resetPassword = () => {
    Alert.alert(
      "Mot de passe réinitialisé",
      `Un nouveau mot de passe a été envoyé à ${selectedPersonnel.email}`
    )
  }

  const sendNotification = () => {
    if (!notificationText.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un message")
      return
    }
    Alert.alert(
      "Notification envoyée",
      `Message envoyé à ${selectedPersonnel.firstName} ${selectedPersonnel.lastName}`
    )
  }

  const deletePersonnel = () => {
    Alert.alert(
      "Confirmation",
      `Êtes-vous sûr de vouloir supprimer ${selectedPersonnel.firstName} ${selectedPersonnel.lastName} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setPersonnelList(prev => prev.filter(p => p.id !== selectedPersonnel.id))
            Alert.alert("Supprimé", "Le personnel a été supprimé avec succès")
          }
        }
      ]
    )
  }

  // Rendu des composants
  const renderHeader = () => (
    <View style={styles.header}>
    
      <Searchbar
        placeholder="Rechercher un personnel..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        icon="magnify"
      />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map(filter => (
          <Chip
            key={filter.key}
            selected={selectedFilter === filter.key}
            onPress={() => setSelectedFilter(filter.key)}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.selectedFilterChip
            ]}
            textStyle={selectedFilter === filter.key && styles.selectedFilterText}
          >
            {filter.label} ({filter.count})
          </Chip>
        ))}
      </ScrollView>
    </View>
  )

  const renderPersonnelCard = (person) => (
    <Animatable.View
      key={person.id}
      animation="fadeInUp"
      delay={person.id * 100}
      duration={600}
    >
      <Card style={styles.personnelCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.personnelInfo}>
              <Avatar.Text
                size={50}
                label={`${person.firstName[0]}${person.lastName[0]}`}
                backgroundColor={person.isActive ? "#FF6B00" : "#ccc"}
              />
              <View style={styles.personnelDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.personnelName}>
                    {person.firstName} {person.lastName}
                  </Text>
                  <Badge
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(person.isActive) }
                    ]}
                  >
                    {getStatusText(person.isActive)}
                  </Badge>
                </View>
                <Text style={styles.personnelRole}>{person.roleLabel}</Text>
                <Text style={styles.personnelEmail}>{person.email}</Text>
              </View>
            </View>

            <Menu
              visible={menuVisible[person.id] || false}
              onDismiss={() => hideMenu(person.id)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => showMenu(person.id)}
                />
              }
            >
              <Menu.Item
                onPress={() => navigation.navigate('EditPersonnel', { personnelId: person.id })}
                title="Modifier le profil"
                leadingIcon="account-edit"
              />
              <Menu.Item
                onPress={() => handleAction('toggle_status', person)}
                title={person.isActive ? "Désactiver" : "Activer"}
                leadingIcon={person.isActive ? "account-off" : "account-check"}
              />
              <Menu.Item
                onPress={() => handleAction('reset_password', person)}
                title="Réinitialiser mot de passe"
                leadingIcon="lock-reset"
              />
              <Divider />
              <Menu.Item
                onPress={() => navigation.navigate('PersonnelHistory', { personnelId: person.id })}
                title="Voir l'historique"
                leadingIcon="history"
              />
              <Menu.Item
                onPress={() => handleAction('send_notification', person)}
                title="Envoyer notification"
                leadingIcon="bell"
              />
              <Divider />
              <Menu.Item
                onPress={() => handleAction('delete', person)}
                title="Supprimer"
                leadingIcon="delete"
                titleStyle={{ color: '#F44336' }}
              />
            </Menu>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="cube" size={20} color="#FF6B00" />
              <Text style={styles.statLabel}>Cette semaine</Text>
              <Text style={styles.statValue}>{person.weeklyPackages} colis</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="calendar" size={20} color="#2196F3" />
              <Text style={styles.statLabel}>Ce mois</Text>
              <Text style={styles.statValue}>{person.monthlyPackages} colis</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color={getPerformanceColor(person.performance.rating)} />
              <Text style={styles.statLabel}>Performance</Text>
              <Text style={styles.statValue}>{person.performance.rating}/5</Text>
            </View>
          </View>

          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Ionicons name={getCategoryIcon(person.category)} size={16} color="#666" />
              <Text style={styles.infoText}>
                {person.relayPoint || person.workZone || person.managedRelayPoints?.join(", ") || "Non assigné"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.infoText}>
                Dernière connexion: {formatLastConnection(person.lastConnection)}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              // onPress={() => navigation.navigate('PersonnelDetails', { personnelId: person.id })}
              onPress={() => Alert.alert("Détails du personnel", "Détails du personnel")}
              style={styles.actionButton}
              icon="eye"
            >
              Détails
            </Button>
            <Button
              mode="contained"
              // onPress={() => navigation.navigate('EditPersonnel', { personnelId: person.id })}
              onPress={() => Alert.alert("Modifier le personnel", "Modifier le personnel")}
              style={[styles.actionButton, styles.editButton]}
              icon="pencil"
            >
              Modifier
            </Button>
          </View>
        </Card.Content>
      </Card>
      
    </Animatable.View>
  )

  const renderDialog = () => {
    let title = ""
    let content = null

    switch (actionType) {
      case "toggle_status":
        title = selectedPersonnel?.isActive ? "Désactiver le personnel" : "Activer le personnel"
        content = (
          <Text>
            {selectedPersonnel?.isActive 
              ? `Êtes-vous sûr de vouloir désactiver ${selectedPersonnel?.firstName} ${selectedPersonnel?.lastName} ?`
              : `Êtes-vous sûr de vouloir activer ${selectedPersonnel?.firstName} ${selectedPersonnel?.lastName} ?`
            }
          </Text>
        )
        break
      case "reset_password":
        title = "Réinitialiser le mot de passe"
        content = (
          <Text>
            Un nouveau mot de passe sera envoyé à {selectedPersonnel?.email}. Continuer ?
          </Text>
        )
        break
      case "send_notification":
        title = "Envoyer une notification"
        content = (
          <TextInput
            label="Message"
            value={notificationText}
            onChangeText={setNotificationText}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Saisissez votre message..."
          />
        )
        break
      case "delete":
        title = "Supprimer le personnel"
        content = (
          <Text style={{ color: '#F44336' }}>
            ⚠️ Cette action est irréversible. Êtes-vous sûr de vouloir supprimer {selectedPersonnel?.firstName} {selectedPersonnel?.lastName} ?
          </Text>
        )
        break
    }

    return (
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            {content}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Annuler</Button>
            <Button 
              onPress={executeAction}
              mode="contained"
              style={actionType === "delete" ? { backgroundColor: '#F44336' } : {}}
            >
              {actionType === "delete" ? "Supprimer" : "Confirmer"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    )
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FF6B00"]}
          />
        }
      >
        {filteredPersonnel.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people" size={60} color="#ccc" />
            <Text style={styles.emptyStateText}>
              {searchQuery ? "Aucun personnel trouvé" : "Aucun personnel dans cette catégorie"}
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('CreatePersonnel')}
              style={styles.emptyStateButton}
              icon="plus"
            >
              Ajouter un personnel
            </Button>
          </View>
        ) : (
          <View style={styles.personnelList}>
            {filteredPersonnel.map(renderPersonnelCard)}
          </View>
        )}
      </ScrollView>

      {renderDialog()}


      {/** la barre de navigation */}
      <View style={styles.headerTop}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreatePersonnel')}
          icon="plus"
          style={styles.addButton}
        >
          Ajouter
        </Button>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between", // distribue entre début et fin
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 130, // optionnel pour marges latérales
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#FF6B00",
  },
  searchBar: {
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  selectedFilterChip: {
    backgroundColor: "#FF6B00",
  },
  selectedFilterText: {
    color: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  personnelList: {
    padding: 16,
  },
  personnelCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  personnelInfo: {
    flexDirection: "row",
    flex: 1,
  },
  personnelDetails: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  personnelName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    color: "#fff",
    fontSize: 12,
  },
  personnelRole: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  personnelEmail: {
    fontSize: 13,
    color: "#888",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  additionalInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: "#FF6B00",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 16,
  },
  emptyStateButton: {
    backgroundColor: "#FF6B00",
    marginTop: 16,
  },
})