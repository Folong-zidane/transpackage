'use client';
import React, { useState, useRef } from 'react';
import { 
  FiEdit2, FiUser, FiMail, FiPhone, FiHome, FiEdit, FiCamera, FiX, FiSave,
  FiShield, FiStar, FiSettings, FiEye, FiLock, FiBell, FiGlobe,
  FiCalendar, FiMapPin, FiCheck, FiAlertCircle, FiActivity
} from 'react-icons/fi';

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  photo?: string;
}

interface ProfilProps {
  utilisateur: Utilisateur;
  onUpdateUtilisateur: (utilisateur: Utilisateur) => void;
}

const Profil: React.FC<ProfilProps> = ({ utilisateur, onUpdateUtilisateur }) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [updatedUtilisateur, setUpdatedUtilisateur] = useState<Utilisateur>(utilisateur);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });
  const userPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUtilisateur({
      ...updatedUtilisateur,
      [name]: value
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const photoUrl = event.target.result.toString();
          setUpdatedUtilisateur({ ...updatedUtilisateur, photo: photoUrl });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = () => {
    onUpdateUtilisateur(updatedUtilisateur);
    setEditingProfile(false);
  };

  const cancelProfileEdit = () => {
    setUpdatedUtilisateur(utilisateur);
    setEditingProfile(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: FiUser },
    { id: 'security', label: 'Sécurité', icon: FiShield },
    { id: 'preferences', label: 'Préférences', icon: FiSettings }
  ];

  const statsCards = [
    { label: 'Colis envoyés', value: '47', icon: FiActivity, color: 'blue' },
    { label: 'Points fidélité', value: '1,234', icon: FiStar, color: 'yellow' },
    { label: 'Compte vérifié', value: 'Oui', icon: FiShield, color: 'green' }
  ];

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header avec informations principales */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50 to-teal-50 p-8 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Photo de profil */}
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-white shadow-2xl border-4 border-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                  {utilisateur.photo ? (
                    <img 
                      src={utilisateur.photo} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                      <FiUser className="text-5xl text-emerald-600" />
                    </div>
                  )}
                </div>
                {editingProfile && (
                  <>
                    <div 
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer rounded-full"
                      onClick={() => userPhotoInputRef.current?.click()}
                    >
                      <FiCamera className="text-white text-2xl" />
                    </div>
                    <input 
                      type="file" 
                      ref={userPhotoInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePhotoUpload} 
                    />
                  </>
                )}
              </div>

              {/* Informations utilisateur */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {utilisateur.prenom} {utilisateur.nom}
                  </h1>
                  <p className="text-teal-800 text-lg">Propriétaire de points relais</p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                  <div className="bg-white/20 backdrop-blur-sm text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <FiShield className="mr-2" />
                    Compte vérifié
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <FiStar className="mr-2" />
                    Compte Premium
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <FiCalendar className="mr-2" />
                    Depuis 2023
                  </div>
                </div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-3 gap-4">
                  {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                      <stat.icon className="text-2xl text-teal-800 mx-auto mb-2" />
                      <div className="text-xl font-bold text-teal-800">{stat.value}</div>
                      <div className="text-teal-800 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton d'édition */}
              {!editingProfile && (
                <button 
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-600 px-6 py-3 rounded-xl flex items-center transition-all duration-300 transform hover:scale-105 font-medium"
                  onClick={() => setEditingProfile(true)}
                >
                  <FiEdit2 className="mr-2" /> Modifier
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-gray-50 to-teal-100 text-gray-800 shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
                {editingProfile && (
                  <div className="flex space-x-3">
                    <button 
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl flex items-center transition-all duration-300 font-medium"
                      onClick={cancelProfileEdit}
                    >
                      <FiX className="mr-2" /> Annuler
                    </button>
                    <button 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2 rounded-xl flex items-center transition-all duration-300 shadow-lg font-medium"
                      onClick={saveProfileChanges}
                    >
                      <FiSave className="mr-2" /> Enregistrer
                    </button>
                  </div>
                )}
              </div>

              {!editingProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: FiUser, label: 'Prénom', value: utilisateur.prenom, color: 'blue' },
                    { icon: FiUser, label: 'Nom', value: utilisateur.nom, color: 'blue' },
                    { icon: FiMail, label: 'Email', value: utilisateur.email, color: 'green' },
                    { icon: FiPhone, label: 'Téléphone', value: utilisateur.telephone, color: 'purple' },
                    { icon: FiMapPin, label: 'Adresse', value: utilisateur.adresse, color: 'orange', fullWidth: true }
                  ].map((item, index) => (
                    <div 
                      key={item.label}
                      className={`group p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                        item.fullWidth ? 'md:col-span-2' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`h-12 w-12 rounded-xl bg-${item.color}-100 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                          <item.icon className={`text-${item.color}-600 text-xl`} />
                        </div>
                        <div className="ml-4 flex-1">
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{item.label}</span>
                          <p className="font-semibold text-gray-800 mt-1 text-lg group-hover:text-gray-900 transition-colors">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'prenom', label: 'Prénom', value: updatedUtilisateur.prenom, type: 'text' },
                    { name: 'nom', label: 'Nom', value: updatedUtilisateur.nom, type: 'text' },
                    { name: 'email', label: 'Email', value: updatedUtilisateur.email, type: 'email' },
                    { name: 'telephone', label: 'Téléphone', value: updatedUtilisateur.telephone, type: 'tel' }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                        value={field.value}
                        onChange={handleProfileInputChange}
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                      value={updatedUtilisateur.adresse}
                      onChange={handleProfileInputChange}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Sécurité du compte</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <FiShield className="text-green-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900">Authentification</h3>
                        <p className="text-green-600 text-sm">Compte sécurisé</p>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
                      Changer le mot de passe
                    </button>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FiLock className="text-blue-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900">Double authentification</h3>
                        <p className="text-blue-600 text-sm">Activée</p>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                      Gérer 2FA
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-900 mb-4">Activité récente</h3>
                    <div className="space-y-3">
                      {[
                        { action: 'Connexion', time: 'Il y a 2 heures', device: 'Chrome, Windows' },
                        { action: 'Modification profil', time: 'Hier', device: 'Mobile App' },
                        { action: 'Connexion', time: 'Il y a 3 jours', device: 'Safari, macOS' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.device}</p>
                          </div>
                          <span className="text-sm text-gray-400">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Préférences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <FiBell className="mr-2" />
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'Notifications par email', description: 'Recevoir les mises à jour par email' },
                        { key: 'sms', label: 'Notifications SMS', description: 'Recevoir les alertes importantes par SMS' },
                        { key: 'push', label: 'Notifications push', description: 'Recevoir les notifications sur l\'appareil' }
                      ].map((notif) => (
                        <div key={notif.key} className="flex items-center justify-between p-4 bg-white rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900">{notif.label}</p>
                            <p className="text-sm text-gray-500">{notif.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notifications[notif.key as keyof typeof notifications]}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                [notif.key]: e.target.checked
                              })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <FiGlobe className="mr-2" />
                      Langue et région
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                        <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>Français</option>
                          <option>English</option>
                          <option>Español</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
                        <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>UTC+1 (Paris)</option>
                          <option>UTC+0 (Londres)</option>
                          <option>UTC-5 (New York)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <FiAlertCircle className="mr-2 text-red-600" />
                      Zone de danger
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Actions irréversibles sur votre compte
                    </p>
                    <button className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors font-medium">
                      Supprimer le compte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profil;