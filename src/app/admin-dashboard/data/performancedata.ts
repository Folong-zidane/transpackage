// data/performanceData.ts
export const performanceData = {
    // Données pour le graphique linéaire de performance des livraisons
    deliveryPerformance: [
      { date: "01/03", onTime: 120, delayed: 8 },
      { date: "02/03", onTime: 132, delayed: 10 },
      { date: "03/03", onTime: 141, delayed: 7 },
      { date: "04/03", onTime: 119, delayed: 11 },
      { date: "05/03", onTime: 125, delayed: 9 },
      { date: "06/03", onTime: 136, delayed: 6 },
      { date: "07/03", onTime: 148, delayed: 8 },
      { date: "08/03", onTime: 152, delayed: 5 },
      { date: "09/03", onTime: 159, delayed: 7 },
      { date: "10/03", onTime: 142, delayed: 9 },
      { date: "11/03", onTime: 135, delayed: 12 },
      { date: "12/03", onTime: 128, delayed: 14 },
      { date: "13/03", onTime: 139, delayed: 11 },
      { date: "14/03", onTime: 147, delayed: 8 },
      { date: "15/03", onTime: 151, delayed: 6 },
      { date: "16/03", onTime: 162, delayed: 9 },
      { date: "17/03", onTime: 170, delayed: 7 },
      { date: "18/03", onTime: 156, delayed: 10 },
      { date: "19/03", onTime: 163, delayed: 8 },
      { date: "20/03", onTime: 175, delayed: 5 },
      { date: "21/03", onTime: 182, delayed: 6 },
      { date: "22/03", onTime: 169, delayed: 9 },
      { date: "23/03", onTime: 175, delayed: 8 },
      { date: "24/03", onTime: 184, delayed: 5 },
      { date: "25/03", onTime: 179, delayed: 7 },
      { date: "26/03", onTime: 185, delayed: 6 },
      { date: "27/03", onTime: 176, delayed: 9 },
      { date: "28/03", onTime: 181, delayed: 7 },
      { date: "29/03", onTime: 193, delayed: 4 },
      { date: "30/03", onTime: 188, delayed: 6 }
    ],
    
    // Données sur le volume de colis par région
    volumeByRegion: {
      "Yaoundé": 5842,
      "Douala": 7623,
      "Bafoussam": 2154,
      "Garoua": 1236,
      "Maroua": 875,
      "Bamenda": 702
    },
    
    // Données de tendances mensuelles
    monthlyTrends: [
      { month: "Jan", volume: 15420, onTimeRate: 87 },
      { month: "Fév", volume: 16540, onTimeRate: 88 },
      { month: "Mar", volume: 18432, onTimeRate: 89 }
    ],
    
    // Types de problèmes rencontrés
    issues: {
      "Adresse incorrecte": 45,
      "Client absent": 29,
      "Colis endommagé": 12,
      "Retard livraison": 18,
      "Autres": 6
    }
  };