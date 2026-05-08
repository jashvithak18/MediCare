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

  const categories = [
    'All',
    'Medicines',
    'Baby Care',
    'Skincare',
    'Vitamins & Supplements',
    'Surgical Equipment',
    'Ayurvedic Products',
    'Diabetic Care',
    'Eye/Ear Drops'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
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

  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.brand.toLowerCase().includes(lowerSearch) ||
        p.category.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('nav.medicines')}</h1>
          <p className="text-gray-600 font-semibold">{t('common.visitNote')}</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12 flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('hero.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-med-blue focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <Filter size={20} className="text-gray-400" />
            <select
              className="w-full lg:w-64 py-3 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-med-blue"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-med-blue" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicines;
