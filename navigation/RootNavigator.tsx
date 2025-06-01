import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "../contexts/AuthContext"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import MainTabNavigator from "./MainTabNavigator"

import LoadingScreen from "../screens/LoadingScreen"
import NewPointRelaisScreen from "../screens/client/NewPointRelaisScreen"
import StatutPointRelaisScreen from "../screens/client/StatutPointRelaisScreen"
import UploadDocumentsScreen from "../screens/client/UploadDocumentsScreen"
import PointRelaisApprovalScreen from "../screens/client/PointRelaisApprovalScreen"
import ChatScreen from "../screens/client/ChatScreen"


const Stack = createStackNavigator()

const RootNavigator = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />

          <Stack.Screen name="NewPointRelais" component={NewPointRelaisScreen} options={{ title: "Nouveau Point Relais" }} />
          <Stack.Screen name="StatutPointRelais" component={StatutPointRelaisScreen} options={{ title: "Statut du Point Relais" }} />
          <Stack.Screen name="UploadDocuments" component={UploadDocumentsScreen} options={{ title: "Télécharger les documents" }} />
          <Stack.Screen name="PointRelaisApproval" component={PointRelaisApprovalScreen} options={{ title: "Approbation du Point Relais" }} />

          <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Discuter" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default RootNavigator
