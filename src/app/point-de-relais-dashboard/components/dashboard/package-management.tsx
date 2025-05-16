'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Eye, Filter, MoreHorizontal, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PackageData {
  id: string;
  trackingNumber: string;
  recipient: string;
  sender: string;
  status: 'en-transit' | 'arrivé' | 'stocké' | 'prêt' | 'livré' | 'retourné';
  arrivalDate?: string;
  storageDate?: string;
  deliveryDate?: string;
  weight: string;
  dimensions: string;
}

const statusConfig = {
  'en-transit': { label: 'En transit', color: 'bg-amber-500 hover:bg-amber-600' },
  arrivé: { label: 'Arrivé', color: 'bg-blue-500 hover:bg-blue-600' },
  stocké: { label: 'Stocké', color: 'bg-purple-500 hover:bg-purple-600' },
  prêt: { label: 'Prêt', color: 'bg-green-500 hover:bg-green-600' },
  livré: { label: 'Livré', color: 'bg-gray-500 hover:bg-gray-600' },
  retourné: { label: 'Retourné', color: 'bg-red-500 hover:bg-red-600' },
};

// Données de démonstration
const packagesData: PackageData[] = [
  {
    id: '1',
    trackingNumber: 'TR-7845962',
    recipient: 'Marie Dubois',
    sender: 'Amazon',
    status: 'arrivé',
    arrivalDate: '23/05/2023',
    weight: '1.2 kg',
    dimensions: '30x20x15 cm',
  },
  {
    id: '2',
    trackingNumber: 'TR-7845963',
    recipient: 'Pierre Martin',
    sender: 'Cdiscount',
    status: 'stocké',
    arrivalDate: '22/05/2023',
    storageDate: '22/05/2023',
    weight: '2.5 kg',
    dimensions: '40x30x20 cm',
  },
  {
    id: '3',
    trackingNumber: 'TR-7845964',
    recipient: 'Sophie Leroy',
    sender: 'Fnac',
    status: 'prêt',
    arrivalDate: '21/05/2023',
    storageDate: '21/05/2023',
    weight: '0.8 kg',
    dimensions: '25x15x10 cm',
  },
  {
    id: '4',
    trackingNumber: 'TR-7845965',
    recipient: 'Thomas Bernard',
    sender: 'Darty',
    status: 'livré',
    arrivalDate: '20/05/2023',
    storageDate: '20/05/2023',
    deliveryDate: '23/05/2023',
    weight: '3.1 kg',
    dimensions: '50x40x30 cm',
  },
  {
    id: '5',
    trackingNumber: 'TR-7845966',
    recipient: 'Julie Petit',
    sender: 'Zalando',
    status: 'retourné',
    arrivalDate: '19/05/2023',
    storageDate: '19/05/2023',
    weight: '1.5 kg',
    dimensions: '35x25x15 cm',
  },
  {
    id: '6',
    trackingNumber: 'TR-7845967',
    recipient: 'Nicolas Durand',
    sender: 'Boulanger',
    status: 'en-transit',
    weight: '4.2 kg',
    dimensions: '60x45x30 cm',
  },
  {
    id: '7',
    trackingNumber: 'TR-7845968',
    recipient: 'Camille Roux',
    sender: 'La Redoute',
    status: 'arrivé',
    arrivalDate: '23/05/2023',
    weight: '1.8 kg',
    dimensions: '35x25x20 cm',
  },
  {
    id: '8',
    trackingNumber: 'TR-7845969',
    recipient: 'Antoine Moreau',
    sender: 'Decathlon',
    status: 'stocké',
    arrivalDate: '22/05/2023',
    storageDate: '22/05/2023',
    weight: '2.3 kg',
    dimensions: '45x30x25 cm',
  },
];

