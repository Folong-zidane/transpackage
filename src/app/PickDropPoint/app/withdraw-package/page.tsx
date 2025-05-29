'use client'

import { useState } from 'react'
import FormCard from '../../components/FormCard'

export default function WithdrawPackagePage() {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    recipientName: '',
    recipientPhone: '',
    recipientId: '',
    withdrawnBy: '',
    relationship: '',
    withdrawnDate: '',
    withdrawnTime: '',
    signature: '',
    notes: ''
  })

  const [packageInfo, setPackageInfo] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const searchPackage = async () => {
    setIsSearching(true)
    // Simulation de recherche
    setTimeout(() => {
      setPackageInfo({
        id: formData.trackingNumber,
        sender: "Jean Dupont",
        recipient: "Marie Martin",
        recipientPhone: "+237 6XX XXX XXX",
        description: "Documents importants",
        weight: "0.5 kg",
        status: "En attente de retrait",
        arrivedDate: "2024-01-16"
      })
      setIsSearching(false)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Retrait colis:', formData)
    alert('Retrait du colis confirmé!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FormCard title="Retrait d'un colis" subtitle="Enregistrez le retrait d'un colis par le destinataire">
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
              <h3 className="text-lg font-semibold mb-4 text-green-800">Colis disponible pour retrait</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Expéditeur:</strong> {packageInfo.sender}</div>
                <div><strong>Destinataire:</strong> {packageInfo.recipient}</div>
                <div><strong>Téléphone:</strong> {packageInfo.recipientPhone}</div>
                <div><strong>Description:</strong> {packageInfo.description}</div>
                <div><strong>Poids:</strong> {packageInfo.weight}</div>
                <div><strong>Arrivé le:</strong> {packageInfo.arrivedDate}</div>
              </div>
              <div className="mt-3">
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                  {packageInfo.status}
                </span>
              </div>
            </div>
          )}

          {/* Formulaire de retrait */}
          {packageInfo && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Vérification d'identité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du destinataire *</label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom complet du destinataire"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      name="recipientPhone"
                      value={formData.recipientPhone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de pièce d'identité *</label>
                  <input
                    type="text"
                    name="recipientId"
                    value={formData.recipientId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="CNI, Passeport, Permis de conduire"
                    required
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Personne effectuant le retrait</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retiré par *</label>
                    <input
                      type="text"
                      name="withdrawnBy"
                      value={formData.withdrawnBy}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom de la personne qui retire"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lien avec le destinataire *</label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="destinataire">Le destinataire lui-même</option>
                      <option value="famille">Membre de la famille</option>
                      <option value="ami">Ami(e)</option>
                      <option value="collegue">Collègue</option>
                      <option value="autre">Autre (préciser en commentaire)</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de retrait *</label>
                    <input
                      type="date"
                      name="withdrawnDate"
                      value={formData.withdrawnDate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heure de retrait *</label>
                    <input
                      type="time"
                      name="withdrawnTime"
                      value={formData.withdrawnTime}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold mb-4 text-yellow-800">Confirmation et signature</h3>
                <div className="mb-4">
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Signature du bénéficiaire *</label>
                  <input
                    type="text"
                    name="signature"
                    value={formData.signature}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom et signature de la personne qui retire"
                    required
                  />
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Attention</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>En confirmant ce retrait, vous certifiez que :</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>L'identité du bénéficiaire a été vérifiée</li>
                        <li>Le colis a été remis en bon état</li>
                        <li>Toutes les informations sont exactes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Confirmer le retrait
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