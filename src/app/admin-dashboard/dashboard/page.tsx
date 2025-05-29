'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FiHome, FiTruck, FiUsers, FiPieChart, FiBarChart2, FiPackage,
  FiTrendingUp, FiCalendar, FiMap, FiShield, FiGlobe, FiCheckCircle, FiAlertCircle, FiPhone
} from 'react-icons/fi';
import { LineChart, BarChart, PieChart, RadialBarChart, Area, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Pie, RadialBar } from 'recharts';
import { relayPointsData } from '../data/relaypoints';
import { performanceData } from '../data/performancedata';
import { franchiseData } from '../data/franchisedata';
import SuperAdminHeader from './Header';

// Types pour le typage TypeScript
interface AdminDashboardProps {}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  active: boolean;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  // États pour gérer l'affichage
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  // Données pour les top performances sur 4 mois
  const topPerformanceData = [
    { name: 'Point Relais Central', region: 'Yaoundé', jan: 95, feb: 97, mar: 96, apr: 98, average: 96.5 },
    { name: 'Express Delivery Center', region: 'Douala', jan: 94, feb: 93, mar: 95, apr: 96, average: 94.5 },
    { name: 'Logistics Hub', region: 'Bafoussam', jan: 92, feb: 94, mar: 93, apr: 93, average: 93.0 },
    { name: 'Quick Ship Post', region: 'Douala', jan: 91, feb: 90, mar: 92, apr: 94, average: 91.8 },
    { name: 'Relay Express', region: 'Yaoundé', jan: 90, feb: 91, mar: 89, apr: 93, average: 90.8 }
  ];

  const handleBackToHome = () => {
  // Vous pouvez utiliser Next.js router ou votre système de navigation
  // Exemple avec Next.js:
  // import { useRouter } from 'next/router';
  // const router = useRouter();
  // router.push('/');
  
  // Ou simplement:
  window.location.href = '/';
};

  // Données pour la distribution par région sur 4 mois
  const regionalDistributionData = [
    { month: 'Janvier', Yaounde: 95, Douala: 82, Bafoussam: 43, Autres: 17 },
    { month: 'Février', Yaounde: 98, Douala: 85, Bafoussam: 45, Autres: 19 },
    { month: 'Mars', Yaounde: 99, Douala: 89, Bafoussam: 48, Autres: 22 },
    { month: 'Avril', Yaounde: 102, Douala: 92, Bafoussam: 50, Autres: 24 }
  ];

  // Données simulées pour les utilisateurs
  const usersData = [
    { name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'Administrateur', lastActive: '2023-04-01', status: 'Active' },
    { name: 'Marie Mbarga', email: 'marie.mbarga@example.com', role: 'Gestionnaire', lastActive: '2023-04-01', status: 'Active' },
    { name: 'Pierre Nkomo', email: 'pierre.nkomo@example.com', role: 'Opérateur', lastActive: '2023-03-28', status: 'Active' },
    { name: 'Sophie Ayissi', email: 'sophie.ayissi@example.com', role: 'Support', lastActive: '2023-03-30', status: 'Inactive' },
    { name: 'Paul Biya', email: 'paul.biya@example.com', role: 'Opérateur', lastActive: '2023-03-25', status: 'Active' }
  ];

  // Fonction pour formater les nombres
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Simuler le chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Menu latéral (avec paramètres supprimé)
  const menuItems: MenuItem[] = [
    { name: 'Vue d\'ensemble', icon: <FiHome size={20} />, active: activeTab === 'overview' },
    { name: 'Points Relais', icon: <FiMap size={20} />, active: activeTab === 'relaypoints' },
    { name: 'Performances', icon: <FiPieChart size={20} />, active: activeTab === 'performance' },
    { name: 'Franchises', icon: <FiUsers size={20} />, active: activeTab === 'franchises' },
    { name: 'Utilisateurs', icon: <FiUsers size={20} />, active: activeTab === 'users' },
  ];

  // Composant pour les cartes de statistiques
  const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, positive, icon }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6 flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <div className={`flex items-center text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? <FiTrendingUp className="mr-1" /> : <FiTrendingUp className="mr-1 transform rotate-180" />}
            <span>{change}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Rendu conditionnel basé sur l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'relaypoints':
        return renderRelayPointsContent();
      case 'performance':
        return renderPerformanceContent();
      case 'franchises':
        return renderFranchisesContent();
      case 'users':
        return renderUsersContent();
      default:
        return renderOverviewContent();
    }
  };

  // Contenu de l'onglet Vue d'ensemble
  const renderOverviewContent = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Points Relais Actifs" 
          value="237" 
          change="+12% depuis le mois dernier" 
          positive={true}
          icon={<FiMap size={20} />}
        />
        <StatsCard 
          title="Colis Livrés" 
          value={formatNumber(18432)} 
          change="+8.3% depuis le mois dernier" 
          positive={true}
          icon={<FiPackage size={20} />}
        />
        <StatsCard 
          title="Performance Moyenne" 
          value="89%" 
          change="+2.5% depuis le mois dernier" 
          positive={true}
          icon={<FiBarChart2 size={20} />}
        />
        <StatsCard 
          title="Franchises Actives" 
          value="42" 
          change="-1 depuis le mois dernier" 
          positive={false}
          icon={<FiUsers size={20} />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Delivery Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Performance des Livraisons</h3>
            <div className="text-sm text-gray-500">
              Derniers 4 mois
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData.deliveryPerformance}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9e9e9e" fontSize={12} tickMargin={10} />
                <YAxis stroke="#9e9e9e" fontSize={12} tickMargin={10} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="onTime" 
                  name="À temps" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="delayed" 
                  name="En retard" 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Distribution by Region */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Distribution par Région</h3>
            <div className="text-sm text-gray-500">
              Nombre de points relais
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={relayPointsData.byRegion}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {relayPointsData.byRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} points relais`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Relay Points Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Points Relais Récents</h3>
          <p className="text-sm text-gray-500">Liste des 5 derniers points relais ajoutés</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {relayPointsData.recent.map((point, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <FiHome className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{point.name}</div>
                        <div className="text-sm text-gray-500">{point.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{point.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{point.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${point.performance}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-900">{point.performance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      point.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {point.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiPhone className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-900">{point.contact || "+237 6xx xxx xxx"}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 border-t border-gray-200">
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            Voir tous les points relais
          </button>
        </div>
      </motion.div>
    </>
  );

  // Contenu de l'onglet Points Relais
  const renderRelayPointsContent = () => (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Points Relais</h1>
        <p className="text-gray-600">Visualisation et gestion de tous les points relais</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white">
            <option value="all">Toutes les régions</option>
            <option value="yaounde">Yaoundé</option>
            <option value="douala">Douala</option>
            <option value="bafoussam">Bafoussam</option>
          </select>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          Ajouter un point relais
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...relayPointsData.recent, ...relayPointsData.recent].map((point, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <FiHome className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{point.name}</div>
                        <div className="text-sm text-gray-500">{point.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{point.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{point.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${point.performance}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-900">{point.performance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      point.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {point.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiPhone className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-900">{point.contact || "+237 6xx xxx xxx"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">Affichage de <span className="font-medium">1</span> à <span className="font-medium">10</span> sur <span className="font-medium">237</span> résultats</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">Précédent</button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-green-600 text-white">1</button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">2</button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">3</button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">Suivant</button>
          </div>
        </div>
      </motion.div>
    </>
  );

// Contenu de l'onglet Performances
const renderPerformanceContent = () => (
  <>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Performances</h1>
      <p className="text-gray-600">Indicateurs de performance de livraison et distribution régionale</p>
    </div>

    {/* Top 5 performances sur 4 mois */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Top 5 Performances de Livraison</h3>
        <p className="text-sm text-gray-500">Meilleures performances sur les 4 derniers mois</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Point Relais
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Région
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Janvier
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Février
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mars
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avril
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance Moyenne
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topPerformanceData.map((point, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{point.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{point.region}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-900 font-medium">{point.jan}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-900 font-medium">{point.feb}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-900 font-medium">{point.mar}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-900 font-medium">{point.apr}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${point.average}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-900 font-bold">{point.average}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>

    {/* Distribution par région sur 4 mois */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-md p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Distribution par Région sur 4 Mois</h3>
        <div className="text-sm text-gray-500">
          Évolution du nombre de points relais par région
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={regionalDistributionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Yaounde" fill="#8884d8" name="Yaoundé" />
            <Bar dataKey="Douala" fill="#82ca9d" name="Douala" />
            <Bar dataKey="Bafoussam" fill="#ffc658" name="Bafoussam" />
            <Bar dataKey="Autres" fill="#ff8042" name="Autres régions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  </>
);

  // Contenu de l'onglet Franchises
  const renderFranchisesContent = () => (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Gestion des Franchises</h1>
        <p className="text-gray-600">Visualisation et gestion de toutes les franchises</p>
      </div>

      <div className="flex justify-between items-center mb-5">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Toutes les régions
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Yaoundé
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Douala
          </button>
        </div>
        
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
          Ajouter une franchise
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Région
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propriétaire
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points Relais
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {franchiseData.map((franchise, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiGlobe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{franchise.name}</div>
                        <div className="text-sm text-gray-500">{franchise.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {franchise.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {franchise.owner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {franchise.relayPoints}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      franchise.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {franchise.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 space-x-2">
                    <button className="hover:text-blue-700">Modifier</button>
                    <button className="hover:text-red-700">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Affichage de 1 à 10 sur 24 résultats
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Précédent
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-blue-600 bg-blue-50">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Contenu de l'onglet Utilisateurs
  const renderUsersContent = () => (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Gestion des Utilisateurs</h1>
        <p className="text-gray-600">Visualisation et gestion de tous les utilisateurs</p>
      </div>

      <div className="flex justify-between items-center mb-5">
        <div className="relative w-64">
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Rechercher un utilisateur..." 
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
          Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière Activité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-700 font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 space-x-2">
                    <button className="hover:text-blue-700">Modifier</button>
                    <button className="hover:text-red-700">Désactiver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Affichage de 1 à 5 sur 24 résultats
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Précédent
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-blue-600 bg-blue-50">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className='sticky z-50 w-full top-0' >
        <SuperAdminHeader onBackToHome={handleBackToHome} />
      </div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden top-32 z-50 md:flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800">Tableau de Bord</h2>
            <p className="text-sm text-gray-600 mt-1">Administration</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-2">
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index} className="mb-2">
                    <button
                      onClick={() => setActiveTab(Object.keys({overview: '', relaypoints: '', performance: '', franchises: '', users: ''})[index])}
                      className={`flex items-center w-full px-4 py-2 text-left rounded-md ${
                        item.active 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;