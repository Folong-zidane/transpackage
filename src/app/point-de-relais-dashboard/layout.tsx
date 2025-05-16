import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { DashboardLayout } from '@/app/point-de-relais-dashboard/components/dashboard/dashboard-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Point Relais - Gestion de Stockage',
  description: 'Plateforme de gestion pour point relais de stockage',
};

// Layout du dashboard Point relais

export default function PointRelaisDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <DashboardLayout> {children}</DashboardLayout>
      </ThemeProvider>
    </div>
  );
}
