// data/relayPoints.ts
export const relayPointsData = {
  // Données pour le graphique en camembert des points relais par région
  byRegion: [
    { name: "Yaoundé", value: 68, color: "#10b981" },
    { name: "Douala", value: 89, color: "#3b82f6" },
    { name: "Bafoussam", value: 34, color: "#f59e0b" },
    { name: "Garoua", value: 21, color: "#ef4444" },
    { name: "Maroua", value: 15, color: "#8b5cf6" },
    { name: "Bamenda", value: 10, color: "#ec4899" },
    { name: "Dschang", value: 8, color: "#14b8a6" },
    { name: "Ngaoundéré", value: 12, color: "#f97316" },
    { name: "Ebolowa", value: 7, color: "#64748b" },
    { name: "Bertoua", value: 9, color: "#a855f7" }
  ],
  
  // Données pour le tableau des points relais récents
  recent: [
    {
      name: "Supermarché Mahima",
      address: "Rue 1.839, Yaoundé",
      region: "Yaoundé",
      type: "Commerce",
      performance: 95,
      status: "Active"
    },
    {
      name: "Pharmacie de la Paix",
      address: "Avenue de l'Indépendance, Douala",
      region: "Douala",
      type: "Pharmacie",
      performance: 88,
      status: "Active"
    },
    {
      name: "Librairie Moderne",
      address: "Boulevard de la Liberté, Bafoussam",
      region: "Bafoussam",
      type: "Commerce",
      performance: 76,
      status: "Active"
    },
    {
      name: "Station Total Akwa",
      address: "Carrefour Akwa, Douala",
      region: "Douala",
      type: "Station-service",
      performance: 92,
      status: "Active"
    },
    {
      name: "Boutique Express",
      address: "Rue des Écoles, Maroua",
      region: "Maroua",
      type: "Commerce",
      performance: 65,
      status: "Inactive"
    },
    {
      name: "Cyber Café Digital",
      address: "Quartier Bastos, Yaoundé",
      region: "Yaoundé",
      type: "Cybercafé",
      performance: 82,
      status: "Active"
    },
    {
      name: "Boulangerie Saint Michel",
      address: "Avenue Kennedy, Douala",
      region: "Douala",
      type: "Boulangerie",
      performance: 91,
      status: "Active"
    },
    {
      name: "Agence Express Union",
      address: "Carrefour Town Green, Bamenda",
      region: "Bamenda",
      type: "Agence de transfert",
      performance: 78,
      status: "Active"
    },
    {
      name: "Station Shell Omnisport",
      address: "Boulevard du 20 Mai, Yaoundé",
      region: "Yaoundé",
      type: "Station-service",
      performance: 94,
      status: "Active"
    },
    {
      name: "Superette du Marché Central",
      address: "Marché Central, Garoua",
      region: "Garoua",
      type: "Commerce",
      performance: 70,
      status: "Active"
    },
    {
      name: "Salon de Thé La Douceur",
      address: "Quartier Fouda, Yaoundé",
      region: "Yaoundé",
      type: "Restauration",
      performance: 85,
      status: "Active"
    },
    {
      name: "Boutique Mobile MTN",
      address: "Rue du Palais, Bafoussam",
      region: "Bafoussam",
      type: "Téléphonie",
      performance: 89,
      status: "Active"
    },
    {
      name: "Dépôt de Boissons Tangui",
      address: "Quartier Pitoare, Maroua",
      region: "Maroua",
      type: "Dépôt",
      performance: 68,
      status: "Inactive"
    },
    {
      name: "Agence Orange Money",
      address: "Carrefour Soboum, Douala",
      region: "Douala",
      type: "Téléphonie",
      performance: 93,
      status: "Active"
    },
    {
      name: "Pressing Elite",
      address: "Rue de la Poste, Ngaoundéré",
      region: "Ngaoundéré",
      type: "Service",
      performance: 75,
      status: "Active"
    },
    {
      name: "Boutique Villageoise",
      address: "Quartier Mbanga, Ebolowa",
      region: "Ebolowa",
      type: "Commerce",
      performance: 60,
      status: "Active"
    },
    {
      name: "Station-service Avia",
      address: "Entrée ville, Bertoua",
      region: "Bertoua",
      type: "Station-service",
      performance: 80,
      status: "Active"
    },
    {
      name: "Librairie des Savoirs",
      address: "Quartier Administratif, Dschang",
      region: "Dschang",
      type: "Commerce",
      performance: 72,
      status: "Inactive"
    },
    {
      name: "Dépanneur Nocturne",
      address: "Quartier Madagascar, Yaoundé",
      region: "Yaoundé",
      type: "Commerce",
      performance: 83,
      status: "Active"
    },
    {
      name: "Pharmacie du Centre",
      address: "Place des Fêtes, Bafoussam",
      region: "Bafoussam",
      type: "Pharmacie",
      performance: 90,
      status: "Active"
    }
  ],
  
  // Statistiques générales mises à jour
  stats: {
    total: 362,
    active: 340,
    inactive: 22,
    averagePerformance: 83
  }
};