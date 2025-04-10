const products: Product[] = [
    // Mobilier
    {
      id: '1',
      title: 'Table à manger moderne',
      price: 150000,
      originalPrice: 185000,
      discount: 19,
      category: 'Mobilier',
      imageUrl: '/images/dining-table.jpg',
      rating: 4.7,
      commission: 8.5,
      inStock: true,
      deliveryTime: '1 semaine'
    },
    {
      id: '2',
      title: 'Chaise design',
      price: 65000,
      originalPrice: 80000,
      discount: 19,
      category: 'Mobilier',
      imageUrl: '/images/chair.jpg',
      rating: 4.5,
      commission: 7.2,
      inStock: true,
      deliveryTime: '3 jours'
    },
    {
      id: '3',
      title: 'Armoire coloniale',
      price: 210000,
      originalPrice: 250000,
      discount: 16,
      category: 'Mobilier',
      imageUrl: '/images/armoire.jpg',
      rating: 4.6,
      commission: 9.5,
      inStock: true,
      deliveryTime: '2 semaines'
    },
    
    // Électronique
    {
      id: '4',
      title: 'Smartphone 6.2" 128Go',
      price: 180000,
      originalPrice: 220000,
      discount: 18,
      category: 'Électronique',
      imageUrl: '/images/smartphone.jpg',
      rating: 4.8,
      commission: 5.5,
      inStock: true,
      deliveryTime: '24h'
    },
    {
      id: '5',
      title: 'Smart TV 55" 4K',
      price: 350000,
      originalPrice: 400000,
      discount: 12,
      category: 'Électronique',
      imageUrl: '/images/tv.jpg',
      rating: 4.7,
      commission: 6.0,
      inStock: true,
      deliveryTime: '3 jours'
    },
    {
      id: '6',
      title: 'Écouteurs sans fil',
      price: 25000,
      originalPrice: 35000,
      discount: 29,
      category: 'Électronique',
      imageUrl: '/images/earbuds.jpg',
      rating: 4.5,
      commission: 10.0,
      inStock: true,
      deliveryTime: '24h'
    },
    
    // Mode
    {
      id: '7',
      title: 'Robe traditionnelle',
      price: 35000,
      originalPrice: 45000,
      discount: 22,
      category: 'Mode',
      imageUrl: '/images/dress.jpg',
      rating: 4.6,
      commission: 12.0,
      inStock: true,
      deliveryTime: '3 jours'
    },
    {
      id: '8',
      title: 'Chaussures cuir homme',
      price: 30000,
      originalPrice: 38000,
      discount: 21,
      category: 'Mode',
      imageUrl: '/images/shoes.jpg',
      rating: 4.4,
      commission: 11.5,
      inStock: true,
      deliveryTime: '1 semaine'
    },
    {
      id: '9',
      title: 'Sac à main en cuir',
      price: 45000,
      originalPrice: 60000,
      discount: 25,
      category: 'Mode',
      imageUrl: '/images/handbag.jpg',
      rating: 4.7,
      commission: 14.0,
      inStock: false,
    },
    
    // Beauté
    {
      id: '10',
      title: 'Coffret soins visage',
      price: 18000,
      originalPrice: 25000,
      discount: 28,
      category: 'Beauté',
      imageUrl: '/images/skincare.jpg',
      rating: 4.9,
      commission: 15.0,
      inStock: true,
      deliveryTime: '24h'
    },
    {
      id: '11',
      title: 'Huile de karité pure',
      price: 8000,
      originalPrice: 10000,
      discount: 20,
      category: 'Beauté',
      imageUrl: '/images/shea.jpg',
      rating: 4.8,
      commission: 18.0,
      inStock: true,
      deliveryTime: '3 jours'
    },
    
    // Alimentation
    {
      id: '12',
      title: 'Panier de fruits séchés',
      price: 12000,
      originalPrice: 15000,
      discount: 20,
      category: 'Alimentation',
      imageUrl: '/images/dried-fruits.jpg',
      rating: 4.5,
      commission: 8.0,
      inStock: true,
      deliveryTime: '24h'
    },
    {
      id: '13',
      title: 'Café artisanal 1kg',
      price: 8500,
      originalPrice: 10000,
      discount: 15,
      category: 'Alimentation',
      imageUrl: '/images/coffee.jpg',
      rating: 4.8,
      commission: 9.5,
      inStock: true,
      deliveryTime: '3 jours'
    },
    
    // Sports
    {
      id: '14',
      title: 'Vélo tout terrain',
      price: 175000,
      originalPrice: 210000,
      discount: 17,
      category: 'Sports',
      imageUrl: '/images/bike.jpg',
      rating: 4.7,
      commission: 7.0,
      inStock: true,
      deliveryTime: '1 semaine'
    },
    {
      id: '15',
      title: 'Ballon de football',
      price: 15000,
      originalPrice: 18000,
      discount: 17,
      category: 'Sports',
      imageUrl: '/images/soccer-ball.jpg',
      rating: 4.6,
      commission: 8.5,
      inStock: true,
      deliveryTime: '24h'
    },
    
    // Livres
    {
      id: '16',
      title: 'Livre histoire africaine',
      price: 9000,
      originalPrice: 12000,
      discount: 25,
      category: 'Livres',
      imageUrl: '/images/book.jpg',
      rating: 4.8,
      commission: 6.0,
      inStock: true,
      deliveryTime: '3 jours'
    },
    
    // Santé
    {
      id: '17',
      title: 'Tensiomètre électronique',
      price: 28000,
      originalPrice: 35000,
      discount: 20,
      category: 'Santé',
      imageUrl: '/images/blood-pressure.jpg',
      rating: 4.7,
      commission: 9.0,
      inStock: true,
      deliveryTime: '24h'
    },
    
    // Informatique
    {
      id: '18',
      title: 'Ordinateur portable 15.6"',
      price: 350000,
      originalPrice: 410000,
      discount: 15,
      category: 'Informatique',
      imageUrl: '/images/laptop.jpg',
      rating: 4.6,
      commission: 5.0,
      inStock: true,
      deliveryTime: '3 jours'
    },
    {
      id: '19',
      title: 'Imprimante multifonction',
      price: 85000,
      originalPrice: 100000,
      discount: 15,
      category: 'Informatique',
      imageUrl: '/images/printer.jpg',
      rating: 4.4,
      commission: 6.5,
      inStock: false,
    },
    
    // Jardinage
    {
      id: '20',
      title: 'Kit jardinage complet',
      price: 25000,
      originalPrice: 32000,
      discount: 22,
      category: 'Jardinage',
      imageUrl: '/images/gardening.jpg',
      rating: 4.5,
      commission: 9.0,
      inStock: true,
      deliveryTime: '1 semaine'
    },
    
    // Décoration
    {
      id: '21',
      title: 'Tapis tissé main 2x3m',
      price: 65000,
      originalPrice: 85000,
      discount: 24,
      category: 'Décoration',
      imageUrl: '/images/carpet.jpg',
      rating: 4.8,
      commission: 10.5,
      inStock: true,
      deliveryTime: '1 semaine'
    },
    {
      id: '22',
      title: 'Lampe de salon artisanale',
      price: 45000,
      originalPrice: 55000,
      discount: 18,
      category: 'Décoration',
      imageUrl: '/images/lamp.jpeg',
      rating: 4.7,
      commission: 11.0,
      inStock: true,
      deliveryTime: '3 jours'
    },
    
    // Multimédia
    {
      id: '23',
      title: 'Appareil photo numérique',
      price: 190000,
      originalPrice: 225000,
      discount: 16,
      category: 'Multimédia',
      imageUrl: '/images/camera.jpeg',
      rating: 4.6,
      commission: 7.5,
      inStock: true,
      deliveryTime: '24h'
    },
    
    // Bébé & Enfant
    {
      id: '24',
      title: 'Poussette tout-terrain',
      price: 120000,
      originalPrice: 150000,
      discount: 20,
      category: 'Bébé & Enfant',
      imageUrl: '/images/stroller.jpeg',
      rating: 4.8,
      commission: 8.0,
      inStock: true,
      deliveryTime: '1 semaine'
    },
    
    // Automobile
    {
      id: '25',
      title: 'Siège auto enfant',
      price: 85000,
      originalPrice: 100000,
      discount: 15,
      category: 'Automobile',
      imageUrl: '/images/car-seat.jpg',
      rating: 4.9,
      commission: 7.0,
      inStock: true,
      deliveryTime: '3 jours'
    },
    
    // Artisanat
    {
      id: '26',
      title: 'Statuette bronze 25cm',
      price: 65000,
      originalPrice: 80000,
      discount: 19,
      category: 'Artisanat',
      imageUrl: '/images/statue.jpeg',
      rating: 4.8,
      commission: 13.5,
      inStock: true,
      deliveryTime: '1 semaine'
    },
    {
      id: '27',
      title: 'Panier tressé décoratif',
      price: 18000,
      originalPrice: 22000,
      discount: 18,
      category: 'Artisanat',
      imageUrl: '/images/basket.jpeg',
      rating: 4.7,
      commission: 15.0,
      inStock: true,
      deliveryTime: '3 jours'
    },
    
    // Ajout de produits supplémentaires pour compléter
    {
      id: '28',
      title: 'Bracelet en perles',
      price: 5000,
      originalPrice: 7500,
      discount: 33,
      category: 'Mode',
      imageUrl: '/images/bracelet.avif',
      rating: 4.5,
      commission: 18.0,
      inStock: true,
      deliveryTime: '24h'
    },
    {
      id: '29',
      title: 'Mixeur professionnel',
      price: 45000,
      originalPrice: 60000,
      discount: 25,
      category: 'Électronique',
      imageUrl: '/images/blender.webp',
      rating: 4.6,
      commission: 8.5,
      inStock: true,
      deliveryTime: '3 jours'
    },
    {
      id: '30',
      title: 'Bureau d\'ordinateur',
      price: 95000,
      originalPrice: 115000,
      discount: 17,
      category: 'Mobilier',
      imageUrl: '/images/desk.jpeg',
      rating: 4.7,
      commission: 9.0,
      inStock: true,
      deliveryTime: '1 semaine'
    },
      {
        id: '31',
        title: 'Location de voiture économique',
        price: 25000,
        originalPrice: 30000,
        discount: 17,
        category: 'Location de véhicules',
        imageUrl: '/images/economy-car-rental.jpg',
        rating: 4.2,
        commission: 10.0,
        inStock: true,
        deliveryTime: '1h'
      },
      {
        id: '32',
        title: 'Forfait voyage Bali 7 jours',
        price: 450000,
        originalPrice: 520000,
        discount: 13,
        category: 'Agence de voyage',
        imageUrl: '/images/bali-tour.jpg',
        rating: 4.8,
        commission: 12.0,
        inStock: true,
        deliveryTime: '7j'
      },
      {
        id: '33',
        title: 'Camion frigorifique 10T',
        price: 8500000,
        originalPrice: 9000000,
        discount: 6,
        category: 'Transport logistique',
        imageUrl: '/images/refrigerated-truck.jpg',
        rating: 4.3,
        commission: 3.5,
        inStock: true,
        deliveryTime: '15j'
      },
      {
        id: '34',
        title: 'Course taxi aéroport',
        price: 15000,
        originalPrice: 18000,
        discount: 17,
        category: 'Transport urbain',
        imageUrl: '/images/taxi-service.jpg',
        rating: 4.1,
        commission: 8.0,
        inStock: true,
        deliveryTime: '30min'
      },
      {
        id: '35',
        title: 'Menu gastronomique 5 plats',
        price: 35000,
        originalPrice: 40000,
        discount: 12,
        category: 'Restauration',
        imageUrl: '/images/gourmet-menu.jpg',
        rating: 4.7,
        commission: 9.0,
        inStock: true,
        deliveryTime: '1h'
      },
      {
        id: '36',
        title: 'Pack de 5 best-sellers',
        price: 28000,
        originalPrice: 32000,
        discount: 12,
        category: 'Librairie',
        imageUrl: '/images/book-bundle.jpg',
        rating: 4.6,
        commission: 7.5,
        inStock: true,
        deliveryTime: '48h'
      },
      {
        id: '37',
        title: 'Abonnement fitness 3 mois',
        price: 60000,
        originalPrice: 75000,
        discount: 20,
        category: 'Salle de sport',
        imageUrl: '/images/gym-membership.jpg',
        rating: 4.4,
        commission: 15.0,
        inStock: true,
        deliveryTime: 'Immédiat'
      },
      {
        id: '38',
        title: 'Consultation médicale à domicile',
        price: 20000,
        originalPrice: 25000,
        discount: 20,
        category: 'Services médicaux',
        imageUrl: '/images/home-doctor.jpg',
        rating: 4.9,
        commission: 5.0,
        inStock: true,
        deliveryTime: '2h'
      },
      {
        id: '39',
        title: 'Nettoyage de maison 3 pièces',
        price: 30000,
        originalPrice: 35000,
        discount: 14,
        category: 'Services ménagers',
        imageUrl: '/images/house-cleaning.jpg',
        rating: 4.5,
        commission: 12.0,
        inStock: true,
        deliveryTime: '24h'
      },
      {
        id: '40',
        title: 'Forfait coiffure et beauté',
        price: 18000,
        originalPrice: 22000,
        discount: 18,
        category: 'Salon de beauté',
        imageUrl: '/images/hair-beauty.jpg',
        rating: 4.3,
        commission: 10.0,
        inStock: true,
        deliveryTime: '2h'
      },
      {
        id: '41',
        title: 'Location de matériel événementiel',
        price: 120000,
        originalPrice: 150000,
        discount: 20,
        category: 'Événementiel',
        imageUrl: '/images/event-equipment.jpg',
        rating: 4.2,
        commission: 8.0,
        inStock: true,
        deliveryTime: '48h'
      },
      {
        id: '42',
        title: 'Cours particulier de mathématiques',
        price: 10000,
        originalPrice: 12000,
        discount: 17,
        category: 'Éducation',
        imageUrl: '/images/math-tutor.jpg',
        rating: 4.7,
        commission: 15.0,
        inStock: true,
        deliveryTime: '24h'
      },
      {
        id: '43',
        title: 'Réparation smartphone express',
        price: 15000,
        originalPrice: 20000,
        discount: 25,
        category: 'Réparation électronique',
        imageUrl: '/images/phone-repair.jpg',
        rating: 4.4,
        commission: 7.0,
        inStock: true,
        deliveryTime: '2h'
      },
      {
        id: '44',
        title: 'Bouquet de fleurs premium',
        price: 22000,
        originalPrice: 25000,
        discount: 12,
        category: 'Fleuriste',
        imageUrl: '/images/premium-flowers.jpg',
        rating: 4.6,
        commission: 9.0,
        inStock: true,
        deliveryTime: '4h'
      },
      {
        id: '45',
        title: 'Séance photo professionnelle',
        price: 45000,
        originalPrice: 50000,
        discount: 10,
        category: 'Photographie',
        imageUrl: '/images/photo-session.jpg',
        rating: 4.8,
        commission: 12.0,
        inStock: true,
        deliveryTime: '72h'
      },
      {
        id: '46',
        title: 'Service de garde d enfants',
        price: 8000,
        originalPrice: 10000,
        discount: 20,
        category: 'Garde d enfants',
        imageUrl: '/images/babysitting.jpg',
        rating: 4.9,
        commission: 5.0,
        inStock: true,
        deliveryTime: '24h'
      },
      {
        id: '47',
        title: 'Location de vélo électrique',
        price: 12000,
        originalPrice: 15000,
        discount: 20,
        category: 'Location véhicules',
        imageUrl: '/images/e-bike.jpg',
        rating: 4.3,
        commission: 8.0,
        inStock: true,
        deliveryTime: '1h'
      },
      {
        id: '48',
        title: 'Installation climatiseur',
        price: 35000,
        originalPrice: 40000,
        discount: 12,
        category: 'Services techniques',
        imageUrl: '/images/ac-installation.jpg',
        rating: 4.5,
        commission: 10.0,
        inStock: true,
        deliveryTime: '24h'
      },
      {
        id: '49',
        title: 'Massage relaxant 1h',
        price: 25000,
        originalPrice: 30000,
        discount: 17,
        category: 'Bien-être',
        imageUrl: '/images/spa-massage.jpg',
        rating: 4.7,
        commission: 12.0,
        inStock: true,
        deliveryTime: '24h'
      },
      {
        id: '50',
        title: 'Cours de cuisine italienne',
        price: 28000,
        originalPrice: 35000,
        discount: 20,
        category: 'Ateliers',
        imageUrl: '/images/cooking-class.jpg',
        rating: 4.6,
        commission: 15.0,
        inStock: true,
        deliveryTime: '48h'
      },
      {
        id: '51',
        title: 'Forfait mobile 10Go',
        price: 15000,
        originalPrice: 18000,
        discount: 17,
        category: 'Télécommunications',
        imageUrl: '/images/mobile-plan.jpg',
        rating: 4.2,
        commission: 5.0,
        inStock: true,
        deliveryTime: 'Immédiat'
      },
      {
        id: '52',
        title: 'Déménagement 2 chambres',
        price: 80000,
        originalPrice: 100000,
        discount: 20,
        category: 'Services de déménagement',
        imageUrl: '/images/moving-service.jpg',
        rating: 4.4,
        commission: 7.0,
        inStock: true,
        deliveryTime: '72h'
      },
      {
        id: '53',
        title: 'Consultation juridique',
        price: 40000,
        originalPrice: 50000,
        discount: 20,
        category: 'Services juridiques',
        imageUrl: '/images/legal-advice.jpg',
        rating: 4.8,
        commission: 5.0,
        inStock: true,
        deliveryTime: '24h'
      },
      {
        id: '54',
        title: 'Nettoyage de vitres professionnel',
        price: 20000,
        originalPrice: 25000,
        discount: 20,
        category: 'Services ménagers',
        imageUrl: '/images/window-cleaning.jpg',
        rating: 4.5,
        commission: 10.0,
        inStock: true,
        deliveryTime: '24h'
      },
      {
        id: '55',
        title: 'Location de matériel de jardinage',
        price: 15000,
        originalPrice: 20000,
        discount: 25,
        category: 'Location équipements',
        imageUrl: '/images/gardening-tools.jpg',
        rating: 4.3,
        commission: 8.0,
        inStock: true,
        deliveryTime: '4h'
      }
  ];








