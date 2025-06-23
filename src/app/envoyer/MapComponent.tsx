'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, Globe2, Pin } from 'lucide-react'; // Globe2 est plus adapté pour satellite

interface MapComponentProps {
  onMapReady: (map: maplibregl.Map) => void;
  initialCenter: [number, number];
  initialZoom: number;
  interactive?: boolean; // NOUVEAU: Pour rendre la carte cliquable ou non
  onMapClick?: (coords: { lng: number; lat: number }) => void; // NOUVEAU: Callback pour le clic
}

const MapComponentMapLibre: React.FC<MapComponentProps> = ({
  onMapReady,
  initialCenter,
  initialZoom,
  interactive = true, // Par défaut, la carte est interactive
  onMapClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [currentStyle, setCurrentStyle] = useState<'streets' | 'hybrid'>('streets');

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  if (!maptilerKey) {
    return <div className="error-container">Clé API Maptiler manquante.</div>;
  }
  
  // NOUVEAU: Utilisation du style "Hybrid" pour la vue satellite
  const mapStyles = {
    streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${maptilerKey}`,
    hybrid: `https://api.maptiler.com/maps/hybrid/style.json?key=${maptilerKey}`,
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyles[currentStyle],
        center: initialCenter,
        zoom: initialZoom,
        interactive: interactive, // Utilise la prop
      });
      
      if (interactive) {
        map.addControl(new maplibregl.NavigationControl({}), 'top-right');
      }
      
      map.on('load', () => {
        mapInstanceRef.current = map;
        onMapReady(map);
      });

      // NOUVEAU: Gérer les clics sur la carte si la fonction est fournie
      if (onMapClick) {
        map.on('click', (e) => {
          onMapClick(e.lngLat);
        });
      }
    }

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [interactive, onMapClick, onMapReady, initialCenter, initialZoom, currentStyle, mapStyles]);

  useEffect(() => {
    mapInstanceRef.current?.setStyle(mapStyles[currentStyle]);
  }, [currentStyle, mapStyles]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full cursor-pointer" />
      
      {interactive && (
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-lg flex space-x-1 z-10">
          <button onClick={() => setCurrentStyle('streets')} title="Vue Rues" className={`p-2 rounded-md transition-colors ${currentStyle === 'streets' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 text-gray-600'}`}>
            <Layers size={18} />
          </button>
          <button onClick={() => setCurrentStyle('hybrid')} title="Vue Satellite" className={`p-2 rounded-md transition-colors ${currentStyle === 'hybrid' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 text-gray-600'}`}>
            <Globe2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponentMapLibre;