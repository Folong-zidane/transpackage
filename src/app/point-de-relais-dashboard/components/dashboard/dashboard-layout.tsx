'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ModeToggle } from '../mode-toggle';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Bell,
  Box,
  Home,
  LogOut,
  Package,
  PackageCheck,
  Settings,
  Truck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const basePath = '/point-de-relais-dashboard';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={window.innerWidth >= 1024}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Sidebar avec navigation */}
        <Sidebar
          variant="floating"
          collapsible="icon"
          className="z-30 transition-all duration-300 ease-in-out"
        >
          {/* En-tête de la sidebar avec logo */}
          <SidebarHeader className="flex items-center justify-between p-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <Box className="h-6 w-6" />
              <span>Point Relais</span>
            </Link>
          </SidebarHeader>

          {/* Contenu principal de la sidebar avec menu de navigation */}
          <SidebarContent className="px-2">
            <SidebarMenu>
              {/* Élément de menu Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `${basePath}`}
                  tooltip="Tableau de bord"
                >
                  <Link href={`${basePath}`} className="flex items-center gap-3">
                    <Home className="h-5 w-5" />
                    <span>Tableau de bord</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Élément de menu Gestion des colis */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `${basePath}/colis`}
                  tooltip="Gestion des colis"
                >
                  <Link href={`${basePath}/colis`} className="flex items-center gap-3">
                    <Package className="h-5 w-5" />
                    <span>Gestion des colis</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Élément de menu Réception */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `${basePath}/reception`}
                  tooltip="Réception"
                >
                  <Link href={`${basePath}/reception`} className="flex items-center gap-3">
                    <Truck className="h-5 w-5" />
                    <span>Réception</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Élément de menu Livraison */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `${basePath}/livraison`}
                  tooltip="Livraison"
                >
                  <Link href={`${basePath}/livraison`} className="flex items-center gap-3">
                    <PackageCheck className="h-5 w-5" />
                    <span>Livraison</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Élément de menu Rapports */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `${basePath}/rapports`}
                  tooltip="Rapports"
                >
                  <Link href={`${basePath}/rapports`} className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5" />
                    <span>Rapports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Élément de menu Notifications avec badge */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `${basePath}/notifications`}
                  tooltip="Notifications"
                >
                  <Link href={`${basePath}/notifications`} className="flex items-center gap-3">
                    <div className="relative">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -right-2 -top-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                        5
                      </Badge>
                    </div>
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Élément de menu Paramètres */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `${basePath}/parametres`}
                  tooltip="Paramètres"
                >
                  <Link href={`${basePath}/parametres`} className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          {/* Pied de la sidebar avec profil utilisateur et actions */}
          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              {/* Profil utilisateur */}
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Jean Dupont</p>
                  <p className="text-xs text-muted-foreground">Administrateur</p>
                </div>
              </div>

              {/* Actions: toggle de thème et déconnexion */}
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                      alert('Déconnexion réussie');
                    }
                  }}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto bg-background">
          {/* Barre supérieure mobile avec menu hamburger */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold">
              <Box className="h-5 w-5" />
              <span>Point Relais</span>
            </Link>
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <ModeToggle />
            </div>
          </div>

          {/* Contenu de la page */}
          <div className="container mx-auto max-w-7xl p-4 pb-20 md:pb-10">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
