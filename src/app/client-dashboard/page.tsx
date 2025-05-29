'use client';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/home/Navbar';
import React, { useState } from 'react';
import {
  FiUser, 
  FiMapPin, 
  FiPackage, 
  FiHome,
  FiSettings,
  FiMenu,
  FiX,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiStar,
  FiShield,
  FiZap
} from 'react-icons/fi';
import Profil from './Profil';
import Grelais from './grelais';
import Colis from './VueColis';

// Types
interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  photo?: string;
}

type PageActive = 'accueil' | 'colis' | 'grelais' | 'profil';

const Dashboard: React.FC = () => {
  const [utilisateur, setUtilisateur] = useState<Utilisateur>({
    id: '1',
    nom: 'NGUETCHO',
    prenom: 'Gabrielle Chloé',
    email: 'marie.dupont@example.com',
    telephone: '+237 6 12 34 56 78',
    adresse: '123 Rue de Yaoundé, Douala',
    photo: '/images/default-user.jpg'
  });
  
  const [pageActive, setPageActive] = useState<PageActive>('accueil');
  const [sidebarOuverte, setSidebarOuverte] = useState(false);

  const handleUpdateUtilisateur = (utilisateurMisAJour: Utilisateur) => {
    setUtilisateur(utilisateurMisAJour);
  };

  const menuItems = [
    { id: 'accueil', label: 'Accueil', icon: FiHome },
    { id: 'colis', label: 'Mes Colis', icon: FiPackage },
    { id: 'grelais', label: 'Points Relais', icon: FiMapPin },
    { id: 'profil', label: 'Mon Profil', icon: FiUser }
  ];

  const statsData = [
    { 
      label: 'Colis actifs', 
      value: '12', 
      icon: FiPackage, 
      color: 'blue',
      trend: '+2 cette semaine' 
    },
    { 
      label: 'Livraisons', 
      value: '47', 
      icon: FiCheckCircle, 
      color: 'green',
      trend: '+15% ce mois' 
    },
    { 
      label: 'Points relais', 
      value: '8', 
      icon: FiMapPin, 
      color: 'purple',
      trend: 'Disponibles' 
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'livraison',
      title: 'Colis livré avec succès',
      description: 'Votre colis #COL-2024-001 a été livré',
      time: 'Il y a 2 heures',
      status: 'success'
    },
    {
      id: 2,
      type: 'transit',
      title: 'Colis en transit',
      description: 'Votre colis #COL-2024-002 est en cours de livraison',
      time: 'Il y a 4 heures',
      status: 'pending'
    },
    {
      id: 3,
      type: 'nouveau',
      title: 'Nouveau colis enregistré',
      description: 'Colis #COL-2024-003 ajouté à votre compte',
      time: 'Hier',
      status: 'info'
    }
  ];

  const renderContenu = () => {
    switch (pageActive) {
      case 'colis':
        return <Colis utilisateur={utilisateur} />;
      case 'grelais':
        return <Grelais utilisateur={utilisateur} />;
      case 'profil':
        return (
          <Profil 
            utilisateur={utilisateur}
            onUpdateUtilisateur={handleUpdateUtilisateur}
          />
        );
      case 'accueil':
      default:
        return (
          <div className="flex-1 p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header d'accueil */}
              <div className="fixed bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-700 to-teal-800 p-4 rounded-2xl mr-6 shadow-lg">
                      <FiHome className="text-2xl text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Bienvenue, {utilisateur.prenom} !
                      </h1>
                      <p className="text-gray-600 mt-2 text-lg">
                        Gérez vos colis et points relais en toute simplicité
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <FiShield className="mr-2" />
                      Compte vérifié
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <FiStar className="mr-2" />
                      Membre Premium
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsData.map((stat, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                        <stat.icon className={`text-xl text-${stat.color}-600`} />
                      </div>
                      <FiTrendingUp className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                      <p className={`text-xs text-${stat.color}-600 font-medium`}>{stat.trend}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cartes de navigation rapide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setPageActive('colis')}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/5 group-hover:from-blue-600/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                        <FiPackage className="text-xl text-blue-600" />
                      </div>
                      <FiArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Mes Colis</h3>
                    <p className="text-gray-600 text-sm">Suivez vos expéditions en temps réel</p>
                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                      <FiZap className="mr-1" />
                      12 colis actifs
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setPageActive('grelais')}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/5 group-hover:from-purple-600/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                        <FiMapPin className="text-xl text-purple-600" />
                      </div>
                      <FiArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Points Relais</h3>
                    <p className="text-gray-600 text-sm">Trouvez le point relais le plus proche</p>
                    <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                      <FiMapPin className="mr-1" />
                      8 points disponibles
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setPageActive('profil')}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-green-600/5 group-hover:from-green-600/5 group-hover:to-green-600/10 transition-all duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                        <FiUser className="text-xl text-green-600" />
                      </div>
                      <FiArrowRight className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Mon Profil</h3>
                    <p className="text-gray-600 text-sm">Gérez vos informations personnelles</p>
                    <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                      <FiShield className="mr-1" />
                      Profil vérifié
                    </div>
                  </div>
                </div>
              </div>

              {/* Activités récentes */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FiClock className="mr-3 text-gray-600" />
                    Activités récentes
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center transition-colors">
                    Voir tout
                    <FiArrowRight className="ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center p-4 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
                      <div className={`p-2 rounded-lg mr-4 ${
                        activity.status === 'success' ? 'bg-green-100 text-green-600' :
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.status === 'success' ? <FiCheckCircle /> :
                         activity.status === 'pending' ? <FiClock /> :
                         <FiAlertCircle />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                      </div>
                      <span className="text-gray-400 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed sticky inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-sm shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOuverte ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold bg-teal-800 bg-clip-text text-transparent">
              Mon espace de Travail
            </h2>
            <button
              onClick={() => setSidebarOuverte(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiX className="text-gray-600" />
            </button>
          </div>
          
          <nav className="mt-6 px-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPageActive(item.id as PageActive);
                  setSidebarOuverte(false);
                }}
                className={`w-full flex items-center px-4 py-3 mb-2 rounded-xl text-left transition-all duration-200 ${
                  pageActive === item.id 
                    ? 'bg-teal-700 text-white shadow-lg transform scale-105' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 text-lg" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Profile section in sidebar */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {utilisateur.prenom.charAt(0)}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {utilisateur.prenom} {utilisateur.nom}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{utilisateur.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay pour mobile */}
        {sidebarOuverte && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOuverte(false)}
          />
        )}

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Header mobile */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-100 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOuverte(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiMenu className="text-gray-600" />
            </button>
            <h1 className="font-semibold text-gray-900 capitalize">{pageActive}</h1>
            <div className="w-8"></div>
          </div>

          {renderContenu()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;