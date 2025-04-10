export interface Affiliate {
  id: string;
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  affiliate: Affiliate;
  comment: string;
  media: string;
  mediaType: 'image' | 'video';
  timestamp: string;
  likes: number;
  comments: number;
  productLink: string;
  recentComments?: {
    id: string;
    username: string;
    text: string;
    timestamp: string;
  }[];
}

const affiliatePosts = [
  {
    id: '1',
    affiliate: {
      id: '1',
      name: 'Sarah Dupont',
      avatar: '/images/assets/avatar-7.png'
    },
    timestamp: 'Il y a 2 heures',
    comment: 'J\'ai découvert cette robe magnifique ! Je l ai mise pour un shooting. Ca m a donné l envie de me marier 😍',
    mediaType: 'image',
    media: '/images/post-1.png',
    tag: 'Lifestyle',
    productLink: '/product/lifestyle-item',
    likes: 24,
    comments: 3,
    recentComments: [
      {
        id: 'c1',
        username: 'Sophie',
        text: 'Merci pour la recommandation, je vais essayer !',
        timestamp: 'Il y a 45 min'
      },
      {
        id: 'c2',
        username: 'Lucas',
        text: 'J\'utilise déjà ce produit, c\'est vraiment top !',
        timestamp: 'Il y a 1 heure'
      }
    ]
  },
  {
    id: '2',
    affiliate: {
      id: '2',
      name: 'Thomas Martin',
      avatar: '/images/assets/avatar-1.png'
    },
    timestamp: 'Il y a 5 heures',
    comment: 'La technologie qui change tout ! Ce Blender va vous faire gagner du temps et améliorer votre expérience en cuisine. Je ne peux plus m\'en passer 🚀',
    mediaType: 'image',
    media: '/images/post-2.jpeg',
    tag: 'Tech',
    productLink: '/product/tech-gadget',
    likes: 47,
    comments: 8,
    recentComments: [
      {
        id: 'c3',
        username: 'Élise',
        text: 'Ça a l\'air génial ! Est-ce que ça vaut vraiment le prix ?',
        timestamp: 'Il y a 2 heures'
      }
    ]
  },
  {
    id: '3',
    affiliate: {
      id: '3',
      name: 'Julie Bernard',
      avatar: '/images/assets/avatar-8.png'
    },
    timestamp: 'Il y a 1 jour',
    comment: 'Le secret de ma peau éclatante enfin révélé ! Ce produit est un véritable miracle pour l\'hydratation et la luminosité ✨',
    mediaType: 'image',
    media: '/images/post-3.png',
    tag: 'Beauté',
    productLink: '/product/beauty-serum',
    likes: 89,
    comments: 12,
    recentComments: []
  },
  {
    id: '4',
    affiliate: {
      id: '1',
      name: 'Sarah Dupont',
      avatar: '/images/assets/avatar-7.png'
    },
    timestamp: 'Il y a 2 jours',
    comment: 'Transformez votre maison avec ce pot de fleur design et fonctionnel ! Ambiance garantie pour vos soirées 🏠',
    mediaType: 'image',
    media: '/images/post-4.png',
    tag: 'Maison',
    productLink: '/product/home-accessory',
    likes: 36,
    comments: 5,
    recentComments: []
  },
  {
    id: '5',
    affiliate: {
      id: '5',
      name: 'Antoine Le BG',
      avatar: '/images/assets/avatar-10.png'
    },
    timestamp: 'Il y a 2 jours',
    comment: 'Je profite de mon double-date au nouveau restaurant "Saveurs du Terroir". Des produits 100% locaux, des recettes revisitées. Venez découvrir.',
    mediaType: 'image',
    media: '/images/post-5.avif',
    tag: 'Restauration',
    productLink: '/product/restaurant-gastronomique',
    likes: 215,
    comments: 42,
    recentComments: [
      {
        id: 'c10',
        username: 'GourmetParis',
        text: 'Le canard est à tomber ! J\'y retourne ce week-end',
        timestamp: 'Il y a 1 jour'
      },
      {
        id: 'c11',
        username: 'Julie',
        text: 'Des options végétariennes ?',
        timestamp: 'Il y a 20 heures'
      }
    ]
  },
  {
    id: '6',
    affiliate: {
      id: '6',
      name: 'Merveille LaRose',
      avatar: '/images/assets/avatar-4.png'
    },
    timestamp: 'Il y a 3 jours',
    comment: 'Mes enfant sont devenu accros à ces livres de contes. 📚 Découvrer la sélection spéciale rentrée littéraire ! Des 10 romans incontournables de cette année.',
    mediaType: 'image',
    media: '/images/post-6.avif',
    tag: 'Culture',
    productLink: '/product/selection-livres',
    likes: 178,
    comments: 31,
    recentComments: [
      {
        id: 'c12',
        username: 'BookLover',
        text: 'Merci pour ces recommandations !',
        timestamp: 'Il y a 2 jours'
      },
      {
        id: 'c13',
        username: 'Paul',
        text: 'Est-ce que vous faites aussi des livraisons ?',
        timestamp: 'Il y a 1 jour'
      }
    ]
  },
  {
    id: '7',
    affiliate: {
      id: '7',
      name: 'Tibo In Shape',
      avatar: '/images/assets/avatar-11.png'
    },
    timestamp: 'Il y a 4 jours',
    comment: 'Je me sens tellement bien après ma séance Jambe. Profitez de cette 🚀 Offre spéciale rentrée : 3 mois d\'abonnement pour le prix d\'1 mois !',
    mediaType: 'image',
    media: '/images/post-8.avif',
    tag: 'Sport',
    productLink: '/product/abonnement-fitness',
    likes: 342,
    comments: 87,
    recentComments: [
      {
        id: 'c14',
        username: 'SportAddict',
        text: 'Meilleure salle de quartier !',
        timestamp: 'Il y a 3 jours'
      },
      {
        id: 'c15',
        username: 'Nathalie',
        text: 'Il y a des cours de yoga ?',
        timestamp: 'Il y a 2 jours'
      }
    ]
  },
  {
    id: '8',
    affiliate: {
      id: '8',
      name: 'Riki Maui',
      avatar: '/images/assets/avatar-10.png'
    },
    timestamp: 'Il y a 5 jours',
    comment: 'Le palu a failli finir avec moi les amis... Heureusement que le DocterHealth Center était là. Ce Nouveau cabinet médical est ouvert 7j/7 ! Et fait des Consultations sans rendez-vous pour les urgences.',
    mediaType: 'image',
    media: '/images/post-9.avif',
    tag: 'Santé',
    productLink: '/product/cabinet-medical',
    likes: 156,
    comments: 28,
    recentComments: [
      {
        id: 'c16',
        username: 'Patient',
        text: 'Très professionnel, J y était récemment.',
        timestamp: 'Il y a 4 jours'
      },
      {
        id: 'c17',
        username: 'Marie',
        text: 'Ils prennent la carte vitale ?',
        timestamp: 'Il y a 3 jours'
      }
    ]
  },
  {
    id: '9',
    affiliate: {
      id: '9',
      name: 'Kimberly choco',
      avatar: '/images/assets/avatar-6.png'
    },
    timestamp: 'Il y a 1 semaine',
    comment: 'Ma famille et moins on ne craint plus la saleté désormais... Grâce à CLEANY-house Un🧹 Service de ménage premium avec produits écologiques ! Première prestation à -30%.',
    mediaType: 'image',
    media: '/images/post-10.jpg',
    tag: 'Services',
    productLink: '/product/menage-ecologique',
    likes: 98,
    comments: 15,
    recentComments: [
      {
        id: 'c18',
        username: 'Claire',
        text: 'Ils sont venus chez moi, impeccable !',
        timestamp: 'Il y a 6 jours'
      },
      {
        id: 'c19',
        username: 'Jacques',
        text: 'Disponible aussi le dimanche ?',
        timestamp: 'Il y a 5 jours'
      }
    ]
  },
  {
    id: '10',
    affiliate: {
      id: '10',
      name: 'Louis le princy',
      avatar: '/images/assets/avatar-2.png'
    },
    timestamp: 'Il y a 1 semaine',
    comment: 'Je peux surfer, télécharger mes films et faire des photos magnifiques grâce à mon nouveau smartphone. 🔥 Nouveau smartphone Tecno Camon 30 pliable avec écran incassable ! Offre exclusive : étui premium + écouteurs sans fil offerts.',
    mediaType: 'image',
    media: '/images/post-11.avif',
    tag: 'Technologie',
    productLink: '/product/smartphone-pliable',
    likes: 421,
    comments: 103,
    recentComments: [
      {
        id: 'c20',
        username: 'Geek',
        text: 'J\'attends ça depuis des années !',
        timestamp: 'Il y a 6 jours'
      },
      {
        id: 'c21',
        username: 'Sophie',
        text: 'Le prix est un peu élevé mais ça a l\'air génial',
        timestamp: 'Il y a 5 jours'
      }
    ]
  },
  {
    id: '11',
    affiliate: {
      id: '5',
      name: 'Antoine Le BG',
      avatar: '/images/assets/avatar-3.png'
    },
    timestamp: 'Il y a 3 heures',
    comment: 'Je peux désormais voyager et découvrir la ville de Marseille grâce à ma nouvelle FIAT 500. Découvrez leur nouvelle flotte de voitures électriques en location ! ⚡',
    mediaType: 'image',
    media: '/images/post-12.avif',
    tag: 'Location véhicule',
    productLink: '/product/location-voiture-electrique',
    likes: 56,
    comments: 7,
    recentComments: [
      {
        id: 'c1',
        username: 'Marc',
        text: 'Combien coûte la location pour un week-end ?',
        timestamp: 'Il y a 2 heures'
      },
      {
        id: 'c2',
        username: 'Sarah',
        text: 'Est-ce qu\'il y a des bornes de recharge incluses ?',
        timestamp: 'Il y a 1 heure'
      },
      {
        id: 'c3',
        username: 'Thomas',
        text: 'J\'ai essayé aussi, super confortable et silencieuse !',
        timestamp: 'Il y a 45 min'
      }
    ]
  },
  {
    id: '12',
    affiliate: {
      id: '1',
      name: 'Sarah Dupont',
      avatar: '/images/assets/avatar-7.png'
    },
    timestamp: 'Il y a 5 heures',
    comment: 'Mes vacances au Maroc se terminent déjà. ✨ Offre exclusive ✨ -20% sur le Séjour tout compris à Marrakech avec visite des jardins Majorelle et balade en montgolfière ! 🌴',
    mediaType: 'image',
    media: '/images/post-13.avif',
    tag: 'Voyage',
    productLink: '/product/voyage-marrakech',
    likes: 124,
    comments: 23,
    recentComments: [
      {
        id: 'c4',
        username: 'Laura',
        text: 'C\'est valable pour quelle période ? Je cherche pour avril !',
        timestamp: 'Il y a 3 heures'
      },
      {
        id: 'c5',
        username: 'AgenceVoyages',
        text: '@Laura Valable jusqu\'au 15 mai, foncez !',
        timestamp: 'Il y a 2 heures'
      }
    ]
  },
  {
    id: '13',
    affiliate: {
      id: '6',
      name: 'Merveille LaRose',
      avatar: '/images/assets/avatar-4.png'
    },
    timestamp: 'Il y a 1 jour',
    comment: 'Besoin de transporter des marchandises en urgence ? Notre nouveau service express garantit une livraison en 24h partout en Europe ! Camions équipés de GPS et système de climatisation. Essayez avec 15% de réduction (code EXPRESS15) 🚛',
    mediaType: 'image',
    media: '/images/posts/truck-service.jpg',
    tag: 'Logistique',
    productLink: '/product/livraison-express',
    likes: 89,
    comments: 14,
    recentComments: [
      {
        id: 'c6',
        username: 'EntrepriseDupont',
        text: 'Service très professionnel, je recommande !',
        timestamp: 'Il y a 18 heures'
      },
      {
        id: 'c7',
        username: 'Pierre',
        text: 'Vous faites aussi du frigo ? J\'ai des produits surgelés à transporter',
        timestamp: 'Il y a 12 heures'
      }
    ]
  },
  {
    id: '14',
    affiliate: {
      id: '2',
      name: 'Thomas Martin',
      avatar: '/images/assets/avatar-1.png'
    },
    timestamp: 'Il y a 1 jour',
    comment: 'J ai failli raté mon entretien d embauche ce matin. Heureusement une nouvelle application de réservation de taxis avec chauffeurs professionnels et la ponctualité de ses chauffeurs j ai pu arriver à temps. Merci #MobilitéUrbaine.',
    mediaType: 'image',
    media: '/images/posts/taxi-app.jpg',
    tag: 'Transport',
    productLink: '/product/taxi-premium',
    likes: 67,
    comments: 9,
    recentComments: [
      {
        id: 'c8',
        username: 'Emma',
        text: 'Super appli, beaucoup plus fiable que les autres !',
        timestamp: 'Il y a 16 heures'
      },
      {
        id: 'c9',
        username: 'David',
        text: 'Les voitures sont vraiment propres ?',
        timestamp: 'Il y a 10 heures'
      }
    ]
  }
];

export default affiliatePosts;