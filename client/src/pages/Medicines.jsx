import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import { Search, Filter, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Medicines = () => {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(new URLSearchParams(window.location.search).get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [priceRange, setPriceRange] = useState(2000);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const categories = [
    'All',
    'Medicines',
    'Baby Care',
    'Skin Care',
    'Health Supplements'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?lang=${lang}`);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const brands = React.useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products]);
  const subCategories = React.useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'All') {
      filtered = products.filter(p => p.category === selectedCategory);
    }
    return [...new Set(filtered.map(p => p.subCategory).filter(Boolean))];
  }, [products, selectedCategory]);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }

    if (selectedSubCategory) {
      result = result.filter(p => p.subCategory === selectedSubCategory);
    }

    result = result.filter(p => (p.price || 0) <= priceRange);

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.brand.toLowerCase().includes(lowerSearch) ||
        p.category.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, selectedBrand, selectedSubCategory, priceRange, products]);

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('nav.medicines')}</h1>
          <p className="text-gray-600 font-semibold">{t('common.visitNote')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg border-b border-gray-100 pb-4">
                <Filter size={20} />
                {t('categories.filters')}
              </div>

              {/* Search */}
              <div className="mb-6 relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-med-blue"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('categories.subCategory')}</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-med-blue"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory('');
                  }}
                >
                  {categories.map(c => {
                    const key = `categories.${c}`;
                    const translated = t(key);
                    const displayName = translated === key ? c : translated;
                    return (
                      <option key={c} value={c}>{displayName}</option>
                    );
                  })}
                </select>
              </div>

              {/* Sub Categories */}
              {subCategories.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('categories.subCategory')}</label>
                  <select 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-med-blue"
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                  >
                    <option value="">{t('categories.All Types')}</option>
                    {subCategories.map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('categories.brand')}</label>
                  <select 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-med-blue"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="">{t('categories.All Brands')}</option>
                    {brands.map((brand, i) => (
                      <option key={i} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t('categories.maxPrice')}: ₹{priceRange}
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="2000" 
                  step="10"
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-med-blue"
                />
              </div>

              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setPriceRange(2000);
                  setSelectedBrand('');
                  setSelectedSubCategory('');
                }}
                className="w-full py-2 text-sm font-bold text-med-blue bg-med-light-blue rounded-xl hover:bg-med-blue hover:text-white transition-colors"
              >
                {t('categories.resetFilters')}
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center py-40">
                <Loader2 className="animate-spin text-med-blue" size={48} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('categories.noProducts')}</h3>
                <p className="text-gray-500">{t('categories.adjustFilters')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medicines;