export function PackageManagement() {
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPackages = (status?: string) => {
    return packagesData.filter(
      (pkg) =>
        (status ? pkg.status === status : true) &&
        (searchTerm
          ? pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.sender.toLowerCase().includes(searchTerm.toLowerCase())
          : true)
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Gestion des Colis</CardTitle>
            <CardDescription>Gérez tous les colis de votre point relais</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="w-full pl-8 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filtrer</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Date (plus récent)</DropdownMenuItem>
                <DropdownMenuItem>Date (plus ancien)</DropdownMenuItem>
                <DropdownMenuItem>Poids (croissant)</DropdownMenuItem>
                <DropdownMenuItem>Poids (décroissant)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tous">
          <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap justify-start h-9">
            <TabsTrigger value="tous" className="text-xs sm:text-sm">
              Tous
            </TabsTrigger>
            <TabsTrigger value="en-transit" className="text-xs sm:text-sm">
              En transit
            </TabsTrigger>
            <TabsTrigger value="arrivé" className="text-xs sm:text-sm">
              Arrivés
            </TabsTrigger>
            <TabsTrigger value="stocké" className="text-xs sm:text-sm">
              Stockés
            </TabsTrigger>
            <TabsTrigger value="prêt" className="text-xs sm:text-sm">
              Prêts
            </TabsTrigger>
            <TabsTrigger value="livré" className="text-xs sm:text-sm">
              Livrés
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tous">
            <PackageTable packages={filteredPackages()} setSelectedPackage={setSelectedPackage} />
          </TabsContent>
          <TabsContent value="en-transit">
            <PackageTable
              packages={filteredPackages('en-transit')}
              setSelectedPackage={setSelectedPackage}
            />
          </TabsContent>
          <TabsContent value="arrivé">
            <PackageTable
              packages={filteredPackages('arrivé')}
              setSelectedPackage={setSelectedPackage}
            />
          </TabsContent>
          <TabsContent value="stocké">
            <PackageTable
              packages={filteredPackages('stocké')}
              setSelectedPackage={setSelectedPackage}
            />
          </TabsContent>
          <TabsContent value="prêt">
            <PackageTable
              packages={filteredPackages('prêt')}
              setSelectedPackage={setSelectedPackage}
            />
          </TabsContent>
          <TabsContent value="livré">
            <PackageTable
              packages={filteredPackages('livré')}
              setSelectedPackage={setSelectedPackage}
            />
          </TabsContent>
        </Tabs>

        {selectedPackage && (
          <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
            <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Détails du colis</DialogTitle>
                <DialogDescription>
                  Informations détaillées sur le colis {selectedPackage.trackingNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Informations générales</h3>
                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">N° de suivi:</span>
                      <span className="text-sm">{selectedPackage.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Statut:</span>
                      <Badge
                        className={cn('text-white', statusConfig[selectedPackage.status].color)}
                      >
                        {statusConfig[selectedPackage.status].label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Poids:</span>
                      <span className="text-sm">{selectedPackage.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Dimensions:</span>
                      <span className="text-sm">{selectedPackage.dimensions}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Dates</h3>
                  <div className="space-y-2 rounded-lg border p-3">
                    {selectedPackage.arrivalDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Arrivée:</span>
                        <span className="text-sm">{selectedPackage.arrivalDate}</span>
                      </div>
                    )}
                    {selectedPackage.storageDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Stockage:</span>
                        <span className="text-sm">{selectedPackage.storageDate}</span>
                      </div>
                    )}
                    {selectedPackage.deliveryDate && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Livraison:</span>
                        <span className="text-sm">{selectedPackage.deliveryDate}</span>
                      </div>
                    )}
                    {!selectedPackage.arrivalDate &&
                      !selectedPackage.storageDate &&
                      !selectedPackage.deliveryDate && (
                        <div className="text-sm text-muted-foreground">Aucune date disponible</div>
                      )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="mb-2 text-sm font-semibold">Personnes</h3>
                  <div className="space-y-4 rounded-lg border p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Destinataire</h4>
                        <div className="mt-1 text-sm">{selectedPackage.recipient}</div>
                        <div className="mt-1 text-xs text-muted-foreground">ID: 12345678</div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Expéditeur</h4>
                        <div className="mt-1 text-sm">{selectedPackage.sender}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="mb-2 text-sm font-semibold">Historique</h3>
                  <div className="rounded-lg border p-3">
                    <div className="space-y-2">
                      {selectedPackage.deliveryDate && (
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                          <div>
                            <div className="text-sm font-medium">Colis livré</div>
                            <div className="text-xs text-muted-foreground">
                              {selectedPackage.deliveryDate} à 14:30
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedPackage.status === 'prêt' && (
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                          <div>
                            <div className="text-sm font-medium">Colis prêt pour enlèvement</div>
                            <div className="text-xs text-muted-foreground">
                              {selectedPackage.storageDate} à 16:45
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedPackage.storageDate && (
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                          <div>
                            <div className="text-sm font-medium">Colis stocké</div>
                            <div className="text-xs text-muted-foreground">
                              {selectedPackage.storageDate} à 10:15
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedPackage.arrivalDate && (
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                          <div>
                            <div className="text-sm font-medium">Colis arrivé au point relais</div>
                            <div className="text-xs text-muted-foreground">
                              {selectedPackage.arrivalDate} à 09:30
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
                        <div>
                          <div className="text-sm font-medium">Colis en transit</div>
                          <div className="text-xs text-muted-foreground">18/05/2023 à 15:20</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-500" />
                        <div>
                          <div className="text-sm font-medium">Colis expédié</div>
                          <div className="text-xs text-muted-foreground">17/05/2023 à 11:05</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedPackage(null)}>
                  Fermer
                </Button>
                <Button>Modifier le statut</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

interface PackageTableProps {
  packages: PackageData[];
  setSelectedPackage: (pkg: PackageData) => void;
}

function PackageTable({ packages, setSelectedPackage }: PackageTableProps) {
  return (
    <div className="rounded-md border">
      <ScrollArea className="h-[500px]">
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">N° de suivi</TableHead>
                <TableHead>Destinataire</TableHead>
                <TableHead className="hidden md:table-cell">Expéditeur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Poids</TableHead>
                <TableHead className="hidden lg:table-cell">Dimensions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun colis trouvé
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.trackingNumber}</TableCell>
                    <TableCell>{pkg.recipient}</TableCell>
                    <TableCell className="hidden md:table-cell">{pkg.sender}</TableCell>
                    <TableCell>
                      <Badge className={cn('text-white', statusConfig[pkg.status].color)}>
                        {statusConfig[pkg.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{pkg.weight}</TableCell>
                    <TableCell className="hidden lg:table-cell">{pkg.dimensions}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPackage(pkg)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Voir les détails</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Plus d'options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem>Changer le statut</DropdownMenuItem>
                            <DropdownMenuItem>Notifier le destinataire</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              Signaler un problème
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
