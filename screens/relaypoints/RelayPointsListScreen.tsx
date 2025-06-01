
import { useState } from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { Text, Card, Chip, Searchbar, Avatar } from "react-native-paper"
import { useRelayPoints } from "../../contexts/RelayPointContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

const RelayPointsListScreen = () => {
  const { relayPoints } = useRelayPoints()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPoints = relayPoints.filter(
    (point) =>
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderItem = ({ item }) => (
    <Card
      style={styles.pointCard}
      onPress={() => navigation.navigate("DetailPointRelais", { relayPointId: item.id } as never)}
    >
      <Card.Title
        title={item.name}
        subtitle={item.address}
        left={(props) => <Avatar.Icon {...props} icon="map-marker" style={{ backgroundColor: "#2196F3" }} />}
        right={(props) => (
          <Chip
            mode="outlined"
            style={[
              styles.statusChip,
              {
                borderColor: item.isActive ? "#4CAF50" : "#FF5722",
                marginRight: 16,
              },
            ]}
            textStyle={{
              color: item.isActive ? "#4CAF50" : "#FF5722",
            }}
          >
            {item.isActive ? "Actif" : "Inactif"}
          </Chip>
        )}
      />
      <Card.Content>
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
      </Card.Content>
    </Card>
  )

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher un point relais..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

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
    </View>
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
  listContent: {
    padding: 16,
  },
  pointCard: {
    marginBottom: 12,
    elevation: 2,
  },
  pointDetails: {
    marginTop: 8,
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
  statusChip: {
    marginRight: 16,
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
})

export default RelayPointsListScreen
