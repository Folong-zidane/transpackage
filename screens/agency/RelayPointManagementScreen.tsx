
import { useState } from "react"
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { Text, Card, Searchbar, Switch, Divider, FAB, Menu } from "react-native-paper"
import { useRelayPoints } from "../../contexts/RelayPointContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const RelayPointManagementScreen = () => {
  const { relayPoints, getManagedRelayPoints, toggleRelayPointStatus } = useRelayPoints()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedRelayPoint, setSelectedRelayPoint] = useState<string | null>(null)

  const managedRelayPoints = getManagedRelayPoints()

  const filteredPoints = managedRelayPoints.filter(
    (point) =>
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleRelayPointStatus(id)
    } catch (error) {
      console.error("Failed to toggle status", error)
    }
  }

  const renderRightActions = (id: string) => {
    return (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.swipeAction, styles.editAction]}
          onPress={() => navigation.navigate("EditRelayPoint", { relayPointId: id } as never)}
          accessible={true}
          accessibilityLabel="Modifier le point relais"
          accessibilityHint="Appuyez pour modifier ce point relais"
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.swipeAction, styles.statsAction]}
          onPress={() => navigation.navigate("RelayPointStats", { relayPointId: id } as never)}
          accessible={true}
          accessibilityLabel="Voir les statistiques"
          accessibilityHint="Appuyez pour voir les statistiques de ce point relais"
        >
          <Ionicons name="stats-chart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    )
  }

  const renderItem = ({ item }) => (
    <Animatable.View animation="fadeIn" duration={500}>
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <Card style={styles.pointCard}>
          <Card.Content>
            <View style={styles.pointHeader}>
              <View>
                <Text style={styles.pointName}>{item.name}</Text>
                <Text style={styles.pointAddress}>{item.address}</Text>
              </View>
              <Menu
                visible={menuVisible && selectedRelayPoint === item.id}
                onDismiss={() => {
                  setMenuVisible(false)
                  setSelectedRelayPoint(null)
                }}
                anchor={
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedRelayPoint(item.id)
                      setMenuVisible(true)
                    }}
                    accessible={true}
                    accessibilityLabel="Options du point relais"
                    accessibilityHint="Appuyez pour voir les options disponibles"
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                  </TouchableOpacity>
                }
              >
                <Menu.Item
                  onPress={() => {
                    navigation.navigate("EditRelayPoint", { relayPointId: item.id } as never)
                    setMenuVisible(false)
                  }}
                  title="Modifier"
                  leadingIcon="pencil"
                />
                <Menu.Item
                  onPress={() => {
                    navigation.navigate("RelayPointStats", { relayPointId: item.id } as never)
                    setMenuVisible(false)
                  }}
                  title="Statistiques"
                  leadingIcon="chart-bar"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    handleToggleStatus(item.id)
                    setMenuVisible(false)
                  }}
                  title={item.isActive ? "Désactiver" : "Activer"}
                  leadingIcon={item.isActive ? "close-circle" : "check-circle"}
                />
              </Menu>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.pointDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{item.openingHours}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="cube-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{item.stats.packagesProcessed} colis traités</Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Statut:</Text>
              <Switch
                value={item.isActive}
                onValueChange={() => handleToggleStatus(item.id)}
                color="#4CAF50"
                style={styles.statusSwitch}
                accessible={true}
                accessibilityLabel={`Point relais ${item.isActive ? "actif" : "inactif"}`}
                accessibilityHint="Appuyez pour changer le statut du point relais"
              />
              <Text style={[styles.statusText, { color: item.isActive ? "#4CAF50" : "#FF3B30" }]}>
                {item.isActive ? "Actif" : "Inactif"}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </Swipeable>
    </Animatable.View>
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Rechercher un point relais..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <Text style={styles.swipeHint}>← Glissez vers la gauche pour plus d'options →</Text>

        {filteredPoints.length > 0 ? (
          <FlatList
            data={filteredPoints}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Aucun point relais trouvé</Text>
          </View>
        )}

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate("CreateRelayPoint" as never)}
          color="#fff"
          accessibilityLabel="Créer un nouveau point relais"
        />
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  swipeHint: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  pointCard: {
    marginBottom: 12,
    elevation: 2,
  },
  pointHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  pointName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  pointAddress: {
    color: "#666",
    fontSize: 14,
  },
  divider: {
    marginVertical: 12,
  },
  pointDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 4,
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  statusSwitch: {
    marginRight: 8,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#FF6B00",
  },
  swipeActions: {
    flexDirection: "row",
  },
  swipeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  editAction: {
    backgroundColor: "#2196F3",
  },
  statsAction: {
    backgroundColor: "#FF6B00",
  },
})

export default RelayPointManagementScreen
