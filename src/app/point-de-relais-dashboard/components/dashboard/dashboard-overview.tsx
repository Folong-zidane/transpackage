import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Clock, Package, PackageCheck, Truck } from 'lucide-react';
import { StatCard } from '@/app/point-de-relais-dashboard/components/dashboard/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityChart } from '@/app/point-de-relais-dashboard/components/dashboard/activity-chart';
import { RecentPackages } from '@/app/point-de-relais-dashboard/components/dashboard/recent-package';

export default function DashboardOverview() {
    const basePath = '/point-de-relais-dashboard';
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>Bienvenu, Jean Dupont</CardTitle>
                        <CardDescription>
                            Voici un apercu de l'activité de votre point relais
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Alerte importante */}
                    <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4">
                            <AlertTitle>Attention</AlertTitle>
                            <AlertDescription>
                                Vous avez 3 colis en attente prolongée (plus de
                                7 jours).
                            </AlertDescription>
                        </AlertCircle>
                    </Alert>
                    {/* Grille des cartes statistiques*/}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Colis en attente */}
                        <StatCard
                            title="Colis en attente"
                            value="12"
                            description="4 arrivant aujourd'hui"
                            trend={{ value: '+2', direction: 'up' }}
                            icon={
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            }
                            detailsUrl={`${basePath}/colis?filter=en-attente`}
                        />

                        {/* Colis en stock */}
                        <StatCard
                            title="Colis en stock"
                            value="45"
                            description="Capacité: 65%"
                            trend={{ value: '+5', direction: 'up' }}
                            icon={
                                <Package className="h-4 w-4 text-muted-foreground" />
                            }
                            detailsUrl={`${basePath}/colis?filter=en-stock`}
                        />

                        {/* Colis en livrés aujourd'hui */}
                        <StatCard
                            title="Livrés aujourd'hui"
                            value="8"
                            description="sur 15 prévus"
                            trend={{ value: '-2', direction: 'down' }}
                            icon={
                                <PackageCheck className="h-4 w-4 text-muted-foreground" />
                            }
                            detailsUrl={`${basePath}/livraison`}
                        />

                        {/* Carte "Réceptionnés aujourd'hui" */}
                        <StatCard
                            title="Réceptionnés aujourd'hui"
                            value="14"
                            description="Sur 16 prévus"
                            trend={{ value: '+3', direction: 'up' }}
                            icon={
                                <Truck className="h-4 w-4 text-muted-foreground" />
                            }
                            detailsUrl={`${basePath}/reception`}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Graphique d'activité*/}
            <Card className="col-span-full md:col-span-1 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Activité des colis</CardTitle>
                    <CardDescription>
                        Nombres de colis traité par jour au cours des 30
                        derniers jours
                    </CardDescription>
                </CardHeader>
                {/* Onglets pour choisir la période*/}
                <Tabs defaultValue="30days">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="7days">7 jours</TabsTrigger>
                            <TabsTrigger value="30days">30 jours</TabsTrigger>
                            <TabsTrigger value="3months">3 mois</TabsTrigger>
                        </TabsList>
                    </div>
                    {/* Contenu des onglets graphiques*/}
                    <TabsContent value="7days">
                        <ActivityChart days={7} />
                    </TabsContent>
                    <TabsContent value="30days">
                        <ActivityChart days={30} />
                    </TabsContent>
                    <TabsContent value="3moths">
                        <ActivityChart days={90} />
                    </TabsContent>
                </Tabs>
            </Card>
            {/*Colis recents*/}
            <Card className="col-span-full md:col-span-1 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Colis récents</CardTitle>
                    <CardDescription>
                        Les 5 derniers colis traités
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RecentPackages />
                </CardContent>
            </Card>
        </div>
    );
}
