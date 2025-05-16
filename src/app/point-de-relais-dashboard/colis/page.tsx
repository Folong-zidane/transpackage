/**
 * Page de gestion des colis
 *
 * Cette page affiche:
 * - L'en-tête avec le titre "Gestion des Colis"
 * - Le composant de gestion des colis avec filtres et tableau
 */
import type { Metadata } from 'next';
import { PackageManagement } from '../components/dashboard/package-management';
import { DashboardHeader } from '../components/dashboard/dashboard-header';

/**
 * Métadonnées de la page pour le SEO
 */
export const metadata: Metadata = {
  title: 'Gestion des Colis | Point Relais',
  description: 'Gestion des colis du point relais',
};

export default function ColisPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <DashboardHeader title="Gestion des Colis" />
      <PackageManagement />
    </div>
  );
}
