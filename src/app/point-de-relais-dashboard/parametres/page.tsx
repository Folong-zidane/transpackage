
import type { Metadata } from 'next';
import { DashboardHeader } from '../components/dashboard/dashboard-header';
import { Settings } from '../components/dashboard/settings';


export const metadata: Metadata = {
  title: 'Paramètres | Point Relais',
  description: 'Paramètres du point relais',
};

/**
 * Page de paramètres
 */
export default function ParametresPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <DashboardHeader title="Paramètres" />
      <Settings />
    </div>
  );
}
