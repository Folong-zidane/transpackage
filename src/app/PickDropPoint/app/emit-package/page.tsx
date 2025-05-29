'use client';
import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  InformationCircleIcon,
  DocumentMagnifyingGlassIcon, // Utilisé dans ShippingSteps
} from '@heroicons/react/24/outline';
import { ChatBubbleOvalLeftEllipsisIcon, CheckCircleIcon as SolidCheckCircleIcon } from '@heroicons/react/24/solid'; // Renommé pour éviter conflit
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import PackageRegistration from '@/app/envoyer/FomulaireColis';
import ProcessExistingPackage from './existingPackage'; // Importer le nouveau composant
import { ArrowRightCircleIcon, PackagePlus, PlusCircle, ScanSearch } from 'lucide-react';
import RoutePacket from './PackageRoad';
import Payment from './Pay';

// ... (vos interfaces PackageDataForParent et ShippingFormDataGlobal restent ici) ...
interface PackageDataForParent {
  image: string | null;
  designation: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  isFragile: boolean;
  contentType: 'solid' | 'liquid' | '';
  isPerishable: boolean;
  description: string;
  declaredValue: string;
  isInsured: boolean;
}

interface ShippingFormDataGlobal {
  departurePointName: string;
  arrivalPointName: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  departurePointId?: number | null;
  arrivalPointId?: number | null;
  distance?: number;
  compensation: number;
  country: string;
}

