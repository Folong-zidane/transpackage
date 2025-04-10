'use client';
import React from "react";

import Navbar from "@/components/home/Navbar";
import Banniere from "@/components/home/Banner";
import Features from "@/components/home/Feautures";
import Testimony from "@/components/home/Testimony";
import Manual from "@/components/home/Manual";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Bannière principale */}
        <Banniere />
        
        {/* Section d'introduction */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Vos colis en de bonnes mains au Cameroun 📦
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              CamerExpress révolutionne l'acheminement de colis au Cameroun avec un vaste réseau de points relais grâce à une
              nouvelle vision de l'adressage au Cameroun... Et le tout au prix de rien.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/achat" 
                className="bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors font-medium text-lg"
              >
                Acheter le Service
              </a>
              <a 
                href="/client-dashboard" 
                className="bg-white border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-full hover:bg-emerald-50 transition-colors font-medium text-lg"
              >
                Devenir point-relais
              </a>
            </div>
          </div>
        </section>

        {/* Nos services */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                🌟 Nos services exceptionnels 🌟
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Découvrez comment CamerExpress transforme l'expérience de reception de colis
              </p>
            </div>
            <Features />
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                🚚 Comment ça marche ? 🚚
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Recevez vos colis partout au Cameroun en 4 étapes simples et rapides
              </p>
            </div>
            <Manual />
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-16 bg-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                💬 Ce que nos clients disent 💬
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Rejoignez les milliers de clients satisfaits à travers le Cameroun
              </p>
            </div>
            <Testimony />
          </div>
        </section>

        {/* Appel à l'action final */}
        <section className="py-16 bg-emerald-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold">
              Prêt à expédier votre premier colis ? 📦
            </h2>
            <p className="mt-4 text-xl max-w-3xl mx-auto">
              Créez votre compte en quelques minutes et commencez à profiter de notre réseau national de points relais !
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="bg-white text-emerald-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium text-lg"
              >
                S'inscrire gratuitement
              </a>
              <a 
                href="/point-de-relais" 
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors font-medium text-lg"
              >
                Créer un point relais
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};