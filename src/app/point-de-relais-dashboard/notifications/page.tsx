/**
 * Page du centre de notifications
 *
 * Cette page affiche:
 * - L'en-tête avec le titre "Centre de Notifications"
 * - Le composant de centre de notifications
 */
import type { Metadata } from 'next';
import { DashboardHeader } from '../components/dashboard/dashboard-header';
import { NotificationCenter } from '../components/dashboard/notifications-center';

/**
 * Métadonnées de la page pour le SEO
 */
export const metadata: Metadata = {
  title: 'Notifications | Point Relais',
  description: 'Centre de notifications du point relais',
};

/**
 * Page du centre de notifications
 */
export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <DashboardHeader title="Centre de Notifications" />
      <NotificationCenter />
    </div>
  );
}
