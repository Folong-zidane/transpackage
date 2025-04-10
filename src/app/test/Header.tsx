import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMapPin, FiStar, FiTrendingUp, FiGift, FiUsers, FiAward, FiZap, FiTag } from 'react-icons/fi';
import Link from 'next/link';
import { CircleUser, Edit, HelpCircle, HomeIcon, Hotel, Users } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Animation pour le focus de la barre de recherche
  const searchAnimation = {
    focused: { width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    unfocused: { width: '100%', boxShadow: 'none' }
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Bannière supérieure */}
      <div className="bg-[#100e34] text-white py-2 text-center text-sm">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Transformez votre passion en profits avec des offres exclusives et des commissions élevées : votre succès en affiliation commence ici. 💸✨
          <a href="#" className="ml-2 underline font-medium">En savoir plus →</a>
        </motion.p>
      </div>

      {/* Partie principale du header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <motion.div 
            className="text-2xl font-bold text-[#0033CC]"
            whileHover={{ scale: 1.05 }}
          >
            Trans<span className="text-[#0099CC]">Affil</span>
          </motion.div>

        {/* Barre de recherche */}
        <div className="w-300 md:w-2/5 relative">
          <motion.form 
            onSubmit={handleSearchSubmit}
            animate={isSearchFocused ? 'focused' : 'unfocused'}
            variants={searchAnimation}
            className="relative"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Que recherchez-vous ?"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full py-2 pl-10 pr-4 border rounded-full border-gray-300 focus:border-[#0066CC] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-opacity-50 transition-all duration-300 shadow-sm hover:shadow-md"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-500" size={18} />
              </div>
            </div>
          </motion.form>
        </div>

          {/* Actions utilisateur */}
          <div className="flex text-gray-800 items-center space-x-8">
          <Link href="/" className="flex items-center text-gray-700 hover:text-blue-600 transition">
              <HomeIcon size={18} className="mr-1" />
              <span>Accueil</span>
            </Link>
            <Link href="/all-affiliates" className="flex items-center text-gray-700 hover:text-blue-600 transition">
              <Users size={18} className="mr-1" />
              <span>Nos Affiliés</span>
            </Link>
            <Link href="/editors" className="flex items-center text-gray-700 hover:text-blue-600 transition">
              <Hotel size={18} className="mr-1" />
              <span>Nos Éditeurs</span>
            </Link>
            <Link href="/editors" className="flex items-center text-gray-700 hover:text-blue-600 transition">
              <CircleUser size={18} className="mr-1" />
              <span>Mon Compte</span>
            </Link>
            <Link href="/help" className="flex items-center text-gray-700 hover:text-blue-600 transition">
              <HelpCircle size={18} className="mr-1" />
              <span>Aide</span>
            </Link>
            <div className="flex font-bold items-center space-x-1 cursor-pointer hover:text-[#0066CC]">
              <FiShoppingCart size={20} />
              <span className="relative inline-flex">
                <span className="hidden md:inline text-sm">Panier</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des catégories */}
      <nav className="border-t border-gray-200">
        <div className="container text-gray-700 mx-auto px-4">
          <ul className="flex flex-wrap justify-center md:justify-start md:space-x-4 py-2 text-sm font-bold overflow-x-auto scrollbar-hide space-x-8">
            <li>
              <a href="#" className="px-3 py-2 hover:text-[#0066CC] hover:underline whitespace-nowrap transition-colors flex items-center">
                <FiStar className="mr-2 text-[#0066CC]" /> {/* Icône pour NOUVEAU! */}
                NOUVEAU!
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-2 hover:text-[#0066CC] hover:underline whitespace-nowrap transition-colors flex items-center">
                <FiTrendingUp className="mr-2 text-[#0066CC]" /> {/* Icône pour MEILLEURES VENTES */}
                MEILLEURES VENTES
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-2 hover:text-[#0066CC] hover:underline whitespace-nowrap transition-colors flex items-center">
                <FiGift className="mr-2 text-[#0066CC]" /> {/* Icône pour OFFRES SPÉCIALES */}
                OFFRES SPÉCIALES
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-2 hover:text-[#0066CC] hover:underline whitespace-nowrap transition-colors flex items-center">
                <FiUsers className="mr-2 text-[#0066CC]" /> {/* Icône pour PROGRAMME PARTENAIRE */}
                PROGRAMME PARTENAIRE
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-2 hover:text-[#0066CC] hover:underline whitespace-nowrap transition-colors flex items-center">
                <FiAward className="mr-2 text-[#0066CC]" /> {/* Icône pour HAUTES COMMISSIONS */}
                HAUTES COMMISSIONS
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-2 hover:text-[#0066CC] hover:underline whitespace-nowrap transition-colors flex items-center">
                <FiZap className="mr-2 text-[#0066CC]" /> {/* Icône pour VENTES FLASH */}
                VENTES FLASH
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-2 text-[#0033CC] font-bold whitespace-nowrap transition-colors flex items-center">
                <FiTag className="mr-2 text-[#0033CC]" /> {/* Icône pour PROMO */}
                PROMO
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;