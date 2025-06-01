import { useState } from "react"
import { View, StyleSheet, ScrollView, Alert, Share } from "react-native"
import { Text, Card, Button, Chip, Divider, ProgressBar, Dialog, Portal, Modal } from "react-native-paper"
import { useRoute, useNavigation } from "@react-navigation/native"
import { usePackages } from "../../contexts/PackageContext"
import { useRelayPoints } from "../../contexts/RelayPointContext"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"

import QRCode from 'react-native-qrcode-svg';
import React from "react"

// Interface pour les informations du produit
interface ProductInfo {
    id: string;
    description: string;
    weight: string;
    volume: string;
    recipient: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const PackageDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { packageId } = route.params as { packageId: string }
  const { getPackageById, updatePackageStatus } = usePackages()
  const { getRelayPointById } = useRelayPoints()
  const [statusDialogVisible, setStatusDialogVisible] = useState(false)
  const [qrModalVisible, setQrModalVisible] = useState(false)

  const packageData = getPackageById(packageId)
  const relayPoint = packageData ? getRelayPointById(packageData.relayPointId) : null

  if (!packageData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Colis non trouvé</Text>
      </View>
    )
  }

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

  const getProgressValue = (status: string) => {
    switch (status) {
      case "pending":
        return 0.33
      case "in_transit":
        return 0.66
      case "delivered":
        return 1
      default:
        return 0
    }
  }

  const handleStatusChange = async (newStatus: "pending" | "in_transit" | "delivered") => {
    try {
      await updatePackageStatus(packageId, newStatus)
      setStatusDialogVisible(false)
      Alert.alert("Succès", "Le statut du colis a été mis à jour")
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le statut")
    }
  }

  // Générateur QR Code
  const generateNewQR = () => {
    setQrModalVisible(true)
  }

  // Fonction de partage
  const partager = async () => {
    try {
      const packageInfo = {
        id: packageData.id,
        trackingNumber: packageData.trackingNumber,
        description: packageData.description,
        weight: packageData.weight,
        volume: packageData.volume,
        status: getStatusLabel(packageData.status),
        relayPoint: relayPoint ? relayPoint.name : "Non spécifié"
      }
      
      const result = await Share.share({
        message: `Détails du colis #${packageData.trackingNumber}:\n` +
                `Description: ${packageData.description}\n` +
                `Poids: ${packageData.weight} kg\n` +
                `Volume: ${packageData.volume} m³\n` +
                `Statut: ${getStatusLabel(packageData.status)}\n` +
                `Point relais: ${relayPoint ? relayPoint.name : "Non spécifié"}`
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Partagé avec succès avec activityType
          console.log(`Partagé via: ${result.activityType}`);
        } else {
          // Partagé avec succès
          console.log('Partagé avec succès');
        }
      } else if (result.action === Share.dismissedAction) {
        // Le partage a été annulé
        console.log('Partage annulé');
      }
    } catch (error) {
      Alert.alert("Erreur", "Le partage a échoué");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="fadeIn" duration={800}>
        <Card style={styles.card}>
          <Card.Title title="Informations du colis" subtitle={`Numéro de suivi: ${packageData.trackingNumber}`} />
          <Card.Content>
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Statut:</Text>
              <Chip
                mode="outlined"
                style={[styles.statusChip, { borderColor: getStatusColor(packageData.status) }]}
                textStyle={{ color: getStatusColor(packageData.status) }}
              >
                {getStatusLabel(packageData.status)}
              </Chip>
              <Button mode="text" onPress={() => setStatusDialogVisible(true)} style={styles.changeStatusButton}>
                Changer
              </Button>
            </View>

            <View style={styles.progressContainer}>
              <ProgressBar
                progress={getProgressValue(packageData.status)}
                color={getStatusColor(packageData.status)}
                style={styles.progressBar}
              />
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>En attente</Text>
                <Text style={styles.progressLabel}>En transit</Text>
                <Text style={styles.progressLabel}>Livré</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailValue}>{packageData.description}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Poids:</Text>
              <Text style={styles.detailValue}>{packageData.weight} kg</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Volume:</Text>
              <Text style={styles.detailValue}>{packageData.volume} m³</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date de création:</Text>
              <Text style={styles.detailValue}>{new Date(packageData.createdAt).toLocaleDateString()}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Point relais" />
          <Card.Content>
            {relayPoint ? (
              <>
                <View style={styles.relayPointInfo}>
                  <Ionicons name="location" size={24} color="#2196F3" style={styles.relayPointIcon} />
                  <View>
                    <Text style={styles.relayPointName}>{relayPoint.name}</Text>
                    <Text style={styles.relayPointAddress}>{relayPoint.address}</Text>
                    <Text style={styles.relayPointHours}>{relayPoint.openingHours}</Text>
                  </View>
                </View>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("Points Relais", {  screen: "DetailPointRelais", params: { relayPointId: relayPoint.id },  } as never) }
                  style={styles.viewRelayPointButton}
                >
                  Voir le point relais
                </Button>
              </>
            ) : (
              <Text>Information du point relais non disponible</Text>
            )}
          </Card.Content>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon="qrcode"
            onPress={generateNewQR}
            style={[styles.actionButton, { backgroundColor: "#FF6B00" }]}
          >
            Code QR
          </Button>
          <Button
            mode="contained"
            icon="share-variant"
            onPress={partager}
            style={[styles.actionButton, { backgroundColor: "#2196F3" }]}
          >
            Partager
          </Button>
        </View>
      </Animatable.View>

      {/* Modal pour afficher le QR Code */}
      <Portal>
        <Modal
          visible={qrModalVisible}
          onDismiss={() => setQrModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>QR Code du Colis</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={JSON.stringify(packageData)}
              size={200}
              backgroundColor="white"
              color="black"
            />
          </View>
          <View style={styles.productInfoContainer}>
            <Text style={styles.productTitle}>Informations du produit:</Text>
            <Text style={styles.productDetail}>
              <Text style={styles.label}>ID:</Text> {packageData.id}
            </Text>
            <Text style={styles.productDetail}>
              <Text style={styles.label}>Description:</Text> {packageData.description}
            </Text>
            <Text style={styles.productDetail}>
              <Text style={styles.label}>Poids:</Text> {packageData.weight} kg
            </Text>
            <Text style={styles.productDetail}>
              <Text style={styles.label}>Volume:</Text> {packageData.volume} m³
            </Text>
            <Text style={styles.productDetail}>
              <Text style={styles.label}>Statut:</Text> {getStatusLabel(packageData.status)}
            </Text>
          </View>
          <Button 
            mode="contained" 
            onPress={() => setQrModalVisible(false)}
            style={styles.closeButton}
          >
            Fermer
          </Button>
        </Modal>
      </Portal>

      {/* Dialog pour changer le statut */}
      <Portal>
        <Dialog visible={statusDialogVisible} onDismiss={() => setStatusDialogVisible(false)}>
          <Dialog.Title>Changer le statut</Dialog.Title>
          <Dialog.Content>
            <Text>Sélectionnez le nouveau statut du colis:</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => handleStatusChange("pending")}>En attente</Button>
            <Button onPress={() => handleStatusChange("in_transit")}>En transit</Button>
            <Button onPress={() => handleStatusChange("delivered")}>Livré</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  statusChip: {
    height: 30,
  },
  changeStatusButton: {
    marginLeft: "auto",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    width: 120,
    fontWeight: "bold",
  },
  detailValue: {
    flex: 1,
  },
  relayPointInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  relayPointIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  relayPointName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  relayPointAddress: {
    color: "#666",
  },
  relayPointHours: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  viewRelayPointButton: {
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  productInfoContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#FF6B00',
  },
})

export default PackageDetailScreen