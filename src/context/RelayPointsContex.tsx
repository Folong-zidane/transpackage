'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

// Définir le type PointRelais
// Interfaces
interface PointRelais {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  hours?: string;
  type?: 'bureau' | 'commerce' | 'agence';
  distance?: number;
}

interface RelayPointsContextType {
  points: PointRelais[];
  isLoading: boolean;
  refetchPoints: () => void; // Fonction pour forcer le rechargement
}

const RelayPointsContext = createContext<RelayPointsContextType | undefined>(undefined);

export const RelayPointsProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState<PointRelais[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPoints = async () => {
    setIsLoading(true);
    try {
      const data = await api.relayPoints.getAll();
      setPoints(data);
    } catch (error) {
      console.error("Erreur chargement points relais:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <RelayPointsContext.Provider value={{ points, isLoading, refetchPoints: fetchPoints }}>
      {children}
    </RelayPointsContext.Provider>
  );
};

export const useRelayPoints = () => {
  const context = useContext(RelayPointsContext);
  if (!context) {
    throw new Error('useRelayPoints must be used within a RelayPointsProvider');
  }
  return context;
};