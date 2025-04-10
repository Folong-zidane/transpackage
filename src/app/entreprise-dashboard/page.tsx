'use client';
import React, { useState, useEffect } from 'react';
import { FiHome, FiTruck, FiUsers, FiPieChart, FiBarChart2, FiPackage, FiTrendingUp, FiCalendar, FiMap, FiShield, FiGlobe, FiCheckCircle, FiAlertCircle, FiPhone } from 'react-icons/fi';
import { LineChart, BarChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Pie, Cell, Bar } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PointRelais } from '../point-de-relais/RelaisData';
import Navbar from '@/components/home/Navbar';

// Interface pour les points relais (depuis votre fichier RelaisData)
interface PointRelais {
  id: number;
  name: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
  isNearby?: boolean;
  quartier: string;
  type: 'bureau' | 'commerce' | 'agence';
  services: string[];
}

const ClientDashboard = () => {
  // États pour gérer l'affichage
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [pointRelaisData, setPointRelaisData] = useState<PointRelais[]>([]);

  // Exemple de données d'utilisation API
  const apiUsageData = [
    { date: 'Jan', requests: 3240, success: 3210, errors: 30 },
    { date: 'Feb', requests: 4120, success: 4080, errors: 40 },
    { date: 'Mar', requests: 5680, success: 5630, errors: 50 },
    { date: 'Apr', requests: 6450, success: 6390, errors: 60 }
  ];

  // Distribution des points relais
  const pointRelaisDistribution = {
    byType: [
      { name: 'Bureau', value: 125, color: '#4f46e5' },
      { name: 'Commerce', value: 247, color: '#10b981' },
      { name: 'Agence', value: 96, color: '#f59e0b' }
    ],
    byService: [
      { name: 'Colis standard', value: 468, color: '#3b82f6' },
      { name: 'Colis volumineux', value: 342, color: '#8b5cf6' },
      { name: 'Express', value: 289, color: '#ec4899' },
      { name: 'Retour', value: 398, color: '#f97316' }
    ]
  };

  // Données performances
  const performanceData = [
    { date: 'Jul 2024', taux: 92.8 },
    { date: 'Aou 2024', taux: 99.0 },
    { date: 'Sep 2024', taux: 83.2 },
    { date: 'Oct 2024', taux: 93.0 },
    { date: 'Nov 2024', taux: 96.4 },
    { date: 'Dec 2024', taux: 96.6 },
    { date: 'Jan 2025', taux: 96.8 },
    { date: 'Fev 2025', taux: 98.5 },
    { date: 'Mar 2025', taux: 99.3 }
  ];

  // Erreurs API par type
  const apiErrorsData = [
    { name: 'Authentication', value: 28, color: '#ef4444' },
    { name: 'Rate limiting', value: 22, color: '#f59e0b' },
    { name: 'Invalid parameters', value: 18, color: '#3b82f6' },
    { name: 'Server errors', value: 12, color: '#8b5cf6' },
    { name: 'Network', value: 8, color: '#10b981' }
  ];

  // Points relais récents
  const recentPointRelais = [
    { id: 1, name: "Relay Express", address: "15 rue de Commerce, 75015", hours: "9h-19h", quartier: "Commerce", type: "commerce", services: ["Colis standard", "Retour"], usage: 245 },
    { id: 2, name: "PostPoint Central", address: "8 avenue Montaigne, 75008", hours: "8h-20h", quartier: "Champs-Élysées", type: "bureau", services: ["Colis standard", "Express", "Retour"], usage: 312 },
    { id: 3, name: "ShipBox Premium", address: "22 rue de Rivoli, 75004", hours: "10h-18h", quartier: "Marais", type: "agence", services: ["Colis standard", "Colis volumineux", "Express"], usage: 189 },
    { id: 4, name: "QuickDrop Store", address: "5 boulevard Haussmann, 75009", hours: "9h-19h30", quartier: "Opéra", type: "commerce", services: ["Colis standard", "Retour"], usage: 276 },
    { id: 5, name: "EasyPoint Relay", address: "18 rue Oberkampf, 75011", hours: "8h30-19h", quartier: "Oberkampf", type: "bureau", services: ["Colis volumineux", "Express"], usage: 203 }
  ];

  // Simuler le chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setPointRelaisData(pointRelaisData);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Menu latéral
  const menuItems = [
    { name: 'Vue d\'ensemble', icon: <FiHome size={20} />, id: 'overview' },
    { name: 'Points Relais', icon: <FiMap size={20} />, id: 'relaypoints' },
    { name: 'Utilisation API', icon: <FiBarChart2 size={20} />, id: 'api' },
    { name: 'Performance', icon: <FiPieChart size={20} />, id: 'performance' },
    { name: 'Facturation', icon: <FiUsers size={20} />, id: 'billing' },
  ];

  // Composant pour les cartes de statistiques
  const StatsCard = ({ title, value, change, positive, icon }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl text-gray-900 font-bold">{value}</p>
          <div className={`flex items-center text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? <FiTrendingUp className="mr-1" /> : <FiTrendingUp className="mr-1 transform rotate-180" />}
            <span>{change}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Si chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Chargement du tableau de bord...</h2>
          <p className="text-gray-500 mt-2">Préparation des données client</p>
        </div>
      </div>
    );
  }

  // Fonction pour formater les nombres
  const formatNumber = (num) => new Intl.NumberFormat('fr-FR').format(num);

  // Rendu conditionnel basé sur l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'relaypoints': return renderRelayPointsContent();
      case 'api': return renderApiContent();
      case 'performance': return renderPerformanceContent();
      case 'billing': return renderBillingContent();
      default: return renderOverviewContent();
    }
  };

  // Contenu de l'onglet Vue d'ensemble
  const renderOverviewContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Points Relais Actifs" 
          value="468" 
          change="+12 depuis le mois dernier" 
          positive={true}
          icon={<FiMap size={20} />}
        />
        <StatsCard 
          title="Appels API" 
          value={formatNumber(6450)} 
          change="+13.6% depuis le mois dernier" 
          positive={true}
          icon={<FiBarChart2 size={20} />}
        />
        <StatsCard 
          title="Taux de Disponibilité" 
          value="99.0%" 
          change="+0.7% depuis le mois dernier" 
          positive={true}
          icon={<FiCheckCircle size={20} />}
        />
        <StatsCard 
          title="Colis Traités" 
          value={formatNumber(8765)} 
          change="+15.2% depuis le mois dernier" 
          positive={true}
          icon={<FiPackage size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Utilisation de l'API</h3>
            <div className="text-sm text-gray-500">Derniers 4 mois</div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={apiUsageData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9e9e9e" fontSize={12} />
                <YAxis stroke="#9e9e9e" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" name="Requêtes totales" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="success" name="Succès" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="errors" name="Erreurs" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Distribution par Type</h3>
            <div className="text-sm text-gray-500">Points relais</div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pointRelaisDistribution.byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pointRelaisDistribution.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} points`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Points Relais les Plus Utilisés</h3>
          <p className="text-sm text-gray-500">Top 5 des points relais par nombre d'utilisations</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quartier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisations</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPointRelais.map((point) => (
                <tr key={point.id} className="hover:bg-gray-50">
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
                    <div className="text-sm text-gray-900">{point.quartier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      point.type === 'bureau' ? 'bg-indigo-100 text-indigo-800' : 
                      point.type === 'commerce' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {point.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {point.services.map((service, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{point.usage}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Voir tous les points relais
          </button>
        </div>
      </div>
    </>
  );

  // Contenu de l'onglet Points Relais
  const renderRelayPointsContent = () => (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Points Relais</h1>
        <p className="text-gray-600">Visualisation et analyse de tous vos points relais</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white">
            <option value="all">Tous les quartiers</option>
            <option value="commerce">Commerce</option>
            <option value="champs">Champs-Élysées</option>
            <option value="marais">Marais</option>
            <option value="opera">Opéra</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white">
            <option value="all">Tous les types</option>
            <option value="bureau">Bureau</option>
            <option value="commerce">Commerce</option>
            <option value="agence">Agence</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Exporter les données
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Distribution par Type</h3>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pointRelaisDistribution.byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pointRelaisDistribution.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} points`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Services Disponibles</h3>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={pointRelaisDistribution.byService}
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9e9e9e" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#9e9e9e" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" name="Points Relais">
                  {pointRelaisDistribution.byService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quartier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horaires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPointRelais.map((point) => (
                <tr key={point.id} className="hover:bg-gray-50">
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
                    <div className="text-sm text-gray-900">{point.quartier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      point.type === 'bureau' ? 'bg-indigo-100 text-indigo-800' : 
                      point.type === 'commerce' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {point.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{point.hours}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {point.services.map((service, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Détails</button>
                    <button className="text-indigo-600 hover:text-indigo-900">Statistiques</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">Affichage de <span className="font-medium">1</span> à <span className="font-medium">5</span> sur <span className="font-medium">468</span> résultats</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">Précédent</button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-blue-600 text-white">1</button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">2</button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">3</button>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm">Suivant</button>
          </div>
        </div>
      </div>
    </>
  );

  // Contenu de l'onglet API
  const renderApiContent = () => (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Utilisation de l'API</h1>
        <p className="text-gray-600">Statistiques d'utilisation et performances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Appels API (Mois)" 
          value={formatNumber(6450)} 
          change="+13.6% depuis le mois dernier" 
          positive={true}
          icon={<FiBarChart2 size={20} />}
        />
        <StatsCard 
          title="Taux de Succès" 
          value="99.2%" 
          change="+0.89% depuis le mois dernier" 
          positive={true}
          icon={<FiCheckCircle size={20} />}
        />
        <StatsCard 
          title="Temps de Réponse" 
          value="156ms" 
          change="+12ms depuis le mois dernier" 
          positive={true}
          icon={<FiTrendingUp size={20} />}
        />
        <StatsCard 
          title="Quota Utilisé" 
          value="42%" 
          change="- 5% depuis le mois dernier" 
          positive={false}
          icon={<FiAlertCircle size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Évolution des Appels API</h3>
            <div className="text-sm text-gray-500">Derniers 4 mois</div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={apiUsageData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9e9e9e" fontSize={12} />
                <YAxis stroke="#9e9e9e" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" name="Requêtes totales" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="success" name="Succès" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="errors" name="Erreurs" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Type d'Erreurs API</h3>
            <div className="text-sm text-gray-500">Mois en cours</div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={apiErrorsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {apiErrorsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} erreurs`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-gray-800">Endpoints les Plus Utilisés</h3>
    <div className="text-sm text-gray-500">Mois en cours</div>
  </div>
  
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={[
          { name: 'Recherche points', count: 2450 },
          { name: 'Créer livraison', count: 1890 },
          { name: 'Suivi colis', count: 1560 },
          { name: 'Historique', count: 980 },
          { name: 'Stats utilisation', count: 670 }
        ]}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#9e9e9e" fontSize={12} />
        <YAxis stroke="#9e9e9e" fontSize={12} />
        <Tooltip formatter={(value) => [`${value} appels`, ""]} />
        <Bar dataKey="count" name="Appels API" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
</>
  );

{/* Contenu Performance */}
const renderPerformanceContent = () => (
  <>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Performances</h1>
      <p className="text-gray-600">Suivi des indicateurs clés de performance</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatsCard 
        title="Taux de Livraison" 
        value="98.7%" 
        change="+0.8% ce mois" 
        positive={true}
        icon={<FiCheckCircle size={20} />}
      />
      <StatsCard 
        title="Temps Moyen" 
        value="2 à 3 jours" 
        change="-0.4 jours" 
        positive={true}
        icon={<FiTrendingUp size={20} />}
      />
      <StatsCard 
        title="Retours" 
        value="1.2%" 
        change="-0.3%" 
        positive={true}
        icon={<FiAlertCircle size={20} />}
      />
    </div>

    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Évolution des Performances</h3>
        <div className="text-sm text-gray-500">6 derniers mois</div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9e9e9e" />
            <YAxis stroke="#9e9e9e" />
            <Tooltip />
            <Line type="monotone" dataKey="taux" stroke="#10b981" strokeWidth={2} name="Taux de succès" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </>
);

// Contenu Facturation
const renderBillingContent = () => (
  <>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Facturation</h1>
      <p className="text-gray-600">Historique et analyse des coûts</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatsCard 
        title="Mois en cours" 
        value="48 000 FCFA" 
        change="+12% vs mois dernier" 
        positive={true}
        icon={<FiCalendar size={20} />}
      />
      <StatsCard 
        title="Année en cours" 
        value="1 589 400 FCFA" 
        change="+18% vs année dernière" 
        positive={true}
        icon={<FiTrendingUp size={20} />}
      />
      <StatsCard 
        title="Prévision annuelle" 
        value="3 056 150 FCFA" 
        change="Sur budget" 
        positive={false}
        icon={<FiAlertCircle size={20} />}
      />
    </div>

    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Historique des Factures de livraisons</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Télécharger tous les relevés
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appels API</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { id: 1, period: '01 avril 2025 -- 11h50', calls: '12 450', amount: '14 500 FCFA', status: 'Payé' },
              { id: 2, period: '23 mars 2025 -- 17h23', calls: '11 890', amount: '4 800 FCFA', status: 'Payé' },
              { id: 3, period: '23 mars 2025 -- 14h40', calls: '10 560', amount: '22 350 FCFA', status: 'Payé' },
              { id: 4, period: '23 mars 2025 -- 14h28', calls: '9 870', amount: '8 400 FCFA', status: 'Payé' }
            ].map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.period}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.calls}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">Télécharger</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

// Rendu principal
return (
  <div className="min-h-screen text-black bg-gray-50">
    <Navbar />
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">CamAdress</h2>
          <p className="text-sm text-gray-500">Tableau de bord de l'entreprise</p>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-3 rounded-lg mb-1 text-left ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  </div>
);
};


export default ClientDashboard;