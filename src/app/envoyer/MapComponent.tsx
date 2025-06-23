'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, Globe2, Pin } from 'lucide-react';

interface MapComponentProps {
  onMapReady: (map: maplibregl.Map) => void;
  initialCenter: [number, number];
  initialZoom: number;
  interactive?: boolean;
  onMapClick?: (coords: { lng: number; lat: number }) => void;
}

const MapComponentMapLibre: React.FC<MapComponentProps> = ({
  onMapReady,
  initialCenter,
  initialZoom,
  interactive = true,
  onMapClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [currentStyle, setCurrentStyle] = useState<'streets' | 'hybrid'>('hybrid');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const clickMarkerRef = useRef<Marker | null>(null);
  const blinkingMarkerRef = useRef<Marker | null>(null);

  // Coordonnées précises de Yaoundé
  const yaundeCenter: [number, number] = [11.5021, 3.8480];
  
  // Utiliser les coordonnées de Yaoundé par défaut si les coordonnées initiales ne sont pas spécifiées
  const mapCenter = initialCenter[0] === 0 && initialCenter[1] === 0 ? yaundeCenter : initialCenter;

  const mapStyles = {
    streets: 'https://api.maptiler.com/maps/streets-v2/style.json?key=YOUR_MAPTILER_KEY',
    hybrid: 'https://api.maptiler.com/maps/hybrid/style.json?key=YOUR_MAPTILER_KEY',
  };

  // Créer un élément de marqueur clignotant
  const createBlinkingMarker = useCallback(() => {
    const el = document.createElement('div');
    el.className = 'blinking-marker';
    el.style.cssText = `
      width: 20px;
      height: 20px;
      background-color: #ff4444;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(255, 68, 68, 0.3);
      animation: blink 1s infinite;
      cursor: pointer;
    `;
    
    // Ajouter les styles d'animation au document si pas déjà présents
    if (!document.querySelector('#blinking-animation-style')) {
      const style = document.createElement('style');
      style.id = 'blinking-animation-style';
      style.textContent = `
        @keyframes blink {
          0%, 50% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.7; transform: scale(1.1); }
          75% { opacity: 0.9; transform: scale(0.95); }
        }
      `;
      document.head.appendChild(style);
    }
    
    return el;
  }, []);

  // Gérer le clic sur la carte
  const handleMapClick = useCallback((e: maplibregl.MapMouseEvent) => {
    if (!mapInstanceRef.current) return;

    const coords = e.lngLat;
    
    // Supprimer l'ancien marqueur clignotant s'il existe
    if (blinkingMarkerRef.current) {
      blinkingMarkerRef.current.remove();
    }

    // Créer un nouveau marqueur clignotant
    const markerElement = createBlinkingMarker();
    const marker = new maplibregl.Marker(markerElement)
      .setLngLat([coords.lng, coords.lat])
      .addTo(mapInstanceRef.current);

    blinkingMarkerRef.current = marker;

    // Supprimer le marqueur après 5 secondes
    setTimeout(() => {
      if (blinkingMarkerRef.current) {
        blinkingMarkerRef.current.remove();
        blinkingMarkerRef.current = null;
      }
    }, 5000);

    // Appeler le callback si fourni
    if (onMapClick) {
      onMapClick(coords);
    }
  }, [onMapClick, createBlinkingMarker]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyles[currentStyle],
        center: mapCenter,
        zoom: Math.max(initialZoom, 12), // Zoom minimum pour bien voir Yaoundé
        interactive: interactive,
        attributionControl: false,
        logoControl: false,
      });

      // Ajouter les contrôles si interactif
      if (interactive) {
        map.addControl(new maplibregl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true
        }), 'top-right');
      }

      // Attendre que la carte soit complètement chargée
      map.on('load', () => {
        mapInstanceRef.current = map;
        setIsMapLoaded(true);
        
        // Centrer sur Yaoundé avec une belle vue
        map.flyTo({
          center: yaundeCenter,
          zoom: 13,
          duration: 2000,
          essential: true
        });

        onMapReady(map);
      });

      // Gérer les clics sur la carte
      if (interactive) {
        map.on('click', handleMapClick);
      }

      // Gérer les erreurs de style
      map.on('error', (e) => {
        console.warn('Erreur de carte, utilisation du style de base:', e);
        // Fallback vers OpenStreetMap si MapTiler échoue
        map.setStyle({
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm'
            }
          ]
        });
      });

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (blinkingMarkerRef.current) {
        blinkingMarkerRef.current.remove();
        blinkingMarkerRef.current = null;
      }
      setIsMapLoaded(false);
    };
  }, []);

  // Changer le style de carte
  const changeMapStyle = useCallback((newStyle: 'streets' | 'hybrid') => {
    if (!mapInstanceRef.current || !isMapLoaded) return;
    
    setCurrentStyle(newStyle);
    
    try {
      if (newStyle === 'hybrid') {
        mapInstanceRef.current.setStyle(mapStyles.hybrid);
      } else {
        mapInstanceRef.current.setStyle(mapStyles.streets);
      }
    } catch (error) {
      console.warn('Erreur lors du changement de style:', error);
    }
  }, [isMapLoaded]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Container de la carte */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Indicateur de chargement */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Chargement de la carte de Yaoundé...</p>
          </div>
        </div>
      )}

      {/* Contrôles de style */}
      {interactive && isMapLoaded && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg flex space-x-2 z-10">
          <button
            onClick={() => changeMapStyle('streets')}
            title="Vue Routes"
            className={`p-2 rounded-md transition-all duration-200 ${
              currentStyle === 'streets' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Layers size={18} />
          </button>
          <button
            onClick={() => changeMapStyle('hybrid')}
            title="Vue Satellite"
            className={`p-2 rounded-md transition-all duration-200 ${
              currentStyle === 'hybrid' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Globe2 size={18} />
          </button>
        </div>
      )}

      {/* Info sur la ville */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10">
        <div className="flex items-center space-x-2">
          <Pin size={16} className="text-red-500" />
          <span className="text-sm font-medium text-gray-800">Yaoundé, Cameroun</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponentMapLibre;