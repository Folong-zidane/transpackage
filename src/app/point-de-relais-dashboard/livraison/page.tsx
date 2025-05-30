/**
 * Page de livraison des colis
 *
 * Cette page affiche:
 * - L'en-tête avec le titre "Livraison des Colis"
 * - Le composant de livraison des colis
 */
import type { Metadata } from 'next';
import { DashboardHeader } from '../components/dashboard/dashboard-header';
import { PackageDelivery } from '../components/dashboard/package-delivery';

/**
 * Métadonnées de la page pour le SEO
 */
export const metadata: Metadata = {
  title: 'Expedition des Colis | Point Relais',
  description: 'Interface d expedition des colis',
};

/**
 * Page de livraison des colis
 */
export default function LivraisonPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <DashboardHeader title="Expédition des Colis" />
      <PackageDelivery />
    </div>
  );
}