const ShippingSteps = ({ currentStep = 1, isNewPackageFlow }: { currentStep?: number, isNewPackageFlow: boolean }) => {
  if (!isNewPackageFlow) return null; // Ne pas afficher les étapes pour un colis existant

  const steps = [
    { number: 1, title: ["Description", "du colis"], icon: <TruckIcon className="w-7 h-7" /> },
    { number: 2, title: ["Choix", "du trajet"], icon: <MapPinIcon className="w-7 h-7" /> },
    { number: 3, title: ["Paiement", "& Confirmation"], icon: <CreditCardIcon className="w-7 h-7" /> },
  ];
  // ... (JSX de ShippingSteps identique)
  return (
    <div className="flex mt-8 sticky z-50 fixed justify-center items-center mb-10 sm:mb-16 w-full px-2">
      <div className="flex justify-between items-start w-full max-w-4xl">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center group relative text-center w-1/3 sm:w-auto">
              <div className={`
                ${step.number <= currentStep ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}
                rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-all duration-300 mb-2
                group-hover:scale-110 shadow-md
              `}>
                {step.number < currentStep ? <SolidCheckCircleIcon className="w-7 h-7 sm:w-8 sm:h-8" /> : React.cloneElement(step.icon, { className: "w-6 h-6 sm:w-7 sm:h-7"})}
              </div>
              {step.title.map((line, i) => (
                <p key={i} className={`text-xs sm:text-sm font-medium leading-tight ${
                  step.number <= currentStep ? "text-green-700" : "text-gray-600"
                }`}>
                  {line}
                </p>
              ))}
            </div>

            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mt-6 sm:mt-7 ${
                step.number < currentStep ? "bg-green-500" : "bg-gray-300"
              } mx-2 self-start transition-colors duration-300`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};


// Renommer la page pour refléter son rôle de point d'entrée pour le gérant
export default function RelayPointProcessingPage() {
  const [flowType, setFlowType] = useState<'initial_selection' | 'new_package' | 'existing_package'>('initial_selection');
  const [currentStep, setCurrentStep] = useState(1); // Pour le flux "new_package"
  const [packageDataForParent, setPackageDataForParent] = useState<PackageDataForParent | null>(null);
  const [formDataGlobal, setFormDataGlobal] = useState<ShippingFormDataGlobal>({
    departurePointName: '',
    arrivalPointName: '',
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    departurePointId: null,
    arrivalPointId: null,
    distance: 0,
    compensation: 0,
    country: 'Cameroun',
  });

  // Réinitialiser les états lors du changement de flowType
  const resetFlowStates = () => {
    setCurrentStep(1);
    setPackageDataForParent(null);
    setFormDataGlobal({
        departurePointName: '', arrivalPointName: '', recipientName: '', recipientPhone: '',
        recipientEmail: '', departurePointId: null, arrivalPointId: null, distance: 0,
        compensation: 0, country: 'Cameroun',
    });
    localStorage.removeItem('packageData');
    localStorage.removeItem('shippingFormDataGlobal');
    localStorage.removeItem('shippingCurrentStep');
  };


  // Charger les données sauvegardées si on est dans le flux "new_package"
  useEffect(() => {
    if (flowType === 'new_package') {
      const savedPackageDataString = localStorage.getItem('packageData');
      const savedShippingFormDataString = localStorage.getItem('shippingFormDataGlobal');
      const savedCurrentStep = localStorage.getItem('shippingCurrentStep');

      if (savedPackageDataString) {
        try { setPackageDataForParent(JSON.parse(savedPackageDataString)); }
        catch (e) { console.error("Erreur parsing packageData:", e); }
      }
      if (savedShippingFormDataString) {
        try {
          const parsedFormData = JSON.parse(savedShippingFormDataString);
          setFormDataGlobal(prev => ({ ...prev, ...parsedFormData, compensation: parsedFormData.compensation || 0 }));
        } catch (e) { console.error("Erreur parsing shippingFormDataGlobal:", e); }
      }
      if (savedCurrentStep) {
        const step = parseInt(savedCurrentStep, 10);
        if (step >= 1 && step <= 3) setCurrentStep(step);
      }
    }
  }, [flowType]);

  useEffect(() => {
    if (flowType === 'new_package') {
      if (Object.keys(formDataGlobal).some(key => formDataGlobal[key as keyof ShippingFormDataGlobal] !== '' && formDataGlobal[key as keyof ShippingFormDataGlobal] !== null && formDataGlobal[key as keyof ShippingFormDataGlobal] !== 0)) {
          localStorage.setItem('shippingFormDataGlobal', JSON.stringify(formDataGlobal));
      }
      localStorage.setItem('shippingCurrentStep', currentStep.toString());
    }
  }, [formDataGlobal, currentStep, flowType]);

  useEffect(() => {
    if (flowType === 'new_package' && packageDataForParent) {
      localStorage.setItem('packageData', JSON.stringify(packageDataForParent));
    }
  }, [packageDataForParent, flowType]);

  const handlePackageSubmit = (data: PackageDataForParent) => {
    setPackageDataForParent(data);
    let insuranceAmount = 0;
    if (data.isInsured && data.declaredValue) {
        const declaredVal = parseFloat(data.declaredValue);
        if (!isNaN(declaredVal) && declaredVal > 0) insuranceAmount = declaredVal * 0.05;
    }
    setFormDataGlobal(prev => ({ ...prev, compensation: insuranceAmount }));
    setCurrentStep(2);
  };

  const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handleBackStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

const renderContent = () => {
    if (flowType === 'initial_selection') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] sm:min-h-[calc(100vh-20rem)] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6 animate-fadeIn"> {/* Arrière-plan dégradé */}
          <div className="w-full max-w-xl text-center"> {/* max-w-xl pour un peu plus de largeur */}
            
            {/* Icône principale flottante */}
            <div className="mb-6 sm:mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-xl transform transition-all duration-500 hover:scale-110">
                <TruckIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-3 sm:mb-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Gestion des Colis
            </h1>
            <p className="text-md sm:text-lg text-slate-600 mb-8 sm:mb-10 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              Quelle opération souhaitez-vous effectuer sur un colis ?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              {/* Carte pour Nouveau Colis */}
              <button
                onClick={() => { resetFlowStates(); setFlowType('new_package'); }}
                className="group relative flex flex-col items-center justify-start p-6 pt-8 sm:p-8 sm:pt-10 text-center bg-white rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-50 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
                
                <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4 sm:mb-5 transform transition-transform duration-300 group-hover:scale-110">
                  <PackagePlus className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 transition-colors duration-300 group-hover:text-emerald-700" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1 sm:mb-1.5 group-hover:text-green-700 transition-colors duration-300">
                  Nouveau Colis
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300 leading-relaxed">
                  Enregistrer les informations d'un nouveau colis et planifier son expédition.
                </p>
                <ArrowRightCircleIcon className="w-5 h-5 text-green-400 mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
              </button>

              {/* Carte pour Colis Existant */}
              <button
                onClick={() => { resetFlowStates(); setFlowType('existing_package'); }}
                className="group relative flex flex-col items-center justify-start p-6 pt-8 sm:p-8 sm:pt-10 text-center bg-white rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-out hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-50 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></div>

                <div className="p-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full mb-4 sm:mb-5 transform transition-transform duration-300 group-hover:scale-110">
                  <ScanSearch className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600 transition-colors duration-300 group-hover:text-cyan-700" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1 sm:mb-1.5 group-hover:text-teal-700 transition-colors duration-300">
                  Colis Existant
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300 leading-relaxed">
                  Rechercher, vérifier le statut ou traiter le dépôt d'un colis déjà enregistré.
                </p>
                <ArrowRightCircleIcon className="w-5 h-5 text-teal-400 mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ... (le reste de votre logique renderContent pour 'new_package' et 'existing_package')
    if (flowType === 'new_package') {
      // ... (votre code existant pour le flux new_package)
      // J'ajoute un indicateur de progression amélioré et des transitions
      return (
        <div className="animate-fadeIn"> {/* Envelopper pour l'animation d'entrée */}
          {/* Indicateur de progression (ShippingSteps est déjà bien) */}
          {/* Vous pouvez l'envelopper ou le styler davantage ici si vous le souhaitez, mais il est déjà dans le composant parent */}
          
          {/* Contenu de l'étape avec transition */}
          <div className="transition-opacity duration-500 ease-in-out"> {/* Transition douce entre les étapes */}
            {(() => {
              switch (currentStep) {
                case 1: 
                  return <PackageRegistration onContinue={handlePackageSubmit} />;
                case 2: 
                  return <RoutePacket formData={formDataGlobal} setFormData={setFormDataGlobal} onNext={handleNextStep} onBack={handleBackStep} />;
                case 3:
                  if (!packageDataForParent) { setCurrentStep(1); return <p className="err-msg">Données du colis manquantes.</p>; }
                  if (!formDataGlobal.departurePointId || !formDataGlobal.arrivalPointId) { setCurrentStep(2); return <p className="err-msg">Trajet incomplet.</p>; }
                  return <Payment onBack={handleBackStep} packageData={packageDataForParent} formData={formDataGlobal} />;
                default: 
                  return <PackageRegistration onContinue={handlePackageSubmit} />;
              }
            })()}
          </div>
        </div>
      );
    }

    if (flowType === 'existing_package') {
      return (
        <div className="animate-fadeIn"> {/* Envelopper pour l'animation d'entrée */}
          <ProcessExistingPackage 
            onBackToSelection={() => { 
              resetFlowStates(); 
              setFlowType('initial_selection'); 
            }} 
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Head>
        <title>Point Relais - Pick & Drop Link</title>
        <meta name="description" content="Interface de gestion des colis pour les points relais Pick & Drop Link." />
      </Head>
      <Navbar/>
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {flowType === 'initial_selection' && (
            <div className="text-center mt-24 mb-8 sm:mb-10">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800">
                    Bienvenue au Point Relais <span className="text-green-600"> de notre interface Pick&Drop</span>
                </h1>
                <p className="mt-2 sm:mt-3 text-md sm:text-lg text-slate-600 max-w-2xl mx-auto">
                    Gérez efficacement les dépôts et les réceptions de colis.
                </p>
            </div>
        )}

        <div className={`bg-white  rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-8 border border-gray-200 
                        ${flowType !== 'initial_selection' ? 'animate-fadeIn' : ''}`}>
          <ShippingSteps currentStep={currentStep} isNewPackageFlow={flowType === 'new_package'} />
          <div className={`${flowType === 'new_package' ? 'mt-6' : ''}`}> {/* Pas de marge si c'est la sélection initiale */}
            {renderContent()}
          </div>
        </div>
      </main>

      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <button className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg flex items-center transition-all duration-200 hover:scale-105">
          <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
          <span className="ml-2 hidden sm:inline text-sm font-medium">Assistance Gérant</span>
        </button>
      </div>
       {/* Styles CSS globaux (comme .btn-primary, .btn-secondary, .err-msg) peuvent être ici ou dans globals.css */}
      <style jsx global>{`
        .btn-primary {
            display: flex; align-items: center; justify-content: center;
            padding: 0.75rem 1.25rem; background-color: #10b981; /* emerald-500 */ color: white;
            border-radius: 0.5rem; font-weight: 500;
            transition: all 0.2s ease-in-out; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .btn-primary:hover:not(:disabled) { background-color: #059669; /* emerald-600 */ transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; opacity: 0.7; }
        
        .btn-secondary {
            display: flex; align-items: center; justify-content: center;
            padding: 0.75rem 1.25rem; background-color: white; color: #374151; /* gray-700 */
            border: 1px solid #d1d5db; /* gray-300 */
            border-radius: 0.5rem; font-weight: 500;
            transition: all 0.2s ease-in-out; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .btn-secondary:hover { background-color: #f3f4f6; /* gray-100 */ border-color: #9ca3af; }
        .err-msg { text-align: center; color: #ef4444; /* red-500 */ background-color: #fee2e2; /* red-100 */ padding: 0.75rem; border-radius: 0.375rem; border: 1px solid #fca5a5; /* red-300 */ }
        /* Animation fadeIn */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}