'use client';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Banner from './Banner';
import ProductGrid from './ProductGrid';
import FilterSortSection from './FilterSortSection';
import { motion } from 'framer-motion';
import CategorySidebar from './CategoryNavigation';
import { Product } from './types';
import ProductData from './ProductData';
import AffiliateSidebar from './AffiliateSidebar';
import AffiliateData from './AffiliateData';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import AffiliateFeed from './Newsfeed';
import affiliatePosts from './PostsData';
import Navbar from '@/components/home/Navbar';


// Types pour les filtres
export interface Filters {
  category: string[];
  inStock: boolean;
  minCommission: number;
  maxCommission: number;
  deliveryTime: string[];
}

const MarketplacePage: React.FC = () => {
  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  
  // État pour les filtres
  const [filters, setFilters] = useState<Filters>({
    category: [],
    inStock: false,
    minCommission: 0,
    maxCommission: 100,
    deliveryTime: [],
  });

  // État pour le carrousel
  const [currentSlide, setCurrentSlide] = useState(0);
  
// Images du carrousel avec données enrichies pour la nouvelle bannière animée
const bannerImages = [
  {
    url: "/images/banner-1.jpg",
    title: "Offres spéciales de la semaine",
    subtitle: "Jusqu'à 50% de réduction sur les articles sélectionnés. Profitez-en dès maintenant pour réaliser des ventes exceptionnelles.",
    buttonText: "Découvrir",
    buttonLink: "#promo",
    color: "from-blue-900/80 via-blue-800/60",  // Couleur du gradient pour cette slide
    icon: "TagIcon",                            // Icône associée à cette slide
    badge: "Promo"                              // Badge optionnel à afficher
  },
  {
    url: "/images/banner-2.jpg",
    title: "Nouveautés en exclusivité",
    subtitle: "Découvrez nos dernières arrivées et soyez le premier à les proposer à vos clients. Innovation et tendances garanties.",
    buttonText: "Voir la collection",
    buttonLink: "#collection",
    color: "from-indigo-900/80 via-indigo-800/60",
    icon: "SparklesIcon",
    badge: "Nouveau"
  },
  {
    url: "/images/ban8.jpg",
    title: "Meilleures commissions",
    subtitle: "Gagnez plus avec nos produits premium. Nos taux de commission exclusifs vous permettent de maximiser vos revenus.",
    buttonText: "En savoir plus",
    buttonLink: "#commissions",
    color: "from-emerald-900/80 via-emerald-800/60",
    icon: "TrendingUpIcon",
    badge: "Premium"
  },
  {
    url: "/images/ban6.jpg",
    title: "Programme d'affiliation VIP",
    subtitle: "Rejoignez notre programme privilégié et bénéficiez d'avantages exclusifs. Formation avancée et support dédié inclus.",
    buttonText: "S'inscrire",
    buttonLink: "#vip",
    color: "from-purple-900/80 via-purple-800/60",
    icon: "CrownIcon",
    badge: "VIP"
  }
];

  // Effet pour le défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
    }, 5000); // Change d'image toutes les 5 secondes
    
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Navigation manuelle
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerImages.length);
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + bannerImages.length) % bannerImages.length);
  };

  const categories = [
    'Dining Tables',
    'Dining Chairs',
    'Bar & Counter Stools',
    'Dining Storage',
    'Rugs',
    'Dining Sets'
  ];
  
  const maxPrice = 2000;

  // État pour le tri
  const [sortBy, setSortBy] = useState('relevance');

  // Gestion de la recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Gestion des filtres
  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters({...filters, ...newFilters});
  };

  // Gestion du tri
  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  // Filtrage des produits
  const filteredProducts = ProductData.filter(product => {
    // Filtrage par recherche
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filtrage par catégorie
    if (filters.category.length > 0 && !filters.category.includes(product.category)) {
      return false;
    }
    
    // Filtrage par stock
    if (filters.inStock && !product.inStock) {
      return false;
    }
    
    // Filtrage par commission
    if (product.commission < filters.minCommission || product.commission > filters.maxCommission) {
      return false;
    }
    
    // Filtrage par délai de livraison
    if (filters.deliveryTime.length > 0 && product.deliveryTime && !filters.deliveryTime.includes(product.deliveryTime)) {
      return false;
    }
    
    return true;
  });

  // Tri des produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'commission':
        return b.commission - a.commission;
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      default:
        return 0; // Par défaut, ne change pas l'ordre (pertinence)
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Header onSearch={handleSearch} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
      {/* Bannière à défilement automatique avec animations améliorées */}
<div className="relative mt-0 w-full h-96 overflow-hidden shadow-lg mb-6 rounded-lg">
  {/* Images */}
  {bannerImages.map((image, index) => (
    <div 
      key={index}
      className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
        index === currentSlide 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-110'
      }`}
      style={{
        backgroundImage: `url(${image.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay gradient amélioré avec animation */}
      <div className="absolute inset-0 bg-transparent"></div>
      
      {/* Contenu texte avec animations d'entrée */}
      <div 
        className={`absolute inset-0 flex flex-col justify-center px-12 md:w-1/2 transition-all duration-1000 ${
          index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <h2 
            className={`text-blue-800 text-3xl md:text-4xl font-bold mb-3 transition-transform duration-1000 ${
              index === currentSlide ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {image.title}
          </h2>
        </div>
        
        <div className="overflow-hidden">
          <p 
            className={`text-white/90 text-sm md:text-black mb-6 max-w-md transition-transform duration-1000 delay-100 ${
              index === currentSlide ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {image.subtitle}
          </p>
        </div>
        
        <button 
          className={`bg-[#0033CC] hover:bg-[#0066CC] text-white py-3 px-8 rounded-full w-max text-sm font-medium transition-all duration-300 hover:shadow-lg hover:translate-y-1 hover:scale-105 ${
            index === currentSlide 
              ? 'opacity-100 translate-y-0 delay-200' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          {image.buttonText}
        </button>
      </div>
    </div>
  ))}
  
  {/* Indicateurs améliorés */}
  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 backdrop-blur-sm bg-black/10 py-2 px-4 rounded-full">
    {bannerImages.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          index === currentSlide 
            ? 'bg-white w-6' 
            : 'bg-white/40 hover:bg-white/60'
        }`}
        aria-label={`Aller à la diapositive ${index + 1}`}
      />
    ))}
  </div>
  
  {/* Ajout d'un élément décoratif */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
</div>
      </motion.div>
      
      <main className="container mx-auto px-4 py-6">
        {/* Section de filtres sur toute la largeur */}
        <div className="w-full mb-6">
          <FilterSortSection
            categories={categories}
            priceRange={[0, maxPrice]} 
            maxPrice={maxPrice}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            totalProducts={filteredProducts.length}
          />
        </div>
        
        {/* Container flex pour les trois sections */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar gauche */}
          <div className="md:flex-shrink-0">
            <CategorySidebar />
          </div>
          
          {/* Grille de produits au centre */}
          <div className="flex-grow">
            <ProductGrid 
              products={sortedProducts} 
              filters={filters} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplacePage;