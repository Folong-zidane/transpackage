import type React from "react"
import { createContext, useState, useContext } from "react"

export interface Package {
  id: string
  trackingNumber: string
  weight: number
  volume: number
  description: string
  status: "pending" | "in_transit" | "delivered"
  senderId: string
  receiverId: string
  relayPointId: string
  createdAt: Date
}

interface PackageContextType {
  packages: Package[]
  addPackage: (packageData: Omit<Package, "id" | "trackingNumber" | "createdAt">) => Promise<Package>
  getPackagesByUser: (userId: string) => Package[]
  getPackageById: (id: string) => Package | undefined
  updatePackageStatus: (id: string, status: Package["status"]) => Promise<void>
}

const PackageContext = createContext<PackageContextType | undefined>(undefined)

export const usePackages = () => {
  const context = useContext(PackageContext)
  if (!context) {
    throw new Error("usePackages must be used within a PackageProvider")
  }
  return context
}

export const PackageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>([])

  const generateTrackingNumber = () => {
    return "PKG" + Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  const addPackage = async (packageData: Omit<Package, "id" | "trackingNumber" | "createdAt">) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newPackage: Package = {
      ...packageData,
      id: Math.random().toString(36).substring(2, 9),
      trackingNumber: generateTrackingNumber(),
      createdAt: new Date(),
    }

    setPackages((prev) => [...prev, newPackage])
    return newPackage
  }

  const getPackagesByUser = (userId: string) => {
    return packages.filter((pkg) => pkg.senderId === userId || pkg.receiverId === userId)
  }

  const getPackageById = (id: string) => {
    return packages.find((pkg) => pkg.id === id)
  }

  const updatePackageStatus = async (id: string, status: Package["status"]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setPackages((prev) => prev.map((pkg) => (pkg.id === id ? { ...pkg, status } : pkg)))
  }

  return (
    <PackageContext.Provider
      value={{
        packages,
        addPackage,
        getPackagesByUser,
        getPackageById,
        updatePackageStatus,
      }}
    >
      {children}
    </PackageContext.Provider>
  )
}
