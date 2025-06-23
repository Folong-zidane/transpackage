'use client';
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  Bell, 
  Scan, 
  User,
  CheckCircle,
  AlertCircle,
  Navigation,
  Power,
  Settings
} from 'lucide-react';

const DeliveryDashboard = () => {
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simuler la mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Données simulées
  const dashboardData = {
    collectes: 3,
    livraisons: 7,
    prochaineTache: {
      type: 'Collecte',
      adresse: '15 Rue de la Paix, Yaoundé',
      heure: '14:30',
      client: 'Boutique Élégance'
    },
    notifications: [
      { id: 1, type: 'nouvelle', message: 'Nouvelle livraison assignée - Quartier Bastos', time: '13:45' },
      { id: 2, type: 'modification', message: 'Horaire modifié pour collecte Mfoundi', time: '13:20' },
      { id: 3, type: 'info', message: 'Point relais Central fermé temporairement', time: '12:30' }
    ]
  };

  const StatusCard = ({ title, count, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{count}</p>
        </div>
        <div className={`${color} bg-opacity-20 p-3 rounded-full`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  const NotificationItem = ({ notification }) => {
    const getNotificationStyle = (type) => {
      switch (type) {
        case 'nouvelle':
          return 'border-l-green-500 bg-green-50';
        case 'modification':
          return 'border-l-yellow-500 bg-yellow-50';
        default:
          return 'border-l-blue-500 bg-blue-50';
      }
    };

    return (
      <div className={`p-4 border-l-4 rounded-r-lg ${getNotificationStyle(notification.type)} transform hover:translate-x-2 transition-all duration-200`}>
        <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-t-4 border-green-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Truck className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pick & Drop Deliver</h1>
              <p className="text-gray-600">Bonjour, Jean-Pierre</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Aujourd'hui</p>
              <p className="text-lg font-semibold text-gray-800">
                {currentTime.toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm text-green-600 font-medium">
                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Statut du Livreur */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isOnDuty ? 'bg-green-100' : 'bg-red-100'}`}>
              <Power className={`w-6 h-6 ${isOnDuty ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Statut de Service</h3>
              <p className={`text-sm font-medium ${isOnDuty ? 'text-green-600' : 'text-red-600'}`}>
                {isOnDuty ? 'En Service' : 'Hors Service'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              isOnDuty ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                isOnDuty ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Aperçu Rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatusCard
          title="Collectes en Attente"
          count={dashboardData.collectes}
          icon={Package}
          color="text-green-600"
          bgColor="bg-white"
        />
        <StatusCard
          title="Livraisons en Attente"
          count={dashboardData.livraisons}
          icon={Truck}
          color="text-emerald-600"
          bgColor="bg-white"
        />
      </div>

      {/* Prochaine Tâche */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Navigation className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Prochaine Tâche</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                  {dashboardData.prochaineTache.type}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{dashboardData.prochaineTache.adresse}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Heure indicative: {dashboardData.prochaineTache.heure}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{dashboardData.prochaineTache.client}</span>
              </div>
            </div>
          </div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-xl transition-all duration-200 hover:scale-105">
            <Navigation className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-200 transition-colors">
              <Scan className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-gray-800">Scanner un Colis</h4>
              <p className="text-sm text-gray-600">Enregistrement rapide</p>
            </div>
          </div>
        </button>
        
        <button className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-100 p-4 rounded-full group-hover:bg-emerald-200 transition-colors">
              <MapPin className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-gray-800">Voir Itinéraire</h4>
              <p className="text-sm text-gray-600">Planifier le trajet</p>
            </div>
          </div>
        </button>
      </div>

      {/* Notifications Récentes */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Notifications Récentes</h3>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            {dashboardData.notifications.length}
          </span>
        </div>
        <div className="space-y-3">
          {dashboardData.notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1 text-green-600">
            <div className="p-2 bg-green-100 rounded-full">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Accueil</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <div className="p-2 rounded-full">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs">Tâches</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <div className="p-2 rounded-full">
              <Scan className="w-5 h-5" />
            </div>
            <span className="text-xs">Scanner</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <div className="p-2 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;