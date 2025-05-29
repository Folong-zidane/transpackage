// GerantForm.tsx
import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Home, Clock, Star, Check, Loader, X, Upload, CreditCard, Calendar, Briefcase 
} from 'lucide-react';

// Types (can be moved to a shared types file if used elsewhere)
export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  photo?: string;
  // Assuming age and gender might be available or collected separately
  // For this form, we'll collect date of birth.
}

export interface GerantFormData {
  experience: string;
  typeActivite: string;
  motivations: string;
  disponibilite: string;
  cniNumber: string;
  cniPhoto?: string;
  dateNaissance: string; // To infer age
  profession: string;
}

interface GerantFormProps {
  utilisateur: Utilisateur;
  onSubmit: (formData: GerantFormData) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

const GerantForm: React.FC<GerantFormProps> = ({ utilisateur, onSubmit, onClose, isLoading }) => {
  const [formData, setFormData] = useState<GerantFormData>({
    experience: '',
    typeActivite: '',
    motivations: '',
    disponibilite: '',
    cniNumber: '',
    cniPhoto: undefined,
    dateNaissance: '',
    profession: '',
  });

  const cniPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCniPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setFormData(prev => ({ ...prev, cniPhoto: event.target.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation here if needed
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 px-8 py-6 relative">
          <h2 className="text-2xl font-bold text-white">Devenir Gérant de Point Relais</h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="text-2xl" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Display existing user info (read-only) */}
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Vos informations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-slate-500">Nom complet</label>
                    <p className="text-sm text-slate-800 font-medium">{utilisateur.nom} {utilisateur.prenom}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-slate-500">Email</label>
                    <p className="text-sm text-slate-800 font-medium">{utilisateur.email}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-slate-500">Téléphone</label>
                    <p className="text-sm text-slate-800 font-medium">{utilisateur.telephone}</p>
                </div>
                 <div className="bg-slate-50 p-3 rounded-lg">
                    <label className="block text-xs font-medium text-slate-500">Adresse</label>
                    <p className="text-sm text-slate-800 font-medium">{utilisateur.adresse}</p>
                </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-700 mb-1 border-b pb-2 pt-2">Informations complémentaires</h3>
            
            <div>
              <label htmlFor="dateNaissance" className="block text-sm font-semibold text-slate-700 mb-2">
                <Calendar className="inline mr-2 h-5 w-5" />
                Date de Naissance
              </label>
              <input
                type="date"
                name="dateNaissance"
                id="dateNaissance"
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                value={formData.dateNaissance}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="profession" className="block text-sm font-semibold text-slate-700 mb-2">
                <Briefcase className="inline mr-2 h-5 w-5" />
                Profession Actuelle
              </label>
              <input
                type="text"
                name="profession"
                id="profession"
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Ex: Commerçant, Enseignant, Sans emploi"
                value={formData.profession}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="cniNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                <CreditCard className="inline mr-2 h-5 w-5" />
                Numéro de CNI (Carte Nationale d'Identité)
              </label>
              <input
                type="text"
                name="cniNumber"
                id="cniNumber"
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Entrez votre numéro de CNI"
                value={formData.cniNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Upload className="inline mr-2 h-5 w-5" />
                Photo de la CNI (Recto)
              </label>
              <div 
                className="w-full p-4 border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 group bg-slate-50"
                onClick={() => cniPhotoInputRef.current?.click()}
              >
                {formData.cniPhoto ? (
                  <div className="relative w-1/2 h-32">
                    <img 
                      src={formData.cniPhoto} 
                      alt="Aperçu CNI" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                     <p className="text-sm text-green-600 mt-1 text-center">Photo chargée. Cliquez pour changer.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="text-3xl text-slate-400 group-hover:text-teal-500 mx-auto mb-2 transition-colors" />
                    <p className="text-sm text-slate-600 group-hover:text-teal-700 transition-colors">
                      Cliquez pour importer la photo de votre CNI
                    </p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG (max 2MB)</p>
                  </div>
                )}
              </div>
              <input
                ref={cniPhotoInputRef}
                type="file"
                name="cniPhoto"
                accept="image/jpeg, image/png"
                onChange={handleCniPhotoUpload}
                className="hidden"
                // CNI photo is important, so making it required for the form submission implicitly
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-semibold text-slate-700 mb-2">
                <User className="inline mr-2 h-5 w-5" />
                Expérience dans le commerce/service client
              </label>
              <select
                name="experience"
                id="experience"
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                value={formData.experience}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionnez votre niveau d'expérience</option>
                <option value="debutant">Débutant (0-1 an)</option>
                <option value="intermediaire">Intermédiaire (1-5 ans)</option>
                <option value="experimente">Expérimenté (5+ ans)</option>
                <option value="aucune">Aucune expérience formelle</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="typeActivite" className="block text-sm font-semibold text-slate-700 mb-2">
                <Home className="inline mr-2 h-5 w-5" />
                Lieu d'activité envisagé pour le point relais
              </label>
              <select
                name="typeActivite"
                id="typeActivite"
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                value={formData.typeActivite}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionnez le type de lieu</option>
                <option value="boutique_existante">Boutique/Commerce existant</option>
                <option value="bureau_existant">Bureau/Agence existant</option>
                <option value="local_dedie">Local dédié à créer</option>
                <option value="domicile">Depuis mon domicile (si adapté)</option>
                <option value="autre">Autre (précisez dans motivations)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="disponibilite" className="block text-sm font-semibold text-slate-700 mb-2">
                <Clock className="inline mr-2 h-5 w-5" />
                Disponibilité horaire (pour le point relais)
              </label>
              <input
                type="text"
                name="disponibilite"
                id="disponibilite"
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Ex: 8h-18h Lun-Ven, 9h-13h Sam"
                value={formData.disponibilite}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="motivations" className="block text-sm font-semibold text-slate-700 mb-2">
                <Star className="inline mr-2 h-5 w-5" />
                Motivations et comment vous assurerez un bon service
              </label>
              <textarea
                name="motivations"
                id="motivations"
                rows={4}
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Expliquez pourquoi vous souhaitez devenir gérant et vos atouts..."
                value={formData.motivations}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-8 space-x-4">
            <button 
              type="button"
              className="px-6 py-3 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
              disabled={isLoading || !formData.cniPhoto} // Require CNI photo
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2 h-5 w-5" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Envoyer ma candidature
                </>
              )}
            </button>
          </div>
          {!formData.cniPhoto && (
            <p className="text-xs text-red-500 text-right mt-2">Veuillez télécharger une photo de votre CNI.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default GerantForm;