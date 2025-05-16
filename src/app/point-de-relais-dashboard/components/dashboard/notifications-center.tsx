'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Bell, Check, PackageCheck, Trash } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouveau colis arrivé',
      description: 'Le colis TR-7845970 est arrivé au point relais',
      time: 'Il y a 5 minutes',
      type: 'info',
      read: false,
    },
    {
      id: '2',
      title: 'Colis en attente prolongée',
      description: 'Le colis TR-7845963 est en attente depuis 7 jours',
      time: 'Il y a 2 heures',
      type: 'warning',
      read: false,
    },
    {
      id: '3',
      title: 'Capacité de stockage à 85%',
      description: "La capacité de stockage a atteint le seuil d'alerte",
      time: 'Il y a 1 jour',
      type: 'warning',
      read: false,
    },
    {
      id: '4',
      title: 'Colis livré',
      description: 'Le colis TR-7845965 a été livré à Thomas Bernard',
      time: 'Il y a 2 jours',
      type: 'success',
      read: true,
    },
    {
      id: '5',
      title: 'Colis endommagé',
      description: 'Le colis TR-7845966 a été signalé comme endommagé',
      time: 'Il y a 3 jours',
      type: 'error',
      read: true,
    },
    {
      id: '6',
      title: 'Nouveau colis en transit',
      description: 'Le colis TR-7845967 est en transit vers votre point relais',
      time: 'Il y a 3 jours',
      type: 'info',
      read: true,
    },
    {
      id: '7',
      title: 'Mise à jour du système',
      description: 'Une mise à jour du système est disponible',
      time: 'Il y a 4 jours',
      type: 'info',
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    // Afficher une confirmation
    setTimeout(() => {
      alert(`Notification ${id} marquée comme lue`);
    }, 100);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
    // Afficher une confirmation
    setTimeout(() => {
      alert('Toutes les notifications ont été marquées comme lues');
    }, 100);
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
    // Afficher une confirmation
    setTimeout(() => {
      alert(`Notification ${id} supprimée`);
    }, 100);
  };

  const clearAllNotifications = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
      setNotifications([]);
      // Afficher une confirmation
      setTimeout(() => {
        alert('Toutes les notifications ont été supprimées');
      }, 100);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <PackageCheck className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Centre de notifications</CardTitle>
            <CardDescription>Gérez toutes vos notifications</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Tout marquer comme lu
              </Button>
            )}
            <Button variant="outline" onClick={clearAllNotifications}>
              <Trash className="mr-2 h-4 w-4" />
              Tout effacer
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              Toutes
              {notifications.length > 0 && <Badge className="ml-2">{notifications.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Non lues
              {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Aucune notification</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Vous n'avez aucune notification pour le moment
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 rounded-lg border p-4 ${
                        !notification.read ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="mt-1 text-sm">{notification.description}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Marquer comme lu</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {unreadCount === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Check className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Tout est lu</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Vous n'avez aucune notification non lue
                    </p>
                  </div>
                ) : (
                  notifications
                    .filter((notification) => !notification.read)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-4 rounded-lg border p-4 bg-muted/50"
                      >
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{notification.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Marquer comme lu</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
