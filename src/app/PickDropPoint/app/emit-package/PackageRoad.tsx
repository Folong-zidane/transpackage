// app/envoyer/CheminColis.tsx // Ou RoutePacket.tsx
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, User, ArrowRight, Search, Package, Building2,
  Store, Clock, ChevronRight, Menu, X, Home, Zap, List, Mail, Phone, LocateFixed, Navigation,
  CheckCircle, CircleDot,
  Target, // Pour les icônes de départ/arrivée
} from 'lucide-react';

import yaoundePointsRelaisData, {
  PointRelais,
  YAOUNDE_CENTER_FALLBACK,
  INITIAL_MAP_ZOOM_FALLBACK,
  findNearbyPoints, // Peut être moins pertinent si le départ est fixe
  filterPointsBySearch,
  calculateDistance,
  NEARBY_RADIUS_METERS
} from '@/app/point-de-relais/RelaisData'; // Ajustez le chemin si nécessaire


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

const USER_POSITION_ZOOM = 15;
const POINTS_PROCHES_A_FAIRE_CLIGNOTER = 3; // Moins pertinent si départ fixe
const LOCAL_STORAGE_SHIPPING_KEY = 'shippingRouteInfo_FixedDeparture'; // Clé différente pour éviter conflits

// ***** DÉFINIR LE POINT DE DÉPART FIXE *****
const FIXED_DEPARTURE_POINT_ID = 1; // REMPLACEZ PAR L'ID RÉEL de "Relais Market Bastos"
const FIXED_DEPARTURE_POINT_NAME = "Relais Market Bastos"; // REMPLACEZ PAR LE NOM RÉEL

