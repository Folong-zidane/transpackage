'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation'; // Import pour détecter la route actuelle
import { 
  Calculator, 
  Package, 
  User, 
  Building2, 
  Code2, 
  DollarSign, 
  MapPin, 
  Settings,
  Menu, 
  X,
  Home,
  HandCoins,
  MapPinHouse
} from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname(); // Détecte automatiquement la route actuelle

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/envoyer', label: 'Envoyer un colis', icon: Package },
    { href: '/point-de-relais', label: 'API', icon: Code2 },
    { href: '/achat', label: 'Tarifs', icon: HandCoins },
    { href: '/PickDropPoint/app', label: ' Mon Point Relais', icon: MapPinHouse },
    { href: '/admin-dashboard', label: 'Paramètres', icon: Settings },
  ];

  // Fonction pour vérifier si un onglet est actif
  const isActiveTab = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-white/98 backdrop-blur-sm py-4'} border-b border-emerald-50`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-1">
                <Image
                  src="/images/im12.avif"
                  alt="Pick&Drop Logo"
                  width={48}
                  height={48}
                  className="transition-transform duration-500 group-hover:scale-110 rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">Pick&Drop</span>
                <p className="text-xs text-emerald-600/70 -mt-1 font-medium">Solutions de Livraison</p>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveTab(item.href);
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center px-6 py-3.5 transition-all duration-300 font-semibold text-base group relative transform hover:scale-105 ${
                    isActive 
                      ? 'bg-transparent text-teal-800 shadow-lg border-b-4 border-green-500 ' 
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 transition-all duration-300 ${
                    isActive 
                      ? 'text-teal-800 drop-shadow-sm' 
                      : 'text-gray-500 group-hover:text-emerald-600'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-white/30 rounded-full"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl animate-pulse"></div>
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Large screens navigation (lg to xl) */}
          <nav className="hidden lg:flex xl:hidden items-center space-x-1">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = isActiveTab(item.href);
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-white to-teal-50 text-teal-800 shadow-md border-b border-green-500 border-4' 
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 mr-2 transition-all duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-500 group-hover:text-emerald-600'
                  }`} />
                  <span className="hidden xl:inline">{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-white/50 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* User Account Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Link 
                href="/client-dashboard" 
                className={`flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-300 group relative transform hover:scale-105 ${
                  isActiveTab('/client-dashboard')
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-200'
                    : 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col">
                  <p className={`text-sm font-semibold transition-colors ${
                    isActiveTab('/client-dashboard') 
                      ? 'text-white' 
                      : 'text-gray-700 group-hover:text-emerald-700'
                  }`}>Mon Compte</p>
                  <p className={`text-xs -mt-0.5 transition-colors ${
                    isActiveTab('/client-dashboard')
                      ? 'text-white/80'
                      : 'text-emerald-600/70'
                  }`}>Gestion</p>
                </div>
                <div className="relative transition-transform duration-300 group-hover:scale-105">
                  <Image 
                    src="/images/assets/avatar.png" 
                    alt="Profile" 
                    width={36} 
                    height={36} 
                    className={`rounded-full ring-2 transition-all ${
                      isActiveTab('/client-dashboard')
                        ? 'ring-white/50'
                        : 'ring-emerald-100 group-hover:ring-emerald-300'
                    }`} 
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                </div>
                {isActiveTab('/client-dashboard') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl animate-pulse"></div>
                )}
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button 
              className="p-3 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-emerald-100 shadow-lg animate-slideDown">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveTab(item.href);
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center py-4 px-5 rounded-xl transition-all duration-300 font-semibold text-base relative transform hover:scale-105 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50'
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon className={`h-6 w-6 mr-4 transition-colors ${
                    isActive 
                      ? 'text-white drop-shadow-sm' 
                      : 'text-gray-500'
                  }`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-12 bg-white/50 rounded-r-full"></div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      </div>
                    </>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-emerald-100 mt-4">
              <Link 
                href="/client-dashboard" 
                className={`flex items-center py-4 px-5 rounded-xl transition-all duration-300 font-semibold text-base relative transform hover:scale-105 ${
                  isActiveTab('/client-dashboard') 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50'
                }`}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                <Settings className={`h-6 w-6 mr-4 transition-colors ${
                  isActiveTab('/client-dashboard') 
                    ? 'text-white drop-shadow-sm' 
                    : 'text-gray-500'
                }`} />
                <span>Mon Compte</span>
                {isActiveTab('/client-dashboard') && (
                  <>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-12 bg-white/50 rounded-r-full"></div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    </div>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { 
            max-height: 0; 
            opacity: 0; 
            transform: translateY(-10px);
          }
          to { 
            max-height: 600px; 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Navbar;