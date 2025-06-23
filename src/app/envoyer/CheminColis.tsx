'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin, User, ArrowRight, Search, Package, Building2,
  Store, Clock, ChevronRight, X, LocateFixed, Navigation,
  CheckCircle, CircleDot, Mail, Phone, Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import maplibregl from 'maplibre-gl';
import { useRelayPoints } from '@/context/RelayPointsContex';


// Import dynamique du composant de carte
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <Loader2 className="animate-spin h-10 w-10 text-green-600" />
    </div>
  ),
});

// Interfaces
interface RelayPoint {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  hours?: string;
  type?: 'bureau' | 'commerce' | 'agence';
  distance?: number;
}

interface ShippingFormData {
  departurePointName: string;
  arrivalPointName: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  departurePointId?: number | null;
  arrivalPointId?: number | null;
}

interface RouteSelectionProps {
  formData: ShippingFormData;
  setFormData: React.Dispatch<React.SetStateAction<ShippingFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const YAOUNDE_CENTER: [number, number] = [11.5174, 3.8721];
const YAOUNDE_ZOOM = 13;

const RouteSelection: React.FC<RouteSelectionProps> = ({ onNext, onBack, formData, setFormData }) => {
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<number, maplibregl.Marker>>(new Map());
  
  // CORRECTION : Déclaration de la ref manquante
  const userMarkerRef = useRef<L.Marker | null>(null);
  const { points, isLoading } = useRelayPoints();
  const [allPoints, setAllPoints] = useState<RelayPoint[]>([]);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);
  const [displayedPoints, setDisplayedPoints] = useState<RelayPoint[]>([]);
  
