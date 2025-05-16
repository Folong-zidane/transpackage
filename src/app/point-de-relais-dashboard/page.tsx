import type { Metadata } from 'next';
import { DashboardHeader } from '@/app/point-de-relais-dashboard/components/dashboard/dashboard-header';
import DashboardOverview from '@/app/point-de-relais-dashboard/components/dashboard/dashboard-overview';

export const metadata: Metadata = {
  title: 'Dashboard | Point Relais',
  description: 'Tableau de bord du point relais de stockage',
};
export default function PointDeRelaisDashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4 md:p-6 ">
      <DashboardHeader />
      <DashboardOverview />
    </div>
  );
}
