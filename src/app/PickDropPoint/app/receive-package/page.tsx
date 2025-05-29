'use client'

import { useState } from 'react'
import FormCard from '../../components/FormCard'

export default function ReceivePackagePage() {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    receivedBy: '',
    receiverPosition: '',
    receivedDate: '',
    receivedTime: '',
    packageCondition: 'bon',
    notes: '',
    signature: '',
    photos: null as File[] | null
  })

  const [packageInfo, setPackageInfo] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files
      setFormData(prev => ({
        ...prev,
        [name]: files ? Array.from(files) : null
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const searchPackage = async () => {
    setIsSearching(true)
    // Simulation de recherche
    setTimeout(() => {
      setPackageInfo({
        id: formData.trackingNumber,
        sender: "Jean Dupont",
        recipient: "Marie Martin",
        description: "Documents importants",
        weight: "0.5 kg",
        emissionDate: "2024-01-15"
      })
      setIsSearching(false)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Réception colis:', formData)
    alert('Réception du colis confirmée!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FormCard title="Recevoir un colis" subtitle="Confirmez la réception d'un colis au point de livraison">
        <div className="space-y-6">
          {/* Recherche du colis */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Rechercher le colis</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de suivi *</label>
                <input
                  type="text"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: TRK123456789"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={searchPackage}
                  disabled={!formData.trackingNumber || isSearching}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isSearching ? 'Recherche...' : 'Rechercher'}
                </button>
              </div>
            </div>
          </div>

          {/* Informations du colis trouvé */}
          {packageInfo && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold mb-4 text-green-800">Colis trouvé</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Expéditeur:</strong> {packageInfo.sender}</div>
                <div><strong>Destinataire:</strong> {packageInfo.recipient}</div>
                <div><strong>Description:</strong> {packageInfo.description}</div>
                <div><strong>Poids:</strong> {packageInfo.weight}</div>
                <div><strong>Date émission:</strong> {packageInfo.emissionDate}</div>
              </div>
            </div>
          )}

          {/* Formulaire de réception */}
          {packageInfo && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Informations de réception</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reçu par *</label>
                    <input
                      type="text"
                      name="receivedBy"
                      value={formData.receivedBy}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fonction *</label>
                    <select
                      name="receiverPosition"
                      value={formData.receiverPosition}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="responsable">Responsable du point</option>
                      <option value="agent">Agent de réception</option>
                      <option value="gardien">Gardien</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de réception *</label>
                    <input
                      type="date"
                      name="receivedDate"
                      value={formData.receivedDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heure de réception *</label>
                    <input
                      type="time"
                      name="receivedTime"
                      value={formData.receivedTime}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">État du colis</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition du colis *</label>
                  <select
                    name="packageCondition"
                    value={formData.packageCondition}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="bon">Bon état</option>
                    <option value="leger_dommage">Léger dommage</option>
                    <option value="dommage_important">Dommage important</option>
                    <option value="endommage">Très endommagé</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photos du colis</label>
                  <input
                    type="file"
                    name="photos"
                    onChange={handleInputChange}
                    multiple
                    accept="image/*"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Optionnel: Ajoutez des photos si nécessaire</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observations</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Remarques particulières..."
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold mb-4 text-yellow-800">Signature</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Signature du responsable *</label>
                  <input
                    type="text"
                    name="signature"
                    value={formData.signature}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom et signature"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Confirmer la réception
                </button>
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </FormCard>
    </div>
  )
}
