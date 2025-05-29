import React from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiUser, FiBell, FiSettings, FiLogOut, FiArrowLeft, FiChevronDown } from 'react-icons/fi';

const SuperAdminHeader = ({ onBackToHome }) => {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-teal-50 backdrop-blur-xl border-b border-gray-100 shadow-lg shadow-gray-100/50"
    >
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Section gauche - Bouton retour et informations */}
          <div className="flex items-center space-x-6">
            {/* Bouton retour à l'accueil */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBackToHome}
              className="group flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-emerald-50 px-5 py-3 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-green-200 shadow-sm hover:shadow-md"
            >
              <div className="p-1 bg-white rounded-lg group-hover:bg-green-50 transition-colors duration-300">
                <FiArrowLeft className="text-lg text-gray-600 group-hover:text-green-600" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-green-700">Retour à l'accueil</span>
            </motion.button>

            {/* Informations de bienvenue */}
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
                Bienvenue, Super Admin ✨
              </h1>
              <p className="text-gray-500 font-medium">
                {currentDate} • {currentTime}
              </p>
            </div>
          </div>

          {/* Section droite - Actions et profil */}
          <div className="flex items-center space-x-4">
            {/* Séparateur moderne */}
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* Profil utilisateur */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="font-bold text-gray-800 text-sm">Administrateur Système</p>
                <p className="text-gray-500 text-xs font-medium">superadmin@pickdrop.com</p>
              </div>
              
              {/* Avatar avec design moderne */}
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-12 w-12 bg-gradient-to-br from-green-800 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 border-2 border-white"
                >
                  <FiUser className="text-lg text-white" />
                </motion.div>
                {/* Indicateur en ligne moderne */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 h-4 w-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Version mobile du titre */}
        <div className="lg:hidden mt-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Bienvenue, Super Admin ✨
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Tableau de bord administrateur
          </p>
        </div>
      </div>

      {/* Barre de statut système moderne */}
      <div className="bg-teal-100 backdrop-blur-sm px-8 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="h-3 w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-sm"></div>
                <div className="absolute inset-0 h-3 w-3 bg-green-400 rounded-full animate-ping opacity-30"></div>
              </div>
              <span className="text-gray-700 font-semibold">Système opérationnel</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-2"
            >
              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-600 font-medium">237 points relais actifs</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-2"
            >
              <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-600 font-medium">42 franchises connectées</span>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 font-medium flex items-center space-x-2"
          >
            <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span>Dernière synchronisation: il y a 2 min</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuperAdminHeader;