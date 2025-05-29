import React, { useState, useRef, useEffect } from 'react'; // Added useEffect
import { 
  Plus, Edit2, Trash2, Package, Map, 
  BarChart2, Star, DollarSign, MapPin, Save,
  Upload, Phone, User, Mail, Home, Clock,
  Check, Loader, Settings, X
} from 'lucide-react';
import GerantForm, { GerantFormData, Utilisateur as GerantUtilisateur } from './gerant';

// Types (assuming PointRelais and Utilisateur interfaces are the same)
interface PointRelais {
  id: string;
  nom: string;
  photo: string;
  localisation: string;
  quartier: string;
  description: string;
  type: 'Bureau' | 'Commerce' | 'Agence';
  contact: string;
  nomProprietaire: string;
  nombreColis: number;
  pourcentageVente: number;
  retourUtilisateurs: number;
  gainsPourvus: number;
  tauxPopularite: number;
  recent?: boolean;
  horaires?: string;
  capaciteMax?: number;
  status?: 'en_attente' | 'approuve' | 'refuse';
}

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  photo?: string;
  isGerant?: boolean;
}

interface GrelaisProps {
  utilisateur: Utilisateur; // This is the initial prop from the parent
}

// Define localStorage keys
const LOCAL_STORAGE_IS_GERANT_PREFIX = 'grelais_isGerant_';
const LOCAL_STORAGE_POINTS_RELAIS_PREFIX = 'grelais_pointsRelais_';

