'use client';

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import { AuthProvider } from '@/context/AuthContext';// NOUVEAU
import { RelayPointsProvider } from '@/context/RelayPointsContex';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Réduit à 2s pour un chargement plus rapide en dev

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="fr" suppressHydrationWarning className={inter.className}>
      <head>
        <title>Pick & Drop - Solution de Livraison</title>
        <meta name="description" content="Votre solution de livraison rapide et sécurisée au Cameroun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        {/* NOUVEAU: Envelopper l'application avec AuthProvider */}
        <AuthProvider>
          <RelayPointsProvider>
            {isLoading && <Loading />}
          
          <main 
            className={`min-h-screen transition-opacity duration-500 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {children}
          </main>
        </RelayPointsProvider>
        </AuthProvider>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </body>
    </html>
  );
}