// WithdrawPackagePage.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
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
  IdentificationIcon,
  PrinterIcon, // PencilIcon as EditIcon was removed
  CalendarDaysIcon,
  CurrencyDollarIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import {
  Package,
  Sparkles,
  AlertTriangle,
  Home,
  CheckCheck,
  Phone,
  MapPin,
  User,
  Clock,
  Search,
  Loader2,
  ArchiveRestore,
  ClipboardSignature,
  FileText,
  CreditCard,
  DollarSign,
  Building,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
// import DigitalSignature from '../emit-package/Sign'; // Signature component removed
import jsPDF from 'jspdf';
import OriginalQRCode from 'qrcode'; // Renamed to avoid conflict with HeroIcon

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
  status: 'Au départ' | 'En transit' | 'Arrivé au relais' | 'Reçu';
  estimatedArrivalDate?: string;
  pickupDate?: string;
  retirantName?: string;
  retirantCni?: string;
  retirantCniDate?: string;
  retirantPhone?: string;
  retirantSignature?: string; // This will now typically be undefined
  isPaid: boolean;
  shippingCost?: string;
  amountPaid?: string;
  changeAmount?: string;
}

interface RetirantInfo {
  name: string;
  cni: string;
  cniDate: string;
  phone: string;
  // signatureDataUrl?: string; // Removed as digital signature is no longer used
}

interface WithdrawPackagePageProps {}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Pick & Drop Link";