const Grelais: React.FC<GrelaisProps> = ({ utilisateur: initialUserProp }) => {
  // State for the current user, potentially updated with localStorage data
  const [utilisateur, setUtilisateur] = useState<Utilisateur>(initialUserProp);
  // State for points relais, potentially loaded from localStorage
  const [pointsRelais, setPointsRelais] = useState<PointRelais[]>([]);

  const [selectedPointRelais, setSelectedPointRelais] = useState<PointRelais | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isGerantModalOpen, setIsGerantModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [newPointRelais, setNewPointRelais] = useState<Partial<PointRelais>>({
    type: 'Commerce'
  });
  
  const pointRelaisPhotoInputRef = useRef<HTMLInputElement>(null);

  // Effect 1: Load user status and points relais from localStorage on mount or when initialUserProp changes
  useEffect(() => {
    if (!initialUserProp || !initialUserProp.id) {
        console.warn("Initial user prop is undefined or missing ID. LocalStorage features might not work correctly.");
        setUtilisateur(initialUserProp || {} as Utilisateur); // Set to initial or empty to avoid errors
        setPointsRelais([]);
        return;
    }
    const currentUserId = initialUserProp.id;

    // Determine 'isGerant' status
    const storedIsGerant = localStorage.getItem(`${LOCAL_STORAGE_IS_GERANT_PREFIX}${currentUserId}`);
    // Priority: localStorage > initial prop > default false
    const effectiveIsGerant = storedIsGerant === 'true' ? true : (initialUserProp.isGerant || false);

    setUtilisateur({
        ...initialUserProp,
        isGerant: effectiveIsGerant,
    });

    // Load points relais if user is a gerant
    if (effectiveIsGerant) {
      const storedPointsRelais = localStorage.getItem(`${LOCAL_STORAGE_POINTS_RELAIS_PREFIX}${currentUserId}`);
      try {
        setPointsRelais(storedPointsRelais ? JSON.parse(storedPointsRelais) : []);
      } catch (error) {
        console.error(`Failed to parse pointsRelais for user ${currentUserId} from localStorage`, error);
        setPointsRelais([]);
      }
    } else {
      setPointsRelais([]); // Not a gerant, clear pointsRelais state.
    }
  }, [initialUserProp]); // Rerun if the initialUserProp object reference changes

  // Effect 2: Persist pointsRelais to localStorage when they change, if the user is a gerant
  useEffect(() => {
    if (utilisateur.isGerant && utilisateur.id) {
      localStorage.setItem(`${LOCAL_STORAGE_POINTS_RELAIS_PREFIX}${utilisateur.id}`, JSON.stringify(pointsRelais));
    }
    // Note: If a user stops being a gerant, their points relais data might remain in localStorage
    // unless explicitly cleared. This logic only handles saving when they *are* a gerant.
  }, [pointsRelais, utilisateur.isGerant, utilisateur.id]);
  
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          if (isCreateMode) {
            setNewPointRelais({ ...newPointRelais, localisation: coords });
          } else if (selectedPointRelais) {
            setSelectedPointRelais({ ...selectedPointRelais, localisation: coords });
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          alert("Impossible d'obtenir votre position. Veuillez l'entrer manuellement.");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  const openModal = (pointRelaisItem: PointRelais) => {
    setSelectedPointRelais(pointRelaisItem);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedPointRelais(null);
    setIsCreateMode(true);
    setNewPointRelais({
      type: 'Commerce',
      nomProprietaire: `${utilisateur.nom} ${utilisateur.prenom}`,
      contact: utilisateur.telephone, // Pre-fill contact from user
      capaciteMax: 50,
      horaires: '08:00 - 18:00'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPointRelais(null);
    // Don't reset showSuccess here, let the floating message timer handle it
  };

  const closeGerantModal = () => {
    setIsGerantModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const processedValue = e.target.type === 'number' ? parseInt(value, 10) || 0 : value;

    if (isCreateMode) {
      setNewPointRelais({ ...newPointRelais, [name]: processedValue });
    } else if (selectedPointRelais) {
      setSelectedPointRelais({ ...selectedPointRelais, [name]: processedValue } as PointRelais);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const photoUrl = event.target.result.toString();
          if (isCreateMode) {
            setNewPointRelais({ ...newPointRelais, photo: photoUrl });
          } else if (selectedPointRelais) {
            setSelectedPointRelais({ ...selectedPointRelais, photo: photoUrl } as PointRelais);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDevenirGerantSubmit = async (formData: GerantFormData) => {
    setIsLoading(true);
    console.log("Données de candidature Gérant:", formData, "pour utilisateur:", utilisateur.id);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API
    
    // Update state AND localStorage for isGerant status
    setUtilisateur(prevUser => {
      const updatedUser = { ...prevUser, isGerant: true };
      if (updatedUser.id) { // Ensure ID exists before setting in localStorage
        localStorage.setItem(`${LOCAL_STORAGE_IS_GERANT_PREFIX}${updatedUser.id}`, 'true');
      }
      return updatedUser;
    });
    
    setIsLoading(false);
    setIsGerantModalOpen(false);
    setSuccessMessage("Candidature envoyée ! Vous êtes maintenant gérant (simulation).");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSave = () => { // For editing an existing point relais
    if (selectedPointRelais) {
      // The setPointsRelais will trigger Effect 2 to save to localStorage
      setPointsRelais(pointsRelais.map(point => 
        point.id === selectedPointRelais.id ? selectedPointRelais : point
      ));
      closeModal();
      setSuccessMessage("Point relais mis à jour !");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCreate = async (event?: React.FormEvent) => {
    if (event) event.preventDefault(); // Prevent default form submission if called from form
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    const newPoint: PointRelais = {
      id: Date.now().toString(),
      nom: newPointRelais.nom || 'Nouveau Point Relais',
      photo: newPointRelais.photo || '', // Provide default empty string if undefined
      localisation: newPointRelais.localisation || 'Non défini',
      quartier: newPointRelais.quartier || 'Non défini',
      description: newPointRelais.description || 'Aucune description.',
      type: newPointRelais.type as 'Bureau' | 'Commerce' | 'Agence' || 'Commerce',
      contact: newPointRelais.contact || utilisateur.telephone || 'N/A',
      nomProprietaire: newPointRelais.nomProprietaire || `${utilisateur.nom} ${utilisateur.prenom}`,
      horaires: newPointRelais.horaires || '09:00 - 17:00',
      capaciteMax: Number(newPointRelais.capaciteMax) || 50,
      nombreColis: 0,
      pourcentageVente: 0,
      retourUtilisateurs: 0,
      gainsPourvus: 0,
      tauxPopularite: 0,
      recent: true,
      status: 'en_attente'
    };
    
    // This state update will trigger Effect 2 to save to localStorage
    setPointsRelais(prevPoints => [...prevPoints, newPoint]); 
    
    setIsLoading(false);
    setSuccessMessage("Point relais créé et en attente de validation!"); // For modal
    setShowSuccess(true); // Shows message in modal

    setTimeout(() => {
      // This success is for the floating notification after modal closes
      setShowSuccess(false); // Reset for next modal usage
      closeModal();
      setSuccessMessage("Point relais créé ! En attente de validation.");
      setShowSuccess(true); // Show floating notification
      setTimeout(() => setShowSuccess(false), 3500);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce point relais ?')) {
      // This state update will trigger Effect 2 to save to localStorage
      setPointsRelais(pointsRelais.filter(point => point.id !== id));
      setSuccessMessage("Point relais supprimé.");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // ... (getTypeColor, getStatusColor, getStatusText functions remain the same)
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Bureau': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Commerce': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Agence': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'approuve': return 'bg-green-50 text-green-700 border-green-200';
      case 'refuse': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'approuve': return 'Approuvé';
      case 'refuse': return 'Refusé';
      default: return 'Inconnu';
    }
  };


  // Conditional rendering based on utilisateur.isGerant
  if (!utilisateur.isGerant && pointsRelais.length === 0) {
    return (
      <section className="flex-1 min-h-screen bg-teal-50 relative overflow-hidden">
        {/* ... (contenu pour non-gérant, identique à avant) ... */}
        <div className="items-center justify-center min-h-screen p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-transparent p-4 border border-white/20">
              <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <MapPin className="text-6xl text-teal-800" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                Rejoignez notre réseau de points relais
              </h1>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                Développez votre activité en devenant gérant de point relais. 
                Offrez un service de proximité à votre communauté tout en générant des revenus supplémentaires.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/50 rounded-2xl shadow-2xl p-6 border border-white/30">
                  <DollarSign className="text-3xl text-teal-700 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-800 mb-2">Revenus supplémentaires</h3>
                  <p className="text-sm text-slate-600">Gagnez de l'argent en gérant les colis</p>
                </div>
                <div className="bg-white/50 rounded-2xl shadow-2xl p-6 border border-white/30">
                  <User className="text-3xl text-teal-700 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-800 mb-2">Service à la clientèle</h3>
                  <p className="text-sm text-slate-600">Fidélisez votre clientèle locale</p>
                </div>
                <div className="bg-white/50 rounded-2xl shadow-2xl p-6 border border-white/30">
                  <BarChart2 className="text-3xl text-teal-700 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-800 mb-2">Croissance assurée</h3>
                  <p className="text-sm text-slate-600">Développez votre réseau</p>
                </div>
              </div>
              <button 
                className="bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white px-10 py-4 rounded-2xl flex items-center mx-auto transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg font-semibold"
                onClick={() => setIsGerantModalOpen(true)}
              >
                <User className="mr-3 text-xl" /> 
                Devenir gérant de point relais
              </button>
            </div>
          </div>
        </div>

        {isGerantModalOpen && utilisateur && ( // Ensure utilisateur is defined
          <GerantForm
            utilisateur={utilisateur}
            onSubmit={handleDevenirGerantSubmit}
            onClose={closeGerantModal}
            isLoading={isLoading}
          />
        )}

        {/* Message de succès général (pour devenir gérant, suppression etc.) */}
        {showSuccess && !isModalOpen && ( // Only show floating if no other modal is open
          <div className="fixed top-8 right-8 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg z-[100] animate-pulse">
            <div className="flex items-center">
              <Check className="mr-3 text-green-600" />
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}
      </section>
    );
  }

  // Rendu pour les gérants
  return (
    <section className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* ... (contenu pour gérant, identique à avant) ... */}
       <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Mes Points Relais</h2>
            <p className="text-slate-600">Gérez vos points de collecte et de distribution</p>
          </div>
          <button 
            className="bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={openCreateModal}
          >
            <Plus className="mr-2 text-lg" /> Créer un Point Relais
          </button>
        </div>

        {pointsRelais.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-slate-200">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-4xl text-teal-700" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">Aucun point relais</h3>
              <p className="text-slate-600 mb-6">Commencez par créer votre premier point relais pour développer votre réseau de distribution.</p>
              <button 
                className="bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white px-8 py-3 rounded-xl flex items-center mx-auto transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={openCreateModal}
              >
                <Plus className="mr-2" /> Créer mon premier point relais
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
            {pointsRelais.map(point => (
              <div key={point.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group relative max-w-xs">
                {point.recent && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse text-[10px]">
                      Nouveau
                    </span>
                  </div>
                )}
                
                <div className="relative h-24 bg-gradient-to-br from-teal-600 to-emerald-600">
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  {point.photo && point.photo.startsWith('data:') ? (
                    <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: `url(${point.photo})` }} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <MapPin className="text-3xl text-white/80" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(point.status || 'en_attente')}`}>
                      {getStatusText(point.status || 'en_attente')}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-sm text-slate-800 mb-1 truncate group-hover:text-teal-700 transition-colors">
                      {point.nom}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(point.type)}`}>
                      {point.type}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="mr-2 text-teal-600 flex-shrink-0 h-4 w-4" />
                      <span className="truncate">{point.quartier}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="mr-2 text-teal-600 flex-shrink-0 h-4 w-4" />
                      <span className="truncate">{point.horaires}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-50 rounded-lg p-2 text-center">
                      <Package className="mx-auto text-teal-600 mb-1 text-sm h-4 w-4" />
                      <div className="text-sm font-bold text-slate-800">{point.nombreColis}</div>
                      <div className="text-xs text-slate-600">Colis</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 text-center">
                      <Star className="mx-auto text-yellow-500 mb-1 text-sm h-4 w-4" />
                      <div className="text-sm font-bold text-slate-800">{point.retourUtilisateurs.toFixed(1)}</div>
                      <div className="text-xs text-slate-600">Note</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-colors text-xs"
                      onClick={() => openModal(point)}
                    >
                      <Settings className="mr-1 h-3 w-3" />
                      Config
                    </button>
                    <button 
                      className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 py-2 px-3 rounded-lg transition-colors"
                      onClick={() => handleDelete(point.id)}
                    >
                      <Trash2 className="text-xs h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Création/Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-700 px-8 py-6 relative">
              <h2 className="text-2xl font-bold text-white">
                {isCreateMode ? "Créer un nouveau Point Relais" : "Configurer le Point Relais"}
              </h2>
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="text-2xl" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isLoading ? (
                 <div className="text-center py-16">
                  <Loader className="animate-spin text-6xl text-teal-700 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-slate-800 mb-2">Envoi en cours...</h3>
                  <p className="text-slate-600">Traitement de votre demande. Veuillez patienter...</p>
                </div>
              ) : showSuccess && successMessage.includes("Point relais créé") ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-4xl text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-2">{successMessage}</h3>
                  <p className="text-slate-600">Votre demande sera examinée par notre équipe sous 24h.</p>
                </div>
              ) : (
                // Pass handleCreate or handleSave to the form's onSubmit
                <form onSubmit={isCreateMode ? handleCreate : (e) => { e.preventDefault(); handleSave(); }}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* Partie gauche - Photo et localisation */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        <Upload className="inline mr-2 h-5 w-5" />
                        Photo du point relais
                      </label>
                      <div className="relative">
                        <div 
                          className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 group"
                          onClick={() => pointRelaisPhotoInputRef.current?.click()}
                        >
                          {(isCreateMode ? newPointRelais.photo : selectedPointRelais?.photo) ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={isCreateMode ? newPointRelais.photo : selectedPointRelais?.photo} 
                                alt="Point relais" 
                                className="w-full h-full object-cover rounded-2xl"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Edit2 className="text-white text-2xl" />
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="text-4xl text-slate-400 group-hover:text-teal-500 mx-auto mb-3 transition-colors" />
                              <p className="text-slate-600 group-hover:text-teal-700 transition-colors">
                                Cliquez pour ajouter une photo
                              </p>
                              <p className="text-sm text-slate-400 mt-1">JPG, PNG (max 5MB)</p>
                            </div>
                          )}
                        </div>
                        <input
                          ref={pointRelaisPhotoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="localisation" className="block text-sm font-semibold text-slate-700 mb-3">
                        <MapPin className="inline mr-2 h-5 w-5" />
                        Localisation
                      </label>
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          id="localisation"
                          name="localisation"
                          className="flex-1 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          placeholder="Adresse ou coordonnées GPS"
                          value={isCreateMode ? newPointRelais.localisation || '' : selectedPointRelais?.localisation || ''}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={getUserLocation}
                          className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl border border-teal-200 transition-colors flex items-center"
                          title="Utiliser ma position"
                        >
                          <Map className="text-lg" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="quartier" className="block text-sm font-semibold text-slate-700 mb-3">
                        <Home className="inline mr-2 h-5 w-5" />
                        Quartier/Zone
                      </label>
                      <input
                        type="text"
                        id="quartier"
                        name="quartier"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        placeholder="Ex: Centre-ville, Bonanjo, Akwa..."
                        value={isCreateMode ? newPointRelais.quartier || '' : selectedPointRelais?.quartier || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Partie droite - Informations du point relais */}
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="nom" className="block text-sm font-semibold text-slate-700 mb-3">
                        <Package className="inline mr-2 h-5 w-5" />
                        Nom du point relais
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        placeholder="Ex: Boutique Centrale, Bureau Akwa..."
                        value={isCreateMode ? newPointRelais.nom || '' : selectedPointRelais?.nom || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-semibold text-slate-700 mb-3">
                        <Settings className="inline mr-2 h-5 w-5" />
                        Type de point relais
                      </label>
                      <select
                        id="type"
                        name="type"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                        value={isCreateMode ? newPointRelais.type : selectedPointRelais?.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Commerce">Commerce (Boutique, Magasin)</option>
                        <option value="Bureau">Bureau (Agence, Office)</option>
                        <option value="Agence">Agence (Point de service)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="horaires" className="block text-sm font-semibold text-slate-700 mb-3">
                        <Clock className="inline mr-2 h-5 w-5" />
                        Horaires d'ouverture
                      </label>
                      <input
                        type="text"
                        id="horaires"
                        name="horaires"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        placeholder="Ex: 08:00 - 18:00"
                        value={isCreateMode ? newPointRelais.horaires || '' : selectedPointRelais?.horaires || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="capaciteMax" className="block text-sm font-semibold text-slate-700 mb-3">
                        <Package className="inline mr-2 h-5 w-5" />
                        Capacité maximale (colis/jour)
                      </label>
                      <input
                        type="number"
                        id="capaciteMax"
                        name="capaciteMax"
                        min="1"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        placeholder="Ex: 50"
                        value={isCreateMode ? newPointRelais.capaciteMax || 50 : selectedPointRelais?.capaciteMax || 50}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="contact" className="block text-sm font-semibold text-slate-700 mb-3">
                        <Phone className="inline mr-2 h-5 w-5" />
                        Contact du point relais
                      </label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        placeholder="Numéro de téléphone"
                        value={isCreateMode ? newPointRelais.contact || '' : selectedPointRelais?.contact || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  </div>
                
                  {/* Common fields for both create and edit */}
                  <div className="mt-8">
                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-3">
                      <Edit2 className="inline mr-2 h-5 w-5" />
                      Description du point relais
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
                      placeholder="Décrivez votre point relais, les services proposés, l'accessibilité..."
                      value={isCreateMode ? newPointRelais.description || '' : selectedPointRelais?.description || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex justify-end mt-8 space-x-4">
                    <button 
                      type="button"
                      className="px-8 py-3 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 transition-all duration-200 font-medium"
                      onClick={closeModal}
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center font-semibold"
                      disabled={isLoading}
                    >
                      <Save className="mr-2 h-5 w-5" />
                      {isCreateMode ? 'Envoyer la demande' : 'Sauvegarder'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message de succès flottant (pour création de point relais, etc., si pas dans un modal) */}
      {showSuccess && !isModalOpen && (
         <div className="fixed top-8 right-8 bg-white border border-green-200 text-green-800 px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-bounce">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Check className="text-green-600" />
            </div>
            <div>
              <div className="font-semibold">{successMessage.split('!')[0]}{successMessage.includes("!") ? "!" : ""}</div>
              {successMessage.includes("!") && successMessage.split('!')[1]?.trim() && (
                <div className="text-sm text-green-700">{successMessage.split('!')[1]?.trim()}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Grelais;