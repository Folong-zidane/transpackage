// Créer un fichier pour les données de test
// mockData/notificationsData.ts

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  packageId?: string;
  relayPointId?: string;
  actionType?: "viewPackage" | "viewRelayPoint" | "confirmDelivery" | "rateService" | "trackPackage" | "updateInfo";
}

// Données de test pour les notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Colis en cours de livraison",
    message: "Votre colis #CR78945 sera livré aujourd'hui entre 14h et 16h",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(), // 35 minutes ago
    packageId: "CR78945",
    actionType: "trackPackage"
  },
  {
    id: "2",
    title: "Colis livré avec succès",
    message: "Votre colis #BX12367 a été livré au point relais Les Cyprès",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    packageId: "BX12367",
    relayPointId: "RP001",
    actionType: "confirmDelivery"
  },
  {
    id: "3",
    title: "Retard de livraison",
    message: "Votre colis #DT45678 rencontre un retard. Nouvelle livraison prévue demain",
    type: "warning",
    read: true,
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
    packageId: "DT45678",
    actionType: "trackPackage"
  },
  {
    id: "4",
    title: "Échec de livraison",
    message: "La livraison du colis #AF87651 a échoué. Veuillez vérifier votre adresse",
    type: "error",
    read: false,
    createdAt: new Date(Date.now() - 27 * 3600000).toISOString(), // 27 hours ago
    packageId: "AF87651",
    actionType: "updateInfo"
  },
  {
    id: "5",
    title: "Votre avis nous intéresse",
    message: "Merci de noter votre expérience de livraison pour le colis #BX12367",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
    packageId: "BX12367",
    actionType: "rateService"
  },
  {
    id: "6",
    title: "Nouveau point relais proche de vous",
    message: "Découvrez le nouveau point relais 'Librairie Moderne' à 500m de votre domicile",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(), // 3 days ago
    relayPointId: "RP045",
    actionType: "viewRelayPoint"
  }
];