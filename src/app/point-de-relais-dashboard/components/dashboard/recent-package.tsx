import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Package {
    id: string;
    trackingNumber: string;
    recipient: string;
    status: 'en-transit' | 'arrive' | 'stocke' | 'pret' | 'livre' | 'retourne';
    timestamp: string;
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

// Données de démonstration pour les colis récents

const recentPackages: Package[] = [
    {
        id: '1',
        trackingNumber: 'TR-7845962',
        recipient: 'Marie Dubois',
        status: 'arrive',
        timestamp: 'Il y a 10 minutes',
    },
    {
        id: '2',
        trackingNumber: 'TR-7845963',
        recipient: 'Pierre Martin',
        status: 'stocke',
        timestamp: 'Il y a 1 heure',
    },
    {
        id: '3',
        trackingNumber: 'TR-7845964',
        recipient: 'Sophie Leroy',
        status: 'pret',
        timestamp: 'Il y a 2 heures',
    },
    {
        id: '4',
        trackingNumber: 'TR-7845965',
        recipient: 'Thomas Bernard',
        status: 'livre',
        timestamp: 'Il y a 3 heures',
    },
    {
        id: '5',
        trackingNumber: 'TR-7845966',
        recipient: 'Julie Petit',
        status: 'retourne',
        timestamp: 'Il y a 5 heures',
    },
];

export function RecentPackages() {
    return (
        <ScrollArea className="h-[350px]">
            <div className="space-y-4">
                {recentPackages.map((colis) => (
                    <div
                        key={colis.id}
                        className="flex flex-col space-y-2 rounded-lg border p-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="font-medium">{colis.recipient}</div>
                            <Badge
                                className={cn(
                                    'text-white',
                                    statusConfig[colis.status].color
                                )}
                            >
                                {statusConfig[colis.status].label}
                            </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            N {colis.trackingNumber}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {colis.timestamp}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
