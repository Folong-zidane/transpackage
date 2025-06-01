import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Text, TextInput, Button as PaperButton, Card, Portal, Modal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { CameraView, useCameraPermissions } from "expo-camera";
import { usePackages } from "../../contexts/PackageContext";

export default function ReceivePackageScreen() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { packages, updatePackageStatus } = usePackages();
  const navigation = useNavigation();
  
  // États pour le scanner
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // État pour le modal
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = () => {
    if (!trackingNumber.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un numéro de suivi");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const foundPackage = packages.find((pkg) => pkg.trackingNumber.toLowerCase() === trackingNumber.toLowerCase());

      setSearchResult(foundPackage || null);
      setLoading(false);

      if (!foundPackage) {
        Alert.alert("Erreur", "Aucun colis trouvé avec ce numéro de suivi");
      } else {
        // Afficher le modal avec les informations du colis
        setModalVisible(true);
      }
    }, 1000);
  };

  const handleReceive = async () => {
    if (!searchResult) return;

    setLoading(true);

    try {
      await updatePackageStatus(searchResult.id, "delivered");
      setModalVisible(false);
      Alert.alert("Succès", "Le colis a été marqué comme livré", [
        {
          text: "Voir les détails",
          onPress: () => navigation.navigate("DetailColis", { packageId: searchResult.id }),
        },
        {
          text: "OK",
          onPress: () => {
            setTrackingNumber("");
            setSearchResult(null);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le statut du colis");
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return "En attente";
      case "in_transit": return "En transit";
      case "delivered": return "Livré";
      default: return status;
    }
  };
  
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#FF9800";
      case "in_transit": return "#2196F3";
      case "delivered": return "#4CAF50";
      default: return "#999";
    }
  };
  
  // Gestion du scan
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setShowScanner(false);
    
    try {
      // Essayer de parser les données JSON du QR code
      let packageData = null;
      
      // Si les données semblent être du JSON, on essaie de les parser
      if (data.startsWith('{') && data.endsWith('}')) {
        try {
          packageData = JSON.parse(data);
          
          // Rechercher le colis directement avec l'ID s'il est disponible
          if (packageData.id) {
            const foundPackage = packages.find(pkg => pkg.id === packageData.id);
            if (foundPackage) {
              setSearchResult(foundPackage);
              setTrackingNumber(foundPackage.trackingNumber);
              setModalVisible(true);
              return;
            }
          }
          
          // Rechercher par numéro de suivi comme fallback
          if (packageData.trackingNumber) {
            setTrackingNumber(packageData.trackingNumber);
          }
        } catch (e) {
          // Si le parsing échoue, on considère data comme un numéro de suivi
          console.log("Impossible de parser les données JSON:", e);
          setTrackingNumber(data);
        }
      } else {
        // Considérer les données comme un numéro de suivi
        setTrackingNumber(data);
      }
      
      // Rechercher automatiquement le colis avec le code scanné
      setTimeout(() => {
        const foundPackage = packages.find((pkg) => 
          pkg.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
        );

        setSearchResult(foundPackage || null);
        setLoading(false);

        if (!foundPackage) {
          Alert.alert("Erreur", "Aucun colis trouvé avec ce code QR scanné");
        } else {
          // Afficher le modal avec les informations du colis
          setModalVisible(true);
        }
      }, 500);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de lire les données du QR code");
    }
  };

  // Rendu du scanner si activé
  if (showScanner) {
    if (!permission) {
      return <View style={styles.container}><Text>Chargement des permissions...</Text></View>;
    }
  
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text>Nous avons besoin de la permission d'accéder à la caméra</Text>
          <PaperButton mode="contained" onPress={requestPermission}>
            Accorder la permission
          </PaperButton>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "code128"]
          }}
        />
        
        <View style={styles.scannerOverlay}>
          <PaperButton 
            mode="contained" 
            icon="close" 
            onPress={() => {
              setShowScanner(false);
              setScanned(false);
            }}
            style={styles.closeButton}
          >
            Annuler
          </PaperButton>
          
          {scanned && (
            <PaperButton 
              mode="contained" 
              icon="refresh" 
              onPress={() => setScanned(false)}
              style={styles.scanAgainButton}
            >
              Scanner à nouveau
            </PaperButton>
          )}
        </View>
      </View>
    );
  }

  // Rendu normal
  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeIn" duration={800} style={styles.content}>
        <Text style={styles.title}>Recevoir un colis</Text>

        <View style={styles.searchContainer}>
          <TextInput
            label="Numéro de suivi"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="barcode" />}
            autoCapitalize="none"
          />
          <PaperButton
            mode="contained"
            onPress={handleSearch}
            loading={loading}
            style={styles.searchButton}
            contentStyle={styles.buttonContent}
            icon="magnify"
          >
            Rechercher
          </PaperButton>
        </View>

        <PaperButton
          mode="outlined"
          onPress={() => setShowScanner(true)}
          style={styles.scanButton}
          contentStyle={styles.buttonContent}
          icon="qrcode-scan"
        >
          Scanner le code QR
        </PaperButton>

        {!searchResult && !modalVisible && (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={80} color="#ddd" />
            <Text style={styles.emptyText}>Entrez un numéro de suivi ou scannez un code QR pour recevoir un colis</Text>
          </View>
        )}

        {/* Modal pour afficher les informations du colis */}
        <Portal>
          <Modal
            visible={modalVisible && searchResult !== null}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Animatable.View animation="fadeIn" duration={500}>
              <View style={styles.modalHeader}>
                <Ionicons name="cube" size={30} color="#FF6B00" style={styles.modalIcon} />
                <Text style={styles.modalTitle}>Informations du colis</Text>
              </View>
              
              <View style={styles.modalDivider} />
              
              <View style={styles.packageInfoContainer}>
                <View style={styles.packageInfoRow}>
                  <Text style={styles.infoLabelModal}>Numéro de suivi:</Text>
                  <Text style={styles.infoValueModal}>{searchResult?.trackingNumber}</Text>
                </View>
                
                <View style={styles.packageInfoRow}>
                  <Text style={styles.infoLabelModal}>Description:</Text>
                  <Text style={styles.infoValueModal}>{searchResult?.description}</Text>
                </View>
                
                <View style={styles.packageInfoRow}>
                  <Text style={styles.infoLabelModal}>Poids:</Text>
                  <Text style={styles.infoValueModal}>{searchResult?.weight} kg</Text>
                </View>
                
                <View style={styles.packageInfoRow}>
                  <Text style={styles.infoLabelModal}>Volume:</Text>
                  <Text style={styles.infoValueModal}>{searchResult?.volume} m³</Text>
                </View>
                
                <View style={styles.packageInfoRow}>
                  <Text style={styles.infoLabelModal}>Statut:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: searchResult ? getStatusColor(searchResult.status) : '#999' }]}>
                    <Text style={styles.statusText}>
                      {searchResult ? getStatusLabel(searchResult.status) : ''}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.packageInfoRow}>
                  <Text style={styles.infoLabelModal}>Date de création:</Text>
                  <Text style={styles.infoValueModal}>
                    {searchResult?.createdAt ? new Date(searchResult.createdAt).toLocaleDateString() : ''}
                  </Text>
                </View>
              </View>
              
              <View style={styles.modalActions}>
                <PaperButton 
                  mode="contained"
                  onPress={handleReceive}
                  loading={loading}
                  style={styles.receiveModalButton}
                  disabled={searchResult?.status === "delivered"}
                >
                  Recevoir le colis
                </PaperButton>
                
                <PaperButton
                  mode="outlined"
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("DetailColis", { packageId: searchResult?.id });
                  }}
                  style={styles.detailsButton}
                >
                  Voir les détails
                </PaperButton>
                
                <PaperButton
                  mode="text"
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Fermer
                </PaperButton>
              </View>
            </Animatable.View>
          </Modal>
        </Portal>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#2196F3",
  },
  buttonContent: {
    height: 50,
  },
  scanButton: {
    marginBottom: 24,
    borderColor: "#FF6B00",
  },
  resultCard: {
    marginTop: 16,
    elevation: 2,
  },
  packageInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: 120,
    fontWeight: "bold",
  },
  infoValue: {
    flex: 1,
  },
  receiveButton: {
    backgroundColor: "#FF6B00",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
    color: "#999",
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    marginHorizontal: 8,
  },
  scanAgainButton: {
    backgroundColor: "#007AFF",
    marginHorizontal: 8,
  },
  
  // Styles pour le modal
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 15,
  },
  packageInfoContainer: {
    marginBottom: 20,
  },
  packageInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabelModal: {
    width: 120,
    fontWeight: "bold",
    fontSize: 15,
    color: "#555",
  },
  infoValueModal: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalActions: {
    marginTop: 15,
  },
  receiveModalButton: {
    backgroundColor: "#FF6B00",
    marginBottom: 10,
  },
  detailsButton: {
    borderColor: "#2196F3",
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 5,
  },
});