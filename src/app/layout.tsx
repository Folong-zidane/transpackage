'use client';

import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loading from '@/components/Loading';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const pathname = usePathname();

  // Chargement initial de l'application
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsInitialLoad(false);
    }, 3000); // 3 secondes pour le premier chargement

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="fr" suppressHydrationWarning className={inter.className}>
      <head>
        <title>Pick & Drop - Recherche de Points Relais</title>
        <meta name="description" content="Votre solution de livraison rapide et sécurisée" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        {/* Écran de chargement */}
        {isLoading && <Loading />}
        
        {/* Contenu principal avec transition */}
        <main 
          className={`min-h-screen transition-all duration-500 ${
            isLoading 
              ? 'opacity-0 scale-95 pointer-events-none' 
              : 'opacity-100 scale-100'
          }`}
        >
          {children}
        </main>
        
        {/* Préchargement des ressources critiques */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </body>
    </html>
  );
}