'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";

const bannerData = [
  {
    imageUrl: "/images/im6.avif",
    title: "Envoyez vos colis partout au Cameroun 🚚",
    description: "Service rapide et sécurisé avec suivi en temps réel"
  },
  {
    imageUrl: "/images/im2.avif",
    title: "Plus de 200 points relais à travers le pays 🏪",
    description: "Trouvez facilement un point relais près de chez vous"
  },
  {
    imageUrl: "/images/im3.jpg",
    title: "Tarifs compétitifs et transparents 💰",
    description: "Sans frais cachés, payez uniquement ce que vous voyez"
  },
  {
    imageUrl: "/images/im4.webp",
    title: "Livraison express en 24h dans les grandes villes 🕒",
    description: "Yaoundé, Douala, Bafoussam, Garoua et plus encore"
  },
  {
    imageUrl: "/images/im5.jpg",
    title: "Service client disponible 7j/7 ✨",
    description: "Nous sommes là pour vous aider à chaque étape"
  }
];

const Banniere: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {bannerData.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative h-full w-full">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center text-white w-full max-w-4xl px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
              {slide.title}
            </h2>
            <p className="text-xl md:text-2xl animate-slideUp">
              {slide.description}
            </p>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banniere;