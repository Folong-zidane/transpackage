import type React from "react"
import { createContext, useState, useContext } from "react"
import { useAuth } from "./AuthContext"

export interface RelayPoint {
  id: string
  name: string
  address: string
  openingHours: string
  location: {
    latitude: number
    longitude: number
  }
  imageUrl: string
  stats: {
    packagesProcessed: number
    packagesInTransit: number
    packagesDelivered: number
  }
  isActive: boolean
  agencyId: string // ID de l'agence qui gère ce point relais
}

interface RelayPointContextType {
  relayPoints: RelayPoint[]
  getRelayPointById: (id: string) => RelayPoint | undefined
  toggleRelayPointStatus: (id: string) => Promise<void>
  getActiveRelayPoints: () => RelayPoint[]
  getManagedRelayPoints: () => RelayPoint[]
  createRelayPoint: (relayPoint: Omit<RelayPoint, "id" | "stats">) => Promise<RelayPoint>
  updateRelayPoint: (id: string, updates: Partial<Omit<RelayPoint, "id" | "stats">>) => Promise<void>
}

const RelayPointContext = createContext<RelayPointContextType | undefined>(undefined)

export const useRelayPoints = () => {
  const context = useContext(RelayPointContext)
  if (!context) {
    throw new Error("useRelayPoints must be used within a RelayPointProvider")
  }
  return context
}

export const RelayPointProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [relayPoints, setRelayPoints] = useState<RelayPoint[]>([
    {
      id: "1",
      name: "Point Relais Mvog-Mbi",
      address: "Rue du Marché, Mvog-Mbi, Yaoundé",
      openingHours: "Lun-Ven: 8h-17h, Sam: 9h-13h",
      location: {
        latitude: 3.8665,
        longitude: 11.5144,
      },
      imageUrl: "/placeholder.svg?height=100&width=100",
      stats: {
        packagesProcessed: 1120,
        packagesInTransit: 35,
        packagesDelivered: 1085,
      },
      isActive: true,
      agencyId: "agency1",
    },
    {
      id: "2",
      name: "Point Relais Poste Centrale",
      address: "Avenue Kennedy, Centre-Ville, Yaoundé",
      openingHours: "Lun-Dim: 7h-20h",
      location: {
        latitude: 3.8700,
        longitude: 11.5122,
      },
      imageUrl: "/placeholder.svg?height=100&width=100",
      stats: {
        packagesProcessed: 1432,
        packagesInTransit: 48,
        packagesDelivered: 1384,
      },
      isActive: true,
      agencyId: "agency2",
    },
    {
      id: "3",
      name: "Point Relais Carrefour Bastos",
      address: "Rue Bastos, Quartier Bastos, Yaoundé",
      openingHours: "Lun-Sam: 9h-18h",
      location: {
        latitude: 3.8853,
        longitude: 11.5172,
      },
      imageUrl: "/placeholder.svg?height=100&width=100",
      stats: {
        packagesProcessed: 970,
        packagesInTransit: 22,
        packagesDelivered: 948,
      },
      isActive: true,
      agencyId: "agency3",
    },
    {
      id: "4",
      name: "Point Relais Ekounou",
      address: "Avenue des Banques, Ekounou, Yaoundé",
      openingHours: "Lun-Ven: 8h-16h",
      location: {
        latitude: 3.8402,
        longitude: 11.5033,
      },
      imageUrl: "/placeholder.svg?height=100&width=100",
      stats: {
        packagesProcessed: 789,
        packagesInTransit: 19,
        packagesDelivered: 770,
      },
      isActive: false,
      agencyId: "agency1",
    },
    {
      id: "5",
      name: "Point Relais Emana",
      address: "Route Emana, Quartier Emana, Yaoundé",
      openingHours: "Lun-Sam: 9h-17h",
      location: {
        latitude: 3.9300,
        longitude: 11.5200,
      },
      imageUrl: "/placeholder.svg?height=100&width=100",
      stats: {
        packagesProcessed: 652,
        packagesInTransit: 14,
        packagesDelivered: 638,
      },
      isActive: true,
      agencyId: "agency2",
    },
  ])
  

  const getRelayPointById = (id: string) => {
    return relayPoints.find((point) => point.id === id)
  }

  const toggleRelayPointStatus = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setRelayPoints((prev) => prev.map((point) => (point.id === id ? { ...point, isActive: !point.isActive } : point)))
  }

  const getActiveRelayPoints = () => {
    return relayPoints.filter((point) => point.isActive)
  }

  const getManagedRelayPoints = () => {
    if (!user || user.type !== "agency") return []

    // Dans une vraie application, vous utiliseriez user.managedRelayPointIds
    // Pour cette démo, nous utilisons l'ID de l'utilisateur comme agencyId
    return relayPoints.filter((point) => point.agencyId === user.id)
  }

  const createRelayPoint = async (relayPointData: Omit<RelayPoint, "id" | "stats">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newRelayPoint: RelayPoint = {
      ...relayPointData,
      id: Math.random().toString(36).substring(2, 9),
      stats: {
        packagesProcessed: 0,
        packagesInTransit: 0,
        packagesDelivered: 0,
      },
    }

    setRelayPoints((prev) => [...prev, newRelayPoint])
    return newRelayPoint
  }

  const updateRelayPoint = async (id: string, updates: Partial<Omit<RelayPoint, "id" | "stats">>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setRelayPoints((prev) => prev.map((point) => (point.id === id ? { ...point, ...updates } : point)))
  }

  return (
    <RelayPointContext.Provider
      value={{
        relayPoints,
        getRelayPointById,
        toggleRelayPointStatus,
        getActiveRelayPoints,
        getManagedRelayPoints,
        createRelayPoint,
        updateRelayPoint,
      }}
    >
      {children}
    </RelayPointContext.Provider>
  )
}
