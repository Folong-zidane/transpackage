'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiTruck } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Settings } from 'lucide-react';

// Types
interface UserData {
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  email: string;
  ville: string;
  typeUtilisateur: 'client' | 'livreur'|'admin';
  entreprise?: string;
  siteWeb?: string;
  numeroCNI?: string;
  contact?: string;
  villeSiege?: string;
}

const ConnexionPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'client' | 'livreur'>('client');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Effet de l'animation
  const [animateForm, setAnimateForm] = useState(true);

  useEffect(() => {
    // Animation pour montrer le formulaire au chargement de la page
    setAnimateForm(true);
    
    // Vérifier si l'utilisateur a déjà des données sauvegardées
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    // Simuler le chargement
    setLoading(true);
    
    // Récupérer les données de l'utilisateur du localStorage
    const storedUserDataString = localStorage.getItem('userData');
    
    if (!storedUserDataString) {
      setTimeout(() => {
        setLoading(false);
        setError('Aucun compte trouvé. Veuillez vous inscrire.');
      }, 1000);
      return;
    }
    
    try {
      const userData: UserData = JSON.parse(storedUserDataString);
      
      // Vérifier si l'email correspond
      if (userData.email !== email) {
        setTimeout(() => {
          setLoading(false);
          setError('Email ou mot de passe incorrect');
        }, 1000);
        return;
      }
      
      // Vérifier si le type d'utilisateur correspond
      if (userData.typeUtilisateur !== userType) {
        setTimeout(() => {
          setLoading(false);
          setError(`Cet email est enregistré en tant que ${userData.typeUtilisateur === 'client' ? 'client' : 'livreur'}`);
        }, 1000);
        return;
      }
      
      // Dans un vrai système, on vérifierait le mot de passe ici
      // Comme on n'a pas de mot de passe dans notre localStorage, on simule juste
      
      // Sauvegarder l'email si "Se souvenir de moi" est coché
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Connexion réussie - simuler redirection après un court délai
      setTimeout(() => {
        setLoading(false);
        // Stocker que l'utilisateur est connecté
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUserEmail', email);
        
        // Rediriger vers le tableau de bord
        router.push('/dashboard');
      }, 1500);
      
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        setError('Une erreur est survenue. Veuillez réessayer.');
      }, 1000);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion | Points de Relais</title>
        <meta name="description" content="Connectez-vous à votre compte sur notre plateforme de points de relais" />
      </Head>
      
      <main className="min-h-screen bg-green-50 flex items-center justify-center p-4 md:p-0">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Image Section - visible uniquement sur desktop */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block lg:w-1/2 bg-green-100 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <h2 className="text-3xl font-bold text-green-800 mb-4">
                  Bienvenue sur Points Relais
                </h2>
                <p className="text-green-700 mb-6">
                  Connectez-vous pour accéder à votre espace personnel et profiter de tous nos services de livraison.
                </p>
                <Image 
                  src="/images/im11.avif" 
                  alt="Illustration de point relais" 
                  width={500} 
                  height={400}
                  className="rounded-lg mx-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        
          {/* Form Section */}
          <AnimatePresence>
            <motion.div 
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={animateForm ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full lg:w-1/2 p-8 flex flex-col justify-center"
            >
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-green-600">Connexion</h1>
                <p className="text-gray-600 mt-2">
                  Accédez à votre espace personnel
                </p>
              </div>
              
              {/* Onglets de type d'utilisateur */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setUserType('client')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                    userType === 'client' 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <FiUser />
                  <span>Particulier</span>
                </button>
                <button
                  onClick={() => setUserType('livreur')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                    userType === 'livreur' 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <FiTruck />
                  <span>Professionnel</span>
                </button>
                <button
                  onClick={() => setUserType('admin')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                    userType === 'admin' 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <Settings />
                  <span>Administrateur</span>
                </button>
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FiMail />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition"
                      placeholder="Entrez votre email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <FiLock />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition"
                      placeholder="Entrez votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                  </label>
                  
                  <button
                    type="button"
                    className="text-sm text-green-600 hover:text-green-700 hover:underline"
                  >
                    Mot de passe oublié?
                  </button>
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
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </motion.button>
              </form>
              
              <div className="mt-6 text-center text-gray-600">
                <p>
                  Vous n'avez pas de compte? {' '}
                  <Link href="/signup" className="text-green-600 hover:text-green-700 hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </div>
              
              {/* Séparateur */}
              <div className="mt-8 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="px-4 text-sm text-gray-500">ou connectez-vous avec</div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              {/* Boutons de connexion sociale */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-2 px-4 flex justify-center items-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.617 0 3.082.603 4.206 1.595l3.209-3.209C17.48 1.486 14.897.5 12 .5c-4.213 0-7.836 2.505-9.483 6.117l3.731 2.927C7.226 6.818 9.438 5 12 5z"
                    />
                    <path
                      fill="#34A853"
                      d="M23.5 12c0-.838-.07-1.642-.21-2.418H12v4.636h6.475c-.278 1.509-1.131 2.789-2.409 3.642l3.675 2.879c2.146-1.986 3.384-4.916 3.384-8.739z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.517 14.346c-.282-.847-.43-1.752-.43-2.682 0-.93.147-1.835.43-2.682L2.246 6C1.435 7.767 1 9.83 1 12s.435 4.233 1.246 6l3.275-2.654z"
                    />
                    <path
                      fill="#4285F4"
                      d="M12 23.5c3.321 0 6.1-1.102 8.131-2.982l-3.675-2.879c-1.015.675-2.32 1.082-4.129 1.082-2.944 0-5.442-1.982-6.342-4.646L2.222 16.97C3.888 20.831 7.662 23.5 12 23.5z"
                    />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-2 px-4 flex justify-center items-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-2 px-4 flex justify-center items-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.5 12.5c0-5.799-4.701-10.5-10.5-10.5s-10.5 4.701-10.5 10.5c0 5.244 3.839 9.59 8.861 10.364v-7.329h-2.665v-3.035h2.665v-2.314c0-2.632 1.567-4.086 3.967-4.086 1.149 0 2.35.205 2.35.205v2.584h-1.323c-1.304 0-1.71.81-1.71 1.64v1.971h2.912l-.465 3.035h-2.447v7.329c5.022-.774 8.861-5.12 8.861-10.364"
                      fill="#000000"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default ConnexionPage;