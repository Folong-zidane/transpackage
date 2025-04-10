'use client';
import React, { useState, useEffect } from 'react';
import { CheckCircle, Package, Truck, Map, Clock, Shield, HelpCircle, ChevronRight, Zap, Users, PlusCircle, Store } from 'lucide-react';
import Head from 'next/head';
import Footer from '@/components/home/Footer';
import { motion } from 'framer-motion';
import Navbar from '@/components/home/Navbar';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  callToAction: string;
  type: 'business' | 'individual';
}

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeTab, setActiveTab] = useState<'business' | 'individual'>('business');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: billingCycle === 'monthly' ? '30 000' : '300 000',
      description: 'Idéal pour les startups et petites entreprises en plein essor',
      features: [
        'Jusqu\'à 1 000 requêtes par mois',
        'Accès à l\'API basique',
        'Support par email',
        'Documentation complète',
        '2 comptes utilisateurs'
      ],
      callToAction: 'Commencer gratuitement',
      type: 'business'
    },
    {
      name: 'Business',
      price: billingCycle === 'monthly' ? '85 000' : '850 000',
      description: 'Pour les entreprises en croissance',
      features: [
        'Jusqu\'à 10 000 requêtes par mois',
        'API complète avec géolocalisation avancée',
        'Support par email et téléphone',
        'Délai de réponse garanti sous 24h',
        '5 comptes utilisateurs'
      ],
      highlight: true,
      callToAction: 'Essai gratuit de 14 jours',
      type: 'business'
    },
    {
      name: 'Enterprise et firme',
      price: 'Sur mesure',
      description: 'Pour les grandes entreprises avec des besoins spécifiques',
      features: [
        'Volume illimité de requêtes',
        'API complète avec fonctionnalités personnalisées',
        'Intégrations personnalisées',
        'Formation et onboarding inclus',
        'Comptes utilisateurs illimités'
      ],
      callToAction: 'Contacter notre équipe',
      type: 'business'
    },
    {
      name: 'Point Relais Basic',
      price: billingCycle === 'monthly' ? '10 000' : '100 000',
      description: 'Pour les particuliers souhaitant devenir point relais',
      features: [
        'Gestion de 50 colis par mois',
        'Application mobile de gestion',
        'Paiement à la livraison',
        'Support par email',
        'commissions présentes'
      ],
      callToAction: 'Devenir point relais',
      type: 'individual'
    },
    {
      name: 'Point Relais Premium',
      price: billingCycle === 'monthly' ? '25 000' : '250 000',
      description: 'Pour les boutiques et commerces',
      features: [
        'Gestion illimitée de colis',
        'Application mobile premium',
        'Paiement à la livraison',
        'Visibilité accrue sur la plateforme',
        'Commissions majorées'
      ],
      highlight: true,
      callToAction: 'Devenir point relais premium',
      type: 'individual'
    },
    {
      name: "Point Relais Pro",
      price: billingCycle === 'monthly' ? '20 000' : '200 000',
      description: "Pour les entreprises souhaitant devenir point relais.",
      features: [
        "Gestion de 150 colis par mois",
        "Application mobile de gestion avancée",
        "Paiement à la livraison",
        "Support par téléphone et email",
        "Commissions avantageuses sur chaque colis"
      ],
      callToAction: "Devenir point relais Pro",
      type: "individual"
    }
  ];

  const benefits = [
    {
      icon: <Map className="h-8 w-8 text-green-600" />,
      title: 'Couverture nationale',
      description: 'Accès à plus de 5 000 points relais dans tout le Cameroun.'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'API haute disponibilité',
      description: 'Temps de réponse rapide et disponibilité 99,9% garantie.'
    },
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: 'Multi-transporteurs',
      description: 'Compatible avec tous les grands réseaux de livraison camerounais.'
    },
    {
      icon: <Zap className="h-8 w-8 text-green-600" />,
      title: 'Intégration facile',
      description: 'Documentation claire et SDKs pour une implémentation rapide.'
    },
    {
      icon: <PlusCircle className="h-8 w-8 text-green-600" />,
      title: 'Revenus supplémentaires',
      description: 'Devenez point relais et générez un revenu additionnel.'
    },
    {
      icon: <Store className="h-8 w-8 text-green-600" />,
      title: 'Visibilité commerciale',
      description: 'Augmentez la fréquentation de votre commerce grâce aux retraits de colis.'
    }
  ];

  const faqs = [
    {
      question: 'Comment fonctionne la facturation ?',
      answer: 'La facturation s\'effectue au début de chaque période (mensuelle ou annuelle). Vous pouvez changer de forfait à tout moment, le montant sera alors calculé au prorata. Nous acceptons les paiements par Mobile Money, Orange Money, carte bancaire et virement bancaire.'
    },
    {
      question: 'Puis-je dépasser mon quota de requêtes mensuelles ?',
      answer: 'Oui, vous pouvez dépasser votre quota. Les requêtes supplémentaires seront facturées selon un tarif dégressif. Contactez-nous pour plus d\'informations sur les tarifs applicables.'
    },
    {
      question: 'Comment intégrer l\'API à mon site e-commerce ?',
      answer: 'Notre API est compatible avec les principales plateformes e-commerce (Shopify, WooCommerce, Magento, PrestaShop). Nous fournissons des plugins et une documentation détaillée pour faciliter l\'intégration. Une équipe technique est disponible pour vous accompagner.'
    },
    {
      question: 'Les données des points relais sont-elles à jour ?',
      answer: 'Oui, nos données sont synchronisées quotidiennement avec les différents réseaux de transporteurs pour garantir des informations précises et à jour.'
    },
    {
      question: 'Comment devenir point relais ?',
      answer: 'Pour devenir point relais, il vous suffit de souscrire à l\'un de nos forfaits dédiés. Vous devrez ensuite remplir un formulaire d\'information, suivre une courte formation en ligne et signer notre charte qualité. Notre équipe vous contactera pour finaliser votre intégration au réseau.'
    },
    {
      question: 'Quelles sont les conditions pour être point relais ?',
      answer: 'Pour être point relais, vous devez disposer d\'un local commercial accessible au public avec des heures d\'ouverture régulières, d\'un smartphone ou d\'une tablette pour utiliser notre application et d\'un espace de stockage sécurisé pour les colis. Vous devez également être en règle avec l\'administration fiscale camerounaise.'
    }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      <Head>
        <title>Tarifs API Point Relais | Cameroun</title>
        <meta name="description" content="Découvrez nos forfaits pour l'API de points relais la plus complète du Cameroun" />
      </Head>

      <div className="bg-white">
        <Navbar/>

        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Ton prix c'est mon prix eh... 😄
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Choisissez le forfait qui correspond à vos besoins et intégrez facilement notre API de points relais à votre plateforme.
          </p>

          {/* Toggle billing cycle */}
          <div className="absolute left-4 top-4 flex flex-col text-gray-800 font-bold">
            <div className="relative bg-gray-100 p-1 rounded-lg inline-flex mb-4">
              <button
                type="button"
                className={`${
                  billingCycle === 'monthly' ? 'bg-white shadow-sm' : 'bg-transparent'
                } relative py-2 px-6 rounded-md text-sm font-medium transition-all duration-200 ease-in-out`}
                onClick={() => setBillingCycle('monthly')}
              >
                Mensuel
              </button>
              <button
                type="button"
                className={`${
                  billingCycle === 'annual' ? 'bg-white shadow-sm' : 'bg-transparent'
                } relative py-2 px-6 rounded-md text-sm font-medium transition-all duration-200 ease-in-out`}
                onClick={() => setBillingCycle('annual')}
              >
                Annuel <span className="text-xs text-green-500 font-bold">-17%</span>
              </button>
            </div>

            {/* Toggle user type */}
            <div className="relative bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                type="button"
                className={`${
                  activeTab === 'business' ? 'bg-white shadow-sm' : 'bg-transparent'
                } relative py-2 px-6 rounded-md text-sm font-medium transition-all duration-200 ease-in-out`}
                onClick={() => setActiveTab('business')}
              >
                Entreprises
              </button>
              <button
                type="button"
                className={`${
                  activeTab === 'individual' ? 'bg-white shadow-sm' : 'bg-transparent'
                } relative py-2 px-6 rounded-md text-sm font-medium transition-all duration-200 ease-in-out`}
                onClick={() => setActiveTab('individual')}
              >
                Devenir Point Relais
              </button>
            </div>
          </div>
        </motion.div>

{/* Pricing Cards */}
<motion.div 
  id="pricing"
  initial="hidden"
  animate="visible"
  variants={staggerContainer}
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
>
  <div className="grid md:grid-cols-3 gap-6">
    {pricingTiers
      .filter(tier => tier.type === activeTab)
      .map((tier) => (
        <motion.div
          key={tier.name}
          variants={fadeIn}
          whileHover={{ y: -5 }}
          className={`rounded-lg shadow-lg overflow-hidden ${
            tier.highlight
              ? 'border-2 border-green-500 transform scale-105 z-10 bg-white'
              : 'border border-gray-200 bg-white'
          }`}
        >
          {tier.highlight && (
            <div className="bg-green-600 text-white text-center py-1 text-xs font-medium">
              Recommandé
            </div>
          )}
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
            <div className="mt-3 flex items-baseline">
              <span className="text-3xl font-extrabold text-gray-900">{tier.price}</span>
              {tier.price !== 'Sur mesure' && (
                <span className="ml-1 text-lg font-medium text-gray-500">
                  FCFA/{billingCycle === 'monthly' ? 'mois' : 'an'}
                </span>
              )}
            </div>
            <p className="mt-2 text-gray-500">{tier.description}</p>

            <ul className="mt-5 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  <span className="ml-2 text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <button
                type="button"
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium ${
                  tier.highlight
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } transition duration-150 ease-in-out transform hover:scale-105`}
              >
                {tier.callToAction}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
  </div>
</motion.div>

        {/* Benefits Section */}
        <motion.div 
          id="benefits"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-white py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Pourquoi choisir notre API de points relais ?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Une solution complète pour intégrer facilement les points relais à votre système de livraison au Cameroun.
              </p>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {benefits.map((benefit) => (
                <motion.div 
                  key={benefit.title} 
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  className="text-center bg-green-50 p-6 rounded-lg shadow-sm"
                >
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-full shadow-sm">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{benefit.title}</h3>
                  <p className="mt-2 text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-green-700 py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-white">5,000+</p>
                <p className="mt-2 text-lg font-medium text-green-100">Points relais</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-extrabold text-white">25M+</p>
                <p className="mt-2 text-lg font-medium text-green-100">Livraisons/an</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-extrabold text-white">99.9%</p>
                <p className="mt-2 text-lg font-medium text-green-100">Disponibilité</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-extrabold text-white">500+</p>
                <p className="mt-2 text-lg font-medium text-green-100">Entreprises</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          id="faq"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gray-50 py-16"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Questions fréquentes
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Vous avez des questions ? Nous avons les réponses.
              </p>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-12 space-y-6"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-green-50 transition-colors">
                      <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      <ChevronRight className="h-5 w-5 text-green-600 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 pt-2 text-gray-600 bg-green-50 animate-fadeIn">{faq.answer}</div>
                  </details>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-white py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Notre réseau de points relais au Cameroun
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Plus de 5 000 points relais répartis dans tout le pays pour une livraison de proximité efficace.
              </p>
            </div>

            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              {/* This would be replaced with an actual map implementation */}
              <div className="absolute inset-0 flex justify-center items-center">
                <Map className="h-16 w-16 text-green-600" />
                <p className="text-gray-600 ml-4">Carte interactive du réseau de points relais</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-green-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Ils nous font confiance
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Des entreprises et des particuliers satisfaits par notre solution.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Client {i}</h3>
                      <p className="text-sm text-gray-500">Entreprise {i}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "L'API de points relais nous a permis d'améliorer significativement notre service de livraison. Nos clients apprécient la flexibilité et la proximité des points de retrait."
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          id="contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-green-700"
        >
          <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Prêt à intégrer notre API de points relais ?
            </h2>
            <p className="mt-4 text-lg leading-6 text-green-100">
              Commencez dès aujourd'hui avec un essai gratuit ou contactez-nous pour une démonstration personnalisée.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center justify-center text-base font-medium text-green-600 hover:bg-green-50"
              >
                Démarrer gratuitement
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-800 border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center justify-center text-base font-medium text-white hover:bg-green-900"
              >
                Contacter l'équipe commerciale
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <Footer/>
      </div>
    </>
  );
};

export default PricingPage;