'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerProps {
  // Vous pouvez rendre ces props optionnelles avec des valeurs par défaut
  autoSlideInterval?: number; // intervalle en ms
  height?: string; // hauteur personnalisable
}

const Banner: React.FC<BannerProps> = ({ 
  autoSlideInterval = 5000, // 5 secondes par défaut
  height = "h-64 md:h-80 lg:h-96" // hauteur responsive par défaut
}) => {

  const banners = [
    {
      id: 1,
      imageUrl: "/images/ban5.jpg",
      title: "Collection Été 2025",
      description: "Découvrez nos nouvelles collections avec jusqu'à 30% de commission",
      buttonText: "Explorer",
      buttonLink: "/collections/ete",
      position: "left", // position du texte: 'left', 'center', ou 'right'
    },
    {
      id: 2,
      imageUrl: "/images/ban3.jpg",
      title: "Offres Spéciales",
      description: "Gamme exclusive avec commissions majorées jusqu'à 40%",
      buttonText: "Voir les offres",
      buttonLink: "/offres",
      position: "right",
    },
    {
      id: 3,
      imageUrl: "/images/ban2.jpg",
      title: "Mobilier Tendance",
      description: "Les pièces incontournables pour un intérieur moderne",
      buttonText: "Découvrir",
      buttonLink: "/tendances",
      position: "left",
    },
    {
      id: 4,
      imageUrl: "/images/ban1.jpg",
      title: "Nouveaux Arrivages",
      description: "Soyez le premier à promouvoir nos derniers produits",
      buttonText: "Explorer",
      buttonLink: "/nouveautes",
      position: "center",
    }
  ];

  // État pour gérer l'index de la bannière actuelle
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gérer le défilement automatique
  useEffect(() => {
    if (!isHovered) {
      // Démarrer le timer de défilement automatique
      autoSlideTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, autoSlideInterval);
    }

    // Nettoyer le timer quand le composant est démonté ou quand isHovered change
    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [isHovered, autoSlideInterval, banners.length]);

  // Passer à la slide suivante
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // Passer à la slide précédente
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  // Passer directement à une slide spécifique
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Obtenir la position du texte dans la bannière
  const getTextPosition = (position: string) => {
    switch (position) {
      case 'left':
        return 'justify-start text-left';
      case 'right':
        return 'justify-end text-right';
      case 'center':
      default:
        return 'justify-center text-center';
    }
  };

  return (
    <div 
      className={`relative w-full ${height} overflow-hidden rounded-lg shadow-md`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images de la bannière */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Remplacer le background-image avec le composant Image de Next.js */}
          <div className="relative w-full h-full">
            <Image 
              src={banners[currentIndex].imageUrl}
              alt={banners[currentIndex].title}
              fill
              sizes="100vw"
              priority
              className="object-cover object-center"
            />
          </div>
          
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          
          {/* Contenu de la bannière */}
          <div className={`absolute inset-0 flex flex-col items-center p-8 ${getTextPosition(banners[currentIndex].position)}`}>
            <div className="flex flex-col max-w-md">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-3xl md:text-4xl font-bold text-white mb-3"
              >
                {banners[currentIndex].title}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-white mb-6"
              >
                {banners[currentIndex].description}
              </motion.p>
              
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                href={banners[currentIndex].buttonLink}
                className="inline-block self-start bg-[#0033CC] hover:bg-[#0066CC] text-white font-medium px-6 py-2 rounded-full transition-colors"
              >
                {banners[currentIndex].buttonText}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flèches de navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition-colors z-10"
        aria-label="Bannière précédente"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition-colors z-10"
        aria-label="Bannière suivante"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicateurs de slide */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Aller à la bannière ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;