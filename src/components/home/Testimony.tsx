'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Jean Mbarga",
    role: "Entrepreneur, Yaoundé",
    image: "/images/assets/avatar-9.png",
    content: "CamerExpress a révolutionné ma façon de gérer les expéditions pour ma boutique en ligne. Le suivi en temps réel et la facilité de dépôt ont considérablement simplifié mes opérations.",
    rating: 5
  },
  {
    name: "Aminatou Sow",
    role: "Étudiante, Douala",
    image: "/images/assets/avatar.png",
    content: "J'ai utilisé CamerExpress pour envoyer des documents importants à ma famille à Bamenda. Le colis est arrivé plus rapidement que prévu et en parfait état. Service impeccable !",
    rating: 5
  },
  {
    name: "BioMarket SARL",
    role: "Entreprise agroalimentaire",
    image: "/testimonial3.jpg",
    content: "En tant que fournisseur de produits frais, la fiabilité et la rapidité sont essentielles. CamerExpress nous a aidés à étendre notre portée à travers le pays avec un service constant.",
    rating: 4
  },
  {
    name: "Sophie Ekambi",
    role: "Graphiste freelance, Bafoussam",
    image: "/images/assets/avatar-6.png",
    content: "Je travaille avec des clients dans tout le pays et l'envoi de supports imprimés est crucial. CamerExpress offre un excellent rapport qualité-prix et une livraison fiable à chaque fois.",
    rating: 5
  },
  {
    name: "Cameroon Textiles Ltd",
    role: "Entreprise de textile",
    image: "/testimonial5.jpg",
    content: "Nous expédions des centaines de colis chaque semaine. Le système de gestion en ligne de CamerExpress a considérablement optimisé notre logistique et réduit nos coûts d'expédition.",
    rating: 5
  },
  {
    name: "Paul Ndjomo",
    role: "Pharmacien, Garoua",
    image: "/images/assets/avatar-2.png",
    content: "La livraison de médicaments nécessite ponctualité et soin. CamerExpress a toujours été à la hauteur de nos attentes, même pour les livraisons dans les zones reculées.",
    rating: 4
  }
];

const Testimony: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const testimonialsPerView = isSmallScreen ? 1 : 3;
  const maxIndex = testimonials.length - testimonialsPerView;
  
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };
  
  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + testimonialsPerView
  );
  
  return (
    <div className="relative">
      {/* Navigation buttons */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className={`p-2 rounded-full bg-emerald-600 text-white ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-700"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      
      <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10">
        <button 
          onClick={handleNext} 
          disabled={currentIndex === maxIndex}
          className={`p-2 rounded-full bg-emerald-600 text-white ${
            currentIndex === maxIndex ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-700"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex space-x-6 overflow-hidden py-6">
        {visibleTestimonials.map((testimonial, index) => (
          <div 
            key={index + currentIndex} 
            className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col"
          >
            <div className="flex items-center mb-4">
              <div className="relative w-16 h-16 mr-4 overflow-hidden rounded-full">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
                <div className="flex mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700 flex-grow">"{testimonial.content}"</p>
          </div>
        ))}
      </div>
      
      {/* Pagination indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-emerald-600" : "bg-gray-300"
            }`}
            aria-label={`Aller au témoignage ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimony;