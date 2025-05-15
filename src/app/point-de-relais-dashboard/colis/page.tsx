import { DashboardHeader } from '@/app/point-de-relais-dashboard/components/dashboard/dashboard-header';
import { PackageManagement } from '@/app/point-de-relais-dashboard/components/dashboard/package-management';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gestion des Colis | Point Relais',
    description: 'Gestion des colis du point relais',
};

export default function ColisPage() {
    return (
        <div className="flex flex-col gap-4 p-4 mx-4 md:p-8 w-screen">
            <DashboardHeader />
            <PackageManagement />
        </div>
    );
}
