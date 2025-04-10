import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Tag, MessageCircle, Megaphone, Truck } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  imageUrl: string;
  rating: number;
  commission: number;
  inStock: boolean;
  deliveryTime?: string;
}

interface Filters {
  category: string[];
  inStock: boolean;
  minCommission: number;
  maxCommission: number;
  deliveryTime: string[];
}

interface ProductGridProps {
  products: Product[];
  filters: Filters;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, filters }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(25); // Nombre initial de produits visibles

  useEffect(() => {
    // Pas besoin de filtrer à nouveau, les produits sont déjà filtrés dans le composant parent
    setFilteredProducts(products);
  }, [products]);

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Fonction pour afficher plus de produits
  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 4); // Ajoute 4 produits à chaque clic
  };

  return (
    <div className="w-full px-8"> {/* Ajout de marges extérieures gauche et droite */}
      {/* Grille de produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6"> {/* Exactement 4 colonnes en lg et espacement augmenté */}
        {filteredProducts.slice(0, visibleProducts).map((product) => (
          <motion.div
            key={product.id}
            className="bg-gradient-to-b from-gray-200 to-blue-100 rounded-lg shadow-lg overflow-hidden transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="relative h-40 w-full overflow-hidden">
              {product.discount && (
                <div className="absolute top-2 left-2 bg-blue-800 text-white px-2 py-1 rounded text-xs font-medium z-10">
                  {product.category}
                </div>
              )}
              
              {!product.inStock && (
                <div className="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold z-10">
                  Épuisé
                </div>
              )}
              
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                {product.imageUrl ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={product.imageUrl}
                      alt={product.title}
                      className="object-cover w-full h-full transition-transform duration-500"
                      style={{
                        transform: hoveredProduct === product.id ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Image non disponible</span>
                )}
              </div>
              
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
              
              <div 
                className={`absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center transition-transform duration-300 ${
                  hoveredProduct === product.id ? 'translate-y-0' : 'translate-y-full'
                }`}
              >
                <button className="bg-white/80 hover:bg-white p-2 rounded-full text-[#0033CC] transition-all">
                  <Heart size={14} />
                </button>
                <button className="bg-[#0033CC] hover:bg-[#0066CC] p-2 rounded-full text-white transition-all">
                  <ShoppingCart size={14} />
                </button>
                <button className="bg-white/80 hover:bg-white p-2 rounded-full text-[#0033CC] transition-all">
                  <Eye size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-4"> {/* Padding augmenté */}
              <div className="flex items-center mb-1">
                <span className="text-sm text-[#0066CC] font-bold mr-1 truncate max-w-[70%]">
                <h3 className="text-sm font-bold text-black truncate">{product.title}</h3>
                </span>
                <div className="flex items-center ml-auto">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-sm text-gray-600 ml-0.5">{product.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-col">
                  {product.discount && (
                    <span className="text-sm text-gray-800 font-medium">
                      {formatPrice(product.originalPrice || product.price)} FCFA
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm font-medium text-blue-800">
                  <Tag size={12} className="mr-1" />
                  <span className="text-sm">{product.commission}%</span>
                </div>
              </div>
              
              {product.deliveryTime && (
                <div className="mt-1 text-sm text-gray-500">
                  Livraison: {product.deliveryTime}
                </div>
              )}
            </div>

            {/* Boutons Acheter et Marchander - avec plus d'espace et taille augmentée */}
            <div className="p-4 flex justify-between gap-3"> {/* Padding et gap augmentés */}
              <Link href='/point-de-relais' >
              <button title='acheter' className="flex items-center justify-center w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-[#0066CC] transition-colors">
                <Truck size={18} className="font-bold mr-2" />
                <span>Me faire livrer</span>
              </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bouton "Voir plus" */}
      {visibleProducts < filteredProducts.length && (
        <div className="flex justify-center mt-10 mb-8"> {/* Marges augmentées */}
          <button
            onClick={handleLoadMore}
            className="bg-[#0033CC] text-white px-8 py-3 rounded-full hover:bg-[#0066CC] transition-colors text-sm"
          >
            Voir plus
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;