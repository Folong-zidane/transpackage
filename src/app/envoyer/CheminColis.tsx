'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, User, ArrowRight, Search, Package, Building2,
  Store, Clock, ChevronRight, Menu, X, Home, Zap, List, Mail, Phone, LocateFixed, Navigation,
  CheckCircle, CircleDot, // Pour les icônes de départ/arrivée
} from 'lucide-react';

import yaoundePointsRelaisData, {
  PointRelais,
  YAOUNDE_CENTER_FALLBACK,
  INITIAL_MAP_ZOOM_FALLBACK,
  findNearbyPoints,
  filterPointsBySearch,
  calculateDistance,
  NEARBY_RADIUS_METERS
} from '../point-de-relais/RelaisData';


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
const POINTS_PROCHES_A_FAIRE_CLIGNOTER = 3;
const LOCAL_STORAGE_SHIPPING_KEY = 'shippingRouteInfo';

const RouteSelection: React.FC<RouteSelectionProps> = ({ formData, setFormData, onNext, onBack }) => {
  const mapInstanceRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const userMarkerRef = useRef<any>(null);
  const [nearbyPointsForHighlight, setNearbyPointsForHighlight] = useState<PointRelais[]>([]);
  const [displayedPoints, setDisplayedPoints] = useState<PointRelais[]>(yaoundePointsRelaisData);
  const pointMarkersRef = useRef<Map<number, any>>(new Map());

  const [selectedDeparturePoint, setSelectedDeparturePoint] = useState<PointRelais | null>(null);
  const [selectedArrivalPoint, setSelectedArrivalPoint] = useState<PointRelais | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const routeControlRef = useRef<any>(null);
  const [isRecipientFormValid, setIsRecipientFormValid] = useState(false);


  const handlePointSelectionOnMapOrList = useCallback((point: PointRelais) => {
    const map = mapInstanceRef.current;

    if (selectedDeparturePoint?.id === point.id) {
      setSelectedDeparturePoint(null);
      setFormData(prev => ({ ...prev, departurePointName: '', departurePointId: null }));
    } else if (selectedArrivalPoint?.id === point.id) {
      setSelectedArrivalPoint(null);
      setFormData(prev => ({ ...prev, arrivalPointName: '', arrivalPointId: null }));
    } else if (!selectedDeparturePoint) {
      setSelectedDeparturePoint(point);
      setFormData(prev => ({ ...prev, departurePointName: point.name, departurePointId: point.id }));
      if (map && typeof point.lat === 'number' && typeof point.lng === 'number') map.setView([point.lat, point.lng], USER_POSITION_ZOOM + 1);
    } else if (!selectedArrivalPoint) {
      setSelectedArrivalPoint(point);
      setFormData(prev => ({ ...prev, arrivalPointName: point.name, arrivalPointId: point.id }));
    } else { // Départ et Arrivée déjà sélectionnés, on change le départ
      setSelectedDeparturePoint(point);
      setSelectedArrivalPoint(null);
      setFormData(prev => ({
        ...prev,
        departurePointName: point.name,
        departurePointId: point.id,
        arrivalPointName: '',
        arrivalPointId: null
      }));
      if (map && typeof point.lat === 'number' && typeof point.lng === 'number') map.setView([point.lat, point.lng], USER_POSITION_ZOOM + 1);
    }
    if (map) map.closePopup();
  }, [selectedDeparturePoint, selectedArrivalPoint, setFormData]); // USER_POSITION_ZOOM est une constante, pas besoin ici


  const getPointIconHtml = useCallback((point: PointRelais) => {
    let bgColor = 'bg-green-400'; // Vert plus clair par défaut pour les points non sélectionnés
    let animationClass = '';
    let zIndex = 50;
    let iconSizeClass = 'w-8 h-8';
    let iconContent;

    // Déterminer l'icône de type de base
    let TypeIconSvgString = '';
    if (point.type === 'bureau') {
      TypeIconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`;
    } else if (point.type === 'commerce') {
      TypeIconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7L12 17 2 7"/></svg>`;
    } else { // agence ou default
      TypeIconSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
    }
    iconContent = TypeIconSvgString; // Par défaut, utiliser l'icône de type

    if (!selectedDeparturePoint && nearbyPointsForHighlight.some(p => p.id === point.id)) {
      animationClass = 'animate-custom-pulse';
      zIndex = 100;
    }

    if (selectedDeparturePoint?.id === point.id) {
      bgColor = 'bg-green-600';
      animationClass = '';
      zIndex = 200;
      iconSizeClass = 'w-10 h-10';
      iconContent = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dot"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>`;
    } else if (selectedArrivalPoint?.id === point.id) {
      bgColor = 'bg-red-600';
      animationClass = '';
      zIndex = 150;
      iconSizeClass = 'w-10 h-10';
      iconContent = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    }
    // L'icône de type est déjà définie par défaut si aucune des conditions ci-dessus n'est remplie.

    return `<div style="z-index: ${zIndex};" class="relative flex items-center justify-center transform transition-transform hover:scale-110">
              <div class="${iconSizeClass} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg border-2 border-white ${animationClass}">
                ${iconContent}
              </div>
            </div>`;
  }, [selectedDeparturePoint, selectedArrivalPoint, nearbyPointsForHighlight]);

  const createPopupContentForPoint = useCallback((point: PointRelais) => {
    // ... (Identique, car ses dépendances (selectedDeparturePoint, selectedArrivalPoint) sont déjà dans le useCallback parent)
    let actionButtonHtml = '';
    const isDeparture = selectedDeparturePoint?.id === point.id;
    const isArrival = selectedArrivalPoint?.id === point.id;

    if (isDeparture) {
        actionButtonHtml = `<button class="popup-action-button bg-gray-500 hover:bg-gray-600" data-point-id="${point.id}" data-action="deselect_departure">Déselectionner Départ</button>`;
    } else if (isArrival) {
        actionButtonHtml = `<button class="popup-action-button bg-gray-500 hover:bg-gray-600" data-point-id="${point.id}" data-action="deselect_arrival">Déselectionner Arrivée</button>`;
    } else if (!selectedDeparturePoint) {
      actionButtonHtml = `<button class="popup-action-button bg-green-500 hover:bg-green-600" data-point-id="${point.id}" data-action="select_departure">Choisir comme Départ</button>`;
    } else if (!selectedArrivalPoint) {
      actionButtonHtml = `<button class="popup-action-button bg-red-500 hover:bg-red-600" data-point-id="${point.id}" data-action="select_arrival">Choisir comme Arrivée</button>`;
    } else {
       actionButtonHtml = `<button class="popup-action-button bg-green-500 hover:bg-green-600" data-point-id="${point.id}" data-action="change_departure">Choisir comme Nouveau Départ</button>`;
    }

    return `<div class="p-1.5 max-w-xs text-xs">
              <strong class="block text-sm mb-0.5 text-gray-800">${point.name}</strong>
              <p class="text-gray-600 mb-0.5">${point.address}</p>
              <p class="text-gray-500 mb-1.5">Horaires: ${point.hours}</p>
              ${actionButtonHtml}
            </div>`;
  }, [selectedDeparturePoint, selectedArrivalPoint]); // Les dépendances sont correctes


  const requestUserLocation = useCallback((mapInstance: any) => {
    if (!mapInstance) return; // S'assurer que mapInstance existe
    // ... (Reste de la logique identique)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);

          if (selectedDeparturePoint?.lat && selectedDeparturePoint?.lng) {
            mapInstance.setView([selectedDeparturePoint.lat, selectedDeparturePoint.lng], USER_POSITION_ZOOM);
          } else if (latitude && longitude) { // Centrer sur l'utilisateur seulement s'il n'y a pas de départ sélectionné
            mapInstance.setView([latitude, longitude], USER_POSITION_ZOOM);
          } else {
             mapInstance.setView(YAOUNDE_CENTER_FALLBACK, INITIAL_MAP_ZOOM_FALLBACK);
          }


          if (userMarkerRef.current) mapInstance.removeLayer(userMarkerRef.current);
          if(latitude && longitude) { // Ajouter le marqueur utilisateur seulement si la position est valide
            userMarkerRef.current = window.L.marker([latitude, longitude], {
              icon: window.L.divIcon({
                html: `<div class="w-5 h-5 bg-green-600 rounded-full border-2 border-white shadow-xl animate-pulse-green-strong"></div>`,
                className: 'user-location-marker', iconSize: [20, 20], iconAnchor: [10, 10],
              }), zIndexOffset: 1000
            }).addTo(mapInstance).bindPopup("Votre position actuelle").openPopup();
          }

          const nearbyForHighlight = findNearbyPoints([latitude, longitude], yaoundePointsRelaisData, NEARBY_RADIUS_METERS * 2, POINTS_PROCHES_A_FAIRE_CLIGNOTER);
          setNearbyPointsForHighlight(nearbyForHighlight);
          setDisplayedPoints(searchQuery.trim() === '' ? yaoundePointsRelaisData : filterPointsBySearch(yaoundePointsRelaisData, searchQuery));
        },
        (error) => {
            console.warn("Géoloc échouée:", error.message);
            setDisplayedPoints(yaoundePointsRelaisData);
            if (selectedDeparturePoint?.lat && selectedDeparturePoint?.lng) {
                mapInstance.setView([selectedDeparturePoint.lat, selectedDeparturePoint.lng], USER_POSITION_ZOOM);
            } else {
                mapInstance.setView(YAOUNDE_CENTER_FALLBACK, INITIAL_MAP_ZOOM_FALLBACK);
            }
        }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
        setDisplayedPoints(yaoundePointsRelaisData);
        if (selectedDeparturePoint?.lat && selectedDeparturePoint?.lng) {
            mapInstance.setView([selectedDeparturePoint.lat, selectedDeparturePoint.lng], USER_POSITION_ZOOM);
        } else {
            mapInstance.setView(YAOUNDE_CENTER_FALLBACK, INITIAL_MAP_ZOOM_FALLBACK);
        }
    }
  }, [searchQuery, selectedDeparturePoint]); // YAOUNDE_CENTER_FALLBACK et INITIAL_MAP_ZOOM_FALLBACK sont des constantes

  // ... (Les autres useEffect et fonctions restent largement les mêmes)
  // Chargement initial des données depuis localStorage
  useEffect(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_SHIPPING_KEY);
      if (storedDataString) {
        try {
          const storedData: ShippingFormData = JSON.parse(storedDataString);
          setFormData(prev => ({
            ...prev,
            recipientName: storedData.recipientName || '',
            recipientPhone: storedData.recipientPhone || '',
            recipientEmail: storedData.recipientEmail || '',
            departurePointName: storedData.departurePointName || '',
            departurePointId: storedData.departurePointId || null,
            arrivalPointName: storedData.arrivalPointName || '',
            arrivalPointId: storedData.arrivalPointId || null,
          }));
        } catch (error) {
          console.error("Erreur de parsing des données de localStorage:", error);
          localStorage.removeItem(LOCAL_STORAGE_SHIPPING_KEY);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (formData.departurePointId) {
        const departure = yaoundePointsRelaisData.find(p => p.id === formData.departurePointId);
        if (departure) {
            setSelectedDeparturePoint(departure);
            if (!formData.departurePointName && departure.name) {
                setFormData(prev => ({...prev, departurePointName: departure.name}));
            }
        } else {
            setSelectedDeparturePoint(null);
            // Ne pas réinitialiser l'ID ici si on veut permettre de le garder même si le point n'est pas trouvé (ex: données corrompues)
            // mais il vaut mieux le faire pour la cohérence
            if (formData.departurePointId) setFormData(prev => ({...prev, departurePointId: null, departurePointName: ''}));
        }
    } else {
        setSelectedDeparturePoint(null);
    }

    if (formData.arrivalPointId) {
        const arrival = yaoundePointsRelaisData.find(p => p.id === formData.arrivalPointId);
        if (arrival) {
            setSelectedArrivalPoint(arrival);
            if (!formData.arrivalPointName && arrival.name) {
                setFormData(prev => ({...prev, arrivalPointName: arrival.name}));
            }
        } else {
            setSelectedArrivalPoint(null);
            if (formData.arrivalPointId) setFormData(prev => ({...prev, arrivalPointId: null, arrivalPointName: ''}));
        }
    } else {
        setSelectedArrivalPoint(null);
    }
  }, [formData.departurePointId, formData.arrivalPointId, formData.departurePointName, formData.arrivalPointName, setFormData]);


  useEffect(() => {
    const name = formData.recipientName ?? '';
    const phone = formData.recipientPhone ?? '';
    // const email = formData.recipientEmail ?? ''; // Email est optionnel, pas besoin de le valider pour isRecipientFormValid
    setIsRecipientFormValid(
      name.trim().length > 2 &&
      phone.trim().length >= 8
    );
  }, [formData.recipientName, formData.recipientPhone]);


  const initializeMapLogic = useCallback(() => {
    if (!mapRef.current || !window.L || mapInstanceRef.current) return;
    try {
      const newMap = window.L.map(mapRef.current, {
        center: YAOUNDE_CENTER_FALLBACK, zoom: INITIAL_MAP_ZOOM_FALLBACK, zoomControl: false,
      });
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19, minZoom: 10
      }).addTo(newMap);
      window.L.control.zoom({ position: 'topright' }).addTo(newMap); // Contrôle de zoom personnalisé
      mapInstanceRef.current = newMap;
      setIsMapLoading(false);
      requestUserLocation(newMap);
    } catch (error) { console.error('Erreur init carte:', error); setIsMapLoading(false); }
  }, [requestUserLocation]); // YAOUNDE_CENTER_FALLBACK, INITIAL_MAP_ZOOM_FALLBACK sont des constantes

  useEffect(() => {
    let leafletLoaded = !!window.L;
    let routingMachineLoaded = !!(window.L && window.L.Routing);
    const loadScriptsIfNeeded = async () => {
       if (!leafletLoaded) {
        if (!document.querySelector('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]')) { // Utiliser unpkg pour les CDN
          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(leafletCSS);
        }
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletScript.async = true;
        await new Promise<void>(resolve => {
          leafletScript.onload = () => { leafletLoaded = true; resolve(); };
          document.head.appendChild(leafletScript);
        });
      }

      if (leafletLoaded && !routingMachineLoaded) {
        if (!document.querySelector('link[href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"]')) {
          const routingCSS = document.createElement('link');
          routingCSS.rel = 'stylesheet';
          routingCSS.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css';
          document.head.appendChild(routingCSS);
        }
        const routingScript = document.createElement('script');
        routingScript.src = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js';
        routingScript.async = true;
        await new Promise<void>(resolve => {
          routingScript.onload = () => { routingMachineLoaded = true; resolve(); };
          document.head.appendChild(routingScript);
        });
      }
      if (leafletLoaded && routingMachineLoaded) initializeMapLogic();
    };
    if (mapRef.current && !mapInstanceRef.current) loadScriptsIfNeeded();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [initializeMapLogic]);


  // useEffect pour mettre à jour les marqueurs sur la carte
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;

    pointMarkersRef.current.forEach(marker => map.removeLayer(marker));
    pointMarkersRef.current.clear();

    displayedPoints.forEach(point => {
      if (typeof point.lat !== 'number' || typeof point.lng !== 'number') return;
      const isSelected = selectedDeparturePoint?.id === point.id || selectedArrivalPoint?.id === point.id;
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
  }, [displayedPoints, selectedDeparturePoint, selectedArrivalPoint, nearbyPointsForHighlight, getPointIconHtml, createPopupContentForPoint]);


  // useEffect pour gérer les clics sur les boutons dans les popups
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
          const point = yaoundePointsRelaisData.find(p => p.id === pointId);

          if (point) {
            if (action === 'select_departure') {
              setSelectedDeparturePoint(point);
              setFormData(prev => ({ ...prev, departurePointName: point.name, departurePointId: point.id }));
            } else if (action === 'select_arrival') {
              setSelectedArrivalPoint(point);
              setFormData(prev => ({ ...prev, arrivalPointName: point.name, arrivalPointId: point.id }));
            } else if (action === 'deselect_departure') {
              setSelectedDeparturePoint(null);
              setFormData(prev => ({ ...prev, departurePointName: '', departurePointId: null }));
            } else if (action === 'deselect_arrival') {
              setSelectedArrivalPoint(null);
              setFormData(prev => ({ ...prev, arrivalPointName: '', arrivalPointId: null }));
            } else if (action === 'change_departure') {
                setSelectedDeparturePoint(point);
                setSelectedArrivalPoint(null);
                setFormData(prev => ({
                    ...prev,
                    departurePointName: point.name,
                    departurePointId: point.id,
                    arrivalPointName: '',
                    arrivalPointId: null
                }));
            }
            map.closePopup();
          }
        });
      });
    };

    map.on('popupopen', onPopupOpen);
    return () => {
      map.off('popupopen', onPopupOpen);
    };
  }, [setFormData, yaoundePointsRelaisData]); // Simplification des dépendances. Les états (selectedDeparturePoint, etc.) sont utilisés dans la logique interne de onPopupOpen.

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setDisplayedPoints(yaoundePointsRelaisData);
    } else {
      const filtered = filterPointsBySearch(yaoundePointsRelaisData, searchQuery);
      setDisplayedPoints(filtered);
    }
  }, [searchQuery]);


  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && selectedDeparturePoint && selectedArrivalPoint && window.L?.Routing) {
      if (routeControlRef.current) {
        map.removeControl(routeControlRef.current);
      }
      if (typeof selectedDeparturePoint.lat !== 'number' || typeof selectedDeparturePoint.lng !== 'number' ||
          typeof selectedArrivalPoint.lat !== 'number' || typeof selectedArrivalPoint.lng !== 'number') return;

      routeControlRef.current = window.L.Routing.control({
        waypoints: [
          window.L.latLng(selectedDeparturePoint.lat, selectedDeparturePoint.lng),
          window.L.latLng(selectedArrivalPoint.lat, selectedArrivalPoint.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null,
        lineOptions: {
          styles: [{ color: '#16a34a', weight: 5, opacity: 0.8 }]
        },
        show: false,
        fitSelectedRoutes: 'smart'
      }).addTo(map);
    } else if (map && routeControlRef.current) {
      map.removeControl(routeControlRef.current);
      routeControlRef.current = null;
    }
  }, [selectedDeparturePoint, selectedArrivalPoint]);


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecipientFormValid && selectedDeparturePoint && selectedArrivalPoint) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const dataToStore: ShippingFormData = {
          recipientName: formData.recipientName,
          recipientPhone: formData.recipientPhone,
          recipientEmail: formData.recipientEmail,
          departurePointName: selectedDeparturePoint.name,
          departurePointId: selectedDeparturePoint.id,
          arrivalPointName: selectedArrivalPoint.name,
          arrivalPointId: selectedArrivalPoint.id,
        };
        try {
            localStorage.setItem(LOCAL_STORAGE_SHIPPING_KEY, JSON.stringify(dataToStore));
        } catch (error) {
            console.error("Erreur de sauvegarde dans localStorage:", error);
        }
      }
      onNext();
    } else if (!selectedDeparturePoint || !selectedArrivalPoint) {
        alert("Veuillez sélectionner un point de départ et un point d'arrivée.");
    } else {
        alert("Veuillez vérifier les informations du destinataire.");
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'bureau') return Building2;
    if (type === 'commerce') return Store;
    if (type === 'agence') return Package;
    return Package;
  };
  const getTypeColorClasses = (type: string): string => {
    if (type === 'bureau') return 'bg-emerald-100 text-emerald-700';
    if (type === 'commerce') return 'bg-lime-100 text-lime-700';
    if (type === 'agence') return 'bg-teal-100 text-teal-700';
    return 'bg-gray-100 text-gray-700';
  };

  const pageTitle = !selectedDeparturePoint ? "1. Choisissez votre point de départ" :
                   !selectedArrivalPoint ? "2. Choisissez le point d'arrivée" :
                   "3. Informations du destinataire";

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm p-3 z-20 flex-shrink-0">
        {/* ... (JSX de l'header identique) ... */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            <h2 className="text-md sm:text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              {pageTitle}
            </h2>
            {selectedDeparturePoint && (
              <div className="text-xs text-gray-600 mt-0.5 flex items-center flex-wrap">
                <CircleDot size={14} className="mr-1 text-green-600"/>
                <span className="font-medium text-green-700">{selectedDeparturePoint.name}</span>
                {selectedArrivalPoint && <>
                  <ArrowRight size={12} className="mx-1.5 text-gray-500"/>
                  <MapPin size={14} className="mr-1 text-red-600" fill="currentColor"/> {/* MapPin rempli pour arrivée */}
                  <span className="font-medium text-red-700">{selectedArrivalPoint.name}</span>
                </>}
              </div>
            )}
          </div>
          <div className="relative w-full sm:w-auto max-w-xs">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher un relais..." value={searchQuery}
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
          {isMapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center p-4 bg-white rounded-lg shadow-xl">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm">Chargement de la carte...</p>
              </div>
            </div>
          )}
           {mapInstanceRef.current && (
            <button onClick={() => userPosition && mapInstanceRef.current?.setView(userPosition, USER_POSITION_ZOOM)}
              className="absolute bottom-4 right-4 z-10 bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Ma position"
              disabled={!userPosition}
            >
              <Navigation className={`w-5 h-5 ${userPosition ? 'text-green-600' : 'text-gray-400'}`} />
            </button>
          )}
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
              {selectedDeparturePoint && selectedArrivalPoint ? "Infos Destinataire" : "Points Relais Disponibles"}
            </h3>
            <button onClick={() => setIsSidebarVisible(false)} className="sm:hidden p-1 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedDeparturePoint && selectedArrivalPoint && (
              <form onSubmit={handleFormSubmit} className="p-4 space-y-3.5 border-b border-gray-200 custom-scrollbar">
                <p className="text-xs text-gray-500 mb-2">Remplissez ces informations pour finaliser.</p>
                <div>
                  <label htmlFor="recipientName" className="label-form">Nom complet du destinataire <span className="text-red-500">*</span></label>
                  <div className="input-group-form">
                      <User size={16} className="input-icon-form" />
                      <input id="recipientName" type="text" placeholder="Ex: Alima C." value={formData.recipientName} onChange={e => setFormData(p => ({...p, recipientName: e.target.value}))} className="input-form pl-8" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="recipientPhone" className="label-form">Téléphone du destinataire <span className="text-red-500">*</span></label>
                   <div className="input-group-form">
                      <Phone size={16} className="input-icon-form" />
                      <input id="recipientPhone" type="tel" placeholder="Ex: 6XX XXX XXX" value={formData.recipientPhone} onChange={e => setFormData(p => ({...p, recipientPhone: e.target.value}))} className="input-form pl-8" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="recipientEmail" className="label-form">E-mail du destinataire (Optionnel)</label>
                  <div className="input-group-form">
                      <Mail size={16} className="input-icon-form" />
                      <input id="recipientEmail" type="email" placeholder="Ex: email@example.com" value={formData.recipientEmail} onChange={e => setFormData(p => ({...p, recipientEmail: e.target.value}))} className="input-form pl-8" />
                  </div>
                </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs space-y-1">
                      <p className="text-gray-700"><strong className="font-medium text-green-700">Départ :</strong> {selectedDeparturePoint.name}</p>
                      <p className="text-gray-700"><strong className="font-medium text-red-700">Arrivée :</strong> {selectedArrivalPoint.name}</p>
                      {calculateDistance && typeof selectedDeparturePoint.lat === 'number' && typeof selectedArrivalPoint.lat === 'number' && typeof selectedDeparturePoint.lng === 'number' && typeof selectedArrivalPoint.lng === 'number' && (
                        <p className="text-gray-700 flex items-center"><Zap size={12} className="mr-1 text-green-500" /> Distance: ~{calculateDistance(selectedDeparturePoint.lat, selectedDeparturePoint.lng, selectedArrivalPoint.lat, selectedArrivalPoint.lng).toFixed(1)} km</p>
                      )}
                  </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onBack} className="form-button-secondary flex-1">Précédent</button>
                  <button type="submit" disabled={!isRecipientFormValid} className="form-button-primary flex-1 disabled:opacity-60">
                    Suivant <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </form>
            )}

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {!(selectedDeparturePoint && selectedArrivalPoint) && (
                <p className="text-xs text-gray-500 px-1 pb-1 border-b border-dashed">
                  {!selectedDeparturePoint ? `Sélectionnez un point de départ.` : 'Sélectionnez un point d\'arrivée.'}
                  {(!selectedDeparturePoint && nearbyPointsForHighlight.length > 0) && ` ${POINTS_PROCHES_A_FAIRE_CLIGNOTER} relais proches clignotent.`}
                </p>
              )}
              {displayedPoints.length > 0 ? displayedPoints.map(point => {
                const TypeSpecificIcon = getTypeIcon(point.type);
                const isSelectedAsDeparture = selectedDeparturePoint?.id === point.id;
                const isSelectedAsArrival = selectedArrivalPoint?.id === point.id;
                const isSelected = isSelectedAsDeparture || isSelectedAsArrival;

                let itemClasses = `p-2.5 rounded-lg border transition-all duration-150 flex items-start gap-2.5 cursor-pointer `;
                if (isSelectedAsDeparture) itemClasses += 'bg-green-50 border-green-500 shadow-md ';
                else if (isSelectedAsArrival) itemClasses += 'bg-red-50 border-red-500 shadow-md ';
                else itemClasses += 'hover:bg-gray-100 hover:border-gray-300 border-gray-200 ';

                return (
                  <div key={`list-point-${point.id}`}
                    onClick={() => handlePointSelectionOnMapOrList(point)} // Utiliser la fonction unifiée
                    className={itemClasses}
                  >
                    <div className={`mt-0.5 w-8 h-8 shrink-0 rounded-md flex items-center justify-center text-sm 
                                     ${isSelectedAsDeparture ? 'bg-green-600 text-white' : 
                                       isSelectedAsArrival ? 'bg-red-600 text-white' : 
                                       getTypeColorClasses(point.type)}`}>
                      {isSelectedAsDeparture ? <CircleDot size={18} /> : 
                       isSelectedAsArrival ? <MapPin size={18} fill="currentColor"/> :  // MapPin rempli pour arrivée
                       <TypeSpecificIcon size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm truncate ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>{point.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{point.address}</p>
                      <p className="text-xs text-gray-500">Quartier: {point.quartier}</p>
                      {userPosition && typeof point.lat === 'number' && typeof point.lng === 'number' && (
                        <p className="text-xs text-green-600 mt-0.5">~{calculateDistance(userPosition[0], userPosition[1], point.lat, point.lng).toFixed(1)} km</p>
                      )}
                    </div>
                     {!isSelected && (
                        <ChevronRight size={18} className="text-gray-400 self-center shrink-0"/>
                     )}
                  </div>
                );
              }) : <p className="text-center text-gray-500 text-sm py-6">Aucun point relais trouvé.</p>}
            </div>
          </div>
        </aside>
      </div>

      {isSidebarVisible && <div className="fixed inset-0 bg-black/30 z-20 sm:hidden" onClick={() => setIsSidebarVisible(false)}></div>}
      <style jsx global>{`
        .user-location-marker div { animation: pulse-green-strong 1.5s infinite ease-in-out; }
        @keyframes pulse-green-strong {
          0%, 100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
          50% {  transform: scale(1); box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
        }
        .custom-relay-marker .animate-custom-pulse {
            animation: custom-pulse 1.2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
        }
        @keyframes custom-pulse {
            0%   { transform: scale(1); opacity: 1; }
            50%  { transform: scale(1.2) rotate(5deg); opacity: 0.8; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .leaflet-popup-content-wrapper { border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; }
        .leaflet-popup-content { margin: 10px !important; font-size: 13px; line-height: 1.5; }
        .leaflet-popup-content p { margin-bottom: 5px !important; }
        .popup-action-button {
          display: block; width: 100%; padding: 7px 12px; margin-top: 8px !important;
          border: none; border-radius: 6px; color: white; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background-color 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        .label-form { display: block; font-size: 0.8rem; font-weight: 500; color: #374151; margin-bottom: 0.3rem; }
        .input-group-form { position: relative; }
        .input-icon-form { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #9ca3af; }
        .input-form {
            width: 100%; padding: 0.625rem 0.75rem; padding-left: 2.25rem;
            font-size: 0.875rem; color: #1f2937;
            background-color: #f9fafb;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .input-form::placeholder { color: #9ca3af; }
        .input-form:focus {
            outline: none; border-color: #10b981; /* emerald-500 */
            background-color: white;
            box-shadow: 0 0 0 2.5px rgba(16, 185, 129, 0.25);
        }
        .form-button-primary {
            padding: 0.65rem 1.1rem; background-color: #10b981; color: white;
            border-radius: 0.375rem; font-weight: 500; font-size: 0.875rem;
            display: flex; align-items: center; justify-content: center;
            transition: background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
        }
        .form-button-primary:hover:not(:disabled) { background-color: #059669; box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1); }
        .form-button-primary:disabled { background-color: #9ca3af; }
        .form-button-secondary {
            padding: 0.65rem 1.1rem; background-color: white; color: #374151;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem; font-weight: 500; font-size: 0.875rem;
            transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
             box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
        }
        .form-button-secondary:hover { background-color: #f3f4f6; border-color: #9ca3af; }
      `}</style>
    </div>
  );
};

export default RouteSelection;