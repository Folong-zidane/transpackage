
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider } from "../contexts/AuthContext"
import RootNavigator from "../navigation/RootNavigator"
import { PackageProvider } from "../contexts/PackageContext"
import { RelayPointProvider } from "../contexts/RelayPointContext"
import { NotificationProvider } from "../contexts/NotificationContext"
import { GestureHandlerRootView } from "react-native-gesture-handler"

// les nouvelles logiques 

import { ThemeProvider } from '../contexts/ThemeContext'
import { LanguageProvider } from '../contexts/LanguageContext'


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <PackageProvider>
            <RelayPointProvider>
              <NotificationProvider>
                <ThemeProvider>
                  <LanguageProvider>
                    <StatusBar style="auto" />
                      <RootNavigator />
                  </LanguageProvider>
                </ThemeProvider>
              </NotificationProvider>
            </RelayPointProvider>
          </PackageProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
