import { DashboardHeader } from '@/app/point-de-relais-dashboard/components/dashboard/dashboard-header';
import { PackageLivraison } from '@/app/point-de-relais-dashboard/components/dashboard/package-delivery';

export default function LivraisonPage() {
    return (
        <div className="flex flex-col gap-4 p-4 mx-4 md:p-8 w-screen">
            <DashboardHeader />
            <PackageLivraison />
        </div>
    );
}
