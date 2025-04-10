import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiShoppingBag, 
  FiTruck, 
  FiShoppingCart, 
  FiHeart, 
  FiCoffee, 
  FiAward, 
  FiMonitor 
} from 'react-icons/fi';
import { Camera, Coffee, Diamond, Droplets, House, Pizza, Shirt, ShoppingBasket, Truck } from 'lucide-react';

const CategorySidebar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Catégories de secteurs d'activité avec icônes et détails
  const categories = [
    {
      id: 1,
      name: "Immobilier",
      icon: <House />,
      discount: "Jusqu'à 30% de réduction",
      commission: 8.5,
      items: 128
    },
    {
      id: 2,
      name: "Vêtements",
      icon: <Shirt />,
      discount: "Jusqu'à 20% de réduction",
      commission: 7.2,
      items: 234
    },
    {
      id: 3,
      name: "Transport",
      icon: <Truck />,
      discount: "Jusqu'à 15% de réduction",
      commission: 6.8,
      items: 65
    },
    {
      id: 4,
      name: "Agroalimentaire",
      icon: <Pizza />,
      discount: "Jusqu'à 25% de réduction",
      commission: 9.5,
      items: 176
    },
    {
      id: 5,
      name: "Hygiène & Beauté",
      icon: <Droplets />,
      discount: "Jusqu'à 40% de réduction",
      commission: 11.2,
      items: 192
    },
    {
      id: 6,
      name: "Restauration",
      icon: <Coffee />,
      discount: "Jusqu'à 20% de réduction",
      commission: 8.0,
      items: 87
    },
    {
      id: 7,
      name: "Luxe",
      icon: <Diamond />,
      discount: "Jusqu'à 10% de réduction",
      commission: 15.5,
      items: 42
    },
    {
      id: 8,
      name: "Électronique",
      icon: <Camera />,
      discount: "Jusqu'à 35% de réduction",
      commission: 7.8,
      items: 153
    }
  ];

  // Animation pour les catégories au survol
  const categoryVariants = {
    initial: { 
      backgroundColor: "rgba(255, 255, 255, 1)",
      x: 0,
    },
    hover: {
      backgroundColor: "rgba(240, 249, 255, 1)",
      x: 3,
      transition: { duration: 0.2 }
    },
    active: {
      backgroundColor: "rgba(230, 244, 255, 1)",
      x: 3,
      borderLeftColor: "#0066CC",
      borderLeftWidth: "3px",
    }
  };

  return (
    <div className="h-screen bg-white w-auto min-w-64 shadow-md flex flex-col rounded-md border-r border-gray-100">
      {/* En-tête de la sidebar */}
      <div className="p-3 rounded-md bg-gradient-to-r from-[#0033CC] to-[#0099CC] border-b border-gray-100">
        <h2 className="text-lg font-bold text-white flex items-center">
          <span className=" text-white font-bold p-1.5 rounded mr-2 text-sm">
            <ShoppingBasket />
          </span>
          Catégories
        </h2>
        <p className="text-xs text-gray-200 mt-0.5">Explorez nos {categories.length} secteurs d'activité...</p>
      </div>
      
      {/* Liste des catégories */}
      <div className="flex-1 overflow-y-auto py-1">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className={`px-3 py-2 mb-0.5 mx-1 rounded-md cursor-pointer relative overflow-hidden border-l-0`}
            variants={categoryVariants}
            initial="initial"
            whileHover="hover"
            animate={activeCategory === category.id ? "active" : "initial"}
            onClick={() => setActiveCategory(category.id)}
          >
            <div className="flex items-center">
              <div className="text-[#0066CC] text-lg mr-2">
                {category.icon}
              </div>
              <div>
                <h3 className="font-medium text-md text-gray-800">{category.name}</h3>
                <div className="flex text-xs text-gray-500 items-center mt-0.5 gap-2"> 
                Au moins
                  <span className="text-xs text-yellow-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-full">
                   {category.commission}%
                  </span>
                  de réduction.
                </div>
              </div>
            </div>
            
            {/* Indicateur de catégorie active */}
            {activeCategory === category.id && (
              <motion.div 
                className="absolute right-1 w-1 h-full rounded-full bg-[#0066CC]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Pied de la sidebar - Info simplifiée sans bouton */}
      <div className="p-3 border-t border-gray-100">
        <div className="bg-gradient-to-r from-[#0033CC] to-[#0099CC] rounded-md p-2 text-white">
          <h3 className="font-bold text-sm">Offres spéciales</h3>
          <p className="text-xs mt-0.5 text-blue-100">Commissions majorées ce mois-ci</p>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;