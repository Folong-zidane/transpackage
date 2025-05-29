// ReceivePackagePage.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  // ... vos imports heroicons ...
  QrCodeIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ArrowUturnLeftIcon,
  TruckIcon,
  UserCircleIcon,
  MapPinIcon as HeroMapPinIcon,
  PhoneIcon as HeroPhoneIcon,
  CubeIcon,
  ScaleIcon,
  ShieldCheckIcon,
  ClockIcon as HeroClockIcon,
  XMarkIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import {
  // ... vos imports lucide-react ...
  Package,
  Sparkles,
  AlertTriangle,
  MessageCircle,
  Home,
  CheckCheck,
  Phone,
  MapPin,
  User,
  Clock,
  Search,
  Loader2,
  ArchiveRestore, // Assurez-vous qu'il est utilisé ou supprimez-le
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // Importez le composant Image de Next.js
import Navbar from '../../components/Navbar';

// ... (interfaces et cardVariants restent les mêmes) ...
interface PackageInfo {
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
  status: 'En transit' | 'Arrivé au relais' | 'Reçu';
  arrivalDate?: string;
  estimatedDeliveryTime?: string;
}

interface ReceivePackagePageProps {
  onBackToHome: () => void; // Gardez ceci si c'est une fonction passée
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};


const ReceivePackagePage: React.FC<ReceivePackagePageProps> = ({ onBackToHome }) => {
  // ... (tous vos états et fonctions restent les mêmes)
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReceiving, setIsReceiving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const decodeQRFromCanvas = (): string | null => {
    if (!videoRef.current || !canvasRef.current || !videoRef.current.videoWidth || !videoRef.current.videoHeight) return null;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const video = videoRef.current;
    if (!context) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const mockDetection = Math.random() > 0.85;
      if (mockDetection) {
        const mockCodes = ['RCV123ABC', 'ARR456DEF', 'PKG789GHI', 'TRK321JKL', 'DLV654MNO'];
        return mockCodes[Math.floor(Math.random() * mockCodes.length)];
      }
    } catch (e) {
      console.error("Canvas draw error:", e);
      return null;
    }
    return null;
  };

  const startScanInterval = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    scanIntervalRef.current = setInterval(() => {
      if (!isScanning || !streamRef.current) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        return;
      }
      const detectedCode = decodeQRFromCanvas();
      if (detectedCode) {
        setSearchInput(detectedCode.toUpperCase());
        handleStopScan(true);
        setTimeout(() => handleSearchPackage(detectedCode.toUpperCase()), 100);
      }
    }, 500);
  };

  const handleScanQRCode = async () => {
    setIsScanning(true);
    setError(null);
    setPackageInfo(null);
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 360 },
          height: { ideal: 360 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        startScanInterval();
        scanTimeoutRef.current = setTimeout(() => {
          if (isScanning && streamRef.current) {
            handleStopScan();
            if (!packageInfo) setError("Aucun QR code n'a pu être détecté. Essayez de mieux positionner le code ou saisissez manuellement.");
          }
        }, 15000);
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
      let msg = "Impossible d'accéder à la caméra. ";
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") msg += "Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.";
        else if (err.name === "NotFoundError") msg += "Aucune caméra compatible n'a été trouvée sur cet appareil.";
        else msg += "Une erreur technique est survenue avec la caméra.";
      } else {
        msg += "Veuillez vérifier les permissions de la caméra.";
      }
      setError(msg);
      setIsScanning(false);
    }
  };

  const handleStopScan = (codeFound = false) => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    scanIntervalRef.current = null;
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    scanTimeoutRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    }
    if (!codeFound) {
        setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);


  const handleSearchPackage = async (value?: string) => {
    if (isScanning) {
        setIsScanning(false);
    }
    const query = (value || searchInput).trim().toUpperCase();
    if (!query) {
      setError('Veuillez entrer un numéro de suivi.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPackageInfo(null);
    setNotificationSent(false);
    setShowSuccessMessage(null);
    if (value && searchInput !== value) setSearchInput(value);
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (query === 'RCV123ABC') {
      setPackageInfo({
        trackingNumber: query, senderName: 'Alice Mbarga', senderPhone: '+237699000001',
        recipientName: 'Bob Nkomo', recipientPhone: '+237677000002',
        departurePointName: 'Relais Mvan (Yaoundé)', arrivalPointName: 'Relais Bonamoussadi (Douala)',
        packageDescription: 'Documents importants scellés et échantillons de tissus', packageWeight: '2.5',
        isFragile: true, isPerishable: false, isInsured: true, declaredValue: '45000',
        status: 'Arrivé au relais', arrivalDate: '29 Mai 2025', estimatedDeliveryTime: '14:30'
      });
    } else if (query === 'ARR456DEF') {
      setPackageInfo({
        trackingNumber: query, senderName: 'Charles Fotso', senderPhone: '+237655000003',
        recipientName: 'Diana Kouam', recipientPhone: '+237688000004',
        departurePointName: 'Relais Omnisport (Yaoundé)', arrivalPointName: 'Relais Makepe (Douala)',
        packageDescription: 'Collection de vêtements et accessoires pour enfants', packageWeight: '1.8',
        isFragile: false, isPerishable: false, isInsured: false,
        status: 'Arrivé au relais', arrivalDate: '28 Mai 2025', estimatedDeliveryTime: '16:45'
      });
    } else if (query === 'PKG789GHI') {
       setPackageInfo({
        trackingNumber: query, senderName: 'Marie Essono', senderPhone: '+237670123456',
        recipientName: 'Jean Biya', recipientPhone: '+237690654321',
        departurePointName: 'Relais Logpom (Douala)', arrivalPointName: 'Relais Deido (Douala)',
        packageDescription: 'Ensemble de composants électroniques fragiles (cartes mères, écrans)', packageWeight: '3.2',
        isFragile: true, isPerishable: false, isInsured: true, declaredValue: '180000',
        status: 'En transit', arrivalDate: '30 Mai 2025', estimatedDeliveryTime: '18:00 (Estimé)'
      });
    } else {
      setError(`Aucun colis trouvé pour le numéro de suivi : ${query}. Veuillez vérifier le numéro et réessayer.`);
    }
    setIsLoading(false);
  };

  const sendWhatsAppNotification = async (pkgInfo: PackageInfo) => {
    const message = `🎉 *COLIS PRÊT AU RETRAIT* 🎉

Bonjour ${pkgInfo.recipientName},

Bonne nouvelle ! Votre colis est arrivé et est prêt à être récupéré au point relais.

📦 *Détails du Colis :*
N° de Suivi : *${pkgInfo.trackingNumber}*
Description : ${pkgInfo.packageDescription}
Poids : ${pkgInfo.packageWeight} kg
Expéditeur : ${pkgInfo.senderName}

📍 *Lieu de Retrait :*
*${pkgInfo.arrivalPointName}*

${pkgInfo.isFragile ? '⚠️ *Attention : Colis fragile, à manipuler avec soin.*\n' : ''}${pkgInfo.isPerishable ? '🧊 *Attention : Contenu périssable, à récupérer rapidement.*\n' : ''}${pkgInfo.isInsured && pkgInfo.declaredValue ? `💎 *Colis assuré* (Valeur déclarée : ${parseFloat(pkgInfo.declaredValue).toLocaleString('fr-CM')} FCFA)\n` : ''}
Veuillez vous munir d'une pièce d'identité pour le retrait.

Nous vous remercions de votre confiance !
L'équipe ${process.env.NEXT_PUBLIC_APP_NAME || "Colis Express"} 🚚✨`;
    await new Promise(resolve => setTimeout(resolve, 1800));
    console.log('Message WhatsApp (simulé) envoyé à :', pkgInfo.recipientPhone);
    console.log('Contenu du Message :', message);
    return true;
  };

  const handleConfirmReception = async () => {
    if (!packageInfo || packageInfo.status === 'En transit') return;
    setIsReceiving(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await sendWhatsAppNotification(packageInfo);
      setNotificationSent(true);
      setShowSuccessMessage(`Réception du colis ${packageInfo.trackingNumber} confirmée ! Notification envoyée à ${packageInfo.recipientName}.`);
      setPackageInfo(prev => prev ? { ...prev, status: 'Reçu' } : null);
    } catch (err) {
      console.error("Erreur lors de la confirmation ou notification:", err);
      setError("Une erreur est survenue lors de la confirmation de la réception. Veuillez réessayer.");
    } finally {
      setIsReceiving(false);
    }
  };

  const getStatusColorClasses = (status: PackageInfo['status']) => {
    switch (status) {
      case 'En transit': return 'bg-gradient-to-r from-orange-400 to-amber-500 text-white'; // Orange/Ambre pour en transit
      case 'Arrivé au relais': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white';
      case 'Reçu': return 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white';
      default: return 'bg-gradient-to-r from-slate-500 to-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: PackageInfo['status']) => {
    switch (status) {
      case 'En transit': return <TruckIcon className="w-7 h-7" />;
      case 'Arrivé au relais': return <CheckCircleIcon className="w-7 h-7" />;
      case 'Reçu': return <CheckCheck className="w-7 h-7" />;
      default: return <Package className="w-7 h-7" />;
    }
  };


  return (
<div className="min-h-screen bg-slate-50 p-3 sm:p-6 font-sans relative overflow-hidden">
  <Navbar />
  {/* Image décorative grande et visible à gauche */}
  <div className="fixed top-0 left-0 w-1/3 h-full hidden lg:flex items-center justify-center z-0 pointer-events-none">
    <div className="relative w-full h-full max-w-md">
      {/* Fond dégradé pour améliorer la visibilité */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 via-emerald-50/20 to-transparent rounded-r-3xl"></div>
      
      {/* Image principale */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <Image
          src="/images/manu3.avif"
          alt="Illustration de livraison"
          width={400}
          height={400}
          className="w-80 h-100 xl:w-96 xl:h-96 object-contain opacity-90 hover:opacity-30 transition-opacity duration-300"
          priority
        />
      </div>
      
      {/* Éléments décoratifs supplémentaires */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-green-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-emerald-300/20 rounded-full blur-lg"></div>
      <div className="absolute top-1/2 left-5 w-8 h-8 bg-teal-200/40 rounded-full blur-md"></div>
    </div>
  </div>

  {/* Version mobile/tablette - image plus petite en haut */}
  <div className="absolute top-10 right-10 lg:hidden z-0 pointer-events-none">
    <Image
      src="/images/manu3.avif"
      alt="Illustration de livraison"
      width={200}
      height={200}
      className="w-32 h-32 sm:w-40 sm:h-40 object-contain opacity-15"
    />
  </div>

  {/* Contenu principal avec marge à gauche sur grand écran */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-4xl mx-auto lg:ml-auto lg:mr-8 xl:mr-16 relative z-10 lg:w-2/3 top-10"
  >
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={onBackToHome}
            className="mb-4 group flex items-center text-green-600 hover:text-green-700 transition-colors duration-200 text-sm font-medium"
          >
            <motion.span whileHover={{ x: -2 }}>
              <ArrowUturnLeftIcon className="w-4 h-4 mr-1.5" />
            </motion.span>
            {/* Assurez-vous que onBackToHome est une fonction ou remplacez par Link si c'est une navigation Next.js */}
             <Link href='/PickDropPoint/app/home'>Retour à l'accueil</Link>
          </button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg"
            >
              <TruckIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              Réception de Colis
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
              Scannez un code QR ou entrez un numéro de suivi pour confirmer la réception et notifier le destinataire.
            </p>
          </div>
        </div>

        {/* ... (Le reste de votre JSX pour Search, Scan, PackageInfo, etc. reste ici à l'intérieur de ce motion.div) ... */}
         {/* Search and Scan Section */}
         <AnimatePresence>
          {!packageInfo && !isScanning && (
            <motion.div
              key="search-scan-section"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-5 sm:p-6 mb-6" // Ajout de backdrop-blur
            >
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-grow w-full">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                      placeholder="N° de suivi (ex: RCV123ABC)"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors duration-200 hover:border-slate-400 bg-white/70" // Ajout de bg-white/70
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchPackage()}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSearchPackage()}
                    disabled={isLoading || !searchInput.trim()}
                    className="w-full sm:w-auto flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-3 px-6 rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                    )}
                    Rechercher
                  </motion.button>
                </div>

                <div className="flex items-center my-3">
                  <hr className="flex-grow border-slate-200" />
                  <span className="px-3 text-xs font-medium text-slate-500">OU</span>
                  <hr className="flex-grow border-slate-200" />
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleScanQRCode}
                  disabled={isLoading || isScanning}
                  className="w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-sm font-medium py-3 px-5 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                >
                  <QrCodeIcon className="w-5 h-5 mr-2" />
                  Scanner un Code QR
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Scanner UI */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              key="scanner-ui"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 mb-6 text-center" // Ajout de backdrop-blur
            >
              <p className="text-slate-300 text-sm mb-3">
                Positionnez le code QR du colis dans le cadre.
              </p>
              <div className="relative max-w-xs mx-auto aspect-square bg-black rounded-lg overflow-hidden shadow-inner border-2 border-slate-700">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-green-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.7)]"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-slate-400 rounded-tl-md"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-slate-400 rounded-tr-md"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-slate-400 rounded-bl-md"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-slate-400 rounded-br-md"></div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStopScan()}
                className="mt-5 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white py-2.5 px-6 rounded-lg font-medium text-sm shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              >
                <XMarkIcon className="w-5 h-5 inline mr-1.5" /> Annuler le Scan
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
        {isLoading && !packageInfo && (
            <motion.div
            key="loading-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center text-center py-10 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200" // Ajout de backdrop-blur
            >
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-slate-700">
                Recherche du colis{' '}
                <span className="font-bold text-green-600">{searchInput}</span>...
            </p>
            <p className="text-sm text-slate-500">Veuillez patienter un instant.</p>
            </motion.div>
        )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center bg-red-50/80 backdrop-blur-sm text-red-700 border border-red-200 p-3.5 rounded-lg shadow-sm mb-6 text-sm" // Ajout de backdrop-blur
              role="alert"
            >
              <AlertTriangle className="w-5 h-5 mr-2.5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              key="success-general-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center bg-green-50/80 backdrop-blur-sm text-green-700 border border-green-200 p-3.5 rounded-lg shadow-sm mb-6 text-sm" // Ajout de backdrop-blur
              role="alert"
            >
              <CheckCircleIcon className="w-5 h-5 mr-2.5 flex-shrink-0" />
              <span className="font-medium">{showSuccessMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Package Information Display */}
        <AnimatePresence>
        {packageInfo && (
            <motion.div
                key={`package-${packageInfo.trackingNumber}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
            >
            {/* Main Package Card */}
            <div className={`rounded-xl shadow-xl overflow-hidden border ${
                packageInfo.status === 'Arrivé au relais' ? 'border-green-300' :
                packageInfo.status === 'En transit' ? 'border-orange-300' : // Orange pour en transit
                packageInfo.status === 'Reçu' ? 'border-teal-300' : 'border-slate-300'
            } bg-white/70 backdrop-blur-md`}> {/* Ajout de backdrop-blur ici aussi */}
                <div className={`p-5 sm:p-6 ${getStatusColorClasses(packageInfo.status)}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                        Colis <span className="font-mono">{packageInfo.trackingNumber}</span>
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-white/25 backdrop-blur-sm shadow">
                        <HeroClockIcon className="w-4 h-4 mr-1.5" />
                        {packageInfo.status}
                    </span>
                    </div>
                    <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="p-2 bg-white/30 rounded-full shadow-md"
                    >
                    {getStatusIcon(packageInfo.status)}
                    </motion.div>
                </div>
                </div>

                <div className="p-5 sm:p-6 space-y-6"> {/* Pas besoin de backdrop-blur ici car le parent l'a */}
                {/* Sender & Recipient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {[
                    { title: 'Expéditeur', name: packageInfo.senderName, phone: packageInfo.senderPhone, icon: User, color: 'text-green-600' },
                    { title: 'Destinataire', name: packageInfo.recipientName, phone: packageInfo.recipientPhone, icon: UserCircleIcon, color: 'text-emerald-600' }
                    ].map(person => (
                    <div key={person.title} className="flex items-start space-x-3">
                        <person.icon className={`w-5 h-5 ${person.color} mt-1 flex-shrink-0`} />
                        <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{person.title}</p>
                        <p className="font-semibold text-slate-800 text-sm">{person.name}</p>
                        <a href={`tel:${person.phone}`} className="text-xs text-slate-600 hover:text-green-600 transition-colors flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {person.phone}
                        </a>
                        </div>
                    </div>
                    ))}
                </div>

                {/* Journey & Arrival Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-200 pt-5">
                    <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trajet</p>
                        <p className="font-semibold text-slate-700 text-sm">{packageInfo.departurePointName}</p>
                        <div className="flex items-center text-xs text-slate-500 my-0.5">
                        <TruckIcon className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        <span>vers</span>
                        </div>
                        <p className="font-semibold text-slate-700 text-sm">{packageInfo.arrivalPointName}</p>
                    </div>
                    </div>
                    {(packageInfo.arrivalDate || packageInfo.estimatedDeliveryTime) && (
                    <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-lime-600 mt-1 flex-shrink-0" />
                        <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Arrivée au point relais</p>
                        {packageInfo.arrivalDate && <p className="font-semibold text-slate-700 text-sm">{packageInfo.arrivalDate}</p>}
                        {packageInfo.estimatedDeliveryTime && <p className="text-xs text-slate-600">Heure estimée: {packageInfo.estimatedDeliveryTime}</p>}
                        </div>
                    </div>
                    )}
                </div>

                {/* Package Details */}
                <div className="border-t border-slate-200 pt-5">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center text-sm">
                    <CubeIcon className="w-5 h-5 mr-2 text-green-500" />
                    Détails du Colis
                    </h4>
                    <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-slate-600">Description:</span> {packageInfo.packageDescription}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center">
                            <ScaleIcon className="w-4 h-4 mr-1 text-slate-500" />
                            <span className="font-medium text-slate-600">Poids:</span>
                            <span className="font-semibold ml-1">{packageInfo.packageWeight} kg</span>
                        </div>
                        {packageInfo.isFragile && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Fragile
                        </span>
                        )}
                        {packageInfo.isPerishable && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700 border border-sky-200">
                            🧊 Périssable
                        </span>
                        )}
                        {packageInfo.isInsured && packageInfo.declaredValue && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <ShieldCheckIcon className="w-3.5 h-3.5 mr-1" /> Assuré ({parseFloat(packageInfo.declaredValue).toLocaleString('fr-CM')} FCFA)
                        </span>
                        )}
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Action Buttons Area */}
            {packageInfo.status !== 'Reçu' && (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-5 sm:p-6 rounded-xl shadow-lg border ${
                    packageInfo.status === 'Arrivé au relais' ? 'bg-green-50/80 border-green-200' : 'bg-slate-50/80 border-slate-200' // Ajout de /80 pour semi-transparence
                } backdrop-blur-md`} // Ajout de backdrop-blur
                >
                <div className="text-center space-y-3">
                    <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                        packageInfo.status === 'Arrivé au relais' ? 'bg-green-500' : 'bg-slate-400'
                    }`}
                    >
                    <CheckCircleIcon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className={`text-lg sm:text-xl font-bold ${
                        packageInfo.status === 'Arrivé au relais' ? 'text-green-800' : 'text-slate-700'
                    }`}>
                    Confirmer la Réception du Colis
                    </h3>
                    <p className={`text-sm ${
                        packageInfo.status === 'Arrivé au relais' ? 'text-green-700' : 'text-slate-600'
                    } max-w-md mx-auto`}>
                    {packageInfo.status === 'Arrivé au relais'
                        ? "Validez la réception pour notifier le destinataire par WhatsApp."
                        : "Ce colis est encore en transit. Vous pourrez confirmer sa réception une fois arrivé au point relais."
                    }
                    </p>

                    <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConfirmReception}
                    disabled={isReceiving || packageInfo.status === 'En transit'}
                    className={`w-full sm:w-auto flex items-center justify-center text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        packageInfo.status === 'Arrivé au relais'
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        : 'bg-slate-400 cursor-not-allowed'
                    }`}
                    >
                    {isReceiving ? (
                        <Loader2 className="w-5 h-5 mr-2.5 animate-spin" />
                    ) : (
                        <MessageCircle className="w-5 h-5 mr-2.5" />
                    )}
                    {isReceiving ? 'Confirmation...' : 'Confirmer & Notifier Destinataire'}
                    {packageInfo.status === 'Arrivé au relais' && !isReceiving && <Sparkles className="w-4 h-4 ml-2 text-yellow-300 opacity-80" />}
                    </motion.button>
                </div>
                </motion.div>
            )}

            {/* Reception Success and Notification Sent */}
            {notificationSent && packageInfo.status === 'Reçu' && (
                <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150 }}
                className="bg-gradient-to-br from-emerald-50/80 via-teal-50/80 to-cyan-50/80 border-2 border-emerald-200 rounded-xl shadow-lg p-5 sm:p-6 text-center backdrop-blur-md" // Ajout de backdrop-blur et /80
                >
                <motion.div
                    initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-3 sm:mb-4 shadow-lg"
                >
                    <BellAlertIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white animate-pulse" style={{animationDuration: '1.5s'}} />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">
                    Réception Confirmée avec Succès !
                </h3>
                <p className="text-emerald-700 text-sm sm:text-base mb-4">
                    Une notification WhatsApp a été envoyée à <strong className="font-semibold">{packageInfo.recipientName}</strong> ({packageInfo.recipientPhone}).
                </p>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(16, 185, 129, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setPackageInfo(null); // Réinitialiser pour une nouvelle recherche
                        setSearchInput('');
                        setError(null);
                        setShowSuccessMessage(null);
                        setNotificationSent(false);
                        // onBackToHome(); // Si vous voulez naviguer, sinon juste réinitialiser la page
                    }}
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    <ArchiveRestore className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Recevoir un autre colis
                </motion.button>
                </motion.div>
            )}
            </motion.div>
        )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default ReceivePackagePage;