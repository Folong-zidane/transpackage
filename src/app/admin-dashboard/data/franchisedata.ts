// data/franchiseData.ts
export const franchiseData = {
    // Résumé des franchises pour la grille de gestion des franchises
    summary: [
      {
        name: "Express Distribution",
        status: "Active",
        region: "Yaoundé",
        relayPoints: 24,
        performance: 92,
        contactPerson: "Alain Mbarga",
        contactEmail: "a.mbarga@expressdist.cm",
        contractDate: "2023-01-15"
      },
      {
        name: "Logistique Pro",
        status: "Active",
        region: "Douala",
        relayPoints: 31,
        performance: 89,
        contactPerson: "Marie Etonde",
        contactEmail: "m.etonde@logistiquepro.cm",
        contractDate: "2022-09-22"
      },
      {
        name: "Ouest Connect",
        status: "Active",
        region: "Bafoussam",
        relayPoints: 18,
        performance: 85,
        contactPerson: "Paul Tagne",
        contactEmail: "p.tagne@ouestconnect.cm",
        contractDate: "2023-03-10"
      },
      {
        name: "Nord Services",
        status: "Active",
        region: "Garoua",
        relayPoints: 12,
        performance: 79,
        contactPerson: "Ibrahim Moussa",
        contactEmail: "i.moussa@nordservices.cm",
        contractDate: "2023-04-05"
      },
      {
        name: "Express Est",
        status: "Inactive",
        region: "Bertoua",
        relayPoints: 8,
        performance: 63,
        contactPerson: "Jeanne Mballa",
        contactEmail: "j.mballa@expressest.cm",
        contractDate: "2023-05-20"
      },
      {
        name: "Littoral Express",
        status: "Active",
        region: "Douala",
        relayPoints: 19,
        performance: 87,
        contactPerson: "Thomas Ekedi",
        contactEmail: "t.ekedi@littoralexpress.cm",
        contractDate: "2023-02-18"
      }
    ],
    
    // Statistiques financières des franchises
    finances: {
      revenue: [
        { month: "Jan", amount: 12450000 },
        { month: "Fév", amount: 13680000 },
        { month: "Mar", amount: 15240000 }
      ],
      feesCollected: [
        { month: "Jan", amount: 1245000 },
        { month: "Fév", amount: 1368000 },
        { month: "Mar", amount: 1524000 }
      ],
      profitSharing: [
        { franchise: "Express Distribution", amount: 452000 },
        { franchise: "Logistique Pro", amount: 576000 },
        { franchise: "Ouest Connect", amount: 324000 },
        { franchise: "Nord Services", amount: 189000 },
        { franchise: "Littoral Express", amount: 342000 }
      ]
    },
    
    // Historique des performances des franchises
    performanceHistory: {
      "Express Distribution": [
        { month: "Jan", performance: 88 },
        { month: "Fév", performance: 90 },
        { month: "Mar", performance: 92 }
      ],
      "Logistique Pro": [
        { month: "Jan", performance: 86 },
        { month: "Fév", performance: 87 },
        { month: "Mar", performance: 89 }
      ],
      "Ouest Connect": [
        { month: "Jan", performance: 80 },
        { month: "Fév", performance: 83 },
        { month: "Mar", performance: 85 }
      ]
    },
    
    // Indicateurs clés
    kpis: {
      averagePerformance: 87,
      totalRelayPoints: 112,
      activeContracts: 5,
      averageContractLength: 24, // en mois
      renewalRate: 92 // pourcentage
    }
  };