'use client';

import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="text-center space-y-8">
        
        {/* Logo animé */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Titre */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Pick & Drop
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        {/* Barre de progression minimaliste */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-3 font-medium">
            {progress < 30 && "Initialisation..."}
            {progress >= 30 && progress < 70 && "Chargement des données..."}
            {progress >= 70 && progress < 100 && "Finalisation..."}
            {progress === 100 && "Terminé !"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;