  const [selectionMode, setSelectionMode] = useState<'origin' | 'destination'>('origin');
  const [selectedOrigin, setSelectedOrigin] = useState<RelayPoint | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<RelayPoint | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isRecipientFormValid, setIsRecipientFormValid] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  const requestUserLocation = useCallback((map: maplibregl.Map) => {
    if (!navigator.geolocation) {
      console.warn("La géolocalisation n'est pas supportée.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
        map.flyTo({ center: [longitude, latitude], zoom: 14 });

        // Mettre à jour le marqueur de l'utilisateur
        if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat([longitude, latitude]);
        } else {
          const el = document.createElement('div');
          el.className = 'w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-xl animate-pulse';
          userMarkerRef.current = new maplibregl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(map);
        }
      },
      () => {
        console.warn("Impossible d'obtenir la position de l'utilisateur.");
        map.flyTo({ center: YAOUNDE_CENTER, zoom: YAOUNDE_ZOOM });
      }
    );
  }, []);

  const handleMapReady = useCallback((map: maplibregl.Map) => {
    mapInstanceRef.current = map;
    requestUserLocation(map);
  }, [requestUserLocation]);

  useEffect(() => {
    setIsLoadingPoints(true);
    api.relayPoints.getAll()
      .then(data => {
        setAllPoints(data);
        const origin = data.find(p => p.id === formData.departurePointId);
        const dest = data.find(p => p.id === formData.arrivalPointId);
        if (origin) setSelectedOrigin(origin);
        if (dest) setSelectedDestination(dest);
      })
      .catch(err => console.error("Failed to load relay points", err))
      .finally(() => setIsLoadingPoints(false));
  }, [formData.departurePointId, formData.arrivalPointId]);

  useEffect(() => {
        setAllPoints(points); // Mettre à jour l'état local quand le contexte change
        setDisplayedPoints(points);
    }, [points]);

  useEffect(() => {
    const term = searchQuery.toLowerCase().trim();
    if (term === '') {
      setDisplayedPoints(allPoints);
    } else {
      const filtered = allPoints.filter(point => 
          point.name.toLowerCase().includes(term) ||
          point.address.toLowerCase().includes(term)
      );
      setDisplayedPoints(filtered);
    }
  }, [searchQuery, allPoints]);

  const handlePointSelect = (point: RelayPoint) => {
    if (selectionMode === 'origin') {
        setSelectedOrigin(point);
        setFormData({ ...formData, departurePointId: point.id, departurePointName: point.name });
        setSelectionMode('destination');
    } else {
        if (selectedOrigin?.id === point.id) {
            alert("Le point de départ et d'arrivée ne peuvent pas être identiques.");
            return;
        }
        setSelectedDestination(point);
        setFormData({ ...formData, arrivalPointId: point.id, arrivalPointName: point.name });
    }
  };

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || isLoadingPoints) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();
    
    allPoints.forEach(point => {
      let markerColor = '#10b981';
      if (point.id === selectedOrigin?.id) markerColor = '#3b82f6';
      if (point.id === selectedDestination?.id) markerColor = '#ef4444';

      const el = document.createElement('div');
      el.innerHTML = `<div class="w-8 h-8 rounded-full flex items-center justify-center shadow-md transform hover:scale-110 transition-transform cursor-pointer" style="background-color: ${markerColor}; border: 2px solid white;"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>`;
      
      const popupContent = `<div class="p-2 font-sans"><h3 class="font-bold text-sm">${point.name}</h3><p class="text-xs text-gray-600">${point.address}</p><button id="select-btn-${point.id}" class="mt-2 w-full bg-green-100 hover:bg-green-200 text-green-700 text-xs py-1 px-2 rounded">Sélectionner</button></div>`;
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupContent);
      
      popup.on('open', () => {
        document.getElementById(`select-btn-${point.id}`)?.addEventListener('click', () => handlePointSelect(point));
      });

      const marker = new maplibregl.Marker({element: el})
        .setLngLat([point.longitude, point.latitude])
        .setPopup(popup)
        .addTo(map);
        
      markersRef.current.set(point.id, marker);
    });

    if (map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }

    if (selectedOrigin && selectedDestination) {
      const routeCoordinates = [ [selectedOrigin.longitude, selectedOrigin.latitude], [selectedDestination.longitude, selectedDestination.latitude] ];
      map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: routeCoordinates } } });
      map.addLayer({ id: 'route', type: 'line', source: 'route', layout: {}, paint: { 'line-color': '#16a34a', 'line-width': 4 } });
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend(routeCoordinates[0] as [number, number]);
      bounds.extend(routeCoordinates[1] as [number, number]);
      map.fitBounds(bounds, { padding: 80, duration: 1000 });
    }

  }, [isLoadingPoints, allPoints, selectedOrigin, selectedDestination]);
  
  useEffect(() => {
    setIsRecipientFormValid(
        formData.recipientName.trim().length > 2 &&
        formData.recipientPhone.trim().length >= 8
    );
  }, [formData.recipientName, formData.recipientPhone]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecipientFormValid && selectedOrigin && selectedDestination) {
        onNext();
    } else {
        alert("Veuillez sélectionner les points et remplir les informations du destinataire.");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm p-3 z-20 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
           <h2 className="text-md sm:text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              {!selectedOrigin ? "1. Choisissez le point de départ" : !selectedDestination ? "2. Choisissez le point d'arrivée" : "3. Infos du destinataire"}
            </h2>
            <div className="relative w-full sm:w-auto max-w-xs">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher un relais..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>
          <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="sm:hidden p-2 text-gray-600 hover:text-green-600" title="Afficher la liste">
            {isSidebarVisible ? <X className="w-5 h-5"/> : <List className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 relative">
          <MapComponent
            onMapReady={handleMapReady}
            initialCenter={YAOUNDE_CENTER}
            initialZoom={YAOUNDE_ZOOM}
          />
        </main>

        <aside className={`
          fixed sm:static top-0 right-0 h-full
          w-full max-w-xs sm:w-80 md:w-96 bg-white shadow-2xl sm:shadow-lg
          transform transition-transform duration-300 ease-in-out z-30
          flex flex-col border-l border-gray-200
          ${isSidebarVisible ? 'translate-x-0' : 'translate-x-full sm:translate-x-0'}
        `}>
           <div className="p-3.5 border-b flex justify-between items-center bg-gray-50">
            <h3 className="text-md font-semibold text-gray-800">
              {selectedOrigin && selectedDestination ? "Infos Destinataire" : "Points Relais"}
            </h3>
            <button onClick={() => setIsSidebarVisible(false)} className="sm:hidden p-1 text-gray-500 hover:text-gray-700"> <X className="w-5 h-5" /> </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedOrigin && selectedDestination ? (
              <form onSubmit={handleFormSubmit} className="p-4 space-y-3.5 border-b border-gray-200 custom-scrollbar">
                <p className="text-xs text-gray-500 mb-2">Remplissez ces informations pour finaliser la sélection du trajet.</p>
                <div>
                  <label htmlFor="recipientName" className="label-form">Nom complet du destinataire <span className="text-red-500">*</span></label>
                  <div className="input-group-form">
                      <User size={16} className="input-icon-form" />
                      <input id="recipientName" type="text" placeholder="Ex: Alima C." value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} className="input-form pl-8" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="recipientPhone" className="label-form">Téléphone du destinataire <span className="text-red-500">*</span></label>
                   <div className="input-group-form">
                      <Phone size={16} className="input-icon-form" />
                      <input id="recipientPhone" type="tel" placeholder="Ex: 6XX XXX XXX" value={formData.recipientPhone} onChange={e => setFormData({...formData, recipientPhone: e.target.value})} className="input-form pl-8" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="recipientEmail" className="label-form">E-mail du destinataire (Optionnel)</label>
                  <div className="input-group-form">
                      <Mail size={16} className="input-icon-form" />
                      <input id="recipientEmail" type="email" placeholder="Ex: email@example.com" value={formData.recipientEmail} onChange={e => setFormData({...formData, recipientEmail: e.target.value})} className="input-form pl-8" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onBack} className="form-button-secondary flex-1">Précédent</button>
                   <button type="submit" disabled={!isRecipientFormValid} className="form-button-primary flex-1 disabled:opacity-60">
                     Suivant <ArrowRight size={16} className="ml-1" />
                   </button>
                </div>
              </form>
            ) : (
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  <p className="text-xs text-gray-500 px-1 pb-1 border-b border-dashed">
                      {!selectedOrigin ? `Sélectionnez un point de départ.` : `Sélectionnez un point d'arrivée.`}
                  </p>
                  {isLoadingPoints ? (
                      <div className="text-center py-20 text-gray-500">
                        <Loader2 className="animate-spin h-8 w-8 mx-auto mb-3" />
                        <p>Chargement des points relais...</p>
                      </div>
                    ) : displayedPoints.length > 0 ? displayedPoints.map(point => {
                      const isSelectedAsDeparture = selectedOrigin?.id === point.id;
                      const isSelectedAsArrival = selectedDestination?.id === point.id;
                      const TypeIcon = point.type === 'bureau' ? Building2 : point.type === 'commerce' ? Store : Package;

                      return (
                      <div key={`list-point-${point.id}`} onClick={() => handlePointSelect(point)} className={`p-2.5 rounded-lg border transition-all duration-150 flex items-start gap-2.5 cursor-pointer ${isSelectedAsDeparture ? 'bg-green-50 border-green-500' : isSelectedAsArrival ? 'bg-red-50 border-red-500' : 'hover:bg-gray-100 border-gray-200'}`}>
                          <div className={`mt-0.5 w-8 h-8 shrink-0 rounded-md flex items-center justify-center text-sm ${isSelectedAsDeparture ? 'bg-green-600 text-white' : isSelectedAsArrival ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            {isSelectedAsDeparture ? <CircleDot size={18} /> : isSelectedAsArrival ? <MapPin size={18} fill="currentColor"/> : <TypeIcon size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-sm text-gray-800 truncate`}>{point.name}</h4>
                            <p className="text-xs text-gray-600 truncate">{point.address}</p>
                          </div>
                          {!isSelectedAsDeparture && !isSelectedAsArrival && <ChevronRight size={18} className="text-gray-400 self-center shrink-0"/>}
                      </div>
                      );
                  }) : <p className="text-center text-gray-500 text-sm py-6">Aucun point relais trouvé.</p>}
                </div>
            )}
          </div>
        </aside>
      </div>
      <style jsx global>{`
        /* Styles pour les formulaires, la scrollbar, etc. */
        .label-form { display: block; font-size: 0.8rem; font-weight: 500; color: #374151; margin-bottom: 0.3rem; }
        .input-group-form { position: relative; }
        .input-icon-form { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #9ca3af; }
        .input-form { width: 100%; padding: 0.625rem 0.75rem; padding-left: 2.25rem; font-size: 0.875rem; color: #1f2937; background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 0.375rem; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
        .input-form:focus { outline: none; border-color: #10b981; background-color: white; box-shadow: 0 0 0 2.5px rgba(16, 185, 129, 0.25); }
        .form-button-primary { padding: 0.65rem 1.1rem; background-color: #10b981; color: white; border-radius: 0.375rem; font-weight: 500; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .form-button-primary:hover:not(:disabled) { background-color: #059669; }
        .form-button-primary:disabled { background-color: #9ca3af; }
        .form-button-secondary { padding: 0.65rem 1.1rem; background-color: white; color: #374151; border: 1px solid #d1d5db; border-radius: 0.375rem; font-weight: 500; font-size: 0.875rem; transition: all 0.15s; }
        .form-button-secondary:hover { background-color: #f3f4f6; }
      `}</style>
    </div>
  );
};

export default RouteSelection;