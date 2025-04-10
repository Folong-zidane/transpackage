'use client';
import React from "react";
import { MapPin, Clock, CreditCard, Shield, Package, Phone } from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-12 h-12 text-emerald-600" />,
      title: "Réseau National",
      description: "Plus de 200 points relais stratégiquement situés dans tout le Cameroun, des grandes villes aux zones rurales."
    },
    {
      icon: <Clock className="w-12 h-12 text-emerald-600" />,
      title: "Livraison Express",
      description: "Livraison en 24h dans les grandes villes et 72h maximum partout ailleurs au Cameroun."
    },
    {
      icon: <CreditCard className="w-12 h-12 text-emerald-600" />,
      title: "Tarifs Transparents",
      description: "Prix calculés en fonction du poids et de la distance, sans frais cachés ni surprises."
    },
    {
      icon: <Shield className="w-12 h-12 text-emerald-600" />,
      title: "Sécurité Maximale",
      description: "Tous vos colis sont assurés et manipulés avec le plus grand soin par notre équipe professionnelle."
    },
    {
      icon: <Package className="w-12 h-12 text-emerald-600" />,
      title: "Suivi en Temps Réel",
      description: "Suivez votre colis à chaque étape de son parcours grâce à notre système de notification SMS et application mobile."
    },
    {
      icon: <Phone className="w-12 h-12 text-emerald-600" />,
      title: "Support Dédié",
      description: "Notre équipe de support client est disponible 7j/7 pour répondre à toutes vos questions et résoudre vos problèmes."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
        >
          <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;