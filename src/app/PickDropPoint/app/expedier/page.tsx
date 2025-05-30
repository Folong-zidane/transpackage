'use client'
import { useState, useRef, useEffect } from 'react';
import { Package, Truck, Plane, Train, Car, Bus, MapPin, Send, CheckCircle, User, PenTool, X, Download, Clock, Zap, AlertCircle, Bike, Ship } from 'lucide-react';
import Navbar from '../../components/Navbar';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Important for the autoTable plugin

export default function ExpeditionColis() {
  const [colis, setColis] = useState([
    {
      id: 'PKG-A1B2C3D4E5F6',
      type: 'Standard',
      status: 'En attente',
      destination: 'Dakar Centre',
      poids: '2.5 kg',
      contenu: 'Documents officiels',
      expediteur: 'Marie Diop',
      destinataire: 'Amadou Fall',
      vehicule: null,
      priority: 1
    },
    {
      id: 'PKG-X9Y8Z7W6V5U4',
      type: 'Express',
      status: 'En attente',
      destination: 'Thiès',
      poids: '1.2 kg',
      contenu: 'Médicaments urgents',
      expediteur: 'Dr. Ndiaye',
      destinataire: 'Hôpital Régional',
      vehicule: null,
      priority: 3
    },
    {
      id: 'PKG-M3N4O5P6Q7R8',
      type: 'Standard',
      status: 'Expédié',
      destination: 'Saint-Louis',
      poids: '5.0 kg',
      contenu: 'Livres scolaires',
      expediteur: 'École Primaire',
      destinataire: 'Fatou Sow',
      vehicule: 'camion', // Make sure this matches an id in vehicules
      priority: 1
    },
    {
      id: 'PKG-G1H2I3J4K5L6',
      type: 'Express',
      status: 'En attente',
      destination: 'Ziguinchor',
      poids: '0.8 kg',
      contenu: 'Échantillons médicaux',
      expediteur: 'Laboratoire Central',
      destinataire: 'Centre de Santé',
      vehicule: null,
      priority: 3
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColis, setSelectedColis] = useState([]);
  const [showExpeditionModal, setShowExpeditionModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [gerantName, setGerantName] = useState('');
  const [signature, setSignature] = useState(''); // Will store DataURL of signature
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastExpeditionDetails, setLastExpeditionDetails] = useState([]);


  const vehicules = [
    { id: 'tricycle', name: 'Tricycle', icon: <Bike className="w-5 h-5 text-blue-500" />, capacity: '50kg max', speed: 'Local' },
    { id: 'voiture', name: 'Voiture', icon: <Car className="w-5 h-5 text-purple-500" />, capacity: '200kg max', speed: 'Rapide' },
    { id: 'bus', name: 'Bus', icon: <Bus className="w-5 h-5 text-orange-500" />, capacity: '500kg max', speed: 'Moyen' },
    { id: 'camion', name: 'Camion', icon: <Truck className="w-5 h-5 text-red-500" />, capacity: '2000kg max', speed: 'Lent' },
    { id: 'train', name: 'Train', icon: <Train className="w-5 h-5 text-gray-700" />, capacity: '5000kg max', speed: 'Rapide' },
    { id: 'avion', name: 'Avion', icon: <Plane className="w-5 h-5 text-sky-500" />, capacity: '1000kg max', speed: 'Très rapide' },
    { id: 'bateau', name: 'Bateau', icon: <Ship className="w-5 h-5 text-teal-500" />, capacity: '10000kg max', speed: 'Très Lent' }
  ];

  const filteredColis = colis.filter(c => {
    if (filterStatus !== 'Tous' && c.status !== filterStatus) return false;
    if (searchQuery && !Object.values(c).some(value => 
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )) return false;
    return true;
  }).sort((a, b) => b.priority - a.priority || (a.status === 'En attente' ? -1 : 1));


  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Expédié': return 'bg-green-100 text-green-800 border-green-300';
      case 'Express': return 'bg-red-100 text-red-800 border-red-300'; // This seems to be for type, not status
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'Express' ? <Zap className="w-4 h-4 text-red-500" /> : <Package className="w-4 h-4 text-blue-500" />;
  };

  const getVehiculeIconComponent = (vehiculeId) => {
    const vehicule = vehicules.find(v => v.id === vehiculeId);
    return vehicule ? vehicule.icon : <Truck className="w-5 h-5 text-gray-400" />;
  };
  
  const getVehiculeName = (vehiculeId) => {
    const vehicule = vehicules.find(v => v.id === vehiculeId);
    return vehicule ? vehicule.name : 'Non assigné';
  }

  const handleSelectColis = (colisId) => {
    setSelectedColis(prev => 
      prev.includes(colisId) 
        ? prev.filter(id => id !== colisId)
        : [...prev, colisId]
    );
  };

  const handleVehiculeChange = (colisId, vehiculeId) => {
    setColis(prev => prev.map(c => 
      c.id === colisId ? { ...c, vehicule: vehiculeId } : c
    ));
  };

  const handleExpedition = () => {
    if (selectedColis.length === 0) {
        alert("Veuillez sélectionner au moins un colis à expédier.");
        return;
    }
    
    const colisToUpdate = colis.map(c => {
      if (selectedColis.includes(c.id)) {
        let vehiculeToAssign = c.vehicule;
        if (!vehiculeToAssign) { // Si aucun véhicule n'est manuellement choisi
            vehiculeToAssign = c.type === 'Express' ? 'avion' : 'tricycle'; // Logique par défaut
        }
        return { ...c, vehicule: vehiculeToAssign };
      }
      return c;
    });
    setColis(colisToUpdate);
    setShowExpeditionModal(true);
  };

  // Signature Canvas Logic
  useEffect(() => {
    if (showSignatureModal && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, [showSignatureModal]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0)) {
        const signatureData = canvas.toDataURL('image/png');
        setSignature(signatureData);
    } else {
        setSignature(''); // No actual drawing
    }
    setShowSignatureModal(false);
    setShowExpeditionModal(false); // Close expedition modal as well
    finalizeExpedition(); // Finalize after signature is set (or not)
  };

  const finalizeExpedition = () => {
    const expeditedColisDetails = colis.filter(c => selectedColis.includes(c.id));
    setLastExpeditionDetails(expeditedColisDetails); // Store for PDF download from success modal

    setColis(prev => prev.map(c => 
      selectedColis.includes(c.id) ? { ...c, status: 'Expédié' } : c
    ));
    
    setShowSuccessModal(true);
    
    // Don't clear selectedColis here if PDF generation relies on it immediately.
    // Clear it after PDF is generated or when success modal is closed.
    // For now, generatePDF will use lastExpeditionDetails.
  };

  const generatePDF = (colisDetailsToPrint) => {
    if (!colisDetailsToPrint || colisDetailsToPrint.length === 0) {
        console.warn("Aucun colis à imprimer dans le PDF.");
        return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Bon d'Expédition", 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Nom du Gérant: ${gerantName || 'Non spécifié'}`, 14, 35);
    doc.text(`Date d'expédition: ${new Date().toLocaleDateString('fr-FR')}`, 14, 42);

    if (signature) {
      try {
        doc.addImage(signature, 'PNG', 150, 28, 45, 20); // x, y, width, height
        doc.setFontSize(8);
        doc.text("Signature Gérant", 162, 50);
      } catch (e) {
        console.error("Erreur d'ajout de la signature au PDF:", e);
        doc.text("Signature (Erreur)", 150, 35);
      }
    } else {
        doc.text("Signature Gérant: Non fournie", 130, 42);
    }


    const tableColumn = ["ID Colis", "Type", "Contenu", "Destination", "Poids", "Véhicule"];
    const tableRows = [];

    colisDetailsToPrint.forEach(c => {
      const vehiculeInfo = vehicules.find(v => v.id === c.vehicule);
      const rowData = [
        c.id,
        c.type,
        c.contenu,
        c.destination,
        c.poids,
        vehiculeInfo ? vehiculeInfo.name : 'N/A',
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'striped', // 'striped', 'grid', 'plain'
      headStyles: { fillColor: [34, 197, 94] }, // Green color for header
      margin: { top: 10 },
    });
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} sur ${pageCount}`, 105, 285, { align: 'center' }); // Footer
    }

    const fileName = `bon_expedition_${gerantName.replace(/\s+/g, '_') || 'global'}_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(fileName);
    
    // Clear selection and reset form fields after PDF generation
    setSelectedColis([]);
    // setGerantName(''); // Optionally reset manager name
    // clearSignature(); // Optionally clear signature from view, it's already saved in `signature` state if used
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-slate-50 to-gray-100 p-4 md:p-8 font-sans">
      <Navbar />
      <div className="max-w-7xl mt-20 mx-auto">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-xl p-6 mb-8 border-t-4 border-green-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-4 rounded-full shadow-md">
                <Package className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Gestion des Expéditions</h1>
                <p className="text-gray-500 text-sm">Organisez et suivez vos envois de colis.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase font-semibold">Colis Prêts</div>
                <div className="text-3xl font-bold text-green-600">{selectedColis.length}</div>
              </div>
              {selectedColis.length > 0 && (
                <button
                  onClick={handleExpedition}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2.5 transition-all duration-300 transform hover:scale-105 shadow-lg focus:ring-4 focus:ring-green-300"
                >
                  <Send className="w-5 h-5" />
                  <span className="font-semibold">Expédier Sélection</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="md:col-span-2">
              <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher un colis
              </label>
              <input
                id="searchQuery"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                placeholder="ID, contenu, destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Filtrer par statut
              </label>
              <select
                id="filterStatus"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Tous">Tous les statuts</option>
                <option value="En attente">En attente</option>
                <option value="Expédié">Expédié</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des colis */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <span className="sr-only">Sélection</span>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID Colis</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Contenu</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Poids</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Véhicule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredColis.length > 0 ? (
                  filteredColis.map((c) => (
                    <tr 
                      key={c.id} 
                      className={`group transition-all duration-150 ${
                        selectedColis.includes(c.id) ? 'bg-green-100 border-l-4 border-green-500' : 'hover:bg-gray-50'
                      } ${c.status === 'Expédié' ? 'opacity-70' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedColis.includes(c.id)}
                          onChange={() => handleSelectColis(c.id)}
                          disabled={c.status === 'Expédié'}
                          className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(c.type)}
                          <span className="font-mono text-sm font-medium text-gray-900 group-hover:text-green-600">{c.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          c.type === 'Express' 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={c.contenu}>{c.contenu}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{c.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{c.poids}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {c.status === 'En attente' ? (
                          <select
                            value={c.vehicule || ''}
                            onChange={(e) => handleVehiculeChange(c.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm w-full max-w-[180px]"
                          >
                            <option value="">Choisir véhicule...</option>
                            {vehicules.map(v => (
                              <option key={v.id} value={v.id}>
                                {v.name}
                              </option>
                            ))}
                          </select>
                        ) : c.vehicule ? (
                          <div className="flex items-center space-x-2">
                            {getVehiculeIconComponent(c.vehicule)}
                            <span className="text-sm text-gray-600 capitalize">{getVehiculeName(c.vehicule)}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Non assigné</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center text-gray-400">
                            <AlertCircle className="w-16 h-16 text-gray-300 mb-4"/>
                            <p className="text-xl font-semibold text-gray-500 mb-1">Aucun colis ne correspond à vos critères.</p>
                            <p className="text-sm">Veuillez ajuster vos filtres ou votre recherche.</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal d'expédition */}
        {showExpeditionModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h3 className="text-2xl font-semibold text-gray-800">Confirmation d'Expédition</h3>
                <button onClick={() => setShowExpeditionModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6"/>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <p className="text-gray-600">
                  Vous êtes sur le point d'expédier <strong className="text-green-600">{selectedColis.length} colis</strong>. 
                  Veuillez vérifier les détails et signer.
                </p>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border rounded-lg p-3 bg-gray-50">
                  {colis.filter(c => selectedColis.includes(c.id)).map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border">
                      <div>
                        <div className="font-mono text-xs font-medium text-gray-700">{c.id}</div>
                        <div className="text-sm text-gray-600">{c.contenu} <span className="text-gray-400">→</span> {c.destination}</div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        {getVehiculeIconComponent(c.vehicule)}
                        <span className="capitalize">{getVehiculeName(c.vehicule) || <span className="text-red-500 italic">À assigner!</span>}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="gerantName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du Gérant <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="gerantName"
                    type="text"
                    value={gerantName}
                    onChange={(e) => setGerantName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Entrez votre nom complet"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    onClick={() => setShowExpeditionModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (gerantName.trim()) {
                        setShowSignatureModal(true);
                      } else {
                        alert("Veuillez entrer le nom du gérant.");
                      }
                    }}
                    disabled={!gerantName.trim()}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    <PenTool className="w-5 h-5" />
                    <span>Signer et Expédier</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de signature */}
        {showSignatureModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-md flex items-center justify-center z-[60] p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Signature Électronique</h3>
                 <button onClick={() => setShowSignatureModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6"/>
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-3 text-sm">Veuillez apposer votre signature dans le cadre ci-dessous.</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg mb-4 bg-gray-50 shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={360} // Reduced fixed width for better responsiveness control with CSS if needed
                    height={180}
                    className="w-full h-auto cursor-crosshair rounded-md" // Ensure it scales
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={(e) => startDrawing(e.touches[0])}
                    onTouchMove={(e) => draw(e.touches[0])}
                    onTouchEnd={stopDrawing}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                  <button
                    onClick={clearSignature}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
                  >
                    Effacer
                  </button>
                  <div className="flex space-x-3 w-full sm:w-auto">
                    <button
                      onClick={() => setShowSignatureModal(false)}
                      className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      onClick={saveSignature}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
                    >
                      Confirmer Signature
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de succès */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all duration-300 scale-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-200">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Expédition Réussie !</h3>
              <p className="text-gray-600 mb-8">
                Les <strong className="text-green-600">{lastExpeditionDetails.length} colis</strong> sélectionnés ont été marqués comme expédiés.
                Vous pouvez télécharger le bon d'expédition.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    generatePDF(lastExpeditionDetails);
                  }}
                  className="w-full bg-green-600 text-white py-3.5 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  <span>Télécharger le Bon d'Expédition</span>
                </button>
                <button
                    onClick={() => {
                        setShowSuccessModal(false);
                        setSelectedColis([]); // Clear selection now
                        // setGerantName(''); // Optionally reset
                        // clearSignature(); // Optionally reset
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-3.5 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
                >
                    Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}