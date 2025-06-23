'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // NOUVEAU
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

const ConnexionPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Pré-remplir l'email si l'utilisateur a choisi de se souvenir de lui
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    try {
      // Gérer la persistance de l'email
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      await login({ email, password });
      // La redirection est maintenant gérée par le AuthContext en cas de succès

    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion | Pick & Drop</title>
        <meta name="description" content="Connectez-vous à votre compte sur notre plateforme de points de relais." />
      </Head>
      
      <main className="min-h-screen bg-green-50 flex items-center justify-center p-4 md:p-0">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
          
          {/* Section Formulaire */}
          <motion.div 
            key="login-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 p-8 flex flex-col justify-center"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-green-600">Connexion</h1>
              <p className="text-gray-600 mt-2">
                Accédez à votre espace personnel.
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition"
                    placeholder="Entrez votre email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-700 text-sm mb-1">Mot de passe</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition"
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm text-green-600 hover:text-green-700 hover:underline">
                  Mot de passe oublié?
                </a>
              </div>
              
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-md ${
                  loading 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Connexion en cours...</span>
                  </>
                ) : 'Se connecter'}
              </motion.button>
            </form>
            
            <div className="mt-6 text-center text-gray-600">
              <p className="text-sm">
                Vous n'avez pas de compte?{' '}
                <Link href="/signup" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                  Créer un compte
                </Link>
              </p>
            </div>
            
            {/* ... Séparateur et boutons sociaux ... */}
          </motion.div>
        
          {/* Section Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block lg:w-1/2 bg-green-100 relative"
          >
            <Image 
              src="/images/im11.avif" 
              alt="Illustration de point relais" 
              layout="fill"
              objectFit="cover"
            />
             <div className="absolute inset-0 bg-gradient-to-br from-green-200/10 via-transparent to-green-500/5"></div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default ConnexionPage;