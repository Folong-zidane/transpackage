import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ArrowUpDown, ChevronDown, X, Check } from 'lucide-react';
import { Slider } from './Slider';

interface FilterSortSectionProps {
  categories: string[];
  priceRange: number[];
  maxPrice: number;
  onFilterChange: (filters: any) => void;
  onSortChange: (sortBy: string) => void;
  totalProducts: number;
}

const FilterSortSection: React.FC<FilterSortSectionProps> = ({
  categories,
  priceRange,
  maxPrice,
  onFilterChange,
  onSortChange,
  totalProducts
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPriceRange, setCurrentPriceRange] = useState<number[]>(priceRange || [0, 1000]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeSortOption, setActiveSortOption] = useState<string>('popularity');
  const [showSortOptions, setShowSortOptions] = useState<boolean>(false);

  const sortOptions = [
    { id: 'popularity', label: 'Popularité' },
    { id: 'priceAsc', label: 'Prix: croissant' },
    { id: 'priceDesc', label: 'Prix: décroissant' },
    { id: 'commission', label: 'Commission' },
    { id: 'discount', label: 'Remise' }
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
        
      onFilterChange({
        category: newCategories,
        inStock: inStockOnly
      });
      
      return newCategories;
    });
  };

  const handlePriceChange = (value: number[]) => {
    const newRange = value;
    setCurrentPriceRange(newRange);
    
    onFilterChange({
      category: selectedCategories,
      inStock: inStockOnly,
      minPrice: newRange[0],
      maxPrice: newRange[1]
    });
  };

  const handleInStockChange = () => {
    setInStockOnly(!inStockOnly);
    
    onFilterChange({
      category: selectedCategories,
      inStock: !inStockOnly
    });
  };

  const handleSortChange = (sortOption: string) => {
    setActiveSortOption(sortOption);
    onSortChange(sortOption);
    setShowSortOptions(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setCurrentPriceRange(priceRange || [0, 1000]);
    setInStockOnly(false);
    
    onFilterChange({
      category: [],
      inStock: false,
      minPrice: priceRange ? priceRange[0] : 0,
      maxPrice: priceRange ? priceRange[1] : 1000
    });
  };

  return (
    <div className="w-full bg-white sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="flex items-center w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-black bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span className="font-medium">Filtres</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </motion.button>
            
            <div className="ml-4 text-sm font-medium">
              {totalProducts} produits trouvés
            </div>
          </div>
          
          <div className="relative w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-black bg-white border border-gray-300 rounded-lg px-4 py-2 w-full md:w-auto hover:bg-gray-50"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              <ArrowUpDown size={18} />
              <span className="font-medium">
                Trier par: {sortOptions.find(opt => opt.id === activeSortOption)?.label}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showSortOptions ? 'rotate-180' : ''}`}
              />
            </motion.button>
            
            <AnimatePresence>
              {showSortOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-full md:w-64 bg-white rounded-lg shadow-lg z-20 overflow-hidden"
                >
                  <div className="p-2">
                    {sortOptions.map(option => (
                      <div
                        key={option.id}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md ${
                          activeSortOption === option.id ? 'bg-[#0033CC]/10 text-[#0033CC]' : ''
                        }`}
                        onClick={() => handleSortChange(option.id)}
                      >
                        {activeSortOption === option.id && (
                          <Check size={16} className="text-[#0033CC]" />
                        )}
                        <span className={activeSortOption === option.id ? 'ml-0' : 'ml-6'}>
                          {option.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-black">Affiner les résultats</h3>
                  <button
                    className="text-sm text-[#0066CC] hover:text-[#0033CC] font-medium flex items-center gap-1"
                    onClick={resetFilters}
                  >
                    <X size={14} />
                    Réinitialiser les filtres
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-2 text-black">Catégories</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {categories && categories.map(category => (
                        <div key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="w-4 h-4 rounded border-gray-300 text-[#0033CC] focus:ring-[#0033CC]"
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-2 text-black">Prix</h4>
                    <div className="px-2">
                      {priceRange && maxPrice && (
                        <Slider
                          defaultValue={[priceRange[0], priceRange[1]]}
                          max={maxPrice}
                          step={1}
                          onValueChange={handlePriceChange}
                          className="mb-6"
                        />
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{currentPriceRange[0]}€</span>
                        <span>{currentPriceRange[1]}€</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div>
                    <h4 className="font-medium mb-2 text-black">Disponibilité</h4>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="in-stock"
                        checked={inStockOnly}
                        onChange={handleInStockChange}
                        className="w-4 h-4 rounded border-gray-300 text-[#0033CC] focus:ring-[#0033CC]"
                      />
                      <label
                        htmlFor="in-stock"
                        className="ml-2 text-sm text-gray-700"
                      >
                        En stock uniquement
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#0033CC] hover:bg-[#0066CC] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setShowFilters(false)}
                  >
                    Appliquer les filtres
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {selectedCategories.length > 0 || inStockOnly ? (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategories.map(category => (
              <div 
                key={category}
                className="bg-[#0033CC]/10 text-[#0033CC] px-3 py-1 rounded-full text-sm font-medium flex items-center"
              >
                {category}
                <button
                  className="ml-2 hover:bg-[#0033CC]/20 rounded-full p-1"
                  onClick={() => handleCategoryToggle(category)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {inStockOnly && (
              <div className="bg-[#0033CC]/10 text-[#0033CC] px-3 py-1 rounded-full text-sm font-medium flex items-center">
                En stock uniquement
                <button
                  className="ml-2 hover:bg-[#0033CC]/20 rounded-full p-1"
                  onClick={handleInStockChange}
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FilterSortSection;