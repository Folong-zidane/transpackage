import type { Metadata } from 'next';
import { DashboardHeader } from '../components/dashboard/dashboard-header';
import { PackageReception } from '../components/dashboard/package-reception';

export const metadata: Metadata = {
  title: 'Réception des Colis | Point Relais',
  description: 'Interface de réception des colis',
};

export default function ReceptionPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <DashboardHeader title="Réception des Colis" />
      <PackageReception />
    </div>
  );
}
