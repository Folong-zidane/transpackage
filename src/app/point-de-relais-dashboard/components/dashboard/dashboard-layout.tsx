'use client';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
    //obtenir le chemin actuel
    const pathname = usePathname();

    // gerer le montage du composant actif
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // protection contre le rendu coté serveur
    if (!isMounted) {
        return null;
    }

    // Préfixe pour les routes du dashboard

    const basePath = '/point-de-relais-dashboard';

    return (
        <SidebarProvider>
            {/*Sidebar avec navigation */}
            <div className="flex h-screen overflow-hidden ">
                <Sidebar>
                    <SidebarHeader className="flex items-center justify-between p-4">
                        <Link
                            href={basePath}
                            className="flex items-center gap-2 font-bold text-xl"
                        >
                            <Box className="h-6 w-6" />
                            <span>Point Relais</span>
                        </Link>
                    </SidebarHeader>
                    {/* Le contenu principal*/}
                    <SidebarContent>
                        <SidebarMenu>
                            {/* Home */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === basePath}
                                >
                                    <Link href={basePath}>
                                        <Home className="h-5 w-5" />
                                        <span>Tableau de bord</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/*Gestion des colis*/}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === `${basePath}/colis`}
                                >
                                    <Link href={`${basePath}/colis`}>
                                        <Package className="h-5 w-5" />
                                        <span>Gestion des Colis</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/*Gestion des Reception de colis*/}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        pathname === `${basePath}/reception`
                                    }
                                >
                                    <Link href={`${basePath}/reception`}>
                                        <Truck className="h-5 w-5" />
                                        <span>Reception</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/*Gestion des Livraison de colis*/}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        pathname === `${basePath}/livraison`
                                    }
                                >
                                    <Link href={`${basePath}/livraison`}>
                                        <PackageCheck className="h-5 w-5" />
                                        <span>Livraison</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/*Gestion des Rapports*/}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        pathname === `${basePath}/rapports`
                                    }
                                >
                                    <Link href={`${basePath}/rapports`}>
                                        <BarChart3 className="h-5 w-5" />
                                        <span>Rapports</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/*Gestion des Notification*/}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        pathname === `${basePath}/notifications`
                                    }
                                >
                                    <Link href={`${basePath}/notifications`}>
                                        <Bell className="h-5 w-5" />
                                        <span>Notifications</span>
                                        <Badge className="ml-auto">5</Badge>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {/*Parametres*/}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        pathname === `${basePath}/notifications`
                                    }
                                >
                                    <Link href={`${basePath}/notifications`}>
                                        <Settings className="h-5 w-5" />
                                        <span>Paramètres</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    {/*Pied de page de la sidebar*/}
                    <SidebarFooter className="p-4">
                        <div className="flex items-center justify-between">
                            {/*User profil*/}
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src="/image" alt="Avatar" />
                                    <AvatarFallback>PR</AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    Jean Dupont
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Administrateur
                                </p>
                            </div>

                            {/* Action pour le changement de theme et la deconnexion*/}
                            <div className="flex items-center gap-2">
                                <div>TCH</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                'Etes-vous sur de vouloir dećonnecter ?'
                                            )
                                        ) {
                                            alert('Déconnection réussie');
                                        }
                                    }}
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </SidebarFooter>
                </Sidebar>
                {/*Contenu principal*/}
                <main className="flex-1 overflow-y-auto bg-background">
                    {/*Barre superieure */}
                    <div className="flex items-center justify-between p-4 lg:hidden">
                        <Link
                            href={basePath}
                            className="flex items-center gap-2 font-bold"
                        >
                            <Box className="h-5 w-5" />
                            <span>Point Relais</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                            <div>Mode change</div>
                        </div>
                    </div>
                </main>
            </div>
            {children}
        </SidebarProvider>
    );
}
