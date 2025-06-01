import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import HomeScreen from "../screens/HomeScreen"
import PackagesNavigator from "./PackagesNavigator"
import RelayPointsNavigator from "./RelayPointsNavigator"
import ProfileScreen from "../screens/ProfileScreen"
import NotificationsScreen from "../screens/NotificationsScreen"
import { useAuth } from "../contexts/AuthContext"
import { useNotifications } from "../contexts/NotificationContext"
import { Badge } from "react-native-paper"
import { View } from "react-native"
import AgencyDashboardNavigator from "./AgencyDashboardNavigator"

import TestScreen from "../screens/TestScreen"

const Tab = createBottomTabNavigator()

const MainTabNavigator = () => {
  const { user, isAgency } = useAuth()
  const { unreadCount } = useNotifications()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Accueil") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Colis") {
            iconName = focused ? "cube" : "cube-outline"
          } else if (route.name === "Points Relais") {
            iconName = focused ? "location" : "location-outline"
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Gestion") {
            iconName = focused ? "business" : "business-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
          }

          // Ajouter un badge pour les notifications non lues
          if (route.name === "Notifications" && unreadCount > 0) {
            return (
              <View>
                <Ionicons name={iconName as any} size={size} color={color} />
                <Badge style={{ position: "absolute", top: -5, right: -10 }} size={16}>
                  {unreadCount}
                </Badge>
              </View>
            )
          }

          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FF6B00",
        tabBarInactiveTintColor: "gray",
        // Augmenter la taille des onglets pour l'accessibilité
        tabBarStyle: { height: 60 },
        tabBarItemStyle: { padding: 5 },
        tabBarLabelStyle: { fontSize: 12, paddingBottom: 5 },
      })}
    >
      <Tab.Screen name="Accueil"options={{ headerShown: false }} component={HomeScreen} />
      <Tab.Screen name="Colis" options={{ headerShown: false }} component={PackagesNavigator} />
      <Tab.Screen name="Points Relais" options={{ headerShown: false }} component={RelayPointsNavigator} />
      {isAgency() && <Tab.Screen name="Gestion" options={{ headerShown: false }} component={AgencyDashboardNavigator} />}
      <Tab.Screen name="Notifications" options={{ headerShown: false }} component={NotificationsScreen} />
      <Tab.Screen name="Profil" options={{ headerShown: false }} component={ProfileScreen} />
      <Tab.Screen name="Settings" options={{ headerShown: false }} component={TestScreen} />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
