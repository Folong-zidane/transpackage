'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';
import { FiUser, FiCalendar, FiMail, FiMapPin, FiPhone, FiBriefcase, FiLink, FiCreditCard } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types
type UserType = 'client' | 'livreur' | '';
type FormStep = 'personal' | 'livreur' | 'success';

interface UserData {
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  email: string;
  ville: string;
  typeUtilisateur: UserType;
  entreprise?: string;
  siteWeb?: string;
  numeroCNI?: string;
  contact?: string;
  villeSiege?: string;
}

const InscriptionPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>('personal');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    nom: '',
    prenom: '',
    sexe: 'homme',
    dateNaissance: '',
    email: '',
    ville: '',
    typeUtilisateur: '',
    entreprise: '',
    siteWeb: '',
    numeroCNI: '',
    contact: '',
    villeSiege: '',
  });

  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Date selection
  const handleDateSelect = (date: Date) => {
    setUserData(prev => ({ 
      ...prev, 
      dateNaissance: format(date, 'yyyy-MM-dd') 
    }));
    setShowCalendar(false);
  };

  // Calendar component (simplified)
  const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const days = Array.from(
      { length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() },
      (_, i) => i + 1
    );
    
    const handleDateClick = (day: number) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      setSelectedDate(date);
      handleDateSelect(date);
    };
    
    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };
    
    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 absolute z-10">
        <div className="flex justify-between mb-2">
          <button onClick={prevMonth} className="p-1 hover:bg-green-100 rounded">
            &lt;
          </button>
          <div>
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </div>
          <button onClick={nextMonth} className="p-1 hover:bg-green-100 rounded">
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day) => (
            <div key={day} className="text-xs font-semibold">
              {day}
            </div>
          ))}
          {Array.from(
            { length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() - 1 },
            (_, i) => (
              <div key={`empty-${i}`} />
            )
          )}
          {days.map((day) => (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`w-8 h-8 rounded-full hover:bg-green-200 ${
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth.getMonth() &&
                selectedDate.getFullYear() === currentMonth.getFullYear()
                  ? 'bg-green-500 text-white'
                  : ''
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate personal info
    if (!userData.nom) newErrors.nom = "Le nom est requis";
    if (!userData.prenom) newErrors.prenom = "Le prénom est requis";
    if (!userData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise";
    if (!userData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!userData.ville) newErrors.ville = "La ville est requise";
    
    // If livreur step, validate business info
    if (step === 'livreur') {
      if (!userData.entreprise) newErrors.entreprise = "Le nom de l'entreprise est requis";
      if (!userData.numeroCNI) newErrors.numeroCNI = "Le numéro de CNI est requis";
      if (!userData.contact) newErrors.contact = "Le contact est requis";
      if (!userData.villeSiege) newErrors.villeSiege = "La ville du siège est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (type: UserType) => {
    if (step === 'personal') {
      setUserData(prev => ({ ...prev, typeUtilisateur: type }));
      
      if (validateForm()) {
        if (type === 'client') {
          // Save to localStorage
          localStorage.setItem('userData', JSON.stringify({...userData, typeUtilisateur: type}));
          // Show success animation
          setStep('success');
          setShowConfetti(true);
          // Simulate email sending
          console.log(`Email de bienvenue envoyé à ${userData.email}`);
        } else {
          // Move to livreur form
          setStep('livreur');
        }
      }
    } else if (step === 'livreur') {
      if (validateForm()) {
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        // Show success
        setStep('success');
        setShowConfetti(true);
        // Simulate email sending
        console.log(`Email de bienvenue envoyé à ${userData.email}`);
      }
    }
  };

  useEffect(() => {
    // Clean up confetti after 5 seconds
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <>
      <Head>
        <title>Inscription | Points de Relais</title>
        <meta name="description" content="Inscrivez-vous sur notre plateforme de points de relais" />
      </Head>
      
      <main className="min-h-screen bg-green-50 flex items-center justify-center p-4 md:p-0">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Form Section */}
          <AnimatePresence mode="wait">
            {step !== 'success' ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`w-full ${step === 'success' ? 'lg:w-full' : 'lg:w-1/2'} p-8`}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-green-600">
                    {step === 'personal' ? 'Créez votre compte' : 'Informations professionnelles'}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {step === 'personal' 
                      ? 'Rejoignez notre réseau de points de relais' 
                      : 'Complétez vos informations de livreur'}
                  </p>
                </div>
                
                {step === 'personal' && (
                  <form className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 mb-1">Nom</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <FiUser />
                          </span>
                          <input
                            type="text"
                            name="nom"
                            value={userData.nom}
                            onChange={handleChange}
                            className={`w-full py-2 pl-10 pr-3 text-green-600 font-bold border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Entrez votre nom"
                          />
                        </div>
                        {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-gray-700 mb-1">Prénom</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <FiUser />
                          </span>
                          <input
                            type="text"
                            name="prenom"
                            value={userData.prenom}
                            onChange={handleChange}
                            className={`w-full py-2 text-green-600 font-bold pl-10 pr-3 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition ${errors.prenom ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Entrez votre prénom"
                          />
                        </div>
                        {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Sexe</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="sexe"
                            value="homme"
                            checked={userData.sexe === 'homme'}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                          />
                          <span className="ml-2 text-green-600 font-bold">Homme</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="sexe"
                            value="femme"
                            checked={userData.sexe === 'femme'}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                          />
                          <span className="ml-2 text-green-600 font-bold">Femme</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Date de naissance</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FiCalendar />
                        </span>
                        <input
                          type="text"
                          name="dateNaissance"
                          value={userData.dateNaissance ? format(new Date(userData.dateNaissance), 'dd/MM/yyyy') : ''}
                          readOnly
                          onClick={() => setShowCalendar(!showCalendar)}
                          className={`w-full py-2 pl-10 pr-3 text-green-600 font-bold border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition cursor-pointer ${errors.dateNaissance ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Sélectionnez votre date de naissance"
                        />
                        {showCalendar && <Calendar />}
                      </div>
                      {errors.dateNaissance && <p className="text-red-500 text-sm mt-1">{errors.dateNaissance}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FiMail />
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleChange}
                          className={`w-full py-2 pl-10 text-green-600 font-bold font-bold pr-3 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Entrez votre email"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Ville de résidence</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FiMapPin />
                        </span>
                        <input
                          type="text"
                          name="ville"
                          value={userData.ville}
                          onChange={handleChange}
                          className={`w-full py-2 pl-10 pr-3 text-green-600 font-bold border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition ${errors.ville ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Entrez votre ville"
                        />
                      </div>
                      {errors.ville && <p className="text-red-500 text-sm mt-1">{errors.ville}</p>}
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => handleSubmit('client')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-md"
                      >
                        <FiUser />
                        Particulier
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        onClick={() => handleSubmit('livreur')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-md"
                      >
                        <FiBriefcase />
                        Proffessionel
                      </motion.button>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-gray-600 mb-1">Vous avez déjà un compte ?</p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/signin')}
                        className="
                          text-green-600 
                          hover:text-green-700 
                          font-medium 
                          underline 
                          underline-offset-4
                          transition-colors
                        "
                      >
                        Connectez-vous ici
                      </motion.button>
                    </div>
                  </form>
                )}
                {step !== 'success' && (
                  <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 h-4/5">
                    <div className="w-px h-full bg-gradient-to-b from-transparent via-green-300 to-transparent"></div>
                  </div>
                )}
                {step === 'livreur' && (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Nom de l'entreprise</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FiBriefcase />
                        </span>
                        <input
                          type="text"
                          name="entreprise"
                          value={userData.entreprise}
                          onChange={handleChange}
                          className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition ${errors.entreprise ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                      {errors.entreprise && <p className="text-red-500 text-sm mt-1">{errors.entreprise}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Site web</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FiLink />
                        </span>
                        <input
                          type="url"
                          name="siteWeb"
                          value={userData.siteWeb}
                          onChange={handleChange}
                          className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition"
                          placeholder="https://www.votresite.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Numéro de CNI</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FiCreditCard />
                        </span>
                        <input
                          type="text"
                          name="numeroCNI"
                          value={userData.numeroCNI}
                          onChange={handleChange}
                          className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition ${errors.numeroCNI ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Numéro de carte d'identité"
                        />
                      </div>
                      {errors.numeroCNI && <p className="text-red-500 text-sm mt-1">{errors.numeroCNI}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Contact</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FiPhone />
                        </span>
                        <input
                          type="tel"
                          name="contact"
                          value={userData.contact}
                          onChange={handleChange}
                          className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Numéro de téléphone"
                        />
                      </div>
                      {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1">Ville du siège</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <FiMapPin />
                        </span>
                        <input
                          type="text"
                          name="villeSiege"
                          value={userData.villeSiege}
                          onChange={handleChange}
                          className={`w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition ${errors.villeSiege ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Ville du siège social"
                        />
                      </div>
                      {errors.villeSiege && <p className="text-red-500 text-sm mt-1">{errors.villeSiege}</p>}
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => setStep('personal')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium flex items-center justify-center transition"
                      >
                        Retour
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        onClick={() => handleSubmit('livreur')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition shadow-md"
                      >
                        Finaliser l'inscription
                      </motion.button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full p-8 flex flex-col items-center justify-center text-center"
              >
                {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl font-bold text-green-600 mb-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Félicitations !
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 mb-6 max-w-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Votre inscription a été enregistrée avec succès. Un email de bienvenue a été envoyé à {userData.email}.
                </motion.p>
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/')}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition"
                >
                  Accéder à votre compte
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
  
          {/* Image Section */}
          {step !== 'success' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block lg:w-1/2 bg-green-100 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <h2 className="text-3xl font-bold text-green-800 mt-8 mb-4">
                    Rejoignez notre réseau de points relais
                  </h2>
                  <p className="text-green-700 mb-6">
                    Simplifiez la livraison de vos colis et participez à une communauté grandissante de points relais et de livreurs à travers le pays.
                  </p>
                  <Image 
                    src="/images/im10.jpg" 
                    alt="Illustration de livraison" 
                    width={500} 
                    height={400}
                    className="rounded-lg mx-auto object-cover"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
};

export default InscriptionPage;