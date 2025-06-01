import { createStackNavigator } from "@react-navigation/stack"
import AgencyDashboardScreen from "../screens/agency/AgencyDashboardScreen"
import RelayPointManagementScreen from "../screens/agency/RelayPointManagementScreen"
import CreateRelayPointScreen from "../screens/agency/CreateRelayPointScreen"
import EditRelayPointScreen from "../screens/agency/EditRelayPointScreen"
import RelayPointStatsScreen from "../screens/agency/RelayPointStatsScreen"

const Stack = createStackNavigator()

const AgencyDashboardNavigator = () => {
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
      <Stack.Screen name="Dashboard" component={AgencyDashboardScreen} options={{ title: "Tableau de bord" }} />
      <Stack.Screen
        name="RelayPointManagement"
        component={RelayPointManagementScreen}
        options={{ title: "Gestion des points relais" }}
      />
      <Stack.Screen
        name="CreateRelayPoint"
        component={CreateRelayPointScreen}
        options={{ title: "Créer un point relais" }}
      />
      <Stack.Screen
        name="EditRelayPoint"
        component={EditRelayPointScreen}
        options={{ title: "Modifier un point relais" }}
      />
      <Stack.Screen
        name="RelayPointStats"
        component={RelayPointStatsScreen}
        options={{ title: "Statistiques du point relais" }}
      />
    </Stack.Navigator>
  )
}

export default AgencyDashboardNavigator
