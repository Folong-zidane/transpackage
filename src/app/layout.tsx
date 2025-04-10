import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recherche de Points Relais',
  description: 'Application de recherche de points relais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}