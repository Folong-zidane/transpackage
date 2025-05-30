'use client';
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Package, 
  UserX, 
  Shuffle, 
  Clock,
  Search,
  Send,
  CheckCircle,
  XCircle,
  Info,
  Phone,
  MapPin,
  Weight,
  Calendar,
  User,
  CloudLightning // Remplacé 'ShieldOff' par 'CloudLightning' pour 'Colis Endommagé' comme dans votre code
} from 'lucide-react';
import Navbar from '../../components/Navbar'; // Assurez-vous que ce chemin est correct

// Définition explicite du type pour packageInfo pour une meilleure clarté
interface PackageDetails {
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  departurePointName: string;
  arrivalPointName: string;
  packageDescription: string;
  packageWeight: string;
  isFragile: boolean;
  isPerishable: boolean;
  isInsured: boolean;
  declaredValue?: string;
  status: string;
  estimatedArrivalDate?: string;
  isPaid: boolean;
  shippingCost?: string;
  pickupDate?: string;
  retirantName?: string;
  retirantCni?: string;
  retirantCniDate?: string;
  retirantPhone?: string;
  amountPaid?: string;
  changeAmount?: string;
}

const ClaimsManagementPage = () => {
  const [selectedClaimType, setSelectedClaimType] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [packageInfo, setPackageInfo] = useState<PackageDetails | null>(null); // Type explicite
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchError, setSearchError] = useState('');

  const claimTypes = [
    {
      id: 'lost',
      title: 'Colis Perdu',
      description: 'Le colis a été égaré et ne peut être localisé',
      icon: Package, // Lucide Icon
      color: 'bg-red-50 border-red-200 text-red-700',
      iconColor: 'text-red-500'
    },
    {
      id: 'wrong_recipient',
      title: 'Mauvais Destinataire',
      description: 'Le colis a été récupéré par une mauvaise personne',
      icon: UserX, // Lucide Icon
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      iconColor: 'text-orange-500'
    },
    {
      id: 'damaged',
      title: 'Colis Endommagé',
      description: 'Le colis est arrivé dans un état endommagé',
      icon: CloudLightning, // Lucide Icon (comme dans votre code)
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      iconColor: 'text-yellow-500'
    },
    {
      id: 'confusion',
      title: 'Confusion de Colis',
      description: 'Erreur d\'identification ou d\'étiquetage du colis',
      icon: Shuffle, // Lucide Icon
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      iconColor: 'text-purple-500'
    },
    {
      id: 'not_collected',
      title: 'Non Retiré',
      description: 'Le destinataire n\'a pas récupéré son colis dans les délais',
      icon: Clock, // Lucide Icon
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      iconColor: 'text-blue-500'
    }
  ];

  const searchPackage = () => {
    if (!trackingNumber.trim()) return;
    
    setIsLoading(true);
    setSearchError('');
    setPackageInfo(null);

    // Simulation de recherche avec les données d'exemple
    setTimeout(() => {
      const query = trackingNumber.toUpperCase();
      let foundPackage: PackageDetails | null = null;
      
      // MOCK DATA (assurez-vous que cela correspond à votre structure de données réelle)
      if (query === 'WDR001XYZ') {
        foundPackage = {
          trackingNumber: query, senderName: 'Émilie Dubois', senderPhone: '+237690112233', recipientName: 'Gaston Lagaffe', recipientPhone: '+237670445566',
          departurePointName: 'Agence Principale (Douala)', arrivalPointName: 'Relais Bastos (Yaoundé)', packageDescription: 'Livres et matériel de dessin', packageWeight: '3.1',
          isFragile: false, isPerishable: false, isInsured: false, status: 'Arrivé au relais', estimatedArrivalDate: '01 Juin 2025',
          isPaid: true,
        };
      } else if (query === 'WDR002PQR') {
        foundPackage = {
          trackingNumber: query, senderName: 'Fatima Zahra', senderPhone: '+237650998877', recipientName: 'Idriss Deby Jr.', recipientPhone: '+237680123456',
          departurePointName: 'Agence Akwa (Douala)', arrivalPointName: 'Relais Logbessou (Douala)', packageDescription: 'Équipement sportif haute performance', packageWeight: '5.5',
          isFragile: false, isPerishable: true, isInsured: true, declaredValue: '75000', status: 'Arrivé au relais',
          isPaid: false, shippingCost: '2500',
        };
      } else if (query === 'PKGOLDDEP') {
        foundPackage = {
          trackingNumber: query, senderName: 'David Atanga', senderPhone: '+237691112233', recipientName: 'Sophie K.', recipientPhone: '+237672223344',
          departurePointName: 'Agence Centrale (Yaoundé)', arrivalPointName: 'Relais Biyem-Assi (Yaoundé)', packageDescription: 'Ordinateur portable et accessoires', packageWeight: '2.8',
          isFragile: true, isPerishable: false, isInsured: true, declaredValue: '350000', status: 'Au départ', estimatedArrivalDate: '05 Juin 2025',
          isPaid: true,
        };
      } else if (query === 'PKGOLDTRN') {
        foundPackage = {
          trackingNumber: query, senderName: 'Linda N.', senderPhone: '+237653334455', recipientName: 'Paul Biya Jr.', recipientPhone: '+237684445566',
          departurePointName: 'Relais Mbouda (Ouest)', arrivalPointName: 'Agence Bonaberi (Douala)', packageDescription: 'Pièces automobiles spécifiques', packageWeight: '12.0',
          isFragile: false, isPerishable: false, isInsured: false, status: 'En transit', estimatedArrivalDate: '03 Juin 2025',
          isPaid: false, shippingCost: '4800',
        };
      } else if (query === 'PKGOLDREC') {
        foundPackage = {
          trackingNumber: query, senderName: 'Marie Claire', senderPhone: '+237677889900', recipientName: 'Jean Baptiste', recipientPhone: '+237655443322',
          departurePointName: 'Agence Douala Port', arrivalPointName: 'Relais Yaoundé Centre Ville', packageDescription: 'Documents officiels urgents', packageWeight: '0.5',
          isFragile: false, isPerishable: false, isInsured: true, declaredValue: '50000', status: 'Reçu', pickupDate: '28 Mai 2025 à 14:30',
          retirantName: 'Jean Baptiste (Lui-même)', retirantCni: '987654321CE', retirantCniDate: '2019-03-10', retirantPhone: '+237655443322',
          isPaid: true, amountPaid: '1500', shippingCost: '1500', changeAmount: '0'
        };
      }
      
      if (foundPackage) {
        setPackageInfo(foundPackage);
      } else {
        setSearchError(`Aucun colis trouvé pour le numéro de suivi : ${query}. Veuillez vérifier et réessayer.`);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const submitClaim = () => {
    if (!selectedClaimType || !packageInfo || !description.trim()) return;
    
    setIsLoading(true);
    
    // Simulation de l'envoi de la réclamation
    // Dans une vraie application, vous appelleriez une API ici
    console.log('Réclamation à envoyer :', {
      trackingNumber: packageInfo.trackingNumber,
      claimType: selectedClaimType,
      description: description,
      packageDetails: packageInfo,
      // Ici, vous pourriez ajouter à qui envoyer, par exemple :
      // notify: packageInfo.recipientEmail or packageInfo.senderEmail or a specific claims department
    });

    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setSelectedClaimType('');
    setTrackingNumber('');
    setPackageInfo(null);
    setDescription('');
    setIsSubmitted(false);
    setSearchError('');
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar /> {/* Navbar doit être dans le fragment racine pour être affichée */}
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 flex items-center justify-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center transform animate-pulse"> {/* Removed animate-pulse for static success message */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Réclamation Envoyée !</h2>
              <p className="text-gray-600 mb-8">
                Votre réclamation concernant le colis <span className="font-semibold">{packageInfo?.trackingNumber}</span> a été transmise avec succès.
                Le propriétaire du colis sera notifié dans les plus brefs délais.
              </p>
              <button
                onClick={resetForm}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Nouvelle Réclamation
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16"> {/* Ajout de padding-top si Navbar est fixe/absolute */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Gestion des Réclamations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interface dédiée aux responsables de points relais pour signaler des problèmes de colis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Section de recherche */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Search className="w-6 h-6 mr-3 text-green-600" />
              1. Rechercher le Colis
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="trackingNumberInput" className="block text-sm font-semibold text-gray-700 mb-2">
                  Numéro de Suivi
                </label>
                <div className="flex gap-3">
                  <input
                    id="trackingNumberInput"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                    placeholder="Ex: WDR001XYZ"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    onClick={searchPackage}
                    disabled={isLoading || !trackingNumber.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {isLoading && packageInfo === null ? ( // Affiche le spinner seulement pendant la recherche initiale
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {searchError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">{searchError}</span>
                  </div>
                )}
              </div>

              {/* Informations du colis */}
              {packageInfo && (
                <div className="bg-gray-50 rounded-xl p-6 animate-fadeIn">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-green-600" />
                    Informations du Colis ({packageInfo.trackingNumber})
                  </h3>
                  <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <InfoItem icon={User} label="Expéditeur" value={packageInfo.senderName} />
                    <InfoItem icon={User} label="Destinataire" value={packageInfo.recipientName} />
                    <InfoItem icon={Phone} label="Tél Exp" value={packageInfo.senderPhone} />
                    <InfoItem icon={Phone} label="Tél Dest" value={packageInfo.recipientPhone} />
                    <InfoItem icon={MapPin} label="Départ" value={packageInfo.departurePointName} />
                    <InfoItem icon={MapPin} label="Arrivée" value={packageInfo.arrivalPointName} />
                    <InfoItem icon={Package} label="Description" value={packageInfo.packageDescription} />
                    <InfoItem icon={Weight} label="Poids" value={`${packageInfo.packageWeight} kg`} />
                    <InfoItem icon={Info} label="Statut" value={packageInfo.status} />
                    {packageInfo.estimatedArrivalDate && (
                       <InfoItem icon={Calendar} label="Arrivée prévue" value={packageInfo.estimatedArrivalDate} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section de réclamation */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${!packageInfo ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-green-600" />
              2. Type de Réclamation
            </h2>

            <div className="space-y-3 mb-6">
              {claimTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => packageInfo && setSelectedClaimType(type.id)}
                    disabled={!packageInfo || isLoading}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed ${
                      selectedClaimType === type.id
                        ? type.color + ' border-current scale-[1.01]'
                        : 'bg-white border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        selectedClaimType === type.id ? type.iconColor : 'text-gray-400'
                      }`} />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-700 text-sm">{type.title}</h3>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Description détaillée */}
            {packageInfo && selectedClaimType && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    3. Description du Problème
                </h2>
                <div>
                  <label htmlFor="descriptionTextarea" className="block text-sm font-semibold text-gray-700 mb-2">
                    Détails pour le colis <span className='font-bold'>{packageInfo.trackingNumber}</span>
                  </label>
                  <textarea
                    id="descriptionTextarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez en détails le problème rencontré avec ce colis..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={submitClaim}
                  disabled={!packageInfo || !selectedClaimType || !description.trim() || isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3.5 rounded-lg font-bold text-md transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center"
                >
                  {isLoading && isSubmitted === false ? ( // Spinner seulement pour la soumission de la réclamation
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  ) : (
                    <Send className="w-5 h-5 mr-3" />
                  )}
                  {isLoading && isSubmitted === false ? 'Envoi en cours...' : 'Envoyer la Réclamation'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions d'aide */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start">
            <Info className="w-6 h-6 text-blue-600 mr-4 mt-1 shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Comment utiliser cette interface ?</h3>
              <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                <li>Recherchez le colis concerné en saisissant son numéro de suivi.</li>
                <li>Une fois le colis trouvé, sélectionnez le type de problème rencontré.</li>
                <li>Décrivez en détails la situation dans la zone de texte.</li>
                <li>Cliquez sur "Envoyer la Réclamation" pour alerter le propriétaire du colis.</li>
              </ol>
              <p className="text-blue-600 text-xs italic mt-3">
                <strong>Numéros de suivi pour test:</strong> WDR001XYZ, WDR002PQR, PKGOLDDEP, PKGOLDTRN, PKGOLDREC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Petit composant pour afficher les informations du colis de manière répétitive
const InfoItem: React.FC<{icon: React.ElementType, label: string, value?: string | number | null}> = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start py-1">
      <Icon className="w-4 h-4 mr-2 text-gray-400 mt-0.5 shrink-0" />
      <span className="text-gray-700"><strong className="text-gray-500 font-medium">{label}:</strong> {value}</span>
    </div>
  );
}

export default ClaimsManagementPage;