// AffiliateData.tsx
export interface Affiliate {
    id: string;
    name: string;
    photoUrl: string;
    salesCount: number;
    promoCode: string;
    category: string;
  }
  
  const AffiliateData = {
    topSellers: [
      { id: "a1", name: "Sophie Martin", photoUrl: "/images/assets/avatar.png", salesCount: 1458, promoCode: "SOPHIE20", category: "Mode" },
      { id: "a2", name: "Thomas Dubois", photoUrl: "/images/assets/avatar-1.png", salesCount: 1356, promoCode: "THOMAS15", category: "High-Tech" },
      { id: "a3", name: "Emma Garcia", photoUrl: "/images/assets/avatar-3.png", salesCount: 1245, promoCode: "EMMA10", category: "Maison" },
      { id: "a4", name: "Lucas Bernard", photoUrl: "/images/assets/avatar-2.png", salesCount: 1122, promoCode: "LUCAS25", category: "Sport" },
      { id: "a5", name: "Léa Moreau", photoUrl: "/images/assets/avatar-4.png", salesCount: 987, promoCode: "LEA30", category: "Beauté" },
      { id: "a6", name: "Hugo Lefèvre", photoUrl: "/images/assets/avatar-9.png", salesCount: 879, promoCode: "HUGO10", category: "Alimentation" },
      { id: "a7", name: "Camille Petit", photoUrl: "/images/assets/avatar-5.png", salesCount: 865, promoCode: "CAMILLE5", category: "Jardin" }
    ],
    risingStars: [
      { id: "b1", name: "Antoine Dupont", photoUrl: "/images/assets/avatar-10.png", salesCount: 753, promoCode: "ANTOINE50", category: "Voyage" },
      { id: "b2", name: "Julie Blanc", photoUrl: "/images/assets/avatar-6.png", salesCount: 682, promoCode: "JULIE40", category: "Enfants" },
      { id: "b3", name: "Maxime Leroy", photoUrl: "/images/assets/avatar-11.png", salesCount: 624, promoCode: "MAXIME30", category: "Livres" },
      { id: "b4", name: "Chloé Rousseau", photoUrl: "/images/assets/avatar-7.png", salesCount: 589, promoCode: "CHLOE25", category: "Musique" },
      { id: "b5", name: "Gabriel Denis", photoUrl: "/images/assets/avatar-9.png", salesCount: 547, promoCode: "GABRIEL15", category: "Art" },
      { id: "b6", name: "Inès Lambert", photoUrl: "/images/assets/avatar-8.png", salesCount: 521, promoCode: "INES20", category: "Bijoux" },
      { id: "b7", name: "Noah Vincent", photoUrl: "/images/assets/avatar-1.png", salesCount: 498, promoCode: "NOAH10", category: "Auto" }
    ],
    featuredAffiliates: [
      { id: "c1", name: "Manon Fournier", photoUrl: "/images/assets/avatar-8.png", salesCount: 867, promoCode: "MANON15", category: "Luxe" },
      { id: "c2", name: "Raphaël Michel", photoUrl: "/images/assets/avatar-3.png", salesCount: 842, promoCode: "RAPHAEL20", category: "Électroménager" },
      { id: "c3", name: "Zoé Durand", photoUrl: "/images/assets/avatar-7.png", salesCount: 798, promoCode: "ZOE25", category: "Santé" },
      { id: "c4", name: "Étienne Lemoine", photoUrl: "/images/assets/avatar-3.png", salesCount: 762, promoCode: "ETIENNE30", category: "Bureautique" },
      { id: "c5", name: "Louise Mercier", photoUrl: "/images/assets/avatar-4.png", salesCount: 735, promoCode: "LOUISE10", category: "Animalerie" },
      { id: "c6", name: "Victor Aubert", photoUrl: "/images/assets/avatar-9.png", salesCount: 704, promoCode: "VICTOR15", category: "Multimédia" },
      { id: "c7", name: "Juliette Girard", photoUrl: "/images/assets/avatar-5.png", salesCount: 687, promoCode: "JULIETTE20", category: "Décoration" }
    ]
  };
  
  export default AffiliateData;