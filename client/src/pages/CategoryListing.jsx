import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import { Loader2, ArrowLeft, SlidersHorizontal, Search, Pill } from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryListing = () => {
  const { name } = useParams();
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [priceRange, setPriceRange] = useState(2000);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  const categoryName = decodeURIComponent(name);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?lang=${lang}`);
        // Filter by category
        const categoryProducts = res.data.filter(p => p.category === categoryName);
        setProducts(categoryProducts);
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName, lang]);

  // Derive unique brands and subCategories from loaded products
  const brands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products]);
  const subCategories = useMemo(() => [...new Set(products.map(p => p.subCategory).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = (product.price || 0) <= priceRange;
      const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
      const matchesSubCategory = selectedSubCategory ? product.subCategory === selectedSubCategory : true;
      
      return matchesSearch && matchesPrice && matchesBrand && matchesSubCategory;
    });
  }, [products, searchQuery, priceRange, selectedBrand, selectedSubCategory]);

  const translateCategory = (cat) => {
    if (!cat) return '';
    const key = `categories.${cat}`;
    const translated = t(key);
    return translated === key ? cat : translated;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{translateCategory(categoryName)}</h1>
          <span className="ml-auto bg-med-light-blue text-med-blue px-4 py-1 rounded-full font-bold text-sm">
            {filteredProducts.length} {t('categories.items')}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg border-b border-gray-100 pb-4">
                <SlidersHorizontal size={20} />
                {t('categories.filters')}
              </div>

              {/* Search */}
              <div className="mb-6 relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={t('categories.searchCategory')} 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-med-blue"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

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

              <button 
                onClick={() => {
                  setSearchQuery('');
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
                <Pill size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('categories.noProducts')}</h3>
                <p className="text-gray-500">{t('categories.adjustFilters')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryListing;
