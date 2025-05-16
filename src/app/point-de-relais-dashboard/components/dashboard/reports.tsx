'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Download, FileText, Printer } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Reports() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className={`${i === 0 ? 'col-span-full' : ''}`}>
            <CardHeader className="pb-2">
              <div className="h-6 w-1/3 bg-muted/50 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-muted/30 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] bg-muted/20 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Données pour les graphiques
  const monthlyData = [
    { name: 'Jan', reçus: 65, livrés: 60, retournés: 5 },
    { name: 'Fév', reçus: 59, livrés: 55, retournés: 4 },
    { name: 'Mar', reçus: 80, livrés: 78, retournés: 2 },
    { name: 'Avr', reçus: 81, livrés: 75, retournés: 6 },
    { name: 'Mai', reçus: 56, livrés: 52, retournés: 4 },
    { name: 'Juin', reçus: 55, livrés: 50, retournés: 5 },
    { name: 'Juil', reçus: 40, livrés: 38, retournés: 2 },
    { name: 'Août', reçus: 45, livrés: 43, retournés: 2 },
    { name: 'Sep', reçus: 60, livrés: 58, retournés: 2 },
    { name: 'Oct', reçus: 70, livrés: 65, retournés: 5 },
    { name: 'Nov', reçus: 90, livrés: 85, retournés: 5 },
    { name: 'Déc', reçus: 100, livrés: 95, retournés: 5 },
  ];

  const statusData = [
    { name: 'En transit', value: 10 },
    { name: 'Arrivés', value: 15 },
    { name: 'Stockés', value: 45 },
    { name: 'Prêts', value: 20 },
    { name: 'Livrés', value: 10 },
  ];

  const COLORS = ['#FFBB28', '#0088FE', '#8884D8', '#00C49F', '#999999'];

  const storageTimeData = [
    { name: '1 jour', count: 30 },
    { name: '2 jours', count: 25 },
    { name: '3 jours', count: 20 },
    { name: '4 jours', count: 15 },
    { name: '5 jours', count: 10 },
    { name: '6 jours', count: 5 },
    { name: '7+ jours', count: 10 },
  ];

  // Adapter le nombre de ticks en fonction de la largeur de l'écran
  const getTickCount = () => {
    if (windowWidth < 640) return 4;
    if (windowWidth < 1024) return 6;
    return 12;
  };

  // Filtrer les données pour n'afficher qu'un sous-ensemble sur les petits écrans
  const getFilteredData = () => {
    if (monthlyData.length <= getTickCount()) return monthlyData;

    const step = Math.floor(monthlyData.length / getTickCount());
    return monthlyData.filter((_, index) => index % step === 0 || index === monthlyData.length - 1);
  };

  return (
    <div className="space-y-6">
      <Card className="col-span-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Rapports et Statistiques</CardTitle>
              <CardDescription>Analysez les performances de votre point relais</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select defaultValue="month">
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9">
                <Printer className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Imprimer</span>
              </Button>
              <Button size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Activité mensuelle</CardTitle>
            <CardDescription>Nombre de colis traités par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {/*
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getFilteredData()}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} />
                  <XAxis
                    dataKey="name"
                    stroke={isDark ? '#888' : '#666'}
                    tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                    tickCount={getTickCount()}
                  />
                  <YAxis
                    stroke={isDark ? '#888' : '#666'}
                    tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                    width={windowWidth < 640 ? 30 : 40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#fff',
                      borderColor: isDark ? '#374151' : '#e5e7eb',
                      color: isDark ? '#f9fafb' : '#111827',
                    }}
                  />
                  <Legend
                    iconSize={windowWidth < 640 ? 8 : 10}
                    wrapperStyle={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                  />
                  <Bar dataKey="reçus" fill="#22c55e" />
                  <Bar dataKey="livrés" fill="#3b82f6" />
                  <Bar dataKey="retournés" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
              */}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Répartition par statut</CardTitle>
            <CardDescription>Distribution des colis par statut</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {/* 
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={windowWidth < 640 ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#fff',
                      borderColor: isDark ? '#374151' : '#e5e7eb',
                      color: isDark ? '#f9fafb' : '#111827',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              */}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Durée de stockage</CardTitle>
            <CardDescription>Temps moyen de stockage des colis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {/*
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={storageTimeData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#eee'} />
                  <XAxis
                    dataKey="name"
                    stroke={isDark ? '#888' : '#666'}
                    tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                  />
                  <YAxis
                    stroke={isDark ? '#888' : '#666'}
                    tick={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                    width={windowWidth < 640 ? 30 : 40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#fff',
                      borderColor: isDark ? '#374151' : '#e5e7eb',
                      color: isDark ? '#f9fafb' : '#111827',
                    }}
                  />
                  <Legend
                    iconSize={windowWidth < 640 ? 8 : 10}
                    wrapperStyle={{ fontSize: windowWidth < 640 ? 10 : 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
              */}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rapports disponibles</CardTitle>
            <CardDescription>Téléchargez les rapports détaillés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Rapport mensuel</p>
                    <p className="text-xs text-muted-foreground">Mai 2023</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Rapport trimestriel</p>
                    <p className="text-xs text-muted-foreground">T2 2023</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Rapport de performance</p>
                    <p className="text-xs text-muted-foreground">Mai 2023</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Voir tous les rapports
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