const WithdrawPackagePage: React.FC<WithdrawPackagePageProps> = ({}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentWithdrawStep, setCurrentWithdrawStep] = useState<'details' | 'payment' | 'recipient' | 'completed'>('details');
  const [retirantInfo, setRetirantInfo] = useState<RetirantInfo>({ name: '', cni: '', cniDate: '', phone: '' });
  const [isConfirmingWithdrawal, setIsConfirmingWithdrawal] = useState(false);
  const [showWithdrawalSuccess, setShowWithdrawalSuccess] = useState(false);
  
  const [amountPaid, setAmountPaid] = useState('');
  const [changeAmount, setChangeAmount] = useState('0');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetPageState = () => {
    setSearchInput(''); setIsLoading(false); setPackageInfo(null); setError(null);
    setCurrentWithdrawStep('details');
    setRetirantInfo({ name: '', cni: '', cniDate: '', phone: '' });
    setIsConfirmingWithdrawal(false); setShowWithdrawalSuccess(false);
    setAmountPaid(''); setChangeAmount('0');
  };

  const decodeQRFromCanvas = (): string | null => {
    if (!videoRef.current || !canvasRef.current || !videoRef.current.videoWidth || !videoRef.current.videoHeight) return null;
    const canvas = canvasRef.current; const context = canvas.getContext('2d', { willReadFrequently: true });
    const video = videoRef.current; if (!context) return null;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (Math.random() > 0.85) return ['WDR001XYZ', 'WDR002PQR', 'PKGOLDDEP', 'PKGOLDTRN', 'PKGOLDREC'][Math.floor(Math.random() * 5)];
    } catch (e) { console.error("Canvas draw error:", e); } return null;
  };

  const startScanInterval = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    scanIntervalRef.current = setInterval(() => {
      if (!isScanning || !streamRef.current) { if (scanIntervalRef.current) clearInterval(scanIntervalRef.current); return; }
      const detectedCode = decodeQRFromCanvas();
      if (detectedCode) {
        setSearchInput(detectedCode.toUpperCase()); handleStopScan(true);
        setTimeout(() => handleSearchPackage(detectedCode.toUpperCase()), 100);
      }
    }, 500);
  };

  const handleScanQRCode = async () => {
    setIsScanning(true); setError(null); setPackageInfo(null); resetWithdrawState();
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 360 }, height: { ideal: 360 } } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream; await videoRef.current.play(); startScanInterval();
        scanTimeoutRef.current = setTimeout(() => {
          if (isScanning && streamRef.current) { handleStopScan(); if (!packageInfo) setError("Aucun QR code détecté après 15 secondes."); }
        }, 15000);
      }
    } catch (err) {
      let msg = "Erreur d'accès à la caméra. ";
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") msg += "Veuillez autoriser l'accès à la caméra.";
        else if (err.name === "NotFoundError") msg += "Aucune caméra compatible n'a été trouvée."; else msg += "Détail: " + err.message;
      } setError(msg); setIsScanning(false);
    }
  };

  const handleStopScan = (codeFound = false) => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current); scanIntervalRef.current = null;
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current); scanTimeoutRef.current = null;
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; if (videoRef.current) videoRef.current.srcObject = null; }
    if (!codeFound) setIsScanning(false);
  };

  useEffect(() => () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
  }, []);

  const resetWithdrawState = () => {
    setCurrentWithdrawStep('details');
    setRetirantInfo({ name: '', cni: '', cniDate: '', phone: '' });
    setIsConfirmingWithdrawal(false); setShowWithdrawalSuccess(false);
    setAmountPaid(''); setChangeAmount('0');
  };

  const handleSearchPackage = async (value?: string) => {
    if (isScanning) handleStopScan(true);
    const query = (value || searchInput).trim().toUpperCase();
    if (!query) { setError('Veuillez entrer un numéro de suivi pour la recherche.'); return; }
    setIsLoading(true); setError(null); setPackageInfo(null); resetWithdrawState();
    if (value && searchInput !== value) setSearchInput(value);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (query === 'WDR001XYZ') {
      setPackageInfo({
        trackingNumber: query, senderName: 'Émilie Dubois', senderPhone: '+237690112233', recipientName: 'Gaston Lagaffe', recipientPhone: '+237670445566',
        departurePointName: 'Agence Principale (Douala)', arrivalPointName: 'Relais Bastos (Yaoundé)', packageDescription: 'Livres et matériel de dessin', packageWeight: '3.1',
        isFragile: false, isPerishable: false, isInsured: false, status: 'Arrivé au relais', estimatedArrivalDate: '01 Juin 2025',
        isPaid: true,
      });
    } else if (query === 'WDR002PQR') {
      setPackageInfo({
        trackingNumber: query, senderName: 'Fatima Zahra', senderPhone: '+237650998877', recipientName: 'Idriss Deby Jr.', recipientPhone: '+237680123456',
        departurePointName: 'Agence Akwa (Douala)', arrivalPointName: 'Relais Logbessou (Douala)', packageDescription: 'Équipement sportif haute performance', packageWeight: '5.5',
        isFragile: false, isPerishable: true, isInsured: true, declaredValue: '75000', status: 'Arrivé au relais',
        isPaid: false, shippingCost: '2500',
      });
    } else if (query === 'PKGOLDDEP') {
      setPackageInfo({
        trackingNumber: query, senderName: 'David Atanga', senderPhone: '+237691112233', recipientName: 'Sophie K.', recipientPhone: '+237672223344',
        departurePointName: 'Agence Centrale (Yaoundé)', arrivalPointName: 'Relais Biyem-Assi (Yaoundé)', packageDescription: 'Ordinateur portable et accessoires', packageWeight: '2.8',
        isFragile: true, isPerishable: false, isInsured: true, declaredValue: '350000', status: 'Au départ', estimatedArrivalDate: '05 Juin 2025',
        isPaid: true,
      });
    } else if (query === 'PKGOLDTRN') {
      setPackageInfo({
        trackingNumber: query, senderName: 'Linda N.', senderPhone: '+237653334455', recipientName: 'Paul Biya Jr.', recipientPhone: '+237684445566',
        departurePointName: 'Relais Mbouda (Ouest)', arrivalPointName: 'Agence Bonaberi (Douala)', packageDescription: 'Pièces automobiles spécifiques', packageWeight: '12.0',
        isFragile: false, isPerishable: false, isInsured: false, status: 'En transit', estimatedArrivalDate: '03 Juin 2025',
        isPaid: false, shippingCost: '4800',
      });
    } else if (query === 'PKGOLDREC') {
      setPackageInfo({
        trackingNumber: query, senderName: 'Marie Claire', senderPhone: '+237677889900', recipientName: 'Jean Baptiste', recipientPhone: '+237655443322',
        departurePointName: 'Agence Douala Port', arrivalPointName: 'Relais Yaoundé Centre Ville', packageDescription: 'Documents officiels urgents', packageWeight: '0.5',
        isFragile: false, isPerishable: false, isInsured: true, declaredValue: '50000', status: 'Reçu', pickupDate: '28 Mai 2025 à 14:30',
        retirantName: 'Jean Baptiste (Lui-même)', retirantCni: '987654321CE', retirantCniDate: '2019-03-10', retirantPhone: '+237655443322',
        isPaid: true, amountPaid: '1500', shippingCost: '1500', changeAmount: '0'
      });
    } else { setError(`Aucun colis trouvé pour le numéro de suivi : ${query}. Veuillez vérifier et réessayer.`); }
    setIsLoading(false);
  };

  useEffect(() => {
    if (packageInfo && !packageInfo.isPaid && packageInfo.shippingCost && amountPaid) {
      const cost = parseFloat(packageInfo.shippingCost);
      const paid = parseFloat(amountPaid);
      if (!isNaN(cost) && !isNaN(paid)) {
        const change = paid - cost;
        setChangeAmount(change >= 0 ? change.toFixed(0) : '0');
      } else {
        setChangeAmount('0');
      }
    }
  }, [amountPaid, packageInfo]);

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setAmountPaid(value);
    }
  };

  const proceedToRecipientInfo = () => {
    if (packageInfo && !packageInfo.isPaid && packageInfo.shippingCost) {
      const cost = parseFloat(packageInfo.shippingCost);
      const paid = parseFloat(amountPaid);
      if (isNaN(paid) || paid < cost) {
        setError(`Le montant payé (${paid || 0} FCFA) est insuffisant. Coût de livraison requis: ${cost} FCFA.`);
        return;
      }
    }
    setError(null);
    setCurrentWithdrawStep('recipient');
  };

  const handleRetirantInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRetirantInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const proceedToConfirmation = () => { // Renamed from proceedToSignature
    if (!retirantInfo.name.trim() || !retirantInfo.cni.trim() || !retirantInfo.cniDate.trim() || !retirantInfo.phone.trim()) {
      setError("Tous les champs d'information du retirant sont obligatoires."); return;
    }
    if (!/^(?:\+237)?(6|2)(?:[235-9]\d{7})$/.test(retirantInfo.phone.replace(/\s/g, ''))) {
        setError("Format du numéro de téléphone invalide pour le Cameroun."); return;
    }
    setError(null);
    handleConfirmWithdrawal(); // Call confirmation directly, no separate signature step
  };

  const generateWithdrawalPDF = async (pkgInfo: PackageInfo, currentRetirantInfo: RetirantInfo) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = 20;
      const greenColor = [34, 139, 34];

      const addSectionTitle = (title: string) => {
        pdf.setFontSize(14); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
        pdf.text(title, margin, yPosition); yPosition += 8;
        pdf.setFont('helvetica', 'normal'); pdf.setTextColor(0, 0, 0);
      };
      const addField = (label: string, value: string | undefined | null, options?: {boldLabel?: boolean, boldValue?: boolean, isCurrency?: boolean, fullWidth?: boolean}) => {
          if (value === undefined || value === null || String(value).trim() === '') return;
          const labelX = margin; const valueX = options?.fullWidth ? margin : margin + 45;
          const maxWidth = options?.fullWidth ? pageWidth - 2 * margin : pageWidth - margin - valueX;
          pdf.setFontSize(9); pdf.setFont('helvetica', options?.boldLabel ? 'bold' : 'normal'); pdf.text(label, labelX, yPosition);
          pdf.setFont('helvetica', options?.boldValue ? 'bold' : 'normal');
          let displayValue = String(value);
          if (options?.isCurrency && pkgInfo.shippingCost) displayValue += ' FCFA';
          const splitValue = pdf.splitTextToSize(displayValue, maxWidth);
          pdf.text(splitValue, valueX, yPosition); yPosition += (splitValue.length * 4) + 2;
      };
      const drawLine = (yOffset = 0) => {
        pdf.setLineWidth(0.3); pdf.setDrawColor(150, 150, 150);
        pdf.line(margin, yPosition + yOffset, pageWidth - margin, yPosition + yOffset);
        yPosition += (yOffset > 0 ? yOffset : 2) + 3;
      };

      pdf.setFontSize(22); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
      pdf.text(APP_NAME, margin, yPosition - 5);
      pdf.setFontSize(9); pdf.setFont('helvetica', 'italic'); pdf.setTextColor(80, 80, 80);
      pdf.text('Votre solution de retrait de colis simplifiée.', margin, yPosition);
      const qrDataURL = await OriginalQRCode.toDataURL(`Retrait Colis ${APP_NAME}: ${pkgInfo.trackingNumber}`, { width: 110, margin: 1, color: { dark: '#000000', light: '#FFFFFF' } });
      const qrCodeWidth = 25; const qrCodeX = (pageWidth - qrCodeWidth) / 2;
      pdf.addImage(qrDataURL, 'PNG', qrCodeX, yPosition - 12, qrCodeWidth, qrCodeWidth);
      pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(0,0,0);
      pdf.text(`Bordereau de Retrait`, pageWidth - margin - 50, yPosition - 5, {align: 'left'});
      pdf.setFontSize(9); pdf.setFont('helvetica', 'normal');
      pdf.text(`N°: ${pkgInfo.trackingNumber}`, pageWidth - margin - 50, yPosition, {align: 'left'});
      pdf.text(`Date: ${new Date().toLocaleDateString('fr-CM', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth - margin - 50, yPosition + 5, {align: 'left'});
      yPosition += qrCodeWidth - 5; drawLine(2);

      addSectionTitle('Retiré Par');
      addField('Nom Complet:', currentRetirantInfo.name, {boldValue: true});
      addField('N° CNI/Passeport:', currentRetirantInfo.cni);
      if (currentRetirantInfo.cniDate) {
        try { addField('Délivré(e) le:', new Date(currentRetirantInfo.cniDate).toLocaleDateString('fr-CM', { year: 'numeric', month: 'long', day: 'numeric' }));
        } catch (e) { addField('Délivré(e) le:', currentRetirantInfo.cniDate); }
      }
      addField('Téléphone:', currentRetirantInfo.phone); drawLine();

      addSectionTitle('Destinataire Initial du Colis');
      addField('Nom Complet:', pkgInfo.recipientName);
      addField('Téléphone:', pkgInfo.recipientPhone); drawLine();

      addSectionTitle('Détails du Colis');
      addField('Description:', pkgInfo.packageDescription, {fullWidth: true});
      addField('Point de Retrait:', pkgInfo.arrivalPointName);
      let characteristics = [];
      if (pkgInfo.isFragile) characteristics.push("Fragile");
      if (pkgInfo.isPerishable) characteristics.push("Périssable");
      if (pkgInfo.isInsured) characteristics.push("Assuré" + (pkgInfo.declaredValue ? ` (Valeur déclarée: ${pkgInfo.declaredValue} FCFA)` : ''));
      if (characteristics.length > 0) addField('Caractéristiques:', characteristics.join(', '));
      addField('Poids Estimé:', `${pkgInfo.packageWeight} kg`); drawLine();

      addSectionTitle('Statut du Paiement');
      if (pkgInfo.isPaid && !pkgInfo.amountPaid && pkgInfo.shippingCost) {
        addField('Statut:', 'PAYÉ PAR L\'EXPÉDITEUR', {boldValue: true});
        addField('Coût initial livraison:', pkgInfo.shippingCost, {isCurrency: true});
      } else if (pkgInfo.isPaid && !pkgInfo.shippingCost) {
         addField('Statut:', 'PAYÉ PAR L\'EXPÉDITEUR', {boldValue: true});
      } else if (pkgInfo.isPaid && pkgInfo.amountPaid) {
        addField('Statut:', 'PAYÉ AU RETRAIT', {boldValue: true});
        addField('Coût Livraison:', pkgInfo.shippingCost, {isCurrency: true});
        addField('Montant Perçu:', pkgInfo.amountPaid, {isCurrency: true});
        addField('Monnaie Rendue:', pkgInfo.changeAmount, {isCurrency: true});
      } else {
         addField('Statut:', 'ERREUR - Statut de paiement non clair.', {boldValue: true});
      }
      drawLine();
      
      yPosition += 5; addSectionTitle('Conditions de Retrait');
      pdf.setFontSize(8); pdf.setFont('helvetica', 'italic');
      const conditions = `Le signataire confirme avoir reçu le colis décrit ci-dessus en bon état apparent, après vérification de son identité. Le retrait vaut acceptation du colis en l'état. ${APP_NAME} vous remercie de votre confiance.`;
      const splitConditions = pdf.splitTextToSize(conditions, pageWidth - 2 * margin);
      pdf.text(splitConditions, margin, yPosition); yPosition += splitConditions.length * 3.5 + 10;

      const signatureBlockY = Math.max(yPosition, pageHeight - margin - 55); yPosition = signatureBlockY;
      pdf.setFontSize(10); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
      const sigRetirantX = margin; const sigAgenceX = pageWidth / 2 + 10;
      pdf.text('Signature du Retirant:', sigRetirantX, yPosition);
      // Since digital signature is removed, always draw a line for manual signature.
      // RetirantInfo type no longer includes signatureDataUrl.
      pdf.line(sigRetirantX, yPosition + 23, sigRetirantX + 60, yPosition + 23);
      
      pdf.text('Cachet & Signature Agence:', sigAgenceX, yPosition);
      pdf.line(sigAgenceX, yPosition + 23, sigAgenceX + 60, yPosition + 23);

      pdf.setFontSize(8); pdf.setFont('helvetica', 'italic'); pdf.setTextColor(100, 100, 100);
      const footerText = `Document généré le ${new Date().toLocaleString('fr-CM')} par ${APP_NAME}.`;
      const footerTextWidth = pdf.getTextWidth(footerText);
      pdf.text(footerText, (pageWidth - footerTextWidth) / 2, pageHeight - margin + 5);

      pdf.save(`Bordereau_Retrait_${pkgInfo.trackingNumber}_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error('Erreur détaillée lors de la génération du PDF de retrait:', error);
      setError("Une erreur est survenue lors de la génération du bordereau PDF. Veuillez réessayer ou contacter le support.");
    }
  };

  const handleConfirmWithdrawal = async () => { // signatureData parameter removed
    if (!packageInfo) return; 
    setIsConfirmingWithdrawal(true); 
    setError(null);
    
    const finalRetirantInfo = { ...retirantInfo }; // retirantInfo no longer has signatureDataUrl
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedPackageInfo: PackageInfo = {
        ...packageInfo, 
        status: 'Reçu',
        pickupDate: new Date().toLocaleString('fr-CM', { dateStyle: 'long', timeStyle: 'short' }),
        retirantName: finalRetirantInfo.name, 
        retirantCni: finalRetirantInfo.cni,
        retirantCniDate: finalRetirantInfo.cniDate, 
        retirantPhone: finalRetirantInfo.phone,
        retirantSignature: undefined, // No digital signature data
        isPaid: true,
        amountPaid: packageInfo.isPaid ? packageInfo.amountPaid : amountPaid, 
        changeAmount: packageInfo.isPaid ? packageInfo.changeAmount : changeAmount,
      };
      
      setPackageInfo(updatedPackageInfo); 
      await generateWithdrawalPDF(updatedPackageInfo, finalRetirantInfo);
      
      setShowWithdrawalSuccess(true); 
      setCurrentWithdrawStep('completed');

    } catch (err) { 
      console.error("Erreur lors de la confirmation du retrait :", err);
      setError("Une erreur est survenue lors de la confirmation du retrait. Veuillez réessayer."); 
    }
    finally { 
      setIsConfirmingWithdrawal(false); 
    }
  };

  const getStatusColorClasses = (status: PackageInfo['status']) => {
    switch (status) {
      case 'Au départ': return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      case 'En transit': return 'bg-gradient-to-r from-sky-500 to-blue-600 text-white';
      case 'Arrivé au relais': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white';
      case 'Reçu': return 'bg-gradient-to-r from-teal-600 to-green-700 text-white';
      default: return 'bg-gradient-to-r from-slate-500 to-gray-600 text-white';
    }
  };
  
  const getStatusBorderClasses = (status: PackageInfo['status']) => {
    switch (status) {
        case 'Au départ': return 'border-orange-400';
        case 'En transit': return 'border-sky-400';
        case 'Arrivé au relais': return 'border-green-400';
        case 'Reçu': return 'border-teal-400';
        default: return 'border-slate-300';
    }
  };

  const getStatusIcon = (status: PackageInfo['status']) => {
    switch (status) {
      case 'Au départ': return <Package className="w-7 h-7" />;
      case 'En transit': return <TruckIcon className="w-7 h-7" />;
      case 'Arrivé au relais': return <CheckCircleIcon className="w-7 h-7" />;
      case 'Reçu': return <ClipboardSignature className="w-7 h-7" />;
      default: return <Package className="w-7 h-7" />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 p-0 font-sans relative overflow-x-hidden">
      <Navbar />
      <div className="fixed top-0 left-0 w-[33.33%] xl:w-[30%] h-full hidden lg:block z-0 pointer-events-none">
        <div className="relative w-full h-full">
          <Image src="/images/im7.avif" alt="Illustration service de colis" layout="fill" objectFit="cover" className="opacity-70" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent"></div>
           <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{delay:0.5, duration:0.8}} className="absolute top-[15%] left-[10%] w-16 h-16 bg-green-400/20 rounded-full blur-xl"></motion.div>
           <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{delay:0.7, duration:0.8}} className="absolute bottom-[20%] left-[25%] w-20 h-20 bg-emerald-500/15 rounded-full blur-2xl"></motion.div>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl mx-auto lg:ml-[calc(33.33%+2rem)] xl:ml-[calc(30%+2rem)] lg:mr-auto px-4 sm:px-6 py-20 lg:py-24 relative z-10"
      >
        <div className="mb-10 text-center lg:text-left">
          <Link href="/PickDropPoint/app/home" legacyBehavior>
            <a className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors text-sm font-medium group mb-6">
              <ArrowUturnLeftIcon className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
              Retour à l'accueil du Point Relais
            </a>
          </Link>
          <div className="flex flex-col items-center lg:items-start">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg mb-4"
            >
              <ClipboardSignature className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1">Processus de Retrait de Colis</h1>
            <p className="text-slate-600 text-base max-w-md lg:max-w-none">Guidez le client à travers les étapes pour retirer son colis en toute sécurité.</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!packageInfo && !isScanning && (
            <motion.section key="search-scan" variants={cardVariants} initial="hidden" animate="visible" exit="exit"
              className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200 mb-8">
              <h2 className="text-xl font-semibold text-slate-700 mb-5 text-center">Identifier le Colis à Retirer</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value.toUpperCase())} placeholder="Numéro de suivi du colis"
                           className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white transition-shadow hover:shadow-md"
                           onKeyDown={(e) => e.key === 'Enter' && handleSearchPackage()} />
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleSearchPackage()} disabled={isLoading || !searchInput.trim()}
                                 className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-3 px-5 rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                    {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <MagnifyingGlassIcon className="w-5 h-5 mr-2" />} Rechercher
                  </motion.button>
                </div>
                <div className="flex items-center my-2"><hr className="flex-grow border-slate-300" /><span className="px-3 text-xs text-slate-500 font-medium">OU</span><hr className="flex-grow border-slate-300" /></div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleScanQRCode} disabled={isLoading || isScanning}
                               className="w-full flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium py-3 px-5 rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                  <QrCodeIcon className="w-5 h-5 mr-2" /> Scanner le QR Code du Colis
                </motion.button>
              </div>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{error}</span>
                </motion.div>
              )}
            </motion.section>
          )}

          {isScanning && (
            <motion.section key="scanning" variants={cardVariants} initial="hidden" animate="visible" exit="exit"
              className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200 mb-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Scan du QR Code en cours...</h2>
                <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 bg-slate-800 rounded-lg overflow-hidden shadow-inner">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-3 border-2 border-green-400 rounded-md animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`absolute w-5 h-5 border-green-300 
                            ${i===0 ? 'top-0 left-0 border-t-2 border-l-2' : ''} ${i===1 ? 'top-0 right-0 border-t-2 border-r-2' : ''} 
                            ${i===2 ? 'bottom-0 left-0 border-b-2 border-l-2' : ''} ${i===3 ? 'bottom-0 right-0 border-b-2 border-r-2' : ''}`}>
                        </div>
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-sm mt-4 mb-6">Veuillez positionner le QR code du colis dans le cadre ci-dessus.</p>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleStopScan()}
                               className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all inline-flex items-center">
                  <XMarkIcon className="w-4 h-4 mr-1.5" /> Annuler le Scan
                </motion.button>
              </div>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" /> <span className="flex-1">{error}</span>
                </motion.div>
              )}
            </motion.section>
          )}

          {packageInfo && currentWithdrawStep === 'details' && (
             <motion.section key="package-details" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div className={`p-5 sm:p-6 rounded-xl shadow-lg border-l-4 ${getStatusColorClasses(packageInfo.status)} ${getStatusBorderClasses(packageInfo.status)}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3"> {getStatusIcon(packageInfo.status)}
                    <div><h3 className="text-lg font-bold">Colis {packageInfo.trackingNumber}</h3> <p className="text-sm opacity-90">Statut actuel : {packageInfo.status}</p></div>
                  </div>
                  <div className="text-left sm:text-right"><p className="text-sm opacity-90">Date d'arrivée estimée</p><p className="font-semibold">{packageInfo.estimatedArrivalDate || 'Non spécifiée'}</p></div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { title: 'Expéditeur', icon: User, color: 'text-blue-600', data: [ { label: 'Nom', value: packageInfo.senderName }, { label: 'Téléphone', value: packageInfo.senderPhone }, { label: 'Point de dépôt', value: packageInfo.departurePointName }, ]},
                  { title: 'Destinataire', icon: UserCircleIcon, color: 'text-green-600', data: [ { label: 'Nom', value: packageInfo.recipientName }, { label: 'Téléphone', value: packageInfo.recipientPhone }, { label: 'Point de retrait', value: packageInfo.arrivalPointName }, ]},
                  { title: 'Détails du Colis', icon: CubeIcon, color: 'text-purple-600', data: [ { label: 'Description', value: packageInfo.packageDescription }, { label: 'Poids', value: `${packageInfo.packageWeight} kg` }, ], tags: [ packageInfo.isFragile && { text: 'Fragile', bg: 'bg-orange-100', tc: 'text-orange-800'}, packageInfo.isPerishable && { text: 'Périssable', bg: 'bg-red-100', tc: 'text-red-800'}, packageInfo.isInsured && { text: `Assuré (${packageInfo.declaredValue || 'N/A'} FCFA)`, bg: 'bg-blue-100', tc: 'text-blue-800'}, ].filter(Boolean) },
                  { title: 'Informations de Paiement', icon: CurrencyDollarIcon, color: 'text-teal-600', customRender: () => (
                    <div className="space-y-1 text-sm">
                      {packageInfo.status === 'Reçu' ? ( packageInfo.amountPaid ? 
                          <> <div className="flex items-center text-green-700"><CheckIcon className="w-4 h-4 mr-1.5" />Payé lors du retrait</div> <p><span className="text-slate-500">Coût:</span> <span className="font-medium">{packageInfo.shippingCost || 'N/A'} FCFA</span></p> <p><span className="text-slate-500">Montant Payé:</span> <span className="font-medium">{packageInfo.amountPaid} FCFA</span></p> <p><span className="text-slate-500">Monnaie:</span> <span className="font-medium">{packageInfo.changeAmount || '0'} FCFA</span></p> </>
                        : <div className="flex items-center text-green-700"><CheckIcon className="w-4 h-4 mr-1.5" />Payé par l'expéditeur</div>
                      ) : packageInfo.isPaid ? (
                        <div className="flex items-center text-green-700"><CheckIcon className="w-4 h-4 mr-1.5" />Payé par l'expéditeur {packageInfo.shippingCost && <span className="text-slate-500 ml-1 text-xs"> (Coût: {packageInfo.shippingCost} FCFA)</span>}</div>
                      ) : (
                        <> <p><span className="text-slate-500">Coût Livraison:</span> <span className="font-bold text-red-600">{packageInfo.shippingCost} FCFA</span></p> <div className="flex items-center text-orange-600 mt-1"><BellAlertIcon className="w-4 h-4 mr-1.5" /><span className="text-xs font-medium">Paiement requis au retrait</span></div></>
                      )}
                    </div>
                  )}
                ].map((section, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                    <h4 className={`font-semibold text-slate-700 mb-3 flex items-center ${section.color}`}> <section.icon className="w-5 h-5 mr-2" /> {section.title} </h4>
                    {section.customRender ? section.customRender() : <div className="space-y-1.5 text-sm"> {section.data?.map(item => <p key={item.label}><span className="text-slate-500">{item.label}:</span> <span className="font-medium text-slate-800">{item.value}</span></p>)} {section.tags && section.tags.length > 0 && ( <div className="flex flex-wrap gap-1.5 mt-2.5"> {section.tags.map(tag => tag && <span key={tag.text} className={`px-2 py-0.5 ${tag.bg} ${tag.tc} text-xs rounded-full font-medium`}>{tag.text}</span>)} </div> )} </div> }
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {packageInfo.status === 'Arrivé au relais' ? (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { const isPaymentRequired = !packageInfo.isPaid && packageInfo.shippingCost; setCurrentWithdrawStep(isPaymentRequired ? 'payment' : 'recipient'); setError(null); }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center text-base"
                  > <ClipboardSignature className="w-5 h-5 mr-2" /> Démarrer le Processus de Retrait </motion.button>
                ) : ( <div className={`flex-1 py-3 px-6 rounded-lg text-center font-semibold text-base ${packageInfo.status === 'Reçu' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}> {packageInfo.status === 'Reçu' ? 'Colis déjà retiré le ' + packageInfo.pickupDate : 'Colis non disponible pour retrait actuellement'} </div> )}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={resetPageState}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center text-base sm:flex-none"
                > <ArrowUturnLeftIcon className="w-5 h-5 mr-2" /> Nouvelle Recherche </motion.button>
              </div>
            </motion.section>
          )}

          {packageInfo && currentWithdrawStep === 'payment' && !packageInfo.isPaid && packageInfo.shippingCost && (
            <motion.section key="payment" variants={cardVariants} initial="hidden" animate="visible" exit="exit"
              className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700 mb-5 flex items-center"> <CreditCard className="w-6 h-6 mr-2.5 text-green-600" /> Étape 1: Paiement de la Livraison </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                  <p className="text-blue-700 text-sm">Montant total à payer par le client :</p> <p className="text-blue-800 font-bold text-2xl">{packageInfo.shippingCost} FCFA</p>
                </div>
                <div>
                  <label htmlFor="amountPaidInput" className="block text-sm font-medium text-slate-700 mb-1.5">Montant effectivement payé par le client (FCFA)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input id="amountPaidInput" type="text" inputMode="numeric" value={amountPaid} onChange={handleAmountPaidChange} placeholder="Ex: 2500"
                      className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold bg-white"/>
                  </div>
                </div>
                {amountPaid && parseFloat(amountPaid) >= parseFloat(packageInfo.shippingCost || '0') && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                    <p className="text-green-700 text-sm">Monnaie à rendre au client :</p> <p className="text-green-800 font-bold text-xl">{changeAmount} FCFA</p>
                  </div>
                )}
                {error && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700 text-sm"> <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" /> <span className="flex-1">{error}</span> </motion.div> )}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={proceedToRecipientInfo}
                    disabled={!amountPaid || parseFloat(amountPaid) < parseFloat(packageInfo.shippingCost || '0')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-base">
                    <CheckIcon className="w-5 h-5 mr-2" /> Valider Paiement et Continuer
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCurrentWithdrawStep('details')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center text-base sm:flex-none">
                    <ArrowUturnLeftIcon className="w-5 h-5 mr-2" /> Retour
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}

          {packageInfo && currentWithdrawStep === 'recipient' && (
            <motion.section key="recipient-info" variants={cardVariants} initial="hidden" animate="visible" exit="exit"
              className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700 mb-5 flex items-center">
                <IdentificationIcon className="w-6 h-6 mr-2.5 text-blue-600" />
                {packageInfo.isPaid && !packageInfo.shippingCost ? 'Étape 1' : 'Étape 2'}: Informations du Retirant
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Nom complet du retirant", name: "name", type: "text", placeholder: "Ex: Jean Dupont"},
                  { label: "Numéro CNI/Passeport", name: "cni", type: "text", placeholder: "Ex: 123456789CE"},
                  { label: "Date de délivrance (CNI/Passeport)", name: "cniDate", type: "date"},
                  { label: "Numéro de téléphone du retirant", name: "phone", type: "tel", placeholder: "Ex: +237 6XXXXXXXX"},
                ].map(field => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                    <input id={field.name} type={field.type} name={field.name} value={retirantInfo[field.name as keyof RetirantInfo] || ''}
                      onChange={handleRetirantInfoChange} placeholder={field.placeholder}
                      className="w-full px-3.5 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"/>
                  </div>
                ))}
                {error && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700 text-sm"> <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" /> <span className="flex-1">{error}</span> </motion.div> )}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={proceedToConfirmation}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center text-base">
                    <PrinterIcon className="w-5 h-5 mr-2" /> Confirmer Retrait et Générer Bordereau
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentWithdrawStep(packageInfo.isPaid && !packageInfo.shippingCost ? 'details' : 'payment')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center text-base sm:flex-none">
                    <ArrowUturnLeftIcon className="w-5 h-5 mr-2" /> Retour
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}

          {/* Section for currentWithdrawStep === 'signature' removed */}

          {showWithdrawalSuccess && currentWithdrawStep === 'completed' && packageInfo && (
            <motion.section key="success" variants={cardVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 sm:p-8 rounded-xl shadow-xl border border-green-200">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCheck className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Retrait Confirmé et Finalisé !</h2>
                <p className="text-slate-700 mb-1.5"> Le colis <strong className="text-green-700 font-semibold">{packageInfo.trackingNumber}</strong> a été retiré avec succès par <strong className="text-green-700 font-semibold">{retirantInfo.name}</strong>. </p>
                <p className="text-sm text-slate-600 mb-1.5 flex items-center justify-center"> <Building className="inline w-4 h-4 mr-1.5 text-slate-500" /> Point de retrait: {packageInfo.arrivalPointName}. </p>
                {packageInfo.amountPaid && parseFloat(packageInfo.amountPaid) > 0 && packageInfo.status === 'Reçu' && (!packageInfo.isPaid || packageInfo.shippingCost) && (
                   <p className="text-sm text-slate-600 mb-4 flex items-center justify-center"> <CurrencyDollarIcon className="inline w-4 h-4 mr-1.5 text-green-500" /> Paiement de <span className="font-semibold mx-1">{packageInfo.amountPaid} FCFA</span> {parseFloat(packageInfo.changeAmount || '0') > 0 ? `(Monnaie rendue: ${packageInfo.changeAmount} FCFA)` : ''} confirmé. </p>
                )}
                <div className="bg-white p-4 rounded-lg border border-green-200 mb-6 shadow-sm">
                  <div className="flex items-center justify-center mb-1.5"> <PrinterIcon className="w-5 h-5 text-green-600 mr-2" /> <span className="text-green-800 font-medium">Bordereau de Retrait Téléchargé</span> </div>
                  <p className="text-sm text-slate-600">Le document PDF a été généré et téléchargé automatiquement. Veuillez le vérifier dans vos téléchargements.</p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={resetPageState}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all inline-flex items-center text-base">
                  <ArchiveRestore className="w-5 h-5 mr-2" /> Effectuer un Nouveau Retrait
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {isConfirmingWithdrawal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{opacity:0}}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{scale:0.9, opacity:0}}
              className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Finalisation du Retrait...</h3>
              <p className="text-slate-600 text-sm">Veuillez patienter pendant que nous enregistrons les informations et générons le bordereau de retrait.</p>
            </motion.div>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default WithdrawPackagePage;