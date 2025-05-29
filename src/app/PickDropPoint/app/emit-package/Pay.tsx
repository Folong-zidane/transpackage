'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CreditCardIcon, BanknotesIcon, DevicePhoneMobileIcon, CheckCircleIcon, XMarkIcon,
  PrinterIcon, DocumentTextIcon, ShieldCheckIcon, ClockIcon, MapPinIcon, UserIcon,
  PhoneIcon, ScaleIcon, CubeIcon, InformationCircleIcon, ShareIcon, SparklesIcon,
  LockClosedIcon, HeartIcon, HomeIcon, ArrowRightIcon, UserCircleIcon, // Pour l'expéditeur et destinataire payeur
  GiftIcon,
  ArrowUturnLeftIcon, // Pour le destinataire payeur
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import { MessageSquare } from 'lucide-react';

// Icônes de partage (vous pourriez utiliser des SVG ou des composants d'icônes d'une autre librairie)
const WhatsAppIcon = () => <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5" />; // Remplacez par le chemin réel
const TelegramIcon = () => <img src="/telegram.jpeg" alt="Telegram" className="w-5 h-5" />; // Remplacez par le chemin réel
const MessengerIcon = () => <img src="/messenger.jpeg" alt="Messenger" className="w-5 h-5" />; // Remplacez par le chemin réel
const SmsIcon = () => <MessageSquare className="w-5 h-5" />;

interface ExtendedFormData {
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  departurePointName?: string;
  arrivalPointName?: string;
  compensation?: number; // Frais d'assurance
  weight?: string;
  distance?: number; // Ajouté pour afficher la distance
  // ... autres champs de RouteSelection
  departurePointId?: number | null;
  arrivalPointId?: number | null;
}

interface PackageData {
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  isFragile?: boolean;
  contentType?: 'solid' | 'liquid' | '';
  isPerishable?: boolean;
  designation?: string;
  image?: string;
  declaredValue?: string; // Valeur déclarée du colis pour l'assurance
  isInsured?: boolean;
  // ... autres champs de PackageRegistration
}

interface PaymentStepProps {
  // onBack: () => void; // Ancienne prop, remplacée
  onGoToPreviousStep: () => void; // Pour aller à l'étape précédente (RouteSelection)
  onStartNewShippingProcess: () => void; // Pour recommencer tout le flux
  packageData: PackageData | null;
  formData: ExtendedFormData;
}

const APP_NAME = "Pick & Drop Link";

