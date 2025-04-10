'use client';
import React, { useState, useEffect } from "react";
import { Package, MapPin, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <Package className="w-16 h-16 text-emerald-600" />,
    title: "Achetez votre colis sur la marketplace",
    description: "Choisissez soigneusement votre colis et l'ajouter au panier du site Web. Créez votre achat en ligne ou via notre application mobile.",
    animation: "fade-right"
  },
  {
    icon: <MapPin className="w-16 h-16 text-emerald-600" />,
    title: "Choisissez le meilleur point relais",
    description: "Rendez-vous au sur la carte pour trouver point relais le plus proche de chez vous. Nos agents se chargeront de vérifier, peser et enregistrer votre colis.",
    animation: "fade-up"
  },
  {
    icon: <Truck className="w-16 h-16 text-emerald-600" />,
    title: "Numéro d'identification de colis",
    description: "Suivez votre colis et receptionner le en bon et du forme grâce à notre système de notification par mail et notre application. Vous êtes informé en temps réel.",
    animation: "fade-up"
  },
  {
    icon: <CheckCircle className="w-16 h-16 text-emerald-600" />,
    title: "Livraison au destinataire",
    description: "Votre destinataire est notifié de l'arrivée du colis et peut le récupérer au point relais le plus proche que vous avez choisi.",
    animation: "fade-left"
  }
];

const Manual: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center text-center transition-all duration-500 ${
              index === activeStep ? "scale-110" : "opacity-70"
            }`}
            onClick={() => setActiveStep(index)}
          >
            <div className="bg-white rounded-full p-4 shadow-lg mb-4 border-2 border-emerald-100">
              {step.icon}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-3 flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile dots indicator */}
      <div className="flex md:hidden justify-center mt-6 space-x-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeStep ? "bg-emerald-600" : "bg-gray-300"
            }`}
            aria-label={`Voir l'étape ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Manual;