'use client';
import { Send } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiMapPin,
  FiCalendar,
  FiFilter,
  FiArrowRight,
  FiEye,
  FiPlus
} from 'react-icons/fi';

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

interface Colis {
  id: string;
  code: string;
  expediteur: string;
  destinataire: string;
  adresseExp: string;
  adresseDest: string;
  status: 'en_attente' | 'en_transit' | 'livre' | 'probleme';
  dateEnvoi: string;
  dateLivraison?: string;
  poids: number;
  prix: number;
  description: string;
  type: 'envoye' | 'recu';
}

interface ColisProps {
  utilisateur: Utilisateur;
}

const Colis: React.FC<ColisProps> = ({ utilisateur }) => {
  const [colis, setColis] = useState<Colis[]>([]);
  const [filtreStatus, setFiltreStatus] = useState<string>('tous');
  const [filtreType, setFiltreType] = useState<string>('tous');
  const [recherche, setRecherche] = useState<string>('');
  const [colisSelectionne, setColisSelectionne] = useState<Colis | null>(null);
  const [loading, setLoading] = useState(true);

  // Données d'exemple
  useEffect(() => {
    const colisExemple: Colis[] = [
      {
        id: '1',
        code: 'COL2024001A',
        expediteur: 'Marie Dupont',
        destinataire: 'Jean Martin',
        adresseExp: 'Douala, Cameroun',
        adresseDest: 'Yaoundé, Cameroun',
        status: 'en_transit',
        dateEnvoi: '2024-03-15',
        poids: 2.5,
        prix: 5000,
        description: 'Documents importants',
        type: 'envoye'
      },
      {
        id: '2',
        code: 'COL2024002B',
        expediteur: 'Paul Ngono',
        destinataire: 'Marie Dupont',
        adresseExp: 'Bafoussam, Cameroun',
        adresseDest: 'Douala, Cameroun',
        status: 'livre',
        dateEnvoi: '2024-03-10',
        dateLivraison: '2024-03-12',
        poids: 1.2,
        prix: 3000,
        description: 'Cadeau d\'anniversaire',
        type: 'recu'
      },
      {
        id: '3',
        code: 'COL2024003C',
        expediteur: 'Marie Dupont',
        destinataire: 'Sophie Kamga',
        adresseExp: 'Douala, Cameroun',
        adresseDest: 'Garoua, Cameroun',
        status: 'en_attente',
        dateEnvoi: '2024-03-18',
        poids: 0.8,
        prix: 2500,
        description: 'Livre',
        type: 'envoye'
      },
      {
        id: '4',
        code: 'COL2024004D',
        expediteur: 'Ahmed Bello',
        destinataire: 'Marie Dupont',
        adresseExp: 'Maroua, Cameroun',
        adresseDest: 'Douala, Cameroun',
        status: 'probleme',
        dateEnvoi: '2024-03-14',
        poids: 3.1,
        prix: 7500,
        description: 'Produits artisanaux',
        type: 'recu'
      }
    ];

    setTimeout(() => {
      setColis(colisExemple);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrage des colis
  const colisFiltres = colis.filter(coli => {
    const matchRecherche = coli.code.toLowerCase().includes(recherche.toLowerCase()) ||
                          coli.expediteur.toLowerCase().includes(recherche.toLowerCase()) ||
                          coli.destinataire.toLowerCase().includes(recherche.toLowerCase());
    
    const matchStatus = filtreStatus === 'tous' || coli.status === filtreStatus;
    const matchType = filtreType === 'tous' || coli.type === filtreType;
    
    return matchRecherche && matchStatus && matchType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_attente': return <FiClock className="text-yellow-500" />;
      case 'en_transit': return <FiTruck className="text-blue-500" />;
      case 'livre': return <FiCheckCircle className="text-green-500" />;
      case 'probleme': return <FiPackage className="text-red-500" />;
      default: return <FiPackage />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'en_transit': return 'En transit';
      case 'livre': return 'Livré';
      case 'probleme': return 'Problème';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'livre': return 'bg-green-100 text-green-800 border-green-200';
      case 'probleme': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statsData = {
    total: colis.length,
    envoyes: colis.filter(c => c.type === 'envoye').length,
    recus: colis.filter(c => c.type === 'recu').length,
    enTransit: colis.filter(c => c.status === 'en_transit').length,
    livres: colis.filter(c => c.status === 'livre').length
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 animate-pulse">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-300 rounded mb-6 w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FiPackage className="mr-3 text-green-600" />
            Mes Colis
          </h1>
          <p className="text-gray-600">Gérez et suivez tous vos colis en temps réel</p>        
        </div>

        <Link href='/envoyer'>
          <button 
            className="fixed top-28 right-4 z-50 bg-gradient-to-r from-teal-800 to-emerald-800 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-bounce"
          >
            <Send className="mr-2 text-lg animate-pulse" /> Envoyer un colis
          </button>
        </Link>


        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.total}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <FiPackage className="text-gray-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Envoyés</p>
                <p className="text-2xl font-bold text-blue-600">{statsData.envoyes}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiArrowRight className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reçus</p>
                <p className="text-2xl font-bold text-purple-600">{statsData.recus}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FiPackage className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En transit</p>
                <p className="text-2xl font-bold text-orange-600">{statsData.enTransit}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FiTruck className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Livrés</p>
                <p className="text-2xl font-bold text-green-600">{statsData.livres}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et Recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par code, expéditeur ou destinataire..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-4">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filtreStatus}
                  onChange={(e) => setFiltreStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="en_attente">En attente</option>
                  <option value="en_transit">En transit</option>
                  <option value="livre">Livré</option>
                  <option value="probleme">Problème</option>
                </select>
              </div>

              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="tous">Tous les types</option>
                <option value="envoye">Envoyés</option>
                <option value="recu">Reçus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des colis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {colisFiltres.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun colis trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code & Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expéditeur</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinataire</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {colisFiltres.map((coli, index) => (
                    <tr 
                      key={coli.id} 
                      className="hover:bg-gray-50 transition-colors duration-200"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {getStatusIcon(coli.status)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{coli.code}</div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(coli.status)}`}>
                              {getStatusText(coli.status)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{coli.expediteur}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiMapPin className="mr-1" />
                          {coli.adresseExp}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{coli.destinataire}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiMapPin className="mr-1" />
                          {coli.adresseDest}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiCalendar className="mr-2 text-gray-400" />
                          {new Date(coli.dateEnvoi).toLocaleDateString('fr-FR')}
                        </div>
                        {coli.dateLivraison && (
                          <div className="text-xs text-green-600">
                            Livré le {new Date(coli.dateLivraison).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {coli.prix.toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">{coli.poids} kg</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setColisSelectionne(coli)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <FiEye className="mr-1" />
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de détails */}
        {colisSelectionne && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Détails du colis</h2>
                  <button
                    onClick={() => setColisSelectionne(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-gray-900">{colisSelectionne.code}</span>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(colisSelectionne.status)}`}>
                        {getStatusText(colisSelectionne.status)}
                      </span>
                    </div>
                    <p className="text-gray-600">{colisSelectionne.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Expéditeur</h3>
                      <div className="space-y-2">
                        <p className="text-gray-900">{colisSelectionne.expediteur}</p>
                        <p className="text-gray-600 flex items-center">
                          <FiMapPin className="mr-2" />
                          {colisSelectionne.adresseExp}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Destinataire</h3>
                      <div className="space-y-2">
                        <p className="text-gray-900">{colisSelectionne.destinataire}</p>
                        <p className="text-gray-600 flex items-center">
                          <FiMapPin className="mr-2" />
                          {colisSelectionne.adresseDest}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-600 font-medium">Poids</p>
                      <p className="text-xl font-bold text-blue-900">{colisSelectionne.poids} kg</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-green-600 font-medium">Prix</p>
                      <p className="text-xl font-bold text-green-900">{colisSelectionne.prix.toLocaleString()} FCFA</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-purple-600 font-medium">Type</p>
                      <p className="text-xl font-bold text-purple-900 capitalize">{colisSelectionne.type}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-orange-600 font-medium">Date envoi</p>
                      <p className="text-sm font-bold text-orange-900">
                        {new Date(colisSelectionne.dateEnvoi).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {colisSelectionne.dateLivraison && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FiCheckCircle className="text-green-500 mr-2" />
                        <span className="text-green-800 font-medium">
                          Livré le {new Date(colisSelectionne.dateLivraison).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Colis;