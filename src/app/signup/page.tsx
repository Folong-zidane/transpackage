'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useAuth } from '@/context/AuthContext';

// Types mis à jour pour correspondre à l'API
type UserRole = 'CLIENT' | 'ENTERPRISE';

interface UserData {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  companyName?: string; // Optionnel pour les entreprises
}

const InscriptionPage: React.FC = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [userData, setUserData] = useState<UserData>({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    password: '',
    role: 'CLIENT',
    companyName: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setUserData(prev => ({ ...prev, role }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!userData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!userData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!userData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = "Format d'email invalide";
    if (!userData.password) newErrors.password = "Le mot de passe est requis";
    else if (userData.password.length < 6) newErrors.password = "Le mot de passe doit faire au moins 6 caractères";
    if (userData.role === 'ENTERPRISE' && !userData.companyName?.trim()) newErrors.companyName = "Le nom de l'entreprise est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Préparer les données pour l'API
      const payload = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role,
      };
      
      await register(payload);
      
      // La redirection est maintenant gérée par le AuthContext
      // On peut déclencher un effet visuel ici si on veut
      setShowConfetti(true);

    } catch (err: any) {
      setApiError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Le return utilise AnimatePresence mais sans l'état `step` car le formulaire est unifié.
  return (
    <>
      <Head>
        <title>Inscription | Pick & Drop</title>
        <meta name="description" content="Inscrivez-vous sur notre plateforme de points de relais" />
      </Head>
      
      <main className="min-h-screen bg-green-50 flex items-center justify-center p-4 md:p-0">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
          
          {/* Form Section */}
          <motion.div 
            key="signup-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 p-8 flex flex-col justify-center"
          >
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={400} />}

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-green-600">Créez votre compte</h1>
              <p className="text-gray-600 mt-2">Rejoignez notre réseau de points de relais</p>
            </div>

            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm"
              >
                {apiError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sélecteur de rôle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => handleRoleChange('CLIENT')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                    userData.role === 'CLIENT' 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <FiUser /><span>Particulier</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('ENTERPRISE')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                    userData.role === 'ENTERPRISE' 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <FiBriefcase /><span>Professionnel</span>
                </button>
              </div>

              {/* Champs personnels */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm mb-1">Prénom</label>
                  <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" name="firstName" value={userData.firstName} onChange={handleChange} className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none transition ${errors.firstName ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-green-300 focus:border-green-500'}`} placeholder="Votre prénom" /></div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm mb-1">Nom</label>
                  <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" name="lastName" value={userData.lastName} onChange={handleChange} className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none transition ${errors.lastName ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-green-300 focus:border-green-500'}`} placeholder="Votre nom" /></div>
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Champ d'entreprise conditionnel */}
              <AnimatePresence>
                {userData.role === 'ENTERPRISE' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="pt-2">
                      <label className="block text-gray-700 text-sm mb-1">Nom de l'entreprise</label>
                      <div className="relative"><FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" name="companyName" value={userData.companyName} onChange={handleChange} className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none transition ${errors.companyName ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-green-300 focus:border-green-500'}`} placeholder="Le nom de votre société" /></div>
                      {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Email</label>
                <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" name="email" value={userData.email} onChange={handleChange} className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:outline-none transition ${errors.email ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-green-300 focus:border-green-500'}`} placeholder="votre.email@exemple.com" /></div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm mb-1">Téléphone (Optionnel)</label>
                <div className="relative"><FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="tel" name="phone" value={userData.phone} onChange={handleChange} className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition" placeholder="+237 6XX XXX XXX" /></div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-1">Mot de passe</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} name="password" value={userData.password} onChange={handleChange} className={`w-full py-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:outline-none transition ${errors.password ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-green-300 focus:border-green-500'}`} placeholder="Minimum 6 caractères" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"><span className="sr-only">Afficher/Cacher mot de passe</span>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit" disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-md ${
                    loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span>Création en cours...</span>
                    </>
                  ) : "S'inscrire"}
                </motion.button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte?{' '}
                  <Link href="/signin" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block lg:w-1/2 bg-green-100 relative"
          >
            <Image 
              src="/images/im10.jpg" 
              alt="Illustration de livraison" 
              layout="fill"
              objectFit="cover"
              className="opacity-90"
            />
             <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 via-transparent to-green-500/10"></div>
          </motion.div>

        </div>
      </main>
    </>
  );
};

export default InscriptionPage;