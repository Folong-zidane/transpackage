'use client';
import { Package, PackagePlus, MapPin, PackageCheck, PackageOpen, CreditCard, CheckCircle, BarChart3, Bell, ShieldCheck, Search, Compass, FastForward, HandCoins, CloudLightning, MapPinHouse, Settings } from 'lucide-react'; // Ajout des icônes nécessaires
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      title: "Dépôt et/ou envoi de colis",
      description: "Enregistrez un colis à expédier via l'application",
      href: "/PickDropPoint/app/emit-package",
      icon: <PackagePlus className="h-8 w-8 text-white" />, // Lucide Icon
      color: "from-green-400 to-green-500"
    },
    {
      title: "Dashboard",
      description: "Consulter les statistique de mon point relais",
      href: "/point-de-relais-dashboard",
      icon: <Settings className="h-8 w-8 text-white" />, // Lucide Icon
      color: "from-green-400 to-green-500"
    },
    {
      title: "Reception de colis",
      description: "Confirmez la réception d'un colis",
      href: "/PickDropPoint/app/receive-package",
      icon: <PackageCheck className="h-8 w-8 text-white" />, // Lucide Icon
      color: "from-green-400 to-green-500"
    },
    {
      title: "Retrait de colis",
      description: "Enregistrez le retrait d'un colis",
      href: "/PickDropPoint/app/withdraw-package",
      icon: <PackageOpen className="h-8 w-8 text-white" />, // Lucide Icon
      color: "from-green-400 to-green-500"
    },
    {
      title: "Conflits et réclamations",
      description: "Voir mon gerant de point relais pour un souci",
      href: "/PickDropPoint/app/payment",
      icon: <CloudLightning className="h-8 w-8 text-white" />, // Lucide Icon
      color: "from-green-400 to-green-500"
    }
  ];

  const features = [
    { icon: <Search className="h-7 w-7 text-green-600 group-hover:text-green-700" />, title: "Traçabilité complète", desc: "Suivi en temps réel" },
    { icon: <Compass className="h-7 w-7 text-green-600 group-hover:text-green-700" />, title: "Réseau étendu", desc: "Points de livraison partout" },
    { icon: <ShieldCheck className="h-7 w-7 text-green-600 group-hover:text-green-700" />, title: "Paiements sécurisés", desc: "Transactions protégées" },
    { icon: <FastForward className="h-7 w-7 text-green-600 group-hover:text-green-700" />, title: "Interface rapide", desc: "Utilisation intuitive" },
    { icon: <Bell className="h-7 w-7 text-green-600 group-hover:text-green-700" />, title: "Notifications", desc: "Alertes automatiques" },
    { icon: <BarChart3 className="h-7 w-7 text-green-600 group-hover:text-green-700" />, title: "Rapports détaillés", desc: "Analyses complètes" }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Section de bienvenue */}
      <div className="relative overflow-hidden">
        {/* Formes décoratives (animations réduites) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-32 -left-40 w-96 h-96 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full opacity-20"></div>
          <div className="absolute top-20 left-1/3 w-32 h-32 bg-gradient-to-r from-lime-200 to-green-200 rounded-full opacity-30"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 sm:px-6"> {/* px et py réduits */}
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}> {/* translate-y réduit */}
            <div className="inline-block mb-4"> {/* mb réduit */}
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-800 via-green-600 to-emerald-700 bg-clip-text text-transparent">
                Pick & Drop Point
              </h1>
              <div className="h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full mt-2"></div> {/* animate-pulse enlevé */}
            </div>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed"> {/* mb réduit, max-w réduit */}
              Bienvenue dans votre système complet de gestion logistique
            </p>

            <div className="flex justify-center mb-0">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg"> {/* taille et animate-bounce enlevés */}
                  <MapPinHouse className='text-white h-12 w-12' /> {/* taille ajustée */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section des fonctionnalités */}
      <div className="container mx-auto px-4 sm:px-6 pb-16"> {/* px, pb réduits */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}> {/* translate-y réduit */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-3"> {/* taille et mb réduits */}
            Nos Services
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mb-8 rounded-full"></div> {/* w et mb réduits */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"> {/* gap et max-w réduits */}
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className={`group transform transition-all duration-300 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }} // délai de transition réduit
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full"> {/* rounded et shadow réduits */}
                  <div className="p-6"> {/* padding réduit */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-all duration-300 shadow-md`}> {/* rounded, mb, rotate, shadow réduits */}
                      {service.icon}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors"> {/* taille et mb réduits */}
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base"> {/* mb, taille de texte réduits */}
                      {service.description}
                    </p>
                    
                    <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 text-sm sm:text-base"> {/* taille de texte réduite */}
                      <span>Accéder</span>
                      <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* taille, ml, translate réduits */}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:translate-x-full transition-all duration-500"></div> {/* opacity réduite */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}