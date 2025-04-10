'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and about */}
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/images/im12.avif"
                alt="CamerExpress Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-xl font-bold text-emerald-400">CamerExpress</span>
            </div>
            <p className="text-gray-400 mb-4">
              Premier réseau de points relais pour l'envoi et le suivi de colis au Cameroun. 
              Simplicité, rapidité et fiabilité pour tous vos envois.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/envoyer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Envoyer un colis
                </Link>
              </li>
              <li>
                <Link href="/suivre" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Suivre un colis
                </Link>
              </li>
              <li>
                <Link href="/points-relais" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Trouver un point relais
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Nos tarifs
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Avenue de l'Indépendance, Yaoundé, Cameroun
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">+237 6XX XXX XXX</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">contact@camerexpress.cm</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Recevez nos actualités et offres spéciales directement dans votre boîte mail.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CamerExpress. Tous droits réservés.
          </p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <Link href="/conditions" className="hover:text-emerald-400 transition-colors">
              Conditions d'utilisation
            </Link>
            <Link href="/confidentialite" className="hover:text-emerald-400 transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/cookies" className="hover:text-emerald-400 transition-colors">
              Gestion des cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;