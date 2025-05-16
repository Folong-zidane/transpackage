/**
 * Page de rapports et statistiques
 *
 * Cette page affiche:
 * - L'en-tête avec le titre "Rapports et Statistiques"
 * - Le composant de rapports avec graphiques et analyses
 */
import type { Metadata } from 'next';
import { DashboardHeader } from '../components/dashboard/dashboard-header';
import { Reports } from '../components/dashboard/reports';

/**
 * Métadonnées de la page pour le SEO
 */
export const metadata: Metadata = {
  title: 'Rapports | Point Relais',
  description: 'Rapports et statistiques du point relais',
};

/**
 * Page de rapports et statistiques
 */
export default function RapportsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <DashboardHeader title="Rapports et Statistiques" />
      <Reports />
    </div>
  );
}
