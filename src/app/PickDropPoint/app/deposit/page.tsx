'use client'
import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function PackageDeposit() {
  const [step, setStep] = useState(1);
  
  // Données du formulaire
  const [formData, setFormData] = useState({
    // Informations du colis
    packageType: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    description: '',
    fragile: false,
    value: '',
    
    // Informations du destinataire
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    
    // Point de livraison
    deliveryPoint: '',
    
    // Options d'envoi
    shippingOption: 'standard',
    insurance: false,
  });
  
  // Liste des points de livraison (simulée)
  const deliveryPoints = [
    { id: 'pl1', name: 'Point Express Dakar Centre', address: 'Plateau, Avenue Léopold Sédar Senghor', city: 'Dakar' },
    { id: 'pl2', name: 'Point Express Médina', address: '12 Rue 22 x 19', city: 'Dakar' },
    { id: 'pl3', name: 'Point Express Yoff', address: 'Route de l\'Aéroport', city: 'Dakar' },
    { id: 'pl4', name: 'Point Express Plateau', address: '45 Avenue Georges Pompidou', city: 'Dakar' },
    { id: 'pl5', name: 'Point Express Rufisque', address: 'Rue 18 x 27', city: 'Rufisque' },
  ];
  
  // Options de type de colis
  const packageTypes = [
    { id: 'envelope', name: 'Enveloppe', maxWeight: '0.5' },
    { id: 'small', name: 'Petit colis', maxWeight: '2' },
    { id: 'medium', name: 'Colis moyen', maxWeight: '5' },
    { id: 'large', name: 'Grand colis', maxWeight: '10' },
    { id: 'custom', name: 'Dimensions spéciales', maxWeight: '20' },
  ];
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = () => {
    // Simulation de l'envoi des données au serveur
    console.log('Données du formulaire soumises:', formData);
    
    // Redirection vers la page de confirmation après traitement
    setStep(4); // Étape de confirmation
  };
  
  // Calcul simulé du prix basé sur les informations du colis
  const calculatePrice = () => {
    let basePrice = 0;
    
    // Prix selon le type de colis
    switch(formData.packageType) {
      case 'envelope': basePrice = 1500; break;
      case 'small': basePrice = 2500; break;
      case 'medium': basePrice = 3500; break;
      case 'large': basePrice = 5000; break;
      case 'custom': basePrice = 7000; break;
      default: basePrice = 2000;
    }
    
    // Ajouts selon les options
    if (formData.shippingOption === 'express') basePrice += 2000;
    if (formData.insurance) basePrice += 1500;
    
    return basePrice;
  };
  
  // Rendu conditionnel selon l'étape du processus
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du colis</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Type de colis
              </label>
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un type</option>
                {packageTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} (max {type.maxWeight} kg)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Poids (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Poids en kg"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {formData.packageType === 'custom' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    placeholder="Longueur"
                    className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    placeholder="Largeur"
                    className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    placeholder="Hauteur"
                    className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Description du contenu
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez le contenu du colis"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
            
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="fragile"
                name="fragile"
                checked={formData.fragile}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="fragile" className="ml-2 text-sm text-gray-700">
                Colis fragile (manipulation avec précaution)
              </label>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Valeur déclarée (FCFA)
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Valeur en FCFA"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du destinataire</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Nom du destinataire
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                placeholder="Nom complet"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Téléphone du destinataire
              </label>
              <input
                type="tel"
                name="recipientPhone"
                value={formData.recipientPhone}
                onChange={handleInputChange}
                placeholder="Numéro de téléphone"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email du destinataire (optionnel)
              </label>
              <input
                type="email"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                placeholder="Adresse email"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Point de livraison
              </label>
              <select
                name="deliveryPoint"
                value={formData.deliveryPoint}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un point de livraison</option>
                {deliveryPoints.map(point => (
                  <option key={point.id} value={point.id}>
                    {point.name} - {point.address}, {point.city}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Options d'envoi</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Type d'envoi
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border p-4 rounded-lg cursor-pointer ${
                    formData.shippingOption === 'standard'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, shippingOption: 'standard' }))}
                >
                  <div className="font-medium mb-1">Standard</div>
                  <div className="text-sm text-gray-600">Livraison en 2-3 jours</div>
                  <div className="mt-2 font-semibold">1500 FCFA</div>
                </div>
                
                <div
                  className={`border p-4 rounded-lg cursor-pointer ${
                    formData.shippingOption === 'express'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, shippingOption: 'express' }))}
                >
                  <div className="font-medium mb-1">Express</div>
                  <div className="text-sm text-gray-600">Livraison en 24h</div>
                  <div className="mt-2 font-semibold">3500 FCFA</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="insurance"
                name="insurance"
                checked={formData.insurance}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="insurance" className="ml-2 text-gray-700">
                Assurance colis (1500 FCFA) - Couverture jusqu'à 100 000 FCFA
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Récapitulatif</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type de colis:</span>
                  <span>{packageTypes.find(t => t.id === formData.packageType)?.name || 'Non sélectionné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Poids:</span>
                  <span>{formData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destinataire:</span>
                  <span>{formData.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Point de livraison:</span>
                  <span>{deliveryPoints.find(p => p.id === formData.deliveryPoint)?.name || 'Non sélectionné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span>{formData.shippingOption === 'express' ? 'Express (24h)' : 'Standard (2-3 jours)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assurance:</span>
                  <span>{formData.insurance ? 'Oui' : 'Non'}</span>
                </div>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total à payer:</span>
                <span>{calculatePrice()} FCFA</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirmer le dépôt
              </button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Dépôt confirmé !</h2>
            <p className="text-gray-600 mb-6">Votre colis a été enregistré avec succès.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Numéro de suivi</div>
                  <div className="font-medium">EXP-{Math.floor(100000 + Math.random() * 900000)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date d'enregistrement</div>
                  <div className="font-medium">{new Date().toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Point de livraison</div>
                  <div className="font-medium">{deliveryPoints.find(p => p.id === formData.deliveryPoint)?.name || 'Non spécifié'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Montant payé</div>
                  <div className="font-medium">{calculatePrice()} FCFA</div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="text-sm text-gray-600 mb-2">Prochaines étapes:</div>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Rendez-vous au point de dépôt pour déposer votre colis</li>
                  <li>Présentez ce numéro de suivi à l'agent</li>
                  <li>Suivez votre colis via la section "Suivi de colis"</li>
                </ol>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Imprimer le reçu
              </button>
              <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                Retour à l'accueil
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Navbar />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dépôt de colis</h1>
        
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium 
                    ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`h-1 w-12 sm:w-24 mx-1 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <div>Informations du colis</div>
            <div>Destinataire</div>
            <div>Options d'envoi</div>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
}