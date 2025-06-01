
import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type UserType = "client" | "agency"

export interface User {
  id: string
  email: string
  name: string
  type: UserType
  activeRelayPointId?: string // Pour les clients
  managedRelayPointIds?: string[] // Pour les agences
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, userType: UserType) => Promise<void>
  register: (email: string, password: string, name: string, userType: UserType) => Promise<void>
  logout: () => Promise<void>
  updateUserPreferences: (preferences: Partial<User>) => Promise<void>
  isClient: () => boolean
  isAgency: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user")
        if (userString) {
          setUser(JSON.parse(userString))
        }
      } catch (error) {
        console.error("Failed to load user from storage", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string, userType: UserType) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would validate credentials with your backend
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name: email.split("@")[0],
        type: userType,
        // Initialiser les propriétés spécifiques au rôle
        ...(userType === "client" ? { activeRelayPointId: "" } : { managedRelayPointIds: [] }),
      }

      await AsyncStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
    } catch (error) {
      console.error("Login failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, userType: UserType) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would register the user with your backend
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        type: userType,
        // Initialiser les propriétés spécifiques au rôle
        ...(userType === "client" ? { activeRelayPointId: "" } : { managedRelayPointIds: [] }),
      }

      await AsyncStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)
    } catch (error) {
      console.error("Registration failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserPreferences = async (preferences: Partial<User>) => {
    if (!user) return

    try {
      const updatedUser = { ...user, ...preferences }
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error("Failed to update user preferences", error)
      throw error
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const isClient = () => user?.type === "client"
  const isAgency = () => user?.type === "agency"

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserPreferences, isClient, isAgency }}>
      {children}
    </AuthContext.Provider>
  )
}
