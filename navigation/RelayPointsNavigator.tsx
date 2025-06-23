import { createStackNavigator } from "@react-navigation/stack"
import RelayPointsListScreen from "../screens/relaypoints/RelayPointsListScreen"
import RelayPointMapScreen from "../screens/relaypoints/RelayPointMapScreen"
import RelayPointDetailScreen from "../screens/relaypoints/RelayPointDetailScreen"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

const RelayPointsTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#FF6B00",
        tabBarInactiveTintColor: "gray",
        tabBarIndicatorStyle: { backgroundColor: "#FF6B00" },
      }}
    >
      <Tab.Screen name="Liste" component={RelayPointsListScreen} />
      <Tab.Screen name="Carte" component={RelayPointMapScreen} />
    </Tab.Navigator>
  )
}

const RelayPointsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FF6B00",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="PointsRelais" component={RelayPointsTabs} options={{ title: "Points Relais Pick&Drop" }} />
      <Stack.Screen
        name="DetailPointRelais"
        component={RelayPointDetailScreen}
        options={{ title: "Détail du Point Relais" }}
      />

    </Stack.Navigator>
  )
}

export default RelayPointsNavigator
