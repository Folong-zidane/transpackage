'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Clock, Package, PackageCheck, Truck } from 'lucide-react';
import { StatCard } from './stat-card';
import { ActivityChart } from './activity-chart';
import { RecentPackages } from './recent-package';

export default function DashboardOverview() {
  const basePath = '/point-de-relais-dashboard';
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Bienvenue, Jean Dupont</h1>
        <p className="text-muted-foreground">Voici un aperçu de l'activité de votre point relais</p>
      </div>

      {/* Alerte importante */}
      <Alert
        variant="default"
        className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>
          Vous avez 3 colis en attente prolongée (plus de 7 jours).
        </AlertDescription>
      </Alert>

      {/* Grille de cartes de statistiques */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Colis en attente"
          value="12"
          description="4 arrivant aujourd'hui"
          trend={{ value: '+2', direction: 'up' }}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          detailsUrl={`${basePath}/colis?filter=en-attente`}
        />

        <StatCard
          title="Colis en stock"
          value="45"
          description="Capacité: 65%"
          trend={{ value: '+5', direction: 'up' }}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          detailsUrl={`${basePath}/colis?filter=en-stock`}
        />

        <StatCard
          title="Livrés aujourd'hui"
          value="8"
          description="Sur 15 prévus"
          trend={{ value: '-2', direction: 'down' }}
          icon={<PackageCheck className="h-4 w-4 text-muted-foreground" />}
          detailsUrl={`${basePath}/colis?filter=livraison`}
        />

        <StatCard
          title="Réceptionnés aujourd'hui"
          value="14"
          description="Sur 16 prévus"
          trend={{ value: '+3', direction: 'up' }}
          icon={<Truck className="h-4 w-4 text-muted-foreground" />}
          detailsUrl={`${basePath}/colis?filter=reception`}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Graphique d'activité */}
        <Card className="col-span-full lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Activité des colis</CardTitle>
            <CardDescription>Nombre de colis traités par jour</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Onglets pour choisir la période */}
            <Tabs defaultValue="30days">
              <div className="flex items-center justify-between">
                <TabsList className="mb-4 h-9">
                  <TabsTrigger value="7days" className="text-xs sm:text-sm">
                    7 jours
                  </TabsTrigger>
                  <TabsTrigger value="30days" className="text-xs sm:text-sm">
                    30 jours
                  </TabsTrigger>
                  <TabsTrigger value="3months" className="text-xs sm:text-sm">
                    3 mois
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Contenu des onglets avec graphiques */}
              <TabsContent value="7days" className="space-y-4 mt-0">
                <ActivityChart days={7} />
              </TabsContent>
              <TabsContent value="30days" className="space-y-4 mt-0">
                <ActivityChart days={30} />
              </TabsContent>
              <TabsContent value="3months" className="space-y-4 mt-0">
                <ActivityChart days={90} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Liste des colis récents */}
        <Card className="col-span-full lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Colis récents</CardTitle>
            <CardDescription>Les 5 derniers colis traités</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPackages />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
