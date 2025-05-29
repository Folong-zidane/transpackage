'use client'
import { useState } from 'react';

export default function TransactionHistory() {
  // Données fictives pour les transactions
  const [transactions, setTransactions] = useState([
    {
      id: 'TX-2025-001',
      date: '15/05/2025',
      type: 'Dépôt',
      pointLivraison: 'Point Express Dakar Centre',
      colis: 'Téléphone portable',
      status: 'Livré',
      montant: '3500 FCFA'
    },
    {
      id: 'TX-2025-002',
      date: '12/05/2025',
      type: 'Réception',
      pointLivraison: 'Point Express Médina',
      colis: 'Documents administratifs',
      status: 'Récupéré',
      montant: '2000 FCFA'
    },
    {
      id: 'TX-2025-003',
      date: '08/05/2025',
      type: 'Émission',
      pointLivraison: 'Point Express Yoff',
      colis: 'Livres scolaires',
      status: 'En cours',
      montant: '4200 FCFA'
    },
    {
      id: 'TX-2025-004',
      date: '01/05/2025',
      type: 'Retrait',
      pointLivraison: 'Point Express Plateau',
      colis: 'Accessoires électroniques',
      status: 'Terminé',
      montant: '1800 FCFA'
    }
  ]);

  const [filterType, setFilterType] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    // Filtre par type
    if (filterType !== 'Tous' && tx.type !== filterType) return false;
    
    // Filtre par recherche
    if (searchQuery && !Object.values(tx).some(value => 
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )) return false;
    
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Livré': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'Récupéré': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Historique des transactions</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
              <input
                type="text"
                id="search"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher par ID, type, colis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-64">
              <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">Filtrer par type</label>
              <select
                id="typeFilter"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="Tous">Tous les types</option>
                <option value="Dépôt">Dépôt</option>
                <option value="Émission">Émission</option>
                <option value="Réception">Réception</option>
                <option value="Retrait">Retrait</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Point de livraison</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colis</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.pointLivraison}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.colis}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.montant}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Détails</button>
                        <button className="text-gray-600 hover:text-gray-900">Reçu</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucune transaction trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
              <div>Affichage de {filteredTransactions.length} sur {transactions.length} transactions</div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">Précédent</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">Suivant</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}