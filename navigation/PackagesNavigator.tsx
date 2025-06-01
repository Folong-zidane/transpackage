import { createStackNavigator } from "@react-navigation/stack"
import PackagesListScreen from "../screens/packages/PackagesListScreen"
import PackageDetailScreen from "../screens/packages/PackageDetailScreen"
import SendPackageScreen from "../screens/packages/SendPackageScreen"
import ReceivePackageScreen from "../screens/packages/ReceivePackageScreen"

const Stack = createStackNavigator()

const PackagesNavigator = () => {
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
      <Stack.Screen name="MesColis" component={PackagesListScreen} options={{ title: "Mes Colis" }} />
      <Stack.Screen name="DetailColis" component={PackageDetailScreen} options={{ title: "Détail du Colis" }} />
      <Stack.Screen name="EnvoyerColis" component={SendPackageScreen} options={{ title: "Deposer un Colis" }} />
      <Stack.Screen name="RecevoirColis" component={ReceivePackageScreen} options={{ title: "Recevoir un Colis" }} />
    </Stack.Navigator>
  )
}

export default PackagesNavigator
