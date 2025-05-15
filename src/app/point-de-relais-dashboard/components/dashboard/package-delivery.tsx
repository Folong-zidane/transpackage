'use client';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Camera,
    Check,
    FileText,
    PackageCheck,
    QrCode,
    Search,
    UserCheck,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

export function PackageLivraison() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [verificationStep, setVerificationStep] = useState<number | null>(
        null
    );

    const handleScan = () => {
        setIsScanning(true);
        //Simuler un scan
        setTimeout(() => {
            setTrackingNumber('TR-' + Math.floor(Math.random() * 10000000));
            setIsScanning(false);
            setVerificationStep(1);
        }, 2000);
    };
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Livraison de colis</CardTitle>
                    <CardDescription>
                        Scannez ou saisissez le numero de suivis pour livrer un
                        colis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="scan">
                        <TabsList>
                            <TabsTrigger value="scan">Scanner</TabsTrigger>
                            <TabsTrigger value="search">Rechercher</TabsTrigger>
                        </TabsList>
                        <TabsContent value="scan">
                            <div className="flex flex-col itmes-center gap-4">
                                {isScanning ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-48 w-48 rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20 flex items-center justify-center">
                                            <div className="animate-pulse text-muted-foreground">
                                                Scanning...
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Placez le code-barres ou QR code
                                            dans le cadre
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-48 w-48 rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20 flex items-center justify-center">
                                            <QrCode className="h-16 w-16 text-muted-foreground" />
                                        </div>
                                        <Button onClick={handleScan}>
                                            <Camera className="mr-2 h-4 w-4" />
                                            Scanner un code
                                        </Button>
                                    </div>
                                )}
                                {trackingNumber && (
                                    <div className="mt-4 w-full">
                                        <Label htmlFor="tracking-result">
                                            Numéro de suivi détecté
                                        </Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input
                                                id="tracking-result"
                                                value={trackingNumber}
                                                readOnly
                                                className="flex-1"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="search" className="space-y-4">
                            <div className="space-4">
                                <div>
                                    <Label htmlFor="search-tracking">
                                        Numéro de suivi ou nom du destinataire
                                    </Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="search-tracking"
                                            placeholder="Ex: TR-7845962 ou Dupont"
                                            className="flex-1"
                                        />
                                        <Button variant="outline" size="icon">
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                    {verificationStep !== null && (
                        <div className="mt-6 space-y-4 border- pt-4">
                            <h3 className="font-medium">
                                Vérifications d'identité
                            </h3>

                            {verificationStep === 1 && (
                                <div className="space-y-4">
                                    <p className="text-sm">
                                        Colis trouvé:{' '}
                                        <span className="font-medium">
                                            TR-7845964
                                        </span>{' '}
                                        pour{' '}
                                        <span className="font-medium">
                                            Sophie Leroy
                                        </span>
                                    </p>
                                    <div className="space-y-2">
                                        <Label htmlFor="id-type">
                                            Type de pièce d'identité
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setVerificationStep(2)
                                                }
                                            >
                                                Carte d'identité
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setVerificationStep(2)
                                                }
                                            >
                                                Passeport
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {verificationStep === 2 && (
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-48 w-full rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20 flex items-center justify-center">
                                            <Camera className="h-16 w-16 text-muted-foreground" />
                                        </div>
                                        <Button
                                            onClick={() =>
                                                setVerificationStep(3)
                                            }
                                        >
                                            <Camera className="mr-2 h-4 w-4" />
                                            Scanner la pièce d'identité
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {verificationStep === 3 && (
                                <div className="space-y-4">
                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                                <UserCheck className="h-8 w-8 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    Identité vérifiée
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Sophie Leroy
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setVerificationStep(1)
                                            }
                                        >
                                            Retour
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setVerificationStep(4)
                                            }
                                        >
                                            Continuer
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {verificationStep === 4 && (
                                <div className="space-y-4">
                                    <div className="rounded-lg border p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                                <FileText className="h-8 w-8 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    Signature électronique
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Veuillez signer pour
                                                    confirmer la réception
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 h-32 rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20 flex items-center justify-center">
                                            <p className="text-sm text-muted-foreground">
                                                Zone de signature
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setVerificationStep(3)
                                            }
                                        >
                                            Retour
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setVerificationStep(5)
                                            }
                                        >
                                            Confirmer la livraison
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {verificationStep === 5 && (
                                <div className="space-y-4">
                                    <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900">
                                                <PackageCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-green-800 dark:text-green-300">
                                                    Colis livré avec succès
                                                </h4>
                                                <p className="text-sm text-green-600 dark:text-green-400">
                                                    Le colis TR-7845964 a été
                                                    remis à Sophie Leroy
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            alert(
                                                'Livraison confirmée avec succès!'
                                            );
                                            setTrackingNumber('');
                                            setVerificationStep(null);
                                        }}
                                    >
                                        Terminer
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Colis prêts pour les livraison</CardTitle>
                    <CardDescription>
                        Liste des colis prêts à être livrés
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>N° de suivi</TableHead>
                                    <TableHead>Destinataire</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        TR-7845964
                                    </TableCell>
                                    <TableCell>Sophie Leroy</TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                            Prêt
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Livrer
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        TR-7845975
                                    </TableCell>
                                    <TableCell>Jean Martin</TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                            Prêt
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Livrer
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        TR-7845976
                                    </TableCell>
                                    <TableCell>Lucie Dubois</TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                            Prêt
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Livrer
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        TR-7845977
                                    </TableCell>
                                    <TableCell>Marc Petit</TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                            Prêt
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Livrer
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
