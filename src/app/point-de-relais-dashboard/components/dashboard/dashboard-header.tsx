'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
    title?: string;
}
interface Notification {
    id: string;
    title: string;
    time: string;
}

export function DashboardHeader({
    title = 'Tableau de bord',
}: DashboardHeaderProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotification] = useState<Notification[]>([
        {
            id: '1',
            title: 'Nouveau colis arrivé',
            time: 'Il y a 5 minutes',
        },
        {
            id: '2',
            title: 'Colis en attente prolongée',
            time: 'Il y a 2 heures',
        },
        {
            id: '3',
            title: 'Capacité de stockage à 85%',
            time: 'Il y a 1 jour',
        },
    ]);

    const router = useRouter();
    const basePath = '/point-de-relais-dashboard';

    //Gestion de la soumission du formulaire de recherche

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Recherche de : ${searchTerm}`);
        // Implémenter la logique de recherche
    };

    //Efface le terme de recherche
    const clearSearch = () => {
        setSearchTerm('');
    };

    //Gere le clic sur une notification

    const handleNotification = (id: string) => {
        // Marquer comme lu et retirer de la liste
        setNotification(notifications.filter((notif) => notif.id !== id));
    };

    const viewAllNotifications = () => {
        router.push(`${basePath}/notifications`);
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <div className="flex items-center gap-4">
                {/*Formulaire de recherche*/}
                <form
                    onSubmit={handleSearch}
                    className="relative hidden md:block"
                >
                    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher..."
                        className="w-[200px] pl-8 md:w-[300px] lg:w-[400px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span>Effacer la recherche</span>
                        </button>
                    )}
                </form>
                {/*Menu de notification*/}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="outline"
                            size="icon"
                            className="relative"
                        >
                            <Bell className="h-5 w-5" />
                            {notifications.length > 0 && (
                                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                    {notifications.length}
                                </Badge>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[300px]">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length === 0 ? (
                            <div className="py-2 px-2 text-center text-sm text-muted-foreground">
                                Aucune notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        handleNotification(notification.id)
                                    }
                                >
                                    <div className="flex flex-col gap-1">
                                        <p className="font-medium">
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {notification.time}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer justify-center font-medium"
                            onClick={viewAllNotifications}
                        >
                            Voir toutes les notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
