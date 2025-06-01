import { useState } from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { Text, Card, Chip, FAB, Searchbar, SegmentedButtons } from "react-native-paper"
import { usePackages } from "../../contexts/PackageContext"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

type PackageStatus = "all" | "pending" | "in_transit" | "delivered"

const PackagesListScreen = () => {
  const { packages, getPackagesByUser } = usePackages()
  const { user } = useAuth()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<PackageStatus>("all")

  const userPackages = user ? getPackagesByUser(user.id) : []

  const filteredPackages = userPackages.filter((pkg) => {
    const matchesSearch =
      pkg.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || pkg.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF9800"
      case "in_transit":
        return "#2196F3"
      case "delivered":
        return "#4CAF50"
      default:
        return "#999"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "in_transit":
        return "En transit"
      case "delivered":
        return "Livré"
      default:
        return status
    }
  }

  const renderItem = ({ item }) => (
    <Card
      style={styles.packageCard}
      onPress={() => navigation.navigate("DetailColis", { packageId: item.id } as never)}
    >
      <Card.Title
        title={`Colis #${item.trackingNumber}`}
        subtitle={item.description}
        right={(props) => (
          <Chip
            mode="outlined"
            style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {getStatusLabel(item.status)}
          </Chip>
        )}
      />
      <Card.Content>
        <View style={styles.packageDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="cube-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.weight} kg</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="resize-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.volume} m³</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher un colis..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <SegmentedButtons
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as PackageStatus)}
        buttons={[
          { value: "all", label: "Tous" },
          { value: "pending", label: "Envoie" },
          { value: "in_transit", label: "Reception" },
          { value: "delivered", label: "Retrait" },
        ]}
        style={styles.segmentedButtons}
      />

      {filteredPackages.length > 0 ? (
        <FlatList
          data={filteredPackages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Aucun colis trouvé</Text>
        </View>
      )}

      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate("EnvoyerColis" as never)} color="#fff" />
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
  segmentedButtons: {
    marginHorizontal: 8,
    marginBottom: 12,
  },
  listContent: {
    padding: 12,
  },
  packageCard: {
    marginBottom: 12,
    elevation: 2,
  },
  packageDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#FF6B00",
  },
})

export default PackagesListScreen
