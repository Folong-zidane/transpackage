'use client';
import React, { useState, useEffect } from 'react';
import { 
  MinusCircleIcon, 
  PlusCircleIcon, 
  InformationCircleIcon, 
  TruckIcon, 
  MapPinIcon, 
  UserIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { ChatBubbleOvalLeftEllipsisIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '@/components/home/Navbar';
import { relayPointsData } from '../admin-dashboard/data/relaypoints';

interface ShippingFormData {
  country: string;
  weight: string;
  compensation: number;
  relayPoint: string;
  recipientName: string;
  recipientPhone: string;
  recipientGender: string;
  recipientAge: string;
  recipientRelayPoint: string;
}

const ShippingSteps = ({ currentStep = 1 }: { currentStep?: number }) => {
  const steps = [
    { number: 1, title: ["Je prépare", "mon envoi"], icon: <TruckIcon className="w-6 h-6" /> },
    { number: 2, title: ["Je valide", "mon panier"], icon: <ShoppingBagIcon className="w-6 h-6" /> },
    { number: 3, title: ["Je paie"], icon: <CreditCardIcon className="w-6 h-6" /> }
  ];

  return (
    <div className="flex justify-center items-center mb-12 w-full">
      <div className="flex justify-between items-center w-full max-w-4xl">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Numéro de l'étape au-dessus de la ligne horizontale */}
            <div className="flex flex-col items-center group relative">
              <div className="mb-2 font-bold text-black  text-lg">
                {step.number}
              </div>
              
              {/* Le cercle avec l'icône uniquement */}
              <div className={`
                ${step.number <= currentStep ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}
                rounded-full w-14 h-14 flex items-center justify-center transition-all duration-300 
                group-hover:scale-110 animate-pulse
              `} style={{ animationDuration: '3s' }}>
                {step.number < currentStep ? <CheckCircleIcon className="w-8 h-8" /> : step.icon}
              </div>
              
              <div className="text-center mt-2">
                {step.title.map((line, i) => (
                  <p key={i} className={`font-medium ${i === 1 ? 'italic' : ''} ${
                    step.number <= currentStep ? "text-green-700" : "text-gray-600"
                  }`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Ligne horizontale centrée verticalement avec les cercles */}
            {index < steps.length - 1 && (
              <div className={`flex-1 border-t-2 ${
                step.number < currentStep ? "border-green-500" : "border-gray-300"
              } mx-2 self-center transition-colors duration-300`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const CompensationSelector = ({ value, onChange }: { value: number, onChange: (value: number) => void }) => {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <ShieldIcon className="w-6 h-6 text-green-600 mr-2" />
        <h2 className="text-2xl text-black font-medium">Indemnisation :</h2>
      </div>
      <p className="mb-4 text-gray-600">Votre colis est couvert à hauteur de 5 000 FCFA. Il a une valeur supérieure ? Choisissez le montant d'indemnisation souhaité.</p>
      
      <div className="flex items-center justify-center border rounded-lg w-full max-w-md mx-auto bg-green-50 transition-all hover:bg-green-100 duration-300">
        <button 
          className="p-4 transition-transform hover:scale-110"
          onClick={() => onChange(Math.max(5000, value - 5000))}
          aria-label="Diminuer l'indemnisation"
        >
          <MinusCircleIcon className="w-8 h-8 text-green-600" />
        </button>
        <div className="flex-1 text-center py-4">
          <p className="text-2xl font-bold text-green-700">{value.toLocaleString()} FCFA</p>
          <p className="text-green-600">Inclus</p>
        </div>
        <button 
          className="p-4 transition-transform hover:scale-110"
          onClick={() => onChange(value + 5000)}
          aria-label="Augmenter l'indemnisation"
        >
          <PlusCircleIcon className="w-8 h-8 text-green-600" />
        </button>
      </div>
    </div>
  );
};

// Icone personnalisée pour le bouclier
const ShieldIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

// Animation de chargement
const LoadingDots = () => (
  <div className="flex space-x-1 items-center justify-center">
    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

const RelayPointSelector = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState([
    { id: 'relay1', name: 'Supermarché Mahima', address: 'Rue 1.839, Yaoundé', distance: '0.5 km'},
    { id: 'relay2', name: 'Librairie Papyrus', address: 'Avenue Kennedy, Douala', distance: '0.8 km'},
    { id: 'relay3', name: 'Boutique Express', address: 'Marché Central, Bafoussam', distance: '1.2 km'}
  ]);

  useEffect(() => {
    if (value === '') {
      // Simuler le chargement des points relais
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [value]);

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <MapPinIcon className="w-6 h-6 text-green-600 mr-2" />
        <h2 className="text-2xl text-black  font-medium">Point relais :</h2>
      </div>
      <p className="mb-4 text-gray-600">Choisissez un point relais proche de chez vous pour déposer votre colis.</p>
      
      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <LoadingDots />
        </div>
      ) : (
        <div className="space-y-4">
          {points.map(point => (
            <div 
              key={point.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                value === point.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
              onClick={() => onChange(point.id)}
            >
              <div className="flex items-start">
                <div className={`min-w-6 h-6 rounded-full border-2 mr-3 mt-1 flex items-center justify-center ${
                  value === point.id ? 'border-green-500 bg-green-100' : 'border-gray-300'
                }`}>
                  {value === point.id && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 ">{point.name}</h3>
                  <p className="text-gray-600 text-sm">{point.address}</p>
                  <div className="flex items-center mt-1">
                    <MapPinIcon className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 text-sm">{point.distance}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RecipientForm = ({ formData, setFormData }: { 
  formData: ShippingFormData, 
  setFormData: React.Dispatch<React.SetStateAction<ShippingFormData>> 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const recipientPoints = [
    { id: 'dest1', name: 'Supermarché Central', address: 'Avenue de l\'Indépendance, Yaoundé', region: 'Yaoundé' },
    { id: 'dest2', name: 'Boutique Akwa', address: 'Boulevard de la Liberté, Douala', region: 'Douala' },
    { id: 'dest3', name: 'Kiosque Express', address: 'Route de Foumban, Bafoussam', region: 'Bafoussam' }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <UserIcon className="w-6 h-6 text-green-600 mr-2" />
        <h2 className="text-2xl text-black  font-medium">Mon destinataire</h2>
      </div>
      
      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <LoadingDots />
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn" style={{ animationDuration: '0.5s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipientName" className="block mb-2 text-gray-500  font-medium">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                id="recipientName"
                type="text"
                className="w-full text-black  border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Nom du destinataire"
                value={formData.recipientName}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="recipientPhone" className="block text-gray-500 mb-2 font-medium">
                Numéro de téléphone <span className="text-red-500">*</span>
              </label>
              <input
                id="recipientPhone"
                type="text"
                className="w-full border text-black  border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Ex: 6XXXXXXXX"
                value={formData.recipientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientPhone: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipientGender" className="block text-gray-500 mb-2 font-medium">
                Sexe
              </label>
              <select
                id="recipientGender"
                className="w-full border border-gray-300 text-black  rounded-lg p-3 appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                value={formData.recipientGender}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientGender: e.target.value }))}
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label htmlFor="recipientAge" className="text-gray-500 block mb-2 font-medium">
                Âge
              </label>
              <input
                id="recipientAge"
                type="number"
                min="18"
                max="100"
                className="w-full text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Âge du destinataire"
                value={formData.recipientAge}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientAge: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-500 mb-2 font-medium">
              Point relais pour la réception <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {recipientPoints.map(point => (
                <div 
                  key={point.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                    formData.recipientRelayPoint === point.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, recipientRelayPoint: point.id }))}
                >
                  <div className="flex items-start">
                    <div className={`min-w-6 h-6 rounded-full border-2 mr-3 mt-1 flex items-center justify-center ${
                      formData.recipientRelayPoint === point.id ? 'border-green-500 bg-green-100' : 'border-gray-300'
                    }`}>
                      {formData.recipientRelayPoint === point.id && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className="font-medium text-black ">{point.name}</h3>
                      <p className="text-gray-600 text-sm">{point.address}</p>
                      <div className="flex items-center mt-1">
                        <MapPinIcon className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-green-600 text-sm">{point.region}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ShippingPage = () => {
  const [formData, setFormData] = useState<ShippingFormData>({
    country: 'Cameroun',
    weight: '',
    compensation: 15000,
    relayPoint: '',
    recipientName: '',
    recipientPhone: '',
    recipientGender: '',
    recipientAge: '',
    recipientRelayPoint: ''
  });
  
  const [isWeightValid, setIsWeightValid] = useState(true);
  const [priceLoading, setPriceLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);

  const handleCompensationChange = (value: number) => {
    setFormData(prev => ({ ...prev, compensation: value }));
    updatePrice();
  };

  const handleRelayPointChange = (value: string) => {
    setFormData(prev => ({ ...prev, relayPoint: value }));
  };

  const handleWeightChange = (value: string) => {
    // Autoriser seulement les chiffres et un point decimal
    const regex = /^(\d+)?(\.\d{0,2})?$/;
    if (value === '' || regex.test(value)) {
      setFormData(prev => ({ ...prev, weight: value }));
      setIsWeightValid(true);
      updatePrice();
    } else {
      setIsWeightValid(false);
    }
  };

  const updatePrice = () => {
    const weight = parseFloat(formData.weight);
    if (!isNaN(weight) && weight > 0) {
      setPriceLoading(true);
      setTimeout(() => {
        // Calcul simple du prix basé sur le poids et la compensation
        const basePrice = 3000 + weight * 1000;
        const compensationFee = (formData.compensation > 15000) ? (formData.compensation - 15000) * 0.005 : 0;
        setPrice(basePrice + compensationFee);
        setPriceLoading(false);
      }, 800);
    } else {
      setPrice(null);
    }
  };

  useEffect(() => {
    updatePrice();
  }, [formData.weight]);

  // Animation CSS personnalisée
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const points = [
    { id: 'relay1', name: 'Supermarché Mahima', address: 'Rue 1.839, Yaoundé', distance: '0.5 km'},
    { id: 'relay2', name: 'Librairie Papyrus', address: 'Avenue Kennedy, Douala', distance: '0.8 km'},
    { id: 'relay3', name: 'Boutique Express', address: 'Marché Central, Bafoussam', distance: '1.2 km'}
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <Head>
        <title>Expédier un colis</title>
        <meta name="description" content="Service d'expédition de colis via notre réseau de points relais au Cameroun" />
      </Head>

      <Navbar/>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 text-center">Grâce à nous, envoyez vos colis en toute sécurité partout au Cameroun.</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Comment expédier un colis sur CamerXpress ?</h1>
          
          {/* Steps */}
          <ShippingSteps currentStep={1} />
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Form */}
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center mb-4">
                  <TruckIcon className="w-6 h-6 text-green-600 mr-2" />
                  <h2 className="text-2xl text-black  font-medium">Mon colis</h2>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="country" className="block text-gray-500 mb-2 font-medium">
                    Région de destination <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="country"
                      className="w-full text-black border border-gray-300 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    >
                      <option value="Cameroun">Ngaoundéré</option>
                      <option value="Yaoundé">Yaoundé</option>
                      <option value="Douala">Douala</option>
                      <option value="Bafoussam">Bafoussam</option>
                      <option value="Garoua">Garoua</option>
                      <option value="Maroua">Maroua</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="weight" className="block text-gray-500 mb-2 font-medium">
                    Poids <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="weight"
                      type="text"
                      className={`w-full text-black border rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        isWeightValid ? 'border-gray-300' : 'border-red-500'
                      }`}
                      placeholder="Entrez le poids"
                      value={formData.weight}
                      onChange={(e) => handleWeightChange(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">Kg</span>
                    </div>
                  </div>
                  {!isWeightValid && <p className="text-red-500 text-sm mt-1">Veuillez entrer un poids valide</p>}
                  
                  <div className="flex items-center text-gray-600 mt-3 hover:text-green-600 transition-colors group cursor-pointer">
                    <InformationCircleIcon className="w-5 h-5 mr-2 group-hover:text-green-600" />
                    <span className="text-sm underline">Aide pour estimer le poids & dimensions</span>
                  </div>
                </div>
              </div>
              
              {/* Compensation selector */}
              <CompensationSelector value={formData.compensation} onChange={handleCompensationChange} />
              
              {/* Relay Point selector */}
              <RelayPointSelector value={formData.relayPoint} onChange={handleRelayPointChange} />
              
              {/* Recipient Form */}
              <RecipientForm formData={formData} setFormData={setFormData} />
            </div>
            
            {/* Right column - Summary */}
            <div className="w-full md:w-96 bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-100 h-fit sticky top-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-bold mb-6 text-green-700 flex items-center">
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                VOTRE ENVOI
              </h3>
              
              <div className="flex items-start mb-6">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <TruckIcon className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-black ">Votre colis en cours...</p>
                  <p className="text-sm text-gray-500">Livraison en point relais</p>
                </div>
              </div>
              
              <div className="border-b border-gray-300 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Destination :</span>
                  <span className="font-medium text-black">{formData.country}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Poids :</span>
                  <span className="font-medium text-black ">{formData.weight || "..."} kg</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Point relais expéditeur :</span>
                  <span className="font-medium text-black">
                    {formData.relayPoint ? points.find(p => p.id === formData.relayPoint)?.name || "..." : "..."}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Destinataire :</span>
                  <span className="font-medium text-black ">{formData.recipientName || "..."}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Point relais destinataire :</span>
                  <span className="font-medium text-black">
                    {formData.relayPoint ? points.find(p => p.id === formData.recipientRelayPoint)?.name || "..." : "..."}
                  </span>
                </div>
              </div>
              
              <div className="border-b border-gray-300 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Prix de l'envoi :</span>
                  <span className="font-medium text-black ">
                    {priceLoading ? <LoadingDots /> : price !== null ? `${price.toLocaleString()} FCFA` : "..."}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Indemnisation :</span>
                  <span className="font-medium text-green-700">{formData.compensation.toLocaleString()} FCFA</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-8">
                <span className="font-bold text-black">Prix final</span>
                <span className="font-bold text-xl text-green-700">
                  {priceLoading ? <LoadingDots /> : price !== null ? `${price.toLocaleString()} FCFA` : "..."}
                </span>
              </div>
              
              <button 
                className={`w-full py-3 px-6 rounded-lg font-medium text-white flex items-center justify-center transition-all ${
                  formData.weight && formData.relayPoint && formData.recipientName && 
                  formData.recipientPhone && formData.recipientRelayPoint ? 
                  'bg-green-600 hover:bg-green-700 animate-pulse' : 
                  'bg-gray-400 cursor-not-allowed'
                }`} style={{ animationDuration: '2s' }}
                disabled={!formData.weight || !formData.relayPoint || !formData.recipientName || 
                          !formData.recipientPhone || !formData.recipientRelayPoint}
              >
                Continuer
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
              
              {(!formData.weight || !formData.relayPoint || !formData.recipientName || 
                !formData.recipientPhone || !formData.recipientRelayPoint) && (
                <p className="text-sm text-center mt-2 text-orange-500">
                  Veuillez remplir tous les champs requis
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Help button with animation */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-4 shadow-lg flex items-center transition-transform hover:scale-105 animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 3 }}>
          <span className="mr-2">Besoin d'aide ?</span>
          <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default ShippingPage;