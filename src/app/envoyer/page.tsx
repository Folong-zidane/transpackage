'use client';
import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  InformationCircleIcon, // Utilisé dans ShippingSteps
} from '@heroicons/react/24/outline';
import { ChatBubbleOvalLeftEllipsisIcon, CheckCircleIcon as SolidCheckCircleIcon } from '@heroicons/react/24/solid'; // Renommé pour éviter conflit
import Head from 'next/head';
import Navbar from '@/components/home/Navbar';
import PackageRegistration from './FomulaireColis';
import RouteSelection from './CheminColis';
import PaymentStep from './paymentStep';

// Interface pour les données du colis (de PackageRegistration)
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
  declaredValue: string; // Ajouté depuis PackageRegistration pour l'assurance
  isInsured: boolean;    // Ajouté depuis PackageRegistration pour l'assurance
}

// Interface pour les données globales du formulaire d'expédition,
// y compris celles gérées par RouteSelection et celles nécessaires pour PaymentStep
interface ShippingFormDataGlobal {
  // Champs gérés par RouteSelection
  departurePointName: string;
  arrivalPointName: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  departurePointId?: number | null;
  arrivalPointId?: number | null;
  distance?: number; // Distance calculée par RouteSelection

  // Champ pour PaymentStep (assurance/compensation)
  compensation: number; // Sera la valeur de l'assurance calculée ou 0

  // Champs optionnels que vous pourriez vouloir conserver
  country: string;
  // Le poids du colis sera directement pris de `packageDataForParent` pour PaymentStep
}


