'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Shield, LogIn, Mail, KeyRound, Home, Users, BarChart3, Settings, Package } from 'lucide-react'; // Ajout de Package
import Link from 'next/link';

const SuperAdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === 'superadmin@pickdrop.com' && password === 'supersecret') {
      // Rediriger vers le dashboard admin (assurez-vous que le chemin est correct)
      window.location.href = '/admin-dashboard/dashboard';
    } else {
      setError('Identifiants invalides. Veuillez réessayer.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Éléments décoratifs de fond - Thème vert */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
      
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-0 items-stretch bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-green-100/50 relative z-10">
        
        {/* Section gauche - Illustration et informations - Thème vert */}
        <div className="hidden lg:flex flex-col justify-center items-center space-y-8 p-10 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 text-white relative overflow-hidden">
          {/* Motifs décoratifs */}
          <div className="absolute inset-0 opacity-5">
            {/* Vous pouvez utiliser des SVG ou des images pour des motifs plus complexes */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="greenGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(45, 212, 191, 0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#greenGrid)" />
            </svg>
          </div>
          
          <Link href="/" legacyBehavior>
            <a className="flex flex-col items-center space-y-3 group relative z-10 mb-6">
              <div className="relative p-1 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-lg">
                <Image 
                  src="/images/im12.avif" // Assurez-vous que ce logo existe et est accessible
                  alt="Pick & Drop Logo" 
                  width={80} 
                  height={80} 
                  className="relative rounded-xl transform group-hover:scale-105 transition-transform duration-300 bg-slate-700 p-1" 
                />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold group-hover:text-green-300 transition-colors duration-300">
                  Pick & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Drop</span>
                </h1>
                <p className="text-xs text-slate-300 font-medium tracking-wider">Admin</p>
              </div>
            </a>
          </Link>
          
          <div className="text-center space-y-4 relative z-10 max-w-xs">
            <h2 className="text-2xl font-semibold leading-tight text-green-50">
              Gestion Centralisée Avancée
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Supervisez, analysez et optimisez chaque aspect de la plateforme Pick & Drop.
            </p>
          </div>

          {/* Icônes de fonctionnalités - Thème vert */}
          <div className="grid grid-cols-2 gap-5 relative z-10 mt-6">
            {[
              { icon: Users, label: "Utilisateurs", color: "text-green-300" },
              { icon: BarChart3, label: "Analytiques", color: "text-emerald-300" },
              { icon: Shield, label: "Sécurité", color: "text-teal-300" },
              { icon: Settings, label: "Paramètres", color: "text-lime-300" },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center space-y-1.5 group cursor-default">
                <div className="p-2.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors border border-green-500/20">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-xs text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section droite - Formulaire de connexion - Thème vert */}
        <div className="w-full p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 relative">
          <div className="space-y-6">
            
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-2.5 mb-3">
                <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md shadow">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Accès Administrateur
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                Veuillez utiliser vos identifiants super administrateur.
              </p>
            </div>

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 text-red-700 p-3 rounded-md shadow-sm">
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></div>
                  <p className="text-xs font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 tracking-wide">
                  Adresse E-mail
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                    <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-slate-400 text-slate-800 text-sm shadow-sm hover:shadow-md group-focus-within:shadow-lg"
                    placeholder="admin@pickdrop.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 tracking-wide">
                  Mot de passe
                </label>
                <div className="relative group">
                   <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                    <KeyRound className="w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-slate-400 text-slate-800 text-sm shadow-sm hover:shadow-md group-focus-within:shadow-lg"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-green-500 transition-colors p-1 rounded-md hover:bg-green-50"
                    aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 text-green-600 border-2 border-slate-300 rounded-sm focus:ring-green-500 focus:ring-offset-1 transition-all"
                  />
                  <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">Se souvenir</span>
                </label>
                {/* Optionnel: lien mot de passe oublié pour super admin */}
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 hover:from-green-700 hover:via-emerald-700 hover:to-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center justify-center text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2.5"></div>
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2.5" />
                    <span>Se Connecter</span>
                  </>
                )}
              </button>
            </form>

            {/* Bouton retour à l'accueil */}
            <div className="text-center pt-3 border-t border-green-100">
              <p className="text-xs text-slate-500 mb-2">Utilisateur standard ?</p>
              <Link href="/" legacyBehavior>
                <a className="inline-flex items-center space-x-1.5 text-green-600 hover:text-emerald-700 text-xs font-medium transition-colors group">
                  <Home className="w-3.5 h-3.5 group-hover:animate-pulse" />
                  <span>Retourner à l'accueil public</span>
                </a>
              </Link>
            </div>

            {/* Footer sécurisé */}
            <div className="mt-6 text-center space-y-2">
              <div className="flex items-center justify-center space-x-1.5 text-slate-500">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs">Connexion Chiffrée & Sécurisée</span>
              </div>
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} Pick & Drop Secure Admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;