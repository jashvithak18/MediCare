import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Pill } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    const message = `Hello MediCare Pharmacy, I want to ask about ${product.name} (${product.brand}). Is it available and what is the price?`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all"
    >
      <div className="w-full h-40 bg-gray-50 rounded-xl mb-6 flex items-center justify-center text-med-blue opacity-50">
        <Pill size={64} />
      </div>

      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-med-blue bg-med-light-blue px-2 py-1 rounded">
            {product.category}
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.available ? t('common.available') : t('common.notAvailable')}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{product.brand}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 italic">"{product.usage}"</p>
      </div>

      <div className="pt-4 border-t border-gray-50 mt-auto">
        <p className="text-[10px] text-gray-400 mb-4 text-center italic">
          {t('common.visitNote')}
        </p>
        <button
          onClick={handleWhatsApp}
          className="w-full bg-med-green text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
        >
          <MessageCircle size={18} />
          {t('buttons.askPharmacist')}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