const ShippingSteps = ({ currentStep = 1 }: { currentStep?: number }) => {
  const steps = [
    { number: 1, title: ["Description", "du colis"], icon: <TruckIcon className="w-7 h-7" /> },
    { number: 2, title: ["Choix", "du trajet"], icon: <MapPinIcon className="w-7 h-7" /> },
    { number: 3, title: ["Paiement", "& Confirmation"], icon: <CreditCardIcon className="w-7 h-7" /> },
    // { number: 4, title: ["Où se trouve", "mon colis"], icon: <InformationCircleIcon className="w-7 h-7" /> } // Optionnel pour une étape de suivi
  ];

  return (
    <div className="flex justify-center items-center mb-10 sm:mb-16 w-full px-2">
      <div className="flex justify-between items-start w-full max-w-4xl"> {/* max-w-4xl pour un peu plus d'espace */}
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
              <div className={`flex-1 h-1 mt-6 sm:mt-7 ${ /* Ajustement de la position de la ligne */
                step.number < currentStep ? "bg-green-500" : "bg-gray-300"
              } mx-2 self-start transition-colors duration-300`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ShippingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
    compensation: 0, // Initialisé à 0
    country: 'Cameroun',
  });

  // Charger les données depuis localStorage au montage
  useEffect(() => {
    const savedPackageDataString = localStorage.getItem('packageData');
    const savedShippingFormDataString = localStorage.getItem('shippingFormDataGlobal');

    if (savedPackageDataString) {
      try {
        setPackageDataForParent(JSON.parse(savedPackageDataString));
      } catch (e) { console.error("Erreur parsing packageData:", e); }
    }

    if (savedShippingFormDataString) {
      try {
        const parsedFormData = JSON.parse(savedShippingFormDataString);
        setFormDataGlobal(prev => ({
          ...prev,
          ...parsedFormData,
          compensation: parsedFormData.compensation || 0, // S'assurer que compensation a une valeur
        }));
      } catch (e) { console.error("Erreur parsing shippingFormDataGlobal:", e); }
    }

    const savedCurrentStep = localStorage.getItem('shippingCurrentStep');
    if (savedCurrentStep) {
        const step = parseInt(savedCurrentStep, 10);
        if (step >= 1 && step <= 3) { // Limiter aux étapes valides pour reprise
             setCurrentStep(step);
        }
    }

  }, []);

  // Sauvegarder formDataGlobal et currentStep dans localStorage
  useEffect(() => {
    if (Object.keys(formDataGlobal).some(key => formDataGlobal[key as keyof ShippingFormDataGlobal] !== '' && formDataGlobal[key as keyof ShippingFormDataGlobal] !== null && formDataGlobal[key as keyof ShippingFormDataGlobal] !== 0)) { // Sauvegarder si pas vide
        localStorage.setItem('shippingFormDataGlobal', JSON.stringify(formDataGlobal));
    }
    localStorage.setItem('shippingCurrentStep', currentStep.toString());
  }, [formDataGlobal, currentStep]);

  // Sauvegarder packageDataForParent dans localStorage
  useEffect(() => {
    if (packageDataForParent) {
      localStorage.setItem('packageData', JSON.stringify(packageDataForParent));
    }
  }, [packageDataForParent]);


  const handlePackageSubmit = (data: PackageDataForParent) => {
    setPackageDataForParent(data);
    // Calculer l'assurance (compensation) si l'option est cochée et valeur déclarée existe
    let insuranceAmount = 0;
    if (data.isInsured && data.declaredValue) {
        const declaredVal = parseFloat(data.declaredValue);
        if (!isNaN(declaredVal) && declaredVal > 0) {
            insuranceAmount = declaredVal * 0.05; // 5% de la valeur déclarée
        }
    }
    setFormDataGlobal(prev => ({ ...prev, compensation: insuranceAmount }));
    setCurrentStep(2);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3)); // Limiter à 3 étapes pour l'instant
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Animation fadeIn (optionnel, si non géré globalement)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        // Passer initialData à PackageRegistration si on veut pré-remplir
        return <PackageRegistration onContinue={handlePackageSubmit} />;
      case 2:
        return (
          <RouteSelection
            formData={formDataGlobal} // Utilise l'état global
            setFormData={setFormDataGlobal} // Met à jour l'état global
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        );
      case 3:
        if (!packageDataForParent) {
            console.warn("Données du colis manquantes pour l'étape de paiement. Retour à l'étape 1.");
            setCurrentStep(1);
            return <p className="text-center text-red-500">Données du colis manquantes. Veuillez recommencer.</p>;
        }
        if (!formDataGlobal.departurePointId || !formDataGlobal.arrivalPointId) {
            console.warn("Points de départ/arrivée manquants pour l'étape de paiement. Retour à l'étape 2.");
            setCurrentStep(2);
            return <p className="text-center text-red-500">Sélection des points relais incomplète. Veuillez recommencer.</p>;
        }
        return (
          <PaymentStep
            onBack={handleBackStep}
            // onPaymentSuccess={handleNextStep} // Si vous avez une 4ème étape de confirmation/suivi
            packageData={packageDataForParent} // Passer les données du colis
            formData={formDataGlobal}      // Passer les données globales du formulaire
          />
        );
      // case 4: // Si vous ajoutez une étape de suivi
      //   return ( /* Votre composant de suivi ici */ );
      default:
        return <PackageRegistration onContinue={handlePackageSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Head>
        <title>Expédier un colis - Pick & Drop Link</title>
        <meta name="description" content="Service d'expédition de colis via notre réseau de points relais au Cameroun" />
      </Head>
      <Navbar/>
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800">
            Envoyez vos colis <span className="text-green-600">facilement</span> et en <span className="text-green-600">toute sécurité</span>.
          </h1>
          <p className="mt-2 sm:mt-3 text-md sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Utilisez notre réseau de points relais étendu pour tous vos besoins d'expédition.
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-8 border border-gray-200">
          <ShippingSteps currentStep={currentStep} />
          <div className="mt-6 animate-fadeIn">
            {renderCurrentStep()}
          </div>
        </div>
      </main>

      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <button className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg flex items-center transition-all duration-200 hover:scale-105 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '1s', animationIterationCount: 3 }}>
          <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
          <span className="ml-2 hidden sm:inline text-sm font-medium">Support</span>
        </button>
      </div>
    </div>
  );
};

export default ShippingPage;