const RoutePacket: React.FC<RouteSelectionProps> = ({ formData, setFormData, onNext, onBack }) => {
  const mapInstanceRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null); // Moins prioritaire
  const userMarkerRef = useRef<any>(null);
  const [nearbyPointsForHighlight, setNearbyPointsForHighlight] = useState<PointRelais[]>([]); // Moins pertinent

  // Initialiser selectedDeparturePoint avec le point fixe
  const initialFixedDeparturePoint = yaoundePointsRelaisData.find(p => p.id === FIXED_DEPARTURE_POINT_ID);
  const [selectedDeparturePoint, setSelectedDeparturePoint] = useState<PointRelais | null>(initialFixedDeparturePoint || null);
  const [selectedArrivalPoint, setSelectedArrivalPoint] = useState<PointRelais | null>(null);

  // Afficher tous les points SAUF le point de départ fixe comme points d'arrivée potentiels
  const [displayedPoints, setDisplayedPoints] = useState<PointRelais[]>(
    yaoundePointsRelaisData.filter(p => p.id !== FIXED_DEPARTURE_POINT_ID)
  );
  const pointMarkersRef = useRef<Map<number, any>>(new Map());

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const routeControlRef = useRef<any>(null);
  const [isRecipientFormValid, setIsRecipientFormValid] = useState(false);

  // Initialiser formData avec le point de départ fixe au montage
  useEffect(() => {
    if (initialFixedDeparturePoint) {
      setFormData(prev => ({
        ...prev,
        departurePointName: initialFixedDeparturePoint.name,
        departurePointId: initialFixedDeparturePoint.id,
      }));
    } else {
        console.error(`Point de départ fixe avec ID ${FIXED_DEPARTURE_POINT_ID} non trouvé! Vérifiez RelaisData.ts`);
        // Gérer l'erreur: afficher un message, etc.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Exécuter une seule fois


  const handlePointSelectionOnMapOrList = useCallback((point: PointRelais) => {
    const map = mapInstanceRef.current;
    if (point.id === FIXED_DEPARTURE_POINT_ID) {
        // On ne peut pas sélectionner le point de départ fixe comme arrivée
        if(map) map.closePopup();
        return;
    }

    if (selectedArrivalPoint?.id === point.id) { // Désélectionner l'arrivée actuelle
      setSelectedArrivalPoint(null);
      setFormData(prev => ({ ...prev, arrivalPointName: '', arrivalPointId: null }));
    } else { // Sélectionner une nouvelle arrivée
      setSelectedArrivalPoint(point);
      setFormData(prev => ({ ...prev, arrivalPointName: point.name, arrivalPointId: point.id }));
      // Optionnel: centrer sur le point d'arrivée sélectionné
      // if (map && typeof point.lat === 'number' && typeof point.lng === 'number') map.setView([point.lat, point.lng], USER_POSITION_ZOOM + 1);
    }
    if (map) map.closePopup();
  }, [selectedArrivalPoint, setFormData]);


  const getPointIconHtml = useCallback((point: PointRelais) => {
    let bgColor = 'bg-emerald-400'; // Couleur par défaut pour les points d'arrivée potentiels
    let zIndex = 50;
    let iconSizeClass = 'w-8 h-8';
    let iconContent;

    let TypeIconSvgString = '';
    if (point.type === 'bureau') TypeIconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>`;
    else if (point.type === 'commerce') TypeIconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-v-8M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20M22 7L12 17 2 7"/></svg>`;
    else TypeIconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7 8.7 5 8.7-5M12 22V12"/></svg>`;
    
    iconContent = TypeIconSvgString; // Par défaut

    if (point.id === FIXED_DEPARTURE_POINT_ID) { // Style pour le point de départ FIXE
      bgColor = 'bg-green-600';
      zIndex = 200;
      iconSizeClass = 'w-10 h-10';
      iconContent = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>`; // Icône CircleDot
    } else if (selectedArrivalPoint?.id === point.id) { // Style pour le point d'arrivée SÉLECTIONNÉ
      bgColor = 'bg-red-600';
      zIndex = 150;
      iconSizeClass = 'w-10 h-10';
      iconContent = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`; // Icône MapPin remplie
    }

    return `<div style="z-index: ${zIndex};" class="relative flex items-center justify-center transform transition-transform hover:scale-110">
              <div class="${iconSizeClass} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg border-2 border-white">
                ${iconContent}
              </div>
            </div>`;
  }, [selectedArrivalPoint]); // nearbyPointsForHighlight n'est plus utilisé ici

  const createPopupContentForPoint = useCallback((point: PointRelais) => {
    let actionButtonHtml = '';
    const isArrival = selectedArrivalPoint?.id === point.id;

    if (point.id === FIXED_DEPARTURE_POINT_ID) {
        actionButtonHtml = `<p class="text-green-600 font-semibold my-1 text-center">Point de Départ Fixe</p>`;
    } else if (isArrival) {
        actionButtonHtml = `<button class="popup-action-button bg-gray-500 hover:bg-gray-600" data-point-id="${point.id}" data-action="deselect_arrival">Déselectionner Arrivée</button>`;
    } else { // C'est un point d'arrivée potentiel
      actionButtonHtml = `<button class="popup-action-button bg-red-500 hover:bg-red-600" data-point-id="${point.id}" data-action="select_arrival">Choisir comme Arrivée</button>`;
    }

    return `<div class="p-1.5 max-w-xs text-xs">
              <strong class="block text-sm mb-0.5 text-gray-800">${point.name}</strong>
              <p class="text-gray-600 mb-0.5">${point.address}</p>
              <p class="text-gray-500 mb-1.5">Horaires: ${point.hours}</p>
              ${actionButtonHtml}
            </div>`;
  }, [selectedArrivalPoint]);


  // La géolocalisation de l'utilisateur est moins critique maintenant,
  // mais on peut la garder pour centrer la carte initialement ou aider l'utilisateur.
  const requestUserLocationAndCenterMap = useCallback((mapInstance: any) => {
    if (!mapInstance) return;

    // Centrer sur le point de départ fixe par défaut
    if (initialFixedDeparturePoint?.lat && initialFixedDeparturePoint?.lng) {
        mapInstance.setView([initialFixedDeparturePoint.lat, initialFixedDeparturePoint.lng], USER_POSITION_ZOOM -1); // Zoom un peu moins fort pour voir alentours
    } else {
        mapInstance.setView(YAOUNDE_CENTER_FALLBACK, INITIAL_MAP_ZOOM_FALLBACK);
    }

    // Optionnel: Marquer la position de l'utilisateur s'il l'autorise
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // setUserPosition([latitude, longitude]); // Si vous voulez stocker
          if (userMarkerRef.current) mapInstance.removeLayer(userMarkerRef.current);
          if(latitude && longitude) {
            userMarkerRef.current = window.L.marker([latitude, longitude], {
              icon: window.L.divIcon({
                html: `<div class="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-xl animate-pulse"></div>`, // Bleu pour utilisateur
                className: 'user-location-marker', iconSize: [20, 20], iconAnchor: [10, 10],
              }), zIndexOffset: 1000
            }).addTo(mapInstance).bindPopup("Votre position");
          }
        },
        (error) => { console.warn("Géoloc. utilisateur échouée:", error.message); }
      );
    }
  }, [initialFixedDeparturePoint]);


  // Initialisation de la carte
  const initializeMapLogic = useCallback(() => {
    if (!mapRef.current || !window.L || mapInstanceRef.current) return;
    try {
      const newMap = window.L.map(mapRef.current, {
        center: (initialFixedDeparturePoint ? [initialFixedDeparturePoint.lat, initialFixedDeparturePoint.lng] : YAOUNDE_CENTER_FALLBACK) as L.LatLngExpression,
        zoom: INITIAL_MAP_ZOOM_FALLBACK,
        zoomControl: false,
      });
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19, minZoom: 10
      }).addTo(newMap);
      window.L.control.zoom({ position: 'topright' }).addTo(newMap);
      mapInstanceRef.current = newMap;
      setIsMapLoading(false);
      requestUserLocationAndCenterMap(newMap); // Centrer la carte
    } catch (error) { console.error('Erreur init carte:', error); setIsMapLoading(false); }
  }, [requestUserLocationAndCenterMap, initialFixedDeparturePoint]);

  // ... (useEffect pour chargement scripts Leaflet, identique)
  useEffect(() => {
    let leafletLoaded = !!window.L;
    let routingMachineLoaded = !!(window.L && window.L.Routing);
    const loadScriptsIfNeeded = async () => {
       if (!leafletLoaded) {
        if (!document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]')) {
          const leafletCSS = document.createElement('link'); leafletCSS.rel = 'stylesheet'; leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(leafletCSS);
        }
        const leafletScript = document.createElement('script'); leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; leafletScript.async = true;
        await new Promise<void>(resolve => { leafletScript.onload = () => { leafletLoaded = true; resolve(); }; document.head.appendChild(leafletScript); });
      }
      if (leafletLoaded && !routingMachineLoaded) {
        if (!document.querySelector('link[href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"]')) {
          const routingCSS = document.createElement('link'); routingCSS.rel = 'stylesheet'; routingCSS.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css'; document.head.appendChild(routingCSS);
        }
        const routingScript = document.createElement('script'); routingScript.src = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js'; routingScript.async = true;
        await new Promise<void>(resolve => { routingScript.onload = () => { routingMachineLoaded = true; resolve(); }; document.head.appendChild(routingScript); });
      }
      if (leafletLoaded && routingMachineLoaded) initializeMapLogic();
    };
    if (mapRef.current && !mapInstanceRef.current) loadScriptsIfNeeded();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [initializeMapLogic]);

  // Mise à jour des marqueurs (incluant le point de départ fixe)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;

    pointMarkersRef.current.forEach(marker => map.removeLayer(marker));
    pointMarkersRef.current.clear();

    const pointsToDisplayOnMap = [
        ...(initialFixedDeparturePoint ? [initialFixedDeparturePoint] : []), // Ajouter le point de départ fixe s'il existe
        ...displayedPoints // Les autres points (arrivées potentielles)
    ];

    pointsToDisplayOnMap.forEach(point => {
      if (typeof point.lat !== 'number' || typeof point.lng !== 'number') return;
      const isSelected = point.id === FIXED_DEPARTURE_POINT_ID || selectedArrivalPoint?.id === point.id;
      const marker = window.L.marker([point.lat, point.lng], {
        icon: window.L.divIcon({
            html: getPointIconHtml(point),
            className: 'custom-relay-marker',
            iconSize: isSelected ? [40, 40] : [32, 32],
            iconAnchor: isSelected ? [20, 40] : [16, 32],
            popupAnchor: [0, isSelected ? -40 : -32]
        })
      }).addTo(map).bindPopup(createPopupContentForPoint(point), { offset: [0, -5] });
      pointMarkersRef.current.set(point.id, marker);
    });
  }, [displayedPoints, selectedArrivalPoint, getPointIconHtml, createPopupContentForPoint, initialFixedDeparturePoint]); // nearbyPointsForHighlight retiré

  // Gestion des clics sur les boutons dans les popups
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const onPopupOpen = (e: any) => {
      const popupNode = e.popup._container;
      const actionButtons = popupNode?.querySelectorAll('.popup-action-button');
      actionButtons?.forEach((button: HTMLButtonElement) => {
        const newButton = button.cloneNode(true) as HTMLButtonElement;
        button.parentNode?.replaceChild(newButton, button);
        newButton.addEventListener('click', () => {
          const pointId = parseInt(newButton.dataset.pointId || '', 10);
          const action = newButton.dataset.action;
          // Trouver le point dans la liste complète, pas seulement displayedPoints
          const point = yaoundePointsRelaisData.find(p => p.id === pointId);
          if (point) {
            if (action === 'select_arrival') {
              handlePointSelectionOnMapOrList(point); // Utilise la logique unifiée
            } else if (action === 'deselect_arrival') {
              handlePointSelectionOnMapOrList(point); // Utilise la logique unifiée
            }
            // Les actions pour départ ne sont plus nécessaires ici si départ fixe
            map.closePopup();
          }
        });
      });
    };
    map.on('popupopen', onPopupOpen);
    return () => { map.off('popupopen', onPopupOpen); };
  }, [handlePointSelectionOnMapOrList]); // setFormData et yaoundePointsRelaisData étaient ici, mais handlePointSelectionOnMapOrList les gère


  // Filtre et affichage des points (exclut toujours le point de départ fixe)
  useEffect(() => {
    const allPotentialArrivals = yaoundePointsRelaisData.filter(p => p.id !== FIXED_DEPARTURE_POINT_ID);
    if (searchQuery.trim() === '') {
      setDisplayedPoints(allPotentialArrivals);
    } else {
      const filtered = filterPointsBySearch(allPotentialArrivals, searchQuery);
      setDisplayedPoints(filtered);
    }
  }, [searchQuery]);


  // Itinéraire (selectedDeparturePoint est maintenant fixe via initialFixedDeparturePoint)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && initialFixedDeparturePoint && selectedArrivalPoint && window.L?.Routing) {
      if (routeControlRef.current) map.removeControl(routeControlRef.current);
      if (typeof initialFixedDeparturePoint.lat !== 'number' || typeof initialFixedDeparturePoint.lng !== 'number' ||
          typeof selectedArrivalPoint.lat !== 'number' || typeof selectedArrivalPoint.lng !== 'number') return;

      routeControlRef.current = window.L.Routing.control({
        waypoints: [
          window.L.latLng(initialFixedDeparturePoint.lat, initialFixedDeparturePoint.lng),
          window.L.latLng(selectedArrivalPoint.lat, selectedArrivalPoint.lng)
        ],
        routeWhileDragging: false, addWaypoints: false, createMarker: () => null,
        lineOptions: { styles: [{ color: '#16a34a', weight: 5, opacity: 0.8 }] },
        show: false, fitSelectedRoutes: 'smart'
      }).addTo(map);
    } else if (map && routeControlRef.current) {
      map.removeControl(routeControlRef.current);
      routeControlRef.current = null;
    }
  }, [initialFixedDeparturePoint, selectedArrivalPoint]);

  // Validation du formulaire destinataire
  useEffect(() => {
    const name = formData.recipientName ?? '';
    const phone = formData.recipientPhone ?? '';
    setIsRecipientFormValid(name.trim().length > 2 && phone.trim().length >= 8);
  }, [formData.recipientName, formData.recipientPhone]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecipientFormValid && initialFixedDeparturePoint && selectedArrivalPoint) {
      // Sauvegarde dans localStorage (optionnel ici si géré par le parent)
      // localStorage.setItem(LOCAL_STORAGE_SHIPPING_KEY, JSON.stringify(formData));
      onNext();
    } else if (!selectedArrivalPoint) {
        alert("Veuillez sélectionner un point d'arrivée.");
    } else {
        alert("Veuillez vérifier les informations du destinataire.");
    }
  };

  const getTypeIcon = (type: string) => {/* ... identique ... */ return Package;};
  const getTypeColorClasses = (type: string): string => {/* ... identique ... */ return 'bg-gray-100 text-gray-700';};

  const pageTitle = !selectedArrivalPoint ? "Choisissez le point d'arrivée" : "Informations du destinataire";

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm p-3 z-20 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            <h2 className="text-md sm:text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              {pageTitle}
            </h2>
            {initialFixedDeparturePoint && (
              <div className="text-xs text-gray-600 mt-0.5 flex items-center flex-wrap">
                <CircleDot size={14} className="mr-1 text-green-600"/>
                <span className="font-medium text-green-700">Départ: {initialFixedDeparturePoint.name} (Fixe)</span>
                {selectedArrivalPoint && <>
                  <ArrowRight size={12} className="mx-1.5 text-gray-500"/>
                  <MapPin size={14} className="mr-1 text-red-600" fill="currentColor"/>
                  <span className="font-medium text-red-700">{selectedArrivalPoint.name}</span>
                </>}
              </div>
            )}
          </div>
          <div className="relative w-full sm:w-auto max-w-xs">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher un point d'arrivée..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 shadow-sm"
            />
          </div>
          <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="sm:hidden p-2 text-gray-600 hover:text-green-600" title="Liste des relais">
            {isSidebarVisible ? <X className="w-5 h-5"/> : <List className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 relative">
          <div ref={mapRef} className="absolute inset-0 z-0" />
          {isMapLoading && ( /* ... Loader identique ... */ <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10"><div className="text-center p-4 bg-white rounded-lg shadow-xl"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div><p className="text-gray-600 text-sm">Chargement...</p></div></div>)}
           {mapInstanceRef.current && initialFixedDeparturePoint?.lat && ( // Bouton pour centrer sur le départ fixe
            <button onClick={() => mapInstanceRef.current?.setView([initialFixedDeparturePoint.lat!, initialFixedDeparturePoint.lng!], USER_POSITION_ZOOM -1)}
              className="absolute bottom-4 right-4 z-10 bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title={`Centrer sur ${FIXED_DEPARTURE_POINT_NAME}`}>
              <Target className="w-6 h-6 text-blue-600" />
            </button>
          )}
        </main>

        <aside className={` /* ... Sidebar identique ... */
          fixed sm:static top-0 right-0 h-full
          w-full max-w-xs sm:w-80 md:w-96 bg-white shadow-2xl sm:shadow-lg
          transform transition-transform duration-300 ease-in-out z-30
          flex flex-col border-l border-gray-200
          ${isSidebarVisible ? 'translate-x-0' : 'translate-x-full sm:translate-x-0'}
        `}>
           <div className="p-3.5 border-b flex justify-between items-center bg-gray-50">
            <h3 className="text-md font-semibold text-gray-800">
              {selectedArrivalPoint ? "Infos Destinataire" : "Choisissez un Point d'Arrivée"}
            </h3>
            <button onClick={() => setIsSidebarVisible(false)} className="sm:hidden p-1 text-gray-500 hover:text-gray-700"> <X className="w-5 h-5" /> </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedArrivalPoint && initialFixedDeparturePoint && ( // Afficher formulaire si arrivée sélectionnée
              <form onSubmit={handleFormSubmit} className="p-4 space-y-3.5 border-b border-gray-200 custom-scrollbar">
                {/* ... Formulaire destinataire identique ... */}
                <p className="text-xs text-gray-500 mb-2">Remplissez ces informations pour finaliser.</p>
                <div>
                  <label htmlFor="recipientName" className="label-form">Nom complet du destinataire <span className="text-red-500">*</span></label>
                  <div className="input-group-form"> <User size={16} className="input-icon-form" /> <input id="recipientName" type="text" placeholder="Ex: Alima C." value={formData.recipientName} onChange={e => setFormData(p => ({...p, recipientName: e.target.value}))} className="input-form pl-8" required /> </div>
                </div>
                <div>
                  <label htmlFor="recipientPhone" className="label-form">Téléphone du destinataire <span className="text-red-500">*</span></label>
                   <div className="input-group-form"> <Phone size={16} className="input-icon-form" /> <input id="recipientPhone" type="tel" placeholder="Ex: 6XX XXX XXX" value={formData.recipientPhone} onChange={e => setFormData(p => ({...p, recipientPhone: e.target.value}))} className="input-form pl-8" required /> </div>
                </div>
                <div>
                  <label htmlFor="recipientEmail" className="label-form">E-mail du destinataire (Optionnel)</label>
                  <div className="input-group-form"> <Mail size={16} className="input-icon-form" /> <input id="recipientEmail" type="email" placeholder="Ex: email@example.com" value={formData.recipientEmail} onChange={e => setFormData(p => ({...p, recipientEmail: e.target.value}))} className="input-form pl-8" /> </div>
                </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-1">
                      <p className="text-gray-700"><strong className="font-medium text-green-700">Départ :</strong> {initialFixedDeparturePoint.name}</p>
                      <p className="text-gray-700"><strong className="font-medium text-red-700">Arrivée :</strong> {selectedArrivalPoint.name}</p>
                      {/* ... Calcul distance ... */}
                  </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onBack} className="form-button-secondary flex-1">Précédent</button>
                   <button type="submit" disabled={!isRecipientFormValid} className="form-button-primary flex-1 disabled:opacity-60"> Suivant <ArrowRight size={16} className="ml-1" /> </button>
                </div>
              </form>
            )}

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {!selectedArrivalPoint && (
                <p className="text-xs text-gray-500 px-1 pb-1 border-b border-dashed">
                  Choisissez un point d'arrivée pour votre colis. Le point de départ est fixé à {FIXED_DEPARTURE_POINT_NAME}.
                </p>
              )}
              {displayedPoints.length > 0 ? displayedPoints.map(point => {
                // Ne pas afficher le point de départ fixe dans cette liste de sélection
                if (point.id === FIXED_DEPARTURE_POINT_ID) return null;

                const TypeSpecificIcon = getTypeIcon(point.type);
                const isSelectedAsArrival = selectedArrivalPoint?.id === point.id;

                let itemClasses = `p-2.5 rounded-lg border transition-all duration-150 flex items-start gap-2.5 cursor-pointer `;
                if (isSelectedAsArrival) itemClasses += 'bg-red-50 border-red-500 shadow-md ';
                else itemClasses += 'hover:bg-gray-100 hover:border-gray-300 border-gray-200 ';

                return (
                  <div key={`list-point-${point.id}`}
                    onClick={() => handlePointSelectionOnMapOrList(point)}
                    className={itemClasses}
                  >
                    <div className={`mt-0.5 w-8 h-8 shrink-0 rounded-md flex items-center justify-center text-sm 
                                     ${isSelectedAsArrival ? 'bg-red-600 text-white' : getTypeColorClasses(point.type)}`}>
                      {isSelectedAsArrival ? <MapPin size={18} fill="currentColor"/> : <TypeSpecificIcon size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm truncate ${isSelectedAsArrival ? 'text-gray-900' : 'text-gray-800'}`}>{point.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{point.address}</p>
                      {/* ... Affichage distance par rapport à l'utilisateur (optionnel) ... */}
                    </div>
                     {!isSelectedAsArrival && ( <ChevronRight size={18} className="text-gray-400 self-center shrink-0"/> )}
                  </div>
                );
              }) : <p className="text-center text-gray-500 text-sm py-6">Aucun point d'arrivée trouvé.</p>}
            </div>
          </div>
        </aside>
      </div>
      {isSidebarVisible && <div className="fixed inset-0 bg-black/30 z-20 sm:hidden" onClick={() => setIsSidebarVisible(false)}></div>}
      <style jsx global>{` /* ... Styles CSS identiques ... */ `}</style>
    </div>
  );
};

export default RoutePacket;