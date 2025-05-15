'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { Eye, Filter, MoreHorizontal, Package, Search } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { DialogHeader } from 'next/dist/client/components/react-dev-overlay/ui/components/dialog';

interface PackageData {
    id: string;
    trackingNumber: string;
    recipient: string;
    sender: string;
    status: 'en-transit' | 'arrive' | 'pret' | 'livre' | 'retourne' | 'stocke';
    arrivalDate?: string;
    storageDate?: string;
    deliveryDate?: string;
    weight: string;
    dimensions: string;
}

const statusConfig = {
    'en-transit': {
        label: 'En transit',
        color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    arrive: { label: 'Arrivé', color: 'bg-blue-500 hover:bg-blue-600' },
    stocke: { label: 'Stocké', color: 'bg-purple-500 hover:bg-purple-600' },
    pret: { label: 'Prêt', color: 'bg-green-500 hover:bg-green-600' },
    livre: { label: 'Livré', color: 'bg-gray-500 hover:bg-gray-600' },
    retourne: { label: 'Retourné', color: 'bg-red-500 hover:bg-red-600' },
};

//Données de démonstration

const packagesData: PackageData[] = [
    {
        id: '1',
        trackingNumber: 'TR-7845962',
        recipient: 'Marie Dubois',
        sender: 'Amazon',
        status: 'arrive',
        arrivalDate: '23/05/2023',
        weight: '1.2 kg',
        dimensions: '30x20x15 cm',
    },
    {
        id: '2',
        trackingNumber: 'TR-7845963',
        recipient: 'Pierre Martin',
        sender: 'Cdiscount',
        status: 'stocke',
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
        status: 'pret',
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
        status: 'livre',
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
        status: 'retourne',
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
        status: 'arrive',
        arrivalDate: '23/05/2023',
        weight: '1.8 kg',
        dimensions: '35x25x20 cm',
    },
    {
        id: '8',
        trackingNumber: 'TR-7845969',
        recipient: 'Antoine Moreau',
        sender: 'Decathlon',
        status: 'stocke',
        arrivalDate: '22/05/2023',
        storageDate: '22/05/2023',
        weight: '2.3 kg',
        dimensions: '45x30x25 cm',
    },
];

export function PackageManagement() {
    const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState('');

    const filterePackage = (status?: string) => {
        return packagesData.filter(
            (pkg) =>
                (status ? pkg.status === status : true) &&
                (searchTerm
                    ? pkg.trackingNumber
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                      pkg.recipient
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                      pkg.sender
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    : true)
        );
    };
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Gestion des Colis</CardTitle>
                        <CardDescription>
                            Gerez tous les colis de votre point relais
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute letf-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Reechercher..."
                                className="w-full pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                    <span className="sr-only">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    Filtrer par
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() =>
                                        alert('Tri par date (plus recent)')
                                    }
                                >
                                    Date (plus recent)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        alert('Tri par date (plus ancien)')
                                    }
                                >
                                    Date (plus ancien)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        alert('Tri par poids (plus recent)')
                                    }
                                >
                                    Poids (croissant)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        alert('Tri par poids (plus recent)')
                                    }
                                >
                                    Poids (décroissant)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            onClick={() =>
                                alert("Fonctionnalité d'ajout de colis")
                            }
                        >
                            <Package className="mr-2 h-4 w-4" />
                            Ajouter un colis
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="tous">
                    <TabsList className="mb-4 overflow-x-auto flex w-full">
                        <TabsTrigger value="tous">Tous</TabsTrigger>
                        <TabsTrigger value="en-transit">En transit</TabsTrigger>
                        <TabsTrigger value="arrive">Arrivés</TabsTrigger>
                        <TabsTrigger value="stocke">Stockés</TabsTrigger>
                        <TabsTrigger value="pret">Prêts</TabsTrigger>
                        <TabsTrigger value="livre">Livré</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tous">
                        <PackageTable
                            packages={filterePackage()}
                            setSelectedPackage={setSelectedPackage}
                        />
                    </TabsContent>
                    <TabsContent value="en-transit">
                        <PackageTable
                            packages={filterePackage('en-transit')}
                            setSelectedPackage={setSelectedPackage}
                        />
                    </TabsContent>
                    <TabsContent value="arrive">
                        <PackageTable
                            packages={filterePackage('arrive')}
                            setSelectedPackage={setSelectedPackage}
                        />
                    </TabsContent>
                    <TabsContent value="stocke">
                        <PackageTable
                            packages={filterePackage('stocke')}
                            setSelectedPackage={setSelectedPackage}
                        />
                    </TabsContent>
                    <TabsContent value="pret">
                        <PackageTable
                            packages={filterePackage('pret')}
                            setSelectedPackage={setSelectedPackage}
                        />
                    </TabsContent>
                    <TabsContent value="livre">
                        <PackageTable
                            packages={filterePackage('livre')}
                            setSelectedPackage={setSelectedPackage}
                        />
                    </TabsContent>
                </Tabs>

                {selectedPackage && (
                    <Dialog
                        open={!!selectedPackage}
                        onOpenChange={() => setSelectedPackage(null)}
                    >
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Details du colis</DialogTitle>
                                <DialogDescription>
                                    Informations détaillés sur le colis{' '}
                                    {selectedPackage.trackingNumber}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Informations générales
                                    </h3>
                                    <div className="space-y-2 rounded-lg border p-4">
                                        <div className="flex justify-between">
                                            <span className="text-sm">
                                                N de suivi:
                                            </span>
                                            <span className="text-sm">
                                                {selectedPackage.trackingNumber}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                                Statut:
                                            </span>
                                            <Badge
                                                className={cn(
                                                    'text-white',
                                                    statusConfig[
                                                        selectedPackage.status
                                                    ].color
                                                )}
                                            >
                                                {
                                                    statusConfig[
                                                        selectedPackage.status
                                                    ].label
                                                }
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                                Poids:
                                            </span>
                                            <span className="text-sm ">
                                                {selectedPackage.weight}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                                Dimensions
                                            </span>
                                            <span className="text-sm">
                                                {selectedPackage.dimensions}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Dates
                                    </h3>
                                    <div className="space-y-2 rounded-lg border p-4">
                                        {selectedPackage.arrivalDate && (
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">
                                                    Arrivée:
                                                </span>
                                                <span className="text-sm">
                                                    {
                                                        selectedPackage.arrivalDate
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {selectedPackage.storageDate && (
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">
                                                    Stockage:
                                                </span>
                                                <span className="text-sm">
                                                    {
                                                        selectedPackage.storageDate
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {selectedPackage.arrivalDate && (
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">
                                                    Livraison:
                                                </span>
                                                <span className="text-sm">
                                                    {
                                                        selectedPackage.deliveryDate
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {!selectedPackage.deliveryDate &&
                                            !selectedPackage.storageDate &&
                                            !selectedPackage.arrivalDate && (
                                                <div className="text-2xl text-muted-foreground">
                                                    Aucune date disponible
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="mb-2 font-semibold">
                                        Personnes
                                    </h3>
                                    <div className="space-y-2 rounded-lg border p-4">
                                        <div>
                                            <h4 className="text-sm font-medium">
                                                Destinataire
                                            </h4>
                                            <div className="mt-1 text-sm">
                                                {selectedPackage.recipient}
                                            </div>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                ID: 12345678
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium">
                                                Expéditeur
                                            </h4>
                                            <div className="mt-1 text-sm">
                                                {selectedPackage.sender}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="mb-2 font-semibold">
                                        Historique
                                    </h3>
                                    <div className="rounded-lg border p-4">
                                        <div className="space-y-2">
                                            {selectedPackage.deliveryDate && (
                                                <div className="flex items-start gap-2">
                                                    <div className="mt-0.5 h-2 2-2 rounded-full bg-green-500 " />
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            Colis stocké
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                selectedPackage.storageDate
                                                            }
                                                            à 10:15
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedPackage.arrivalDate && (
                                                <div className="flex items-start gap-2">
                                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500" />
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            Colis arrivé au
                                                            point relais
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                selectedPackage.arrivalDate
                                                            }
                                                            à 09:30
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500" />
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        Colis en transit
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        18/05/2023 à 15:20
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-500" />
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        Colis expédié
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        17/05/2023 à 11:05
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedPackage(null)}
                                >
                                    Fermer
                                </Button>
                                <Button>Modifier le statut</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </CardContent>
        </Card>
    );
}

interface PackagesTableProps {
    packages: PackageData[];
    setSelectedPackage: (pkg: PackageData) => void;
}

export function PackageTable({
    packages,
    setSelectedPackage,
}: PackagesTableProps) {
    return (
        <div className="rounded-md border">
            <ScrollArea className="h-[500px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>N de suivi</TableHead>
                            <TableHead>Destinataire</TableHead>
                            <TableHead>Expéditeur</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Poids</TableHead>
                            <TableHead>Dimensions</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {packages.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 texte-center"
                                >
                                    Aucun colis trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            packages.map((pkg) => (
                                <TableRow key={pkg.id}>
                                    <TableCell className="font-medium">
                                        {pkg.trackingNumber}
                                    </TableCell>
                                    <TableCell>{pkg.recipient}</TableCell>
                                    <TableCell>{pkg.sender}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                'text-white',
                                                statusConfig[pkg.status].color
                                            )}
                                        >
                                            {statusConfig[pkg.status].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{pkg.weight}</TableCell>
                                    <TableCell>{pkg.dimensions}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setSelectedPackage(pkg)
                                                }
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Détails
                                                </span>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Plus d'options
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Changer de status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Modifier le destinataire
                                                    </DropdownMenuItem>
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
            </ScrollArea>
        </div>
    );
}
