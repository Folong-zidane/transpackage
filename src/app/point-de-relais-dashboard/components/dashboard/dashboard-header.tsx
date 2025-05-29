'use client';

import type React from 'react';

import { useState } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title = 'Tableau de bord' }: DashboardHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Recherche de: ${searchTerm}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const viewAllNotifications = () => {
    router.push('/dashboard/notifications');
  };

  return (
    <div className="mb-6 mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1 sm:min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full pl-8 h-9"
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
                <span className="sr-only">Effacer la recherche</span>
              </button>
            )}
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
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
                  Aucune notification
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="cursor-pointer"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
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
    </div>
  );
}
