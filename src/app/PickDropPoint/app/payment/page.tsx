'use client'

import { useState } from 'react'
import FormCard from '../../components/FormCard'

export default function PaymentPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    trackingNumber: '',
    paymentMethod: '',
    amount: '',
    phoneNumber: '',
    operatorCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    payerName: '',
    payerPhone: ''
  })

  const [packageInfo, setPackageInfo] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const searchPackage = async () => {
    setIsSearching(true)
    setTimeout(() => {
      setPackageInfo({
        id: formData.trackingNumber,
        sender: "Jean Dupont",
        recipient: "Marie Martin",
        description: "Documents importants",
        weight: "2.5 kg",
        distance: "250 km",
        shippingCost: 3500,
        insuranceCost: 500,
        totalCost: 4000,
        status: "En attente de paiement"
      })
      setFormData(prev => ({ ...prev, amount: '4000' }))
      setIsSearching(false)
      setStep(2)
    }, 1000)
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Paiement:', formData)
    alert('Paiement effectué avec succès!')
    setStep(3)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FormCard title="Paiement des frais d'expédition" subtitle="Réglez les frais de transport de votre colis">
        <div className="space-y-6">
          {/* Étape 1: Recherche du colis */}
          {step === 1 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Rechercher le colis à payer</h3>
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
          )}

          {/* Étape 2: Détails et paiement */}
          {step === 2 && packageInfo && (
            <>
              {/* Résumé de la commande */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Résumé de la commande</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Expéditeur:</span>
                    <span className="font-medium">{packageInfo.sender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destinataire:</span>
                    <span className="font-medium">{packageInfo.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description:</span>
                    <span className="font-medium">{packageInfo.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Poids:</span>
                    <span className="font-medium">{packageInfo.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-medium">{packageInfo.distance}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between">
                      <span>Frais de transport:</span>
                      <span>{packageInfo.shippingCost} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assurance:</span>
                      <span>{packageInfo.insuranceCost} FCFA</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>Total à payer:</span>
                      <span className="text-blue-600">{packageInfo.totalCost} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulaire de paiement */}
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Informations du payeur</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom du payeur *</label>
                      <input
                        type="text"
                        name="payerName"
                        value={formData.payerName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <input
                        type="tel"
                        name="payerPhone"
                        value={formData.payerPhone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Mode de paiement</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mobile_money"
                        checked={formData.paymentMethod === 'mobile_money'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label className="ml-2 text-sm text-gray-700">Mobile Money (MTN/Orange)</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label className="ml-2 text-sm text-gray-700">Carte bancaire</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <label className="ml-2 text-sm text-gray-700">Espèces (au point de livraison)</label>
                    </div>
                  </div>
                </div>

                {/* Détails Mobile Money */}
                {formData.paymentMethod === 'mobile_money' && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold mb-3 text-orange-800">Paiement Mobile Money</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone *</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder="Ex: 6XXXXXXXX"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Opérateur *</label>
                        <select
                          name="operatorCode"
                          value={formData.operatorCode}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          required
                        >
                          <option value="">Sélectionner</option>
                          <option value="mtn">MTN Mobile Money</option>
                          <option value="orange">Orange Money</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Détails Carte bancaire */}
                {formData.paymentMethod === 'card' && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold mb-3 text-green-800">Paiement par Carte</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom sur la carte *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration *</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="MM/AA"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paiement en espèces */}
                {formData.paymentMethod === 'cash' && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold mb-3 text-yellow-800">Paiement en Espèces</h4>
                    <p className="text-sm text-yellow-700">
                      Le paiement sera effectué directement au point de livraison lors de la réception du colis.
                      Assurez-vous d'avoir le montant exact: <strong>{packageInfo.totalCost} FCFA</strong>
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Retour
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.paymentMethod}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
                  >
                    {formData.paymentMethod === 'cash' ? 'Confirmer la commande' : `Payer ${packageInfo.totalCost} FCFA`}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Étape 3: Confirmation */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="bg-green-50 p-8 rounded-lg border border-green-200">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Paiement effectué avec succès!</h3>
                <p className="text-green-700">
                  Votre paiement de <strong>{packageInfo?.totalCost} FCFA</strong> a été traité avec succès.
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Numéro de transaction: TXN{Date.now()}
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  Vous recevrez une notification SMS/Email de confirmation.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Imprimer le reçu
                  </button>
                  <button
                    onClick={() => {setStep(1); setPackageInfo(null); setFormData({...formData, trackingNumber: '', paymentMethod: ''})}}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Nouveau paiement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </FormCard>
    </div>
  )
}