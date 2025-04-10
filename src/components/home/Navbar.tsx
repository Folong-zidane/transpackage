'use client';
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, Package, MapPin, HelpCircle, UserPlus, LogIn, Search, Menu, X, CirclePower, Building, HandCoins, Circle, CircleUser } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/im12.avif"
                alt="CamerExpress Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-xl font-bold text-emerald-600">CamerXpress</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/test" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <CirclePower className="mr-1 h-5 w-5" />
              <span>Simulation</span>
            </Link>
            <Link href="/point-de-relais" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <MapPin className="mr-1 h-5 w-5" />
              <span>API</span>
            </Link>
            <Link href="/achat" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <HandCoins className="mr-1 h-5 w-5" />
              <span>Tarifs</span>
            </Link>
            <Link href="/client-dashboard" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <CircleUser className="mr-1 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/entreprise-dashboard" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <Building className="mr-1 h-5 w-5" />
              <span>For business</span>
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/signup" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <UserPlus className="mr-1 h-5 w-5" />
              <span>S'inscrire</span>
            </Link>
            <Link
              href="/signin"
              className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors"
            >
              <LogIn className="mr-1 h-5 w-5" />
              <span>Se connecter</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="hidden md:block">
                <Link href='/admin-dashboard'>
                <p className="text-sm font-medium text-gray-700">Admin Système</p>
                </Link>
              </div>
              <Image 
                src="/images/assets/avatar.png" 
                alt="Admin" 
                width={40} 
                height={40} 
                className="rounded-full border-2 border-green-200" 
              />
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              className="text-gray-700 hover:text-emerald-600"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="px-4 space-y-3">
          <Link href="/test" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <CirclePower className="mr-1 h-5 w-5" />
              <span>Simulation</span>
            </Link>
            <Link href="/point-de-relais" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <MapPin className="mr-1 h-5 w-5" />
              <span>API</span>
            </Link>
            <Link href="/achat" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <HandCoins className="mr-1 h-5 w-5" />
              <span>Tarifs</span>
            </Link>
            <Link href="/client-dashboard" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <CircleUser className="mr-1 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/entreprise-dashboard" className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors">
              <Building className="mr-1 h-5 w-5" />
              <span>For business</span>
            </Link>
            <Link
              href="/signin"
              className="flex items-center py-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              <LogIn className="mr-2 h-5 w-5" />
              <span>Se connecter</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;