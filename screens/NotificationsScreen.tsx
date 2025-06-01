import { useState } from "react"
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { Text, Card, Divider, Menu, IconButton, Badge, Button } from "react-native-paper"
import { useNotifications } from "../contexts/NotificationContext"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Notification } from "../public/data/notificationsData"
import { Swipeable } from "react-native-gesture-handler"

import { FAB } from "react-native-paper";


const NotificationsScreen = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, deleteNotification } = useNotifications()
  const navigation = useNavigation()
  const [menuVisible, setMenuVisible] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  let swipeableRefs = new Map()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      case "warning":
        return <Ionicons name="alert-circle" size={24} color="#FF9800" />
      case "error":
        return <Ionicons name="close-circle" size={24} color="#FF3B30" />
      default:
        return <Ionicons name="information-circle" size={24} color="#2196F3" />
    }
  }

  const getActionButton = (notification: Notification) => {
    switch (notification.actionType) {
      case "viewPackage":
        return (
          <Button 
            mode="contained" 
            icon="package-variant" 
            onPress={() => handleActionPress(notification)}
            style={styles.actionButton}
          >
            Voir le colis
          </Button>
        )
      case "viewRelayPoint":
        return (
          <Button 
            mode="contained" 
            icon="map-marker" 
            onPress={() => handleActionPress(notification)}
            style={styles.actionButton}
          >
            Voir le point relais
          </Button>
        )
      case "confirmDelivery":
        return (
          <Button 
            mode="contained" 
            icon="check" 
            onPress={() => handleActionPress(notification)}
            style={styles.actionButton}
          >
            Confirmer réception
          </Button>
        )
      case "rateService":
        return (
          <Button 
            mode="contained" 
            icon="star" 
            onPress={() => handleActionPress(notification)}
            style={styles.actionButton}
          >
            Évaluer
          </Button>
        )
      case "trackPackage":
        return (
          <Button 
            mode="contained" 
            icon="truck-delivery" 
            onPress={() => handleActionPress(notification)}
            style={styles.actionButton}
          >
            Tracker le colis 
          </Button>
        )
      case "updateInfo":
        return (
          <Button 
            mode="contained" 
            icon="pencil" 
            onPress={() => handleActionPress(notification)}
            style={styles.actionButton}
          >
            Mettre à jour
          </Button>
        )
      default:
        return null
    }
  }

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    // Toggle expanded state
    setExpandedId(expandedId === notification.id ? null : notification.id)
  }

  const handleActionPress = (notification: Notification) => {
    // Naviguer vers le détail approprié en fonction du type de notification
    console.log(notification)
    if (notification.packageId) {
      Alert.alert("Navigation", `Navigation vers les détails du colis #${notification.packageId}`)
      
      navigation.navigate("Colis", { screen: "DetailColis", params: { packageId: notification.packageId } } as never)
    } else if (notification.relayPointId) {
      Alert.alert("Navigation", `Navigation vers les détails du point relais #${notification.relayPointId}`)

      navigation.navigate("Points Relais", { screen: "DetailPointRelais", params: { relayPointId: notification.relayPointId } } as never)
    }

    switch(notification.actionType) {
      case "confirmDelivery":
        Alert.alert("Confirmation", "Réception du colis confirmée. Merci !")
        break
      case "rateService":
        Alert.alert("Évaluation", "Merci d'évaluer notre service de livraison")
        break
      case "updateInfo":
        Alert.alert("Mise à jour", "Veuillez vérifier et mettre à jour vos informations")
        break
      case "trackPackage":
        Alert.alert("Suivi", `Suivi en direct du colis #${notification.packageId}`)
        break
    }
  }

  const renderRightActions = (notification: Notification) => {
    return (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.swipeAction, { backgroundColor: '#FF3B30' }]}
          onPress={() => {
            deleteNotification(notification.id)
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.swipeActionText}>Supprimer</Text>
        </TouchableOpacity>
        
        {!notification.read && (
          <TouchableOpacity
            style={[styles.swipeAction, { backgroundColor: '#007AFF' }]}
            onPress={() => {
              markAsRead(notification.id)
              if (swipeableRefs.has(notification.id)) {
                swipeableRefs.get(notification.id).close()
              }
            }}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
            <Text style={styles.swipeActionText}>Lu</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  const renderItem = ({ item }: { item: Notification }) => (
    <Swipeable
      ref={ref => {
        if (ref && !swipeableRefs.has(item.id)) {
          swipeableRefs.set(item.id, ref)
        }
      }}
      renderRightActions={() => renderRightActions(item)}
      onSwipeableOpen={() => {
        // Fermer tous les autres swipeables
        for (let [id, ref] of swipeableRefs.entries()) {
          if (id !== item.id) {
            ref.close()
          }
        }
      }}
    >
      <Animatable.View animation="fadeIn" duration={500}>
        <TouchableOpacity
          onPress={() => handleNotificationPress(item)}
          style={[styles.notificationItem, !item.read && styles.unreadNotification]}
          accessible={true}
          accessibilityLabel={`Notification: ${item.title}. ${item.message}`}
          accessibilityHint="Appuyez pour voir les détails et marquer comme lu"
        >
          <Card style={styles.notificationCard}>
            <Card.Content style={styles.notificationContent}>
              <View style={styles.iconContainer}>{getNotificationIcon(item.type)}</View>
              <View style={styles.textContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>
                  {format(new Date(item.createdAt), "d MMMM à HH:mm", { locale: fr })}
                </Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </Card.Content>
            
            {expandedId === item.id && (
              <Card.Actions style={styles.cardActions}>
                {getActionButton(item)}
              </Card.Actions>
            )}
          </Card>
        </TouchableOpacity>
      </Animatable.View>
    </Swipeable>
  )

  // pour ajouter une notification
  const { addNotification } = useNotifications();

  const handleAddNotification = () => {
    addNotification({
      title: "Nouveau colis enregistré",
      message: "Votre colis #XY12345 a été pris en charge",
      type: "info",
      read: false,
      packageId: "XY12345",
      actionType: "trackPackage",
    });
    console.log("Notification ajoutée");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>

        <View style={styles.headerRight}>
          {notifications.filter(n => !n.read).length > 0 && (
            <Badge style={styles.badge}>{notifications.filter(n => !n.read).length}</Badge>
          )}
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={() => setMenuVisible(true)}
                accessibilityLabel="Options de notifications"
              />
            }
          >
            <Menu.Item
              onPress={() => {
                markAllAsRead()
                setMenuVisible(false)
              }}
              title="Tout marquer comme lu"
              leadingIcon="check-all"
            />
            <Menu.Item
              onPress={() => {
                clearNotifications()
                setMenuVisible(false)
              }}
              title="Effacer toutes les notifications"
              leadingIcon="delete-sweep"
            />
          </Menu>
        </View>
      </View>

      {/* bouton ajouter notification.. je vais retirer dans la version finale 
      <FAB style={styles.fab} icon="plus" onPress={handleAddNotification} label="Ajouter" />
*/}
      <Divider />

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Animatable.View animation="fadeIn" duration={1000}>
            <Ionicons name="notifications-off-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Aucune notification</Text>
          </Animatable.View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#FF3B30",
    color: "white",
  },
  listContent: {
    padding: 8,
  },
  notificationItem: {
    marginBottom: 8,
  },
  unreadNotification: {
    backgroundColor: "rgba(33, 150, 243, 0.05)",
  },
  notificationCard: {
    elevation: 2,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#888",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2196F3",
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  cardActions: {
    justifyContent: "flex-end",
    paddingTop: 8,
    paddingBottom: 8,
  },
  actionButton: {
    borderRadius: 4,
  },
  swipeActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  swipeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    paddingHorizontal: 10,
  },
  swipeActionText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  }
});

export default NotificationsScreen;