const Payment: React.FC<PaymentStepProps> = ({ onBack, packageData, formData }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending_cash' | 'pending_recipient' | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [currentDate, setCurrentDate] = useState('');

  // Simuler les informations de l'utilisateur connecté
  const currentUser = {
    name: "John Doe (Expéditeur)", // Remplacez par les vraies données
    phone: "+237 6XX XXX XXX",
    email: "john.doe@example.com"
  };

  useEffect(() => {
    const generateTrackingNumber = () => {
      const prefix = 'PDL'; // Pick & Drop Link
      const timestamp = Date.now().toString().slice(-7);
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      return `${prefix}${timestamp}${random}`;
    };
    setTrackingNumber(generateTrackingNumber());

    const today = new Date();
    setCurrentDate(today.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
  }, []);

  const paymentMethods = [
    { id: 'card', name: 'Carte bancaire', description: 'Visa, Mastercard', icon: <CreditCardIcon className="w-8 h-8" />, color: 'blue', fees: 0, gradient: 'from-blue-500 to-indigo-600', popular: false },
    { id: 'mobile', name: 'Paiement Mobile', description: 'Orange Money, MTN MoMo', icon: <DevicePhoneMobileIcon className="w-8 h-8" />, color: 'orange', fees: 100, gradient: 'from-orange-500 to-red-500', popular: true },
    { id: 'cash', name: 'Paiement en espèces', description: 'Au dépôt du colis au point relais', icon: <BanknotesIcon className="w-8 h-8" />, color: 'green', fees: 0, gradient: 'from-green-500 to-emerald-600', popular: false },
    { id: 'recipient_pay', name: 'Paiement par le destinataire', description: 'À la réception du colis', icon: <GiftIcon className="w-8 h-8" />, color: 'purple', fees: 0, gradient: 'from-purple-500 to-pink-500', popular: false },
  ];

  const calculatePackageBasePrice = useCallback(() => {
    if (!packageData) return 0;
    const weight = parseFloat(packageData.weight || '0');
    const length = parseFloat(packageData.length || '0');
    const width = parseFloat(packageData.width || '0');
    const height = parseFloat(packageData.height || '0');

    let base = 1500 + weight * 300;
    if (length && width && height) {
      const volume = length * width * height;
      const volumetricWeight = volume / 5000;
      if (volumetricWeight > weight) {
        base = 1500 + volumetricWeight * 300;
      }
    }
    return base;
  }, [packageData]);

  const calculateAdditionalFees = useCallback(() => {
    if (!packageData) return 0;
    const basePrice = calculatePackageBasePrice();
    let fees = 0;
    if (packageData.isFragile) fees += basePrice * 0.15;
    if (packageData.contentType === 'liquid') fees += basePrice * 0.10;
    if (packageData.isPerishable) fees += basePrice * 0.20;
    return fees;
  }, [packageData, calculatePackageBasePrice]);
  
  const calculateInsuranceFee = useCallback(() => {
    if (packageData?.isInsured && packageData?.declaredValue) {
        return parseFloat(packageData.declaredValue) * 0.05; // 5% de la valeur déclarée
    }
    return formData?.compensation || 0; // Ancien champ compensation, ou 0
  }, [packageData, formData.compensation]);


  const calculateTotal = useCallback(() => {
    if (selectedMethod === 'recipient_pay') return 0; // L'expéditeur ne paie rien

    const packageBase = calculatePackageBasePrice();
    const additional = calculateAdditionalFees();
    const insurance = calculateInsuranceFee();
    const paymentFee = paymentMethods.find(m => m.id === selectedMethod)?.fees || 0;

    return Math.round(packageBase + additional + insurance + paymentFee);
  }, [selectedMethod, calculatePackageBasePrice, calculateAdditionalFees, calculateInsuranceFee, paymentMethods]);
// Alternative approach: Generate PDF directly with jsPDF without html2canvas
const generatePDF = async () => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Générer le QR code
    const QRCode = (await import('qrcode')).default;
    const qrDataURL = await QRCode.toDataURL(`Suivi ${APP_NAME}: ${trackingNumber}`, {
      width: 100,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(APP_NAME, 20, yPosition);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Votre partenaire logistique fiable.', 20, yPosition + 7);

    // Bordereau number and date (right side)
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Bordereau N°: ${trackingNumber}`, pageWidth - 80, yPosition);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${currentDate}`, pageWidth - 80, yPosition + 7);

    // Add QR Code
    pdf.addImage(qrDataURL, 'PNG', pageWidth - 35, yPosition - 5, 25, 25);

    yPosition += 35;

    // Line separator
    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    // Expéditeur section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EXPÉDITEUR', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nom: ${currentUser.name}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Téléphone: ${currentUser.phone}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Email: ${currentUser.email}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Point de dépôt: ${formData?.departurePointName || 'N/A'}`, 20, yPosition);
    yPosition += 10;

    // Destinataire section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DESTINATAIRE', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nom: ${formData?.recipientName || 'N/A'}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Téléphone: ${formData?.recipientPhone || 'N/A'}`, 20, yPosition);
    yPosition += 5;
    if (formData?.recipientEmail) {
      pdf.text(`Email: ${formData.recipientEmail}`, 20, yPosition);
      yPosition += 5;
    }
    pdf.text(`Point de retrait: ${formData?.arrivalPointName || 'N/A'}`, 20, yPosition);
    yPosition += 10;

    // Trajet section
    if (formData.departurePointName && formData.arrivalPointName) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TRAJET', 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const trajetText = `${formData.departurePointName} → ${formData.arrivalPointName}`;
      pdf.text(trajetText, 20, yPosition);
      yPosition += 5;
      
      if (formData.distance) {
        pdf.setFontSize(9);
        pdf.text(`Distance estimée: ${formData.distance.toFixed(1)} km`, 20, yPosition);
        yPosition += 8;
      } else {
        yPosition += 3;
      }
    }

    // Détails du colis
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DÉTAILS DU COLIS', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Désignation: ${packageData?.designation || 'Colis divers'}`, 20, yPosition);
    pdf.text(`Poids: ${packageData?.weight || formData?.weight || 'N/A'} kg`, pageWidth/2, yPosition);
    yPosition += 5;
    
    if (packageData?.length) {
      pdf.text(`Dimensions: ${packageData.length}x${packageData.width}x${packageData.height} cm`, 20, yPosition);
      pdf.text(`Type: ${packageData?.contentType || 'Solide'}`, pageWidth/2, yPosition);
      yPosition += 5;
    }
    
    pdf.text(`Fragile: ${packageData?.isFragile ? 'Oui' : 'Non'}`, 20, yPosition);
    pdf.text(`Périssable: ${packageData?.isPerishable ? 'Oui' : 'Non'}`, pageWidth/2, yPosition);
    yPosition += 5;
    
    if (packageData?.isInsured) {
      pdf.text(`Assuré: Oui (Valeur: ${parseFloat(packageData.declaredValue || '0').toLocaleString()} FCFA)`, 20, yPosition);
      yPosition += 5;
    }
    yPosition += 5;

    // Récapitulatif financier
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RÉCAPITULATIF FINANCIER', 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const basePrice = calculatePackageBasePrice();
    const additionalFees = calculateAdditionalFees();
    const insuranceFee = calculateInsuranceFee();
    const paymentFees = selectedMethod !== 'recipient_pay' && paymentMethods.find(m => m.id === selectedMethod)?.fees > 0 
      ? paymentMethods.find(m => m.id === selectedMethod)?.fees || 0 
      : 0;
    
    pdf.text(`Prix de base du colis:`, 20, yPosition);
    pdf.text(`${basePrice.toLocaleString()} FCFA`, pageWidth - 50, yPosition);
    yPosition += 5;
    
    pdf.text(`Frais additionnels (fragile, etc.):`, 20, yPosition);
    pdf.text(`${additionalFees.toLocaleString()} FCFA`, pageWidth - 50, yPosition);
    yPosition += 5;
    
    pdf.text(`Assurance:`, 20, yPosition);
    pdf.text(`${insuranceFee.toLocaleString()} FCFA`, pageWidth - 50, yPosition);
    yPosition += 5;
    
    if (paymentFees > 0) {
      pdf.text(`Frais ${paymentMethods.find(m => m.id === selectedMethod)?.name}:`, 20, yPosition);
      pdf.text(`${paymentFees.toLocaleString()} FCFA`, pageWidth - 50, yPosition);
      yPosition += 5;
    }
    
    // Line separator
    pdf.setLineWidth(0.3);
    pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
    yPosition += 8;
    
    // Total
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    const totalText = `TOTAL À PAYER ${selectedMethod === 'recipient_pay' ? 'PAR LE DESTINATAIRE' : 'PAR L\'EXPÉDITEUR'}:`;
    const totalAmount = selectedMethod === 'recipient_pay' ? 
      (basePrice + additionalFees + insuranceFee) : 
      calculateTotal();
    
    pdf.text(totalText, 20, yPosition);
    pdf.text(`${totalAmount.toLocaleString()} FCFA`, pageWidth - 50, yPosition);
    yPosition += 10;
    
    if (paymentStatus === 'success' && selectedMethod !== 'cash' && selectedMethod !== 'recipient_pay') {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Colis payé comptant par l\'expéditeur.', pageWidth - 80, yPosition);
      yPosition += 8;
    }

    // Conditions
    yPosition += 10;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const conditions = `Conditions: Le colis sera livré au point relais d'arrivée indiqué. Le destinataire doit présenter une pièce d'identité valide. ${APP_NAME} n'est pas responsable des dommages non déclarés ou dus à un emballage inadéquat si non fragile.`;
    
    const splitConditions = pdf.splitTextToSize(conditions, pageWidth - 40);
    pdf.text(splitConditions, 20, yPosition);
    yPosition += splitConditions.length * 4 + 10;

    // Signatures
    pdf.text('Signature Expéditeur: _________________________', 20, yPosition);
    pdf.text('Cachet Agence Départ:', pageWidth - 80, yPosition);
    yPosition += 20;

    // Footer
    pdf.setFontSize(9);
    pdf.text(`Merci d'utiliser ${APP_NAME}!`, pageWidth/2 - 30, yPosition);

    // Télécharger le PDF
    pdf.save(`Bordereau-${trackingNumber}.pdf`);

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
  }
};

  const InvoiceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl">
        {/* ... (header de la modale) ... */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">Aperçu du Bordereau - {APP_NAME}</h2>
          <div className="flex items-center space-x-1.5">
            <div className="relative">
              <button onClick={() => setShowShareMenu(!showShareMenu)} className="btn-icon-header" title="Partager"> <ShareIcon className="w-5 h-5" /> </button>
              {showShareMenu && <ShareMenu />}
            </div>
            <button onClick={generatePDF} className="btn-icon-header" title="Imprimer / PDF"> <PrinterIcon className="w-5 h-5" /> </button>
            <button onClick={() => setShowInvoice(false)} className="btn-icon-header" title="Fermer"> <XMarkIcon className="w-5 h-5" /> </button>
          </div>
        </div>
        <div className="overflow-y-auto p-5" id="invoice-content-pdf" style={{ fontFamily: 'Arial, sans-serif', color: '#333', fontSize: '9pt' }}>
            {/* ... (Contenu du bordereau) ... */}
            {/* S'assurer que QRCodeCanvas a l'ID correct */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #10B981', paddingBottom: '10px', marginBottom: '15px' }}>
                {/* ... (logo et nom appli) ... */}
                 <div style={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon style={{ height: '30px', marginRight: '8px', color: '#10B981' /* Vert émeraude */ }}/>
                    <div>
                        <h1 style={{ fontSize: '20pt', fontWeight: 'bold', color: '#059669' /* Vert émeraude plus foncé */, margin: 0 }}>{APP_NAME}</h1>
                        <p style={{ margin: '0', fontSize: '8pt', color: '#555' }}>Votre partenaire logistique fiable.</p>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '10pt' }}>Bordereau N°: <span style={{ fontWeight: 'bold' }}>{trackingNumber}</span></p>
                    <p style={{ margin: '0', fontSize: '9pt' }}>Date: {currentDate}</p>
                    <div style={{ marginTop: '8px' }}>
                        {/* ID important ici pour la capture par html2canvas */}
                        <QRCodeCanvas id="qr-code-canvas-pdf" value={`Suivi ${APP_NAME}: ${trackingNumber}`} size={70} level="M" bgColor="#ffffff" fgColor="#222222" />
                    </div>
                </div>
            </div>
            {/* ... (Reste du contenu du bordereau identique) ... */}
            {/* Informations Expéditeur et Destinataire côte à côte */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                <div className="invoice-section">
                    <h3 className="invoice-section-title text-green-600">EXPÉDITEUR</h3>
                    <p><strong>Nom:</strong> {currentUser.name}</p>
                    <p><strong>Téléphone:</strong> {currentUser.phone}</p>
                    <p><strong>Email:</strong> {currentUser.email}</p>
                    <p><strong>Point de dépôt:</strong> {formData?.departurePointName || 'N/A'}</p>
                </div>
                <div className="invoice-section">
                    <h3 className="invoice-section-title text-blue-600">DESTINATAIRE</h3>
                    <p><strong>Nom:</strong> {formData?.recipientName || 'N/A'}</p>
                    <p><strong>Téléphone:</strong> {formData?.recipientPhone || 'N/A'}</p>
                    {formData?.recipientEmail && <p><strong>Email:</strong> {formData.recipientEmail}</p>}
                    <p><strong>Point de retrait:</strong> {formData?.arrivalPointName || 'N/A'}</p>
                </div>
            </div>
            
            {/* Trajet */}
             {formData.departurePointName && formData.arrivalPointName && (
                <div className="invoice-section" style={{ marginBottom: '15px' }}>
                    <h3 className="invoice-section-title text-purple-600">TRAJET</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <div><MapPinIcon className="inline-block w-4 h-4 mr-1" />{formData.departurePointName}</div>
                        <ArrowRightIcon className="inline-block w-5 h-5 mx-2 text-gray-400" />
                        <div><MapPinIcon className="inline-block w-4 h-4 mr-1" />{formData.arrivalPointName}</div>
                    </div>
                    {formData.distance && <p style={{textAlign: 'center', fontSize: '8pt', marginTop: '5px'}}>Distance estimée: {formData.distance.toFixed(1)} km</p>}
                </div>
            )}


            {/* Détails du Colis */}
            <div className="invoice-section" style={{ marginBottom: '15px' }}>
                <h3 className="invoice-section-title text-orange-600">DÉTAILS DU COLIS</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
                    <tbody>
                        <tr>
                            <td className="invoice-table-label">Désignation:</td><td className="invoice-table-value">{packageData?.designation || 'Colis divers'}</td>
                            <td className="invoice-table-label">Poids:</td><td className="invoice-table-value">{packageData?.weight || formData?.weight || 'N/A'} kg</td>
                        </tr>
                        {packageData?.length && (
                        <tr>
                            <td className="invoice-table-label">Dimensions:</td><td className="invoice-table-value">{`${packageData.length}x${packageData.width}x${packageData.height} cm`}</td>
                            <td className="invoice-table-label">Type:</td><td className="invoice-table-value capitalize">{packageData?.contentType || 'Solide'}</td>
                        </tr>
                        )}
                        <tr>
                            <td className="invoice-table-label">Fragile:</td><td className="invoice-table-value">{packageData?.isFragile ? 'Oui' : 'Non'}</td>
                            <td className="invoice-table-label">Périssable:</td><td className="invoice-table-value">{packageData?.isPerishable ? 'Oui' : 'Non'}</td>
                        </tr>
                         {packageData?.isInsured && (
                             <tr>
                                <td className="invoice-table-label">Assuré:</td><td className="invoice-table-value">Oui (Valeur: {parseFloat(packageData.declaredValue || '0').toLocaleString()} FCFA)</td>
                                <td colSpan={2}></td>
                             </tr>
                         )}
                    </tbody>
                </table>
            </div>

            {/* Récapitulatif Financier */}
            <div style={{ backgroundColor: '#F3F4F6', padding: '12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                <h3 className="invoice-section-title text-indigo-600" style={{marginTop: 0}}>RÉCAPITULATIF FINANCIER</h3>
                <div style={{ fontSize: '9pt' }}>
                    <div className="invoice-financial-row"><span>Prix de base du colis:</span><span>{calculatePackageBasePrice().toLocaleString()} FCFA</span></div>
                    <div className="invoice-financial-row"><span>Frais additionnels (fragile, etc.):</span><span>{calculateAdditionalFees().toLocaleString()} FCFA</span></div>
                    <div className="invoice-financial-row"><span>Assurance:</span><span>{calculateInsuranceFee().toLocaleString()} FCFA</span></div>
                    {selectedMethod !== 'recipient_pay' && paymentMethods.find(m => m.id === selectedMethod)?.fees > 0 && (
                        <div className="invoice-financial-row">
                            <span>Frais {paymentMethods.find(m => m.id === selectedMethod)?.name}:</span>
                            <span>{(paymentMethods.find(m => m.id === selectedMethod)?.fees || 0).toLocaleString()} FCFA</span>
                        </div>
                    )}
                     <hr style={{ margin: '8px 0', borderColor: '#D1D5DB' }} />
                    <div className="invoice-financial-row" style={{ fontSize: '11pt', fontWeight: 'bold', color: '#16A34A' /* green-700 */ }}>
                        <span>TOTAL À PAYER {selectedMethod === 'recipient_pay' ? 'PAR LE DESTINATAIRE' : 'PAR L\'EXPÉDITEUR'}:</span>
                        <span>
                            {(selectedMethod === 'recipient_pay' ? 
                                (calculatePackageBasePrice() + calculateAdditionalFees() + calculateInsuranceFee()) : 
                                calculateTotal()
                            ).toLocaleString()} FCFA
                        </span>
                    </div>
                      {paymentStatus === 'success' && selectedMethod !== 'cash' && selectedMethod !== 'recipient_pay' && (
                        <p style={{color: '#059669', fontWeight: 'bold', textAlign: 'right', fontSize: '8.5pt', marginTop: '5px' }}>Colis payé comptant par l'expéditeur.</p>
                    )}
                </div>
            </div>

            {/* Notes et signature */}
            <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px dashed #ccc', fontSize: '8pt', color: '#4B5563' }}>
                <p><strong>Conditions:</strong> Le colis sera livré au point relais d'arrivée indiqué. Le destinataire doit présenter une pièce d'identité valide. {APP_NAME} n'est pas responsable des dommages non déclarés ou dus à un emballage inadéquat si non fragile.</p>
                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>Signature Expéditeur: _________________________</div>
                    <div>Cachet Agence Départ:</div>
                </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '8pt', color: '#6B7280' }}>Merci d'utiliser {APP_NAME}!</p>
        </div>
      </div>
    </div>
  );

  
  const shareBordereau = async (platform: 'whatsapp' | 'telegram' | 'sms' | 'messenger' | 'native') => {
    const textToShare = `Bonjour ${formData.recipientName || 'Destinataire'}, votre colis ${APP_NAME} (N° ${trackingNumber}) est en cours d'expédition. Point de départ: ${formData.departurePointName}, Arrivée: ${formData.arrivalPointName}.`;
    const urlToShare = window.location.href; // Ou une URL de suivi spécifique si vous en avez une

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: `Bordereau ${APP_NAME} N° ${trackingNumber}`,
          text: textToShare,
          url: urlToShare, // Vous pourriez aussi partager le PDF directement s'il est accessible via une URL
        });
      } catch (error) {
        console.error('Erreur de partage natif:', error);
        alert("Le partage a échoué. Vous pouvez télécharger le PDF et le partager manuellement.");
      }
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(textToShare + "\n" + urlToShare)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent(textToShare)}`, '_blank');
    } else if (platform === 'sms') {
      window.open(`sms:?body=${encodeURIComponent(textToShare + "\n" + urlToShare)}`, '_blank');
    } else if (platform === 'messenger') {
        // Messenger n'a pas d'URL de partage direct simple comme WhatsApp ou Telegram pour du texte arbitraire
        // Le mieux est d'utiliser le partage natif, ou de demander à l'utilisateur de copier/coller
        alert("Pour partager sur Messenger, veuillez utiliser la fonction de partage native de votre appareil ou copiez le texte et le lien.");
    }
    setShowShareMenu(false);
  };


  const shareOptions = [
    { name: 'Partage Natif', icon: <ShareIcon className="w-5 h-5" />, action: () => shareBordereau('native'), color: 'gray' },
    { name: 'WhatsApp', icon: <WhatsAppIcon />, action: () => shareBordereau('whatsapp'), color: 'green' },
    { name: 'Telegram', icon: <TelegramIcon />, action: () => shareBordereau('telegram'), color: 'blue' },
    { name: 'SMS', icon: <SmsIcon />, action: () => shareBordereau('sms'), color: 'yellow' },
    // { name: 'Messenger', icon: <MessengerIcon />, action: () => shareBordereau('messenger'), color: 'purple' }, // Optionnel
  ];


  const handlePayment = async () => {
    setIsProcessing(true);
    const steps = ['Vérification des informations...', 'Traitement en cours...', 'Validation...', 'Enregistrement...'];
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }
    setIsProcessing(false);

    if (selectedMethod === 'cash') {
      setPaymentStatus('pending_cash');
    } else if (selectedMethod === 'recipient_pay') {
      setPaymentStatus('pending_recipient');
    } else {
      setPaymentStatus('success'); // Pour carte et mobile money après simulation
    }
  };

  const PaymentMethodCard = ({ method }: { method: typeof paymentMethods[0] }) => (
    <div
      onClick={() => {
        setSelectedMethod(method.id);
        // Afficher le formulaire seulement si ce n'est pas cash ou paiement par destinataire
        setShowPaymentForm(method.id === 'card' || method.id === 'mobile');
      }}
      className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.03] 
        ${ selectedMethod === method.id ? `border-green-500 bg-gradient-to-br ${method.gradient} bg-opacity-10 shadow-lg shadow-green-200/50`
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {method.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1 shadow">
            <SparklesIcon className="w-3 h-3" />
            <span>POPULAIRE</span>
          </div>
        </div>
      )}
      {selectedMethod === method.id && (
        <div className={`absolute -top-2.5 -right-2.5 w-7 h-7 bg-gradient-to-br ${method.gradient} rounded-full flex items-center justify-center animate-pulse shadow-md`}>
          <CheckCircleIcon className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${method.gradient} text-white transform transition-transform duration-300 ${selectedMethod === method.id ? 'scale-110' : ''}`}>
          {method.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-md">{method.name}</h3>
          <p className="text-xs text-gray-500 mb-0.5">{method.description}</p>
          <p className="text-xs font-medium text-green-600">Frais: {method.fees.toLocaleString()} FCFA</p>
        </div>
      </div>
    </div>
  );

  const CardPaymentForm = () => (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 animate-fadeIn mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <LockClosedIcon className="w-5 h-5 mr-2 text-green-600" />
          Paiement par Carte
        </h3>
        <div className="flex space-x-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/200px-MasterCard_Logo.svg.png" alt="Mastercard" className="h-6" />
        </div>
      </div>
      {/* ... (champs du formulaire carte) ... */}
       <div className="space-y-4">
        <div className="relative">
          <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="input-form-payment" maxLength={19} />
          <label className="label-form-payment">Numéro de carte</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input type="text" placeholder="MM/AA" className="input-form-payment" maxLength={5}/>
            <label className="label-form-payment">Expiration</label>
          </div>
          <div className="relative">
            <input type="text" placeholder="CVV" className="input-form-payment" maxLength={4}/>
            <label className="label-form-payment">CVV</label>
          </div>
        </div>
        <div className="relative">
          <input type="text" placeholder="Nom sur la carte" className="input-form-payment" />
          <label className="label-form-payment">Titulaire</label>
        </div>
      </div>
    </div>
  );

  const MobilePaymentForm = () => (
     <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 animate-fadeIn mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <DevicePhoneMobileIcon className="w-5 h-5 mr-2 text-orange-500" />
        Paiement Mobile
      </h3>
      <div className="space-y-4">
        <div className="relative">
          <select className="input-form-payment">
            <option>Orange Money</option>
            <option>MTN Mobile Money</option>
            {/* Ajoutez d'autres opérateurs si nécessaire */}
          </select>
          <label className="label-form-payment">Opérateur</label>
        </div>
        <div className="relative">
          <input type="tel" placeholder="+237 6XX XXX XXX" className="input-form-payment" />
          <label className="label-form-payment">Numéro de téléphone</label>
        </div>
      </div>
    </div>
  );
  
  const ShareMenu = () => (
    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-1.5 z-50 w-48">
      {shareOptions.map((option) => (
        <button
          key={option.name}
          onClick={option.action}
          className={`w-full flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-gray-100 transition-colors text-sm text-gray-700`}
        >
          {option.icon}
          <span>{option.name}</span>
        </button>
      ))}
    </div>
  );

  // ... (Reste du JSX pour affichage principal, succès, traitement)
   const finalPrice = calculateTotal();
   const priceForRecipientIfTheyPay = calculatePackageBasePrice() + calculateAdditionalFees() + calculateInsuranceFee();

   if (paymentStatus) {
    let title = "Paiement réussi !";
    let message = `Votre colis ${APP_NAME} (N° ${trackingNumber}) a été enregistré avec succès.`;
    let iconColor = "from-green-400 to-emerald-500";
    let IconComponent = CheckCircleIcon;

    if (paymentStatus === 'pending_cash') {
      title = "Paiement réussi !";
      message = `Le colis ${APP_NAME} (N° ${trackingNumber}) a été enregistré avec succès.`;
      iconColor = "from-green-400 to-emerald-500";
      IconComponent = CheckCircleIcon;
    } else if (paymentStatus === 'pending_recipient') {
      title = "Enregistrement confirmé !";
      message = `Le colis (N° ${trackingNumber}) est enregistré. Le destinataire paiera ${priceForRecipientIfTheyPay.toLocaleString()} FCFA à la réception.`;
      iconColor = "from-purple-400 to-pink-500";
      IconComponent = UserCircleIcon;
    }

    return (
      <div className="max-w-3xl mx-auto text-center py-8">
        <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn">
          <div className={`w-20 h-20 bg-gradient-to-r ${iconColor} rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse`}>
            <IconComponent className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6 text-md">{message}</p>
          
          <div className="bg-slate-50 p-6 rounded-xl mb-6 border border-slate-200">
            <p className="text-sm text-gray-500 mb-1">Numéro de suivi de votre colis</p>
            <p className="text-2xl font-bold text-green-700 font-mono tracking-wide">{trackingNumber}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowInvoice(true)}
              className="btn-primary flex-1"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Voir le Bordereau
            </button>
            <button
              onClick={onBack} // Idéalement, cela devrait aussi réinitialiser l'état de ce composant
              className="btn-secondary flex-1"
            >
              Nouvelle tâche
            </button>
          </div>
        </div>
        {showInvoice && <InvoiceModal />}
      </div>
    );
  }


  if (isProcessing) {
    // ... (Affichage du traitement identique)
    const steps = ['Vérification des informations...', 'Traitement en cours...', 'Validation du paiement...', 'Enregistrement de la commande...'];
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Traitement en cours...</h2>
          <p className="text-gray-600 mb-5">Veuillez patienter, ceci peut prendre quelques instants.</p>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-green-700 font-medium text-sm">{steps[processingStep]}</p>
            <div className="w-full bg-green-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((processingStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ... (JSX principal pour la sélection du paiement et le résumé)
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid lg:grid-cols-5 gap-8 items-start"> {/* Changé à 5 colonnes, 3 pour paiement, 2 pour résumé */}
        <div className="lg:col-span-3"> {/* Section paiement prend 3 colonnes */}
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Finaliser votre envoi
          </h2>
          <p className="text-gray-600 mb-8 text-md">Veuillez sélectionner une méthode pour régler les frais d'expédition.</p>


          <div className="space-y-5 mb-8">
            {paymentMethods.map((method) => (
              <PaymentMethodCard key={method.id} method={method} />
            ))}
          </div>

          {selectedMethod && !showPaymentForm && (selectedMethod === 'card' || selectedMethod === 'mobile') && (
            <div className="text-center animate-fadeIn mt-6">
              <button
                onClick={() => setShowPaymentForm(true)}
                className="btn-primary w-full sm:w-auto"
              >
                Continuer avec {paymentMethods.find(m => m.id === selectedMethod)?.name}
              </button>
            </div>
          )}

          {showPaymentForm && selectedMethod === 'card' && <CardPaymentForm />}
          {showPaymentForm && selectedMethod === 'mobile' && <MobilePaymentForm />}

          {(selectedMethod === 'cash' || selectedMethod === 'recipient_pay') && !showPaymentForm && (
             <div className="text-center animate-fadeIn mt-6">
                <button
                    onClick={handlePayment}
                    className="btn-primary w-full sm:w-auto"
                >
                    Confirmer l'expédition
                    {selectedMethod === 'cash' && " (Paiement au dépôt)"}
                    {selectedMethod === 'recipient_pay' && " (Paiement par destinataire)"}
                </button>
             </div>
          )}
        </div>

        {/* Sidebar avec résumé - prend 2 colonnes */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 sticky top-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
              <DocumentTextIcon className="w-6 h-6 mr-2 text-green-600" />
              Résumé de la Commande
            </h3>

            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 text-sm">
              <div className="font-semibold text-gray-700 mb-1">Expéditeur (Vous)</div>
              <p><UserIcon className="inline w-4 h-4 mr-1 text-gray-500" /> {currentUser.name}</p>
              <p><PhoneIcon className="inline w-4 h-4 mr-1 text-gray-500" /> {currentUser.phone}</p>
              <p><MapPinIcon className="inline w-4 h-4 mr-1 text-gray-500" /> Départ de: <span className="font-medium">{formData?.departurePointName || 'N/A'}</span></p>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 text-sm">
              <div className="font-semibold text-gray-700 mb-1">Destinataire</div>
              <p><UserIcon className="inline w-4 h-4 mr-1 text-gray-500" /> {formData?.recipientName || 'N/A'}</p>
              <p><PhoneIcon className="inline w-4 h-4 mr-1 text-gray-500" /> {formData?.recipientPhone || 'N/A'}</p>
              {formData?.recipientEmail && <p><InformationCircleIcon className="inline w-4 h-4 mr-1 text-gray-500" /> {formData.recipientEmail}</p>}
              <p><MapPinIcon className="inline w-4 h-4 mr-1 text-gray-500" /> Arrivée à: <span className="font-medium">{formData?.arrivalPointName || 'N/A'}</span></p>
              {formData?.distance && <p><ArrowRightIcon className="inline w-4 h-4 mr-1 text-gray-500" /> Distance: <span className="font-medium">{formData.distance.toFixed(1)} km</span></p>}
            </div>
            
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 text-sm">
              <div className="font-semibold text-gray-700 mb-1">Détails du Colis</div>
              <p><CubeIcon className="inline w-4 h-4 mr-1 text-gray-500" /> {packageData?.designation || 'Colis Standard'}</p>
              <p><ScaleIcon className="inline w-4 h-4 mr-1 text-gray-500" /> Poids: <span className="font-medium">{packageData?.weight || formData?.weight || 'N/A'} kg</span></p>
              {packageData?.length && <p><InformationCircleIcon className="inline w-4 h-4 mr-1 text-gray-500" /> Dimensions: <span className="font-medium">{packageData.length}x{packageData.width}x{packageData.height}cm</span></p>}
              {packageData?.isFragile && <p className="text-orange-600"><ShieldCheckIcon className="inline w-4 h-4 mr-1" /> Colis Fragile</p>}
              {packageData?.isPerishable && <p className="text-red-600"><ClockIcon className="inline w-4 h-4 mr-1" /> Colis Périssable</p>}
               {packageData?.isInsured && <p className="text-blue-600"><ShieldCheckIcon className="inline w-4 h-4 mr-1" /> Colis Assuré (Val: {parseFloat(packageData.declaredValue || '0').toLocaleString()} FCFA)</p>}
            </div>

            <div className="space-y-2 mb-5 text-sm">
              <div className="font-semibold text-gray-700 mb-1">Coûts Estimés</div>
              <div className="flex justify-between"><span>Prix de base:</span> <span className="font-medium">{calculatePackageBasePrice().toLocaleString()} FCFA</span></div>
              <div className="flex justify-between"><span>Frais additionnels:</span> <span className="font-medium">{calculateAdditionalFees().toLocaleString()} FCFA</span></div>
              <div className="flex justify-between"><span>Assurance:</span> <span className="font-medium">{calculateInsuranceFee().toLocaleString()} FCFA</span></div>
              {selectedMethod !== 'recipient_pay' && paymentMethods.find(m => m.id === selectedMethod)?.fees > 0 && (
                <div className="flex justify-between">
                    <span>Frais {paymentMethods.find(m => m.id === selectedMethod)?.name}:</span>
                    <span className="font-medium">{(paymentMethods.find(m => m.id === selectedMethod)?.fees || 0).toLocaleString()} FCFA</span>
                </div>
              )}
            </div>

            <div className="bg-green-50 p-3 rounded-lg border-t-2 border-green-500">
              <div className="flex justify-between items-center">
                <span className="text-md font-bold text-gray-800">
                    {selectedMethod === 'recipient_pay' ? 'Total (Destinataire):' : 'Total à Payer:'}
                </span>
                <span className="text-xl font-bold text-green-700">
                    {(selectedMethod === 'recipient_pay' ? priceForRecipientIfTheyPay : finalPrice).toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {showPaymentForm && (selectedMethod === 'card' || selectedMethod === 'mobile') && (
                <button onClick={handlePayment} className="btn-primary w-full">
                  Payer {finalPrice.toLocaleString()} FCFA
                </button>
              )}
              <button onClick={onBack} className="btn-secondary w-full"> Retour </button>
            </div>
             <div className="mt-5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <LockClosedIcon className="w-4 h-4 text-green-600 inline mr-1.5 align-middle" />
                <span className="text-xs text-gray-600 align-middle">Transactions sécurisées par {APP_NAME}.</span>
            </div>
          </div>
        </div>
      </div>
      {/* Styles CSS pour le formulaire de paiement et la facture/bordereau */}
      <style jsx global>{`
        .input-form-payment {
          width: 100%; padding: 0.8rem 1rem; font-size: 0.9rem;
          border: 1px solid #e5e7eb; border-radius: 0.5rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-form-payment:focus {
          outline: none; border-color: #10b981; /* emerald-500 */
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }
        .label-form-payment { /* Style pour les labels flottants si vous les ajoutez */
          position: absolute; top: -0.6rem; left: 0.75rem;
          background-color: white; padding: 0 0.25rem;
          font-size: 0.75rem; color: #6b7280; /* gray-500 */
          transition: all 0.2s;
        }
        .btn-primary {
            display: flex; align-items: center; justify-content: center;
            padding: 0.75rem 1.25rem; background-color: #10b981; /* emerald-500 */ color: white;
            border-radius: 0.5rem; font-weight: 500; font-size: 0.9rem;
            transition: all 0.2s ease-in-out; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .btn-primary:hover:not(:disabled) { background-color: #059669; /* emerald-600 */ transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }
        
        .btn-secondary {
            display: flex; align-items: center; justify-content: center;
            padding: 0.75rem 1.25rem; background-color: white; color: #374151; /* gray-700 */
            border: 1px solid #d1d5db; /* gray-300 */
            border-radius: 0.5rem; font-weight: 500; font-size: 0.9rem;
            transition: all 0.2s ease-in-out; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .btn-secondary:hover { background-color: #f3f4f6; /* gray-100 */ border-color: #9ca3af; }

        .btn-icon-header {
            padding: 0.5rem; border-radius: 9999px; transition: background-color 0.2s;
            color: #4b5563; /* gray-600 */
        }
        .btn-icon-header:hover { background-color: #e5e7eb; /* gray-200 */ }
        
        /* Styles pour la facture/bordereau PDF */
        .invoice-section { border: 1px solid #e0e0e0; padding: 10px; border-radius: 6px; }
        .invoice-section-title { font-size: 11pt; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-bottom: 8px; }
        .invoice-table-label { font-weight: bold; padding: 4px; text-align: left; min-width: 90px; }
        .invoice-table-value { padding: 4px; text-align: left; }
        .invoice-financial-row { display: flex; justify-content: space-between; padding: 3px 0; }
      `}</style>
    </div>
  );
};

export default Payment;