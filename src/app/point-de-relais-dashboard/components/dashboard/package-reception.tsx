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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Camera, Check, QrCode, Truck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PackageReception() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simuler un scan
    setTimeout(() => {
      setTrackingNumber('TR-' + Math.floor(Math.random() * 10000000));
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle>Réception de colis</CardTitle>
          <CardDescription>
            Scannez ou saisissez le numéro de suivi pour réceptionner un colis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scan">
            <TabsList className="grid w-full grid-cols-2 h-9">
              <TabsTrigger value="scan" className="text-xs sm:text-sm">
                Scanner
              </TabsTrigger>
              <TabsTrigger value="manual" className="text-xs sm:text-sm">
                Saisie manuelle
              </TabsTrigger>
            </TabsList>
            <TabsContent value="scan" className="space-y-4 mt-4">
              <div className="flex flex-col items-center justify-center gap-4 p-4">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-48 w-48 rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20 flex items-center justify-center">
                      <div className="animate-pulse text-muted-foreground">Scanning...</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placez le code-barres ou QR code dans le cadre
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-48 w-48 rounded-lg border-2 border-dashed border-muted-foreground bg-muted/20 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <Button onClick={handleScan} className="w-full sm:w-auto">
                      {isScanning ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
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
                    <Label htmlFor="tracking-result">Numéro de suivi détecté</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="tracking-result"
                        value={trackingNumber}
                        readOnly
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="manual" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tracking-number">Numéro de suivi</Label>
                  <Input
                    id="tracking-number"
                    placeholder="Ex: TR-7845962"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="carrier">Transporteur</Label>
                  <Select>
                    <SelectTrigger id="carrier">
                      <SelectValue placeholder="Sélectionner un transporteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chronopost">Chronopost</SelectItem>
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="colissimo">Colissimo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="package-type">Type de colis</Label>
                  <Select>
                    <SelectTrigger id="package-type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="fragile">Fragile</SelectItem>
                      <SelectItem value="oversized">Surdimensionné</SelectItem>
                      <SelectItem value="heavy">Lourd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input id="weight" type="number" placeholder="Ex: 1.5" />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">Dimensions (cm)</Label>
                    <Input id="dimensions" placeholder="Ex: 30x20x15" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Informations supplémentaires" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setTrackingNumber('');
              setIsScanning(false);
            }}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              if (trackingNumber) {
                alert(`Colis ${trackingNumber} réceptionné avec succès!`);
                setTrackingNumber('');
              } else {
                alert('Veuillez scanner ou saisir un numéro de suivi');
              }
            }}
            className="w-full sm:w-auto"
          >
            <Truck className="mr-2 h-4 w-4" />
            Réceptionner le colis
          </Button>
        </CardFooter>
      </Card>

      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle>Colis attendus aujourd'hui</CardTitle>
          <CardDescription>Liste des colis prévus pour aujourd'hui</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° de suivi</TableHead>
                    <TableHead className="hidden md:table-cell">Transporteur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">TR-7845970</TableCell>
                    <TableCell className="hidden md:table-cell">Chronopost</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
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
                    <TableCell className="font-medium">TR-7845971</TableCell>
                    <TableCell className="hidden md:table-cell">DHL</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
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
                    <TableCell className="font-medium">TR-7845972</TableCell>
                    <TableCell className="hidden md:table-cell">UPS</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
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
                    <TableCell className="font-medium">TR-7845973</TableCell>
                    <TableCell className="hidden md:table-cell">Colissimo</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
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
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
