'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Package {
  id: string;
  trackingNumber: string;
  recipient: string;
  status: 'en-transit' | 'arrivé' | 'stocké' | 'prêt' | 'livré' | 'retourné';
  timestamp: string;
}

const statusConfig = {
  'en-transit': { label: 'En transit', color: 'bg-amber-500 hover:bg-amber-600' },
  arrivé: { label: 'Arrivé', color: 'bg-blue-500 hover:bg-blue-600' },
  stocké: { label: 'Stocké', color: 'bg-purple-500 hover:bg-purple-600' },
  prêt: { label: 'Prêt', color: 'bg-green-500 hover:bg-green-600' },
  livré: { label: 'Livré', color: 'bg-gray-500 hover:bg-gray-600' },
  retourné: { label: 'Retourné', color: 'bg-red-500 hover:bg-red-600' },
};
// Données de test
const recentPackages: Package[] = [
  {
    id: '1',
    trackingNumber: 'TR-7845962',
    recipient: 'Marie Dubois',
    status: 'arrivé',
    timestamp: 'Il y a 10 minutes',
  },
  {
    id: '2',
    trackingNumber: 'TR-7845963',
    recipient: 'Pierre Martin',
    status: 'stocké',
    timestamp: 'Il y a 1 heure',
  },
  {
    id: '3',
    trackingNumber: 'TR-7845964',
    recipient: 'Sophie Leroy',
    status: 'prêt',
    timestamp: 'Il y a 2 heures',
  },
  {
    id: '4',
    trackingNumber: 'TR-7845965',
    recipient: 'Thomas Bernard',
    status: 'livré',
    timestamp: 'Il y a 3 heures',
  },
  {
    id: '5',
    trackingNumber: 'TR-7845966',
    recipient: 'Julie Petit',
    status: 'retourné',
    timestamp: 'Il y a 5 heures',
  },
];

export function RecentPackages() {
  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-3">
        {recentPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="flex flex-col space-y-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{pkg.recipient}</div>
              <Badge className={cn('text-white', statusConfig[pkg.status].color)}>
                {statusConfig[pkg.status].label}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">N° {pkg.trackingNumber}</div>
            <div className="text-xs text-muted-foreground">{pkg.timestamp}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
