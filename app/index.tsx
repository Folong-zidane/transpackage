
// import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider } from "../contexts/AuthContext"
import RootNavigator from "../navigation/RootNavigator"
import { PackageProvider } from "../contexts/PackageContext"
import { RelayPointProvider } from "../contexts/RelayPointContext"
import { NotificationProvider } from "../contexts/NotificationContext"
import { PaperProvider } from "react-native-paper"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { theme } from "../theme"

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <PackageProvider>
              <RelayPointProvider>
                <NotificationProvider>
                  <StatusBar style="auto" />
                    <RootNavigator />
                </NotificationProvider>
              </RelayPointProvider>
            </PackageProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
