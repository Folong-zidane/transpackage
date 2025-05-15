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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Check, QrCode, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

export function PackageReception() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setTrackingNumber('TR-' + Math.floor(Math.random() * 10000000));
            setIsScanning(false);
        }, 2000);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Reception de colis</CardTitle>
                    <CardDescription>
                        Scannez ou saississez le numéro de suivi pour
                        receptionner un colis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="scan">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="scan">Scanner</TabsTrigger>
                            <TabsTrigger value="manual">
                                Saisie manuelle
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="scan">
                            <div className="flex flex-col items-center justify-center gap-4 p-6">
                                {isScanning ? (
                                    <div className="flex flex-col items-center gap-4 ">
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
                                            {isScanning ? (
                                                <>
                                                    <span className="animate-spin mr-2">
                                                        ⏳
                                                    </span>
                                                    Scan en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="mr-2 h-4 w-4" />
                                                    Scanner un code
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                                {trackingNumber && (
                                    <div className="mt-4 w-full">
                                        <Label htmlFor="tracking-result">
                                            Numero de suivi détecté
                                        </Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input
                                                className="flex-1"
                                                id="tracking-result"
                                                value={trackingNumber}
                                                readOnly
                                            />
                                            <Button
                                                size="icon"
                                                variant="outline"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="manual" className="space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="tracking-number">
                                        Numero de suivi
                                    </Label>
                                    <Input
                                        id="tracking-number"
                                        placeholder="Ex: TR-7845962"
                                        value={trackingNumber}
                                        onChange={(e) =>
                                            setTrackingNumber(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="transporteur">
                                        Transporteur
                                    </Label>
                                    <Select>
                                        <SelectTrigger id="carrier">
                                            <SelectValue placeholder="Sélectionner un transporteur" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="chronopost">
                                                Chronopost
                                            </SelectItem>
                                            <SelectItem value="dhl">
                                                DHL
                                            </SelectItem>
                                            <SelectItem value="ups">
                                                UPS
                                            </SelectItem>
                                            <SelectItem value="fedex">
                                                FedEx
                                            </SelectItem>
                                            <SelectItem value="colissimo">
                                                Colissimo
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="package-type">
                                        Type de colis
                                    </Label>
                                    <Select>
                                        <SelectTrigger id="package-type">
                                            <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">
                                                Standard
                                            </SelectItem>
                                            <SelectItem value="fragile">
                                                Fragile
                                            </SelectItem>
                                            <SelectItem value="oversized">
                                                Surdimensionné
                                            </SelectItem>
                                            <SelectItem value="heavy">
                                                Lourd
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="weight">
                                            Poids (kg)
                                        </Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            placeholder="Ex: 1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dimensions">
                                            Dimensions (cm)
                                        </Label>
                                        <Input
                                            id="dimensions"
                                            type="number"
                                            placeholder="Ex: 30x20x15"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Input
                                        id="notes"
                                        type="number"
                                        placeholder="Informations supplémentairs"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setTrackingNumber('');
                            setIsScanning(false);
                        }}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={() => {
                            if (trackingNumber) {
                                alert(
                                    `Colis ${trackingNumber} receptionné avec succes!`
                                );
                                setTrackingNumber('');
                            } else {
                                alert(
                                    'Veuillez scanner ou saisir un numero de suivi'
                                );
                            }
                        }}
                    >
                        <Truck className="mr-2 h-4 w-4" />
                        Receptionner le colis
                    </Button>
                </CardFooter>
            </Card>

            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Colis attendus aujourd'hui</CardTitle>
                    <CardDescription>
                        Liste des colis prévu pour aujourd'hui
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>N de suivi</TableHead>
                                    <TableHead>Transporteur</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        TR-7845970
                                    </TableCell>
                                    <TableCell>Chronopost</TableCell>
                                    <TableCell>
                                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                            En transit
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Réceptionner
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        TR-7845971
                                    </TableCell>
                                    <TableCell>DHL</TableCell>
                                    <TableCell>
                                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                            En transit
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Réceptionner
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        TR-7845972
                                    </TableCell>
                                    <TableCell>UPS</TableCell>
                                    <TableCell>
                                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                            En transit
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Réceptionner
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        TR-7845973
                                    </TableCell>
                                    <TableCell>Colissimo</TableCell>
                                    <TableCell>
                                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                            En transit
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Réceptionner
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
