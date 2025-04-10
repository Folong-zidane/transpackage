'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Users, Gift, Percent, ChevronDown, Mail, DollarSign, X, UsersRound, PhoneCall, UserPlus } from 'lucide-react';
import { Affiliate } from './AffiliateData';

interface AffiliateSidebarProps {
  topSellers: Affiliate[];
  risingStars: Affiliate[];
  featuredAffiliates: Affiliate[];
}

const AffiliateSidebar: React.FC<AffiliateSidebarProps> = ({ topSellers, risingStars, featuredAffiliates }) => {
  // États pour le nombre d'affiliés visibles dans chaque section
  const [visibleTopSellers, setVisibleTopSellers] = useState(3);
  const [visibleRisingStars, setVisibleRisingStars] = useState(3);
  const [visibleFeatured, setVisibleFeatured] = useState(3);
  
  // État pour le menu contextuel
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    affiliateId: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    affiliateId: ''
  });
  
  // Référence pour fermer le menu en cas de clic en dehors
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Fonctions pour afficher plus d'affiliés
  const showMoreTopSellers = () => {
    setVisibleTopSellers(prev => Math.min(prev + 3, topSellers.length));
  };
  
  const showMoreRisingStars = () => {
    setVisibleRisingStars(prev => Math.min(prev + 3, risingStars.length));
  };
  
  const showMoreFeatured = () => {
    setVisibleFeatured(prev => Math.min(prev + 3, featuredAffiliates.length));
  };
  
  // Gestionnaire pour l'ouverture du menu contextuel
  const handleContextMenu = (e: React.MouseEvent, affiliateId: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      affiliateId
    });
  };
  
  // Fermer le menu contextuel
  const closeContextMenu = () => {
    setContextMenu({...contextMenu, visible: false});
  };
  
  // Actions du menu contextuel
  const handleContact = (affiliateId: string) => {
    console.log(`Contacter l'affilié avec l'ID: ${affiliateId}`);
    closeContextMenu();
  };
  
  const handleCommission = (affiliateId: string) => {
    console.log(`Commissionner l'affilié avec l'ID: ${affiliateId}`);
    closeContextMenu();
  };
  
  // Effet pour fermer le menu lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };
    
    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.visible]);

  // Fonction pour rendre une section d'affiliés
  const renderAffiliateSection = (title: string, icon: React.ReactNode, affiliates: Affiliate[], visibleCount: number, showMoreFn: () => void, gradientFrom: string, gradientTo: string) => {
    const hasMore = visibleCount < affiliates.length;
    
    return (
      <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header avec image de fond */}
        <div className={`relative h-24 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
          <div className="absolute bottom-0 left-0 p-4 flex items-center text-white">
            <div className="mr-2 bg-white rounded-full p-2 text-blue-600">{icon}</div>
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
        </div>
        
        {/* Liste des affiliés */}
        <div className="grid grid-cols-1 gap-2 p-3">
          {affiliates.slice(0, visibleCount).map((affiliate) => (
            <motion.div
              key={affiliate.id}
              className="flex flex-col items-center bg-gray-50 rounded-lg p-3 border border-gray-100"
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
              onContextMenu={(e) => handleContextMenu(e, affiliate.id)}
            >
              <div className="flex w-full items-center mb-2">
                {/* Photo de l'affilié */}
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-400">
                  {affiliate.photoUrl ? (
                    <img
                      src={affiliate.photoUrl}
                      alt={affiliate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <Users size={24} />
                    </div>
                  )}
                </div>
                
                {/* Info affilié */}
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-bold text-gray-800">{affiliate.name}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-600">{affiliate.category}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Award size={12} className="text-blue-500 mr-1" />
                    <span className="text-xs font-medium">{affiliate.salesCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ventes</span>
                  </div>
                </div>
              </div>
              
              {/* Code promo */}
              <motion.div 
                className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg text-center relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05, 
                  rotate: [0, -1, 1, -1, 0],
                  transition: { repeat: Infinity, repeatType: "mirror", duration: 1 }
                }}
              >
                <div className="absolute -right-6 -top-6 w-12 h-12 bg-yellow-400 rounded-full opacity-30"></div>
                <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-yellow-400 rounded-full opacity-30"></div>
                <Percent size={12} className="inline-block mr-1 text-yellow-600" />
                <span className="text-xs font-bold text-yellow-800">Page : {affiliate.promoCode}</span>
              </motion.div>
            </motion.div>
          ))}
          
          {/* Bouton "Voir plus" */}
          {hasMore && (
            <motion.button
              onClick={showMoreFn}
              className="w-full mt-2 py-2 flex items-center justify-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">Voir plus</span>
              <ChevronDown size={16} className="ml-1" />
            </motion.button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-72 bg-gray-50 p-4 border-l border-gray-100 shrink-0">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        Nos Meilleurs Affiliés
      </h2>
      
      {renderAffiliateSection(
        "Top Vendeurs", 
        <Award size={18} />, 
        topSellers, 
        visibleTopSellers, 
        showMoreTopSellers,
        "blue-500",
        "blue-700"
      )}
      
      {renderAffiliateSection(
        "Étoiles Montantes", 
        <TrendingUp size={18} />, 
        risingStars, 
        visibleRisingStars, 
        showMoreRisingStars,
        "blue-500",
        "blue-700"
      )}
      
      {renderAffiliateSection(
        "Affiliés à Suivre", 
        <Gift size={18} />, 
        featuredAffiliates, 
        visibleFeatured, 
        showMoreFeatured,
        "blue-500",
        "blue-700"
      )}
      
      {/* Menu contextuel */}
      {contextMenu.visible && (
        <div 
          ref={contextMenuRef}
          className="fixed bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-50"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            width: '180px'
          }}
        >
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-600">Link</span>
            <button 
              onClick={closeContextMenu} 
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
          
          <div className="p-1">
            <button 
              onClick={() => handleContact(contextMenu.affiliateId)}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors duration-150"
            >
              <PhoneCall size={16} className="mr-2 text-blue-500" />
              <span>Contacter</span>
            </button>
            
            <button 
              onClick={() => handleCommission(contextMenu.affiliateId)}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors duration-150"
            >
              <UserPlus size={16} className="mr-2 text-green-500" />
              <span>Commissionner</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateSidebar;