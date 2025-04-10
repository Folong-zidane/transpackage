'use client';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import React, { useState, useEffect, useRef } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiPackage, FiUser, FiMap, 
  FiBarChart2, FiStar, FiDollarSign, FiMapPin, FiSave,
  FiUpload, FiX, FiCheck, FiPhone, FiMail, FiHome,
  FiEdit,
  FiCamera
} from 'react-icons/fi';

// Types
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
  retourUtilisateurs: number; // Sur 5
  gainsPourvus: number;
  tauxPopularite: number; // Pourcentage
  recent?: boolean;
}

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  photo?: string;
}

const Dashboard: React.FC = () => {
  const [utilisateur, setUtilisateur] = useState<Utilisateur>({
    id: '1',
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'marie.dupont@example.com',
    telephone: '+237 6 12 34 56 78',
    adresse: '123 Rue de Yaoundé, Douala',
    photo: '/images/default-user.jpg'
  });

  const [pointsRelais, setPointsRelais] = useState<PointRelais[]>([
    {
      id: '1',
      nom: 'Point Relais Central',
      photo: '/images/point-relais-1.jpg',
      localisation: '15 Avenue Kennedy, Douala',
      quartier: 'Akwa',
      description: 'Point relais situé en plein centre-ville, facilement accessible',
      type: 'Commerce',
      contact: '+237 6 23 45 67 89',
      nomProprietaire: 'Dupont Marie',
      nombreColis: 156,
      pourcentageVente: 87,
      retourUtilisateurs: 4.7,
      gainsPourvus: 324050,
      tauxPopularite: 92
    },
    {
      id: '2',
      nom: 'Agence Express',
      photo: '/images/point-relais-2.jpg',
      localisation: '42 Boulevard de la Liberté, Yaoundé',
      quartier: 'Centre',
      description: 'Agence spécialisée dans la livraison express de colis',
      type: 'Agence',
      contact: '+237 6 98 76 54 32',
      nomProprietaire: 'Dupont Marie',
      nombreColis: 98,
      pourcentageVente: 73,
      retourUtilisateurs: 4.2,
      gainsPourvus: 187025,
      tauxPopularite: 78
    }
  ]);


  const [selectedPointRelais, setSelectedPointRelais] = useState<PointRelais | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newPointRelais, setNewPointRelais] = useState<Partial<PointRelais>>({
    type: 'Commerce'
  });
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [updatedUtilisateur, setUpdatedUtilisateur] = useState<Utilisateur>(utilisateur);
  
  const userPhotoInputRef = useRef<HTMLInputElement>(null);
  const pointRelaisPhotoInputRef = useRef<HTMLInputElement>(null);
  
  // Fonction pour géolocaliser l'utilisateur
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          if (isCreateMode) {
            setNewPointRelais({
              ...newPointRelais,
              localisation: coords
            });
          } else if (selectedPointRelais) {
            setSelectedPointRelais({
              ...selectedPointRelais,
              localisation: coords
            });
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


  
  // Gestion des modaux
  const openModal = (pointRelais: PointRelais) => {
    setSelectedPointRelais(pointRelais);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedPointRelais(null);
    setIsCreateMode(true);
    setNewPointRelais({
      type: 'Commerce',
      nomProprietaire: `${utilisateur.nom} ${utilisateur.prenom}`
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPointRelais(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (isCreateMode) {
      setNewPointRelais({
        ...newPointRelais,
        [name]: value
      });
    } else if (selectedPointRelais) {
      setSelectedPointRelais({
        ...selectedPointRelais,
        [name]: value
      });
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUtilisateur({
      ...updatedUtilisateur,
      [name]: value
    });
  };

  // Gestion des photos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isUserPhoto: boolean = false) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const photoUrl = event.target.result.toString();
          
          if (isUserPhoto) {
            setUpdatedUtilisateur({ ...updatedUtilisateur, photo: photoUrl });
          } else if (isCreateMode) {
            setNewPointRelais({ ...newPointRelais, photo: photoUrl });
          } else if (selectedPointRelais) {
            setSelectedPointRelais({ ...selectedPointRelais, photo: photoUrl });
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Sauvegarder les modifications
  const handleSave = () => {
    if (selectedPointRelais) {
      setPointsRelais(pointsRelais.map(point => 
        point.id === selectedPointRelais.id ? selectedPointRelais : point
      ));
      closeModal();
    }
  };

  const handleCreate = () => {
    const newPoint: PointRelais = {
      id: Date.now().toString(),
      nom: newPointRelais.nom || '',
      photo: newPointRelais.photo || '/images/default-point-relais.jpg',
      localisation: newPointRelais.localisation || '',
      quartier: newPointRelais.quartier || '',
      description: newPointRelais.description || '',
      type: newPointRelais.type as 'Bureau' | 'Commerce' | 'Agence',
      contact: newPointRelais.contact || '',
      nomProprietaire: newPointRelais.nomProprietaire || `${utilisateur.nom} ${utilisateur.prenom}`,
      nombreColis: 0,
      pourcentageVente: 0,
      retourUtilisateurs: 0,
      gainsPourvus: 0,
      tauxPopularite: 0,
      recent: true
    };
    
    setPointsRelais([...pointsRelais, newPoint]);
    closeModal();
  };

  const handleDelete = (id: string) => {
    setPointsRelais(pointsRelais.filter(point => point.id !== id));
  };

  const saveProfileChanges = () => {
    setUtilisateur(updatedUtilisateur);
    setEditingProfile(false);
  };

  const cancelProfileEdit = () => {
    setUpdatedUtilisateur(utilisateur);
    setEditingProfile(false);
  };


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md">
      <Navbar />
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FiMapPin className="text-2xl mr-2" />
            <h1 className="text-xl font-bold">EasyRelais Dashboard</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-2">{utilisateur.prenom} {utilisateur.nom}</span>
            <div className="bg-green-700 rounded-full h-8 w-8 flex items-center justify-center overflow-hidden">
              {utilisateur.photo ? (
                <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: `url(${utilisateur.photo})` }} />
              ) : (
                <FiUser className="text-white" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 container mx-auto">
        {/* Sidebar - Profile Section */}
        <aside className="w-64 text-black bg-white shadow-md rounded-lg overflow-hidden">
            {/* En-tête avec photo */}
            <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 flex flex-col items-center relative">
                <h2 className="text-xl font-semibold text-white mb-4 text-center">Mon profil</h2>
                
                {!editingProfile ? (
                <div className="mb-2">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-white shadow-lg border-4 border-white">
                    {utilisateur.photo ? (
                        <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: `url(${utilisateur.photo})` }} />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-green-100">
                        <FiUser className="text-3xl text-green-700" />
                        </div>
                    )}
                    </div>
                    <p className="text-white font-medium text-center mt-2">
                    {utilisateur.prenom} {utilisateur.nom}
                    </p>
                </div>
                ) : (
                <div className="mb-2">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-white shadow-lg border-4 border-white relative">
                    {updatedUtilisateur.photo ? (
                        <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: `url(${updatedUtilisateur.photo})` }} />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-green-100">
                        <FiUser className="text-3xl text-green-700" />
                        </div>
                    )}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => userPhotoInputRef.current?.click()}
                    >
                        <FiCamera className="text-white text-2xl" />
                    </div>
                    </div>
                    <input 
                    type="file" 
                    ref={userPhotoInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, true)} 
                    />
                    <button 
                    className="text-sm text-white hover:text-green-100 flex items-center justify-center mt-2"
                    onClick={() => userPhotoInputRef.current?.click()}
                    >
                    <FiEdit className="mr-1" /> Modifier photo
                    </button>
                </div>
                )}
            </div>
            
            {/* Contenu du profil */}
            <div className="p-5">
                {!editingProfile ? (
                <>
                    <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-2">
                        <div className="flex items-center mb-1">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <FiMail className="text-green-600" />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500">Email</span>
                            <p className="font-medium text-sm">{utilisateur.email}</p>
                        </div>
                        </div>
                    </div>
                    
                    <div className="border-b border-gray-100 pb-2">
                        <div className="flex items-center mb-1">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <FiPhone className="text-green-600" />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500">Téléphone</span>
                            <p className="font-medium text-sm">{utilisateur.telephone}</p>
                        </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex items-center mb-1">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <FiHome className="text-green-600" />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500">Adresse</span>
                            <p className="font-medium text-sm">{utilisateur.adresse}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    <button 
                        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
                        onClick={() => setEditingProfile(true)}
                    >
                        <FiEdit2 className="mr-2" /> Modifier mon profil
                    </button>
                </>
                ) : (
                <>
                    <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">Prénom</label>
                        <input
                        type="text"
                        name="prenom"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                        value={updatedUtilisateur.prenom}
                        onChange={handleProfileInputChange}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">Nom</label>
                        <input
                        type="text"
                        name="nom"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                        value={updatedUtilisateur.nom}
                        onChange={handleProfileInputChange}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">Email</label>
                        <input
                        type="email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                        value={updatedUtilisateur.email}
                        onChange={handleProfileInputChange}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">Téléphone</label>
                        <input
                        type="tel"
                        name="telephone"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                        value={updatedUtilisateur.telephone}
                        onChange={handleProfileInputChange}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs text-gray-600 mb-1 font-medium">Adresse</label>
                        <input
                        type="text"
                        name="adresse"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                        value={updatedUtilisateur.adresse}
                        onChange={handleProfileInputChange}
                        />
                    </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-2">
                    <button 
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center justify-center transition-colors text-sm"
                        onClick={cancelProfileEdit}
                    >
                        <FiX className="mr-1" /> Annuler
                    </button>
                    <button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center justify-center transition-colors text-sm"
                        onClick={saveProfileChanges}
                    >
                        <FiSave className="mr-1" /> Enregistrer
                    </button>
                    </div>
                </>
                )}
            </div>
        </aside>

        {/* Points Relais Section */}
        <section className="flex-1 p-6 text-black">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-green-700">Mes Points Relais</h2>
            <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
            onClick={openCreateModal}
            >
            <FiPlus className="mr-2" /> Créer un Point Relais
            </button>
        </div>

        {pointsRelais.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
            <FiMapPin className="mx-auto text-4xl mb-2" />
            <p>Vous n'avez pas encore de points relais</p>
            </div>
        ) : (
            <div className="space-y-3">
            {pointsRelais.map(point => (
                <div key={point.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative p-3">
                {point.recent && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Nouveau
                    </span>
                )}
                <div className="flex items-center">
                    {/* Photo circulaire */}
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden relative mr-4 border-2 border-green-100">
                    {point.photo && point.photo.startsWith('data:') ? (
                        <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: `url(${point.photo})` }} />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <FiMapPin className="text-2xl" />
                        </div>
                    )}
                    </div>
                    
                    {/* Informations principales */}
                    <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-center mb-1">
                        <div className="flex items-center mr-2">
                        <h3 className="font-semibold text-base truncate">{point.nom}</h3>
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                            {point.type}
                        </span>
                        </div>
                        <span className="text-xs text-gray-500">{point.quartier}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-1">
                        <div className="flex items-center text-gray-600">
                        <FiMapPin className="mr-1 text-xs" />
                        <span className="text-xs truncate">{point.localisation}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                        <FiPhone className="mr-1 text-xs" />
                        <span className="text-xs">{point.contact}</span>
                        </div>
                    </div>
                    
                    {/* Stats en inline */}
                    <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center">
                        <FiPackage className="mr-1 text-green-600 text-xs" />
                        <span className="text-xs font-medium">{point.nombreColis} colis</span>
                        </div>
                        <div className="flex items-center">
                        <FiBarChart2 className="mr-1 text-green-600 text-xs" />
                        <span className="text-xs font-medium">{point.pourcentageVente}% ventes</span>
                        </div>
                        <div className="flex items-center">
                        <FiStar className="mr-1 text-yellow-500 text-xs" />
                        <span className="text-xs font-medium">{point.retourUtilisateurs.toFixed(1)}/5</span>
                        </div>
                        <div className="flex items-center">
                        <FiDollarSign className="mr-1 text-green-600 text-xs" />
                        <span className="text-xs font-medium">{point.gainsPourvus.toLocaleString()} FCFA</span>
                        </div>
                    </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-shrink-0 ml-4 space-x-2">
                    <button 
                        className="text-green-600 hover:text-green-800 p-1.5 rounded-full hover:bg-green-50"
                        onClick={() => openModal(point)}
                    >
                        <FiEdit2 className="text-lg" />
                    </button>
                    <button 
                        className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50"
                        onClick={() => handleDelete(point.id)}
                    >
                        <FiTrash2 className="text-lg" />
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4">
                {isCreateMode ? "Créer un nouveau Point Relais" : "Modifier le Point Relais"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={isCreateMode ? newPointRelais.nom || '' : selectedPointRelais?.nom || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg relative overflow-hidden">
                      {(isCreateMode ? newPointRelais.photo : selectedPointRelais?.photo) ? (
                        <div 
                          className="h-full w-full bg-center bg-cover" 
                          style={{ 
                            backgroundImage: `url(${isCreateMode ? newPointRelais.photo : selectedPointRelais?.photo})` 
                          }} 
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          <FiMapPin className="text-2xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => pointRelaisPhotoInputRef.current?.click()}
                    >
                      <FiUpload className="inline-block mr-2" />
                      Charger une photo
                    </button>
                    <input
                      type="file"
                      ref={pointRelaisPhotoInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="localisation"
                      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-green-500 focus:border-green-500"
                      value={isCreateMode ? newPointRelais.localisation || '' : selectedPointRelais?.localisation || ''}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 transition-colors"
                      onClick={getUserLocation}
                    >
                      <FiMapPin />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Cliquez sur l'icône pour utiliser votre position actuelle</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                  <input
                    type="text"
                    name="quartier"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={isCreateMode ? newPointRelais.quartier || '' : selectedPointRelais?.quartier || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={isCreateMode ? newPointRelais.description || '' : selectedPointRelais?.description || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={isCreateMode ? newPointRelais.type || 'Commerce' : selectedPointRelais?.type || 'Commerce'}
                    onChange={handleInputChange}
                  >
                    <option value="Bureau">Bureau</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Agence">Agence</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={isCreateMode ? newPointRelais.contact || '' : selectedPointRelais?.contact || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom Propriétaire</label>
                  <input
                    type="text"
                    name="nomProprietaire"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    value={isCreateMode ? newPointRelais.nomProprietaire || '' : selectedPointRelais?.nomProprietaire || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                {!isCreateMode && (
                <div className="md:col-span-2 pt-4 border-t mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Statistiques</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nombre de colis</label>
                      <input
                        type="number"
                        name="nombreColis"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={selectedPointRelais?.nombreColis || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Pourcentage de vente (%)</label>
                      <input
                        type="number"
                        name="pourcentageVente"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        min="0"
                        max="100"
                        value={selectedPointRelais?.pourcentageVente || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Retour utilisateurs (sur 5)</label>
                      <input
                        type="number"
                        name="retourUtilisateurs"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        min="0"
                        max="5"
                        step="0.1"
                        value={selectedPointRelais?.retourUtilisateurs || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Gains pourvus (FCFA)</label>
                      <input
                        type="number"
                        name="gainsPourvus"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        value={selectedPointRelais?.gainsPourvus || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Taux de popularité (%)</label>
                      <input
                        type="number"
                        name="tauxPopularite"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        min="0"
                        max="100"
                        value={selectedPointRelais?.tauxPopularite || 0}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700"
                  onClick={closeModal}
                >
                  Annuler
                </button>
                {isCreateMode ? (
                  <button 
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    onClick={handleCreate}
                  >
                    <FiPlus className="inline-block mr-2" />
                    Créer
                  </button>
                ) : (
                  <button 
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    onClick={handleSave}
                  >
                    <FiSave className="inline-block mr-2" />
                    Enregistrer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;