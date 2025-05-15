import { DashboardHeader } from '@/app/point-de-relais-dashboard/components/dashboard/dashboard-header';
import { PackageReception } from '@/app/point-de-relais-dashboard/components/dashboard/package-reception';

export default function ReceptionPage() {
    return (
        <div className="flex flex-col gap-4 p-4 mx-4 md:p-8 w-screen">
            <DashboardHeader />
            <PackageReception />
        </div>
    );
}
