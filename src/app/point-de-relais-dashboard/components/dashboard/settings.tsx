'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Save,
  Trash,
  User,
  Package,
  PackageCheck,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Settings() {
  const [notifyNewPackage, setNotifyNewPackage] = useState(true);
  const [notifyPickup, setNotifyPickup] = useState(true);
  const [notifyCapacity, setNotifyCapacity] = useState(true);
  const [notifyDelayed, setNotifyDelayed] = useState(true);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du point relais</CardTitle>
              <CardDescription>Modifiez les informations de votre point relais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                      <AvatarFallback>PR</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Changer l'image
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 md:w-2/3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom du point relais</Label>
                      <Input id="name" defaultValue="Point Relais Central" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id">Identifiant</Label>
                      <Input id="id" defaultValue="PR-12345" readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse Informelle </Label>
                    <Textarea id="address" defaultValue="123 Rue de la République, 75001 Paris" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" type="tel" defaultValue="01 23 45 67 89" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="contact@pointrelais.fr" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button onClick={() => alert('Paramètres enregistrés avec succès!')}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horaires d'ouverture</CardTitle>
              <CardDescription>
                Définissez les horaires d'ouverture de votre point relais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Jour</div>
                  <div className="font-medium">Ouverture</div>
                  <div className="font-medium">Fermeture</div>
                </div>
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(
                  (day, index) => (
                    <div key={day} className="grid grid-cols-3 gap-4 items-center">
                      <div>{day}</div>
                      <Input
                        type="time"
                        defaultValue={index < 6 ? '09:00' : 'Fermé'}
                        disabled={index === 6}
                      />
                      <Input
                        type="time"
                        defaultValue={index < 5 ? '18:00' : index === 5 ? '12:00' : 'Fermé'}
                        disabled={index === 6}
                      />
                    </div>
                  )
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button onClick={() => alert('Paramètres enregistrés avec succès!')}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capacité de stockage</CardTitle>
              <CardDescription>
                Définissez la capacité de stockage de votre point relais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-packages">Nombre maximum de colis</Label>
                    <Input id="max-packages" type="number" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-weight">Poids maximum par colis (kg)</Label>
                    <Input id="max-weight" type="number" defaultValue="30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-dimensions">Dimensions maximales (cm)</Label>
                    <Input
                      id="max-dimensions"
                      placeholder="L x l x h"
                      defaultValue="100 x 80 x 60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-threshold">Seuil d'alerte de capacité (%)</Label>
                    <Input id="alert-threshold" type="number" defaultValue="85" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button onClick={() => alert('Paramètres enregistrés avec succès!')}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Configurez les notifications que vous souhaitez recevoir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <Label htmlFor="notify-new-package" className="flex-1">
                      Nouveaux colis
                    </Label>
                  </div>
                  <Switch
                    id="notify-new-package"
                    checked={notifyNewPackage}
                    onCheckedChange={setNotifyNewPackage}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <PackageCheck className="h-4 w-4" />
                    <Label htmlFor="notify-pickup" className="flex-1">
                      Colis prêts pour enlèvement
                    </Label>
                  </div>
                  <Switch
                    id="notify-pickup"
                    checked={notifyPickup}
                    onCheckedChange={setNotifyPickup}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <Label htmlFor="notify-capacity" className="flex-1">
                      Capacité de stockage atteinte
                    </Label>
                  </div>
                  <Switch
                    id="notify-capacity"
                    checked={notifyCapacity}
                    onCheckedChange={setNotifyCapacity}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <Label htmlFor="notify-delayed" className="flex-1">
                      Colis en attente prolongée
                    </Label>
                  </div>
                  <Switch
                    id="notify-delayed"
                    checked={notifyDelayed}
                    onCheckedChange={setNotifyDelayed}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canaux de notification</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="notify-app" className="flex-1">
                      Notifications dans l'application
                    </Label>
                  </div>
                  <Switch id="notify-app" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="notify-email" className="flex-1">
                      Email
                    </Label>
                  </div>
                  <Switch id="notify-email" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label htmlFor="notify-sms" className="flex-1">
                      SMS
                    </Label>
                  </div>
                  <Switch id="notify-sms" />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <Label htmlFor="notify-call" className="flex-1">
                      Appel téléphonique (urgences uniquement)
                    </Label>
                  </div>
                  <Switch id="notify-call" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button onClick={() => alert('Paramètres enregistrés avec succès!')}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>Gérez les utilisateurs ayant accès au point relais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher un utilisateur..."
                      className="pl-8"
                    />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un utilisateur
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span>Jean Dupont</span>
                          </div>
                        </TableCell>
                        <TableCell>jean.dupont@example.com</TableCell>
                        <TableCell>
                          <Badge>Administrateur</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900"
                          >
                            Actif
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                              <AvatarFallback>ML</AvatarFallback>
                            </Avatar>
                            <span>Marie Lefebvre</span>
                          </div>
                        </TableCell>
                        <TableCell>marie.lefebvre@example.com</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Employé</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900"
                          >
                            Actif
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                              <AvatarFallback>PM</AvatarFallback>
                            </Avatar>
                            <span>Pierre Martin</span>
                          </div>
                        </TableCell>
                        <TableCell>pierre.martin@example.com</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Employé</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            Inactif
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Modifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rôles et permissions</CardTitle>
              <CardDescription>Définissez les permissions pour chaque rôle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permission</TableHead>
                        <TableHead>Administrateur</TableHead>
                        <TableHead>Employé</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Réception des colis</TableCell>
                        <TableCell>
                          <Switch defaultChecked disabled />
                        </TableCell>
                        <TableCell>
                          <Switch defaultChecked />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Livraison des colis</TableCell>
                        <TableCell>
                          <Switch defaultChecked disabled />
                        </TableCell>
                        <TableCell>
                          <Switch defaultChecked />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Gestion des utilisateurs</TableCell>
                        <TableCell>
                          <Switch defaultChecked disabled />
                        </TableCell>
                        <TableCell>
                          <Switch />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Accès aux rapports</TableCell>
                        <TableCell>
                          <Switch defaultChecked disabled />
                        </TableCell>
                        <TableCell>
                          <Switch />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Modification des paramètres</TableCell>
                        <TableCell>
                          <Switch defaultChecked disabled />
                        </TableCell>
                        <TableCell>
                          <Switch />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button onClick={() => alert('Paramètres enregistrés avec succès!')}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button onClick={() => alert('Paramètres enregistrés avec succès!')}>
                <Save className="mr-2 h-4 w-4" />
                Mettre à jour le mot de passe
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentification à deux facteurs</CardTitle>
              <CardDescription>
                Renforcez la sécurité de votre compte avec l'authentification à deux facteurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <div className="font-medium">Authentification par SMS</div>
                  <div className="text-sm text-muted-foreground">
                    Recevez un code de vérification par SMS lors de la connexion
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <div className="font-medium">Authentification par application</div>
                  <div className="text-sm text-muted-foreground">
                    Utilisez une application d'authentification comme Google Authenticator
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <div className="font-medium">Authentification par email</div>
                  <div className="text-sm text-muted-foreground">
                    Recevez un code de vérification par email lors de la connexion
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button onClick={() => alert('Paramètres enregistrés avec succès!')}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>Gérez les appareils connectés à votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Cet appareil</div>
                        <div className="text-sm text-muted-foreground">
                          Windows • Chrome • Paris, France
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900"
                    >
                      Actif
                    </Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">iPhone 13</div>
                        <div className="text-sm text-muted-foreground">
                          iOS • Safari • Paris, France
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Trash className="mr-2 h-4 w-4" />
                      Déconnecter
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">MacBook Pro</div>
                        <div className="text-sm text-muted-foreground">
                          macOS • Firefox • Paris, France
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Trash className="mr-2 h-4 w-4" />
                      Déconnecter
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Déconnecter tous les autres appareils
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
