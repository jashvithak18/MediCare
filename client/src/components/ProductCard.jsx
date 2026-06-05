import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Pill, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const translateCategory = (cat) => {
    if (!cat) return '';
    const key = `categories.${cat}`;
    const translated = t(key);
    return translated === key ? cat : translated;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all relative overflow-hidden"
    >
      <div className="w-full h-48 bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full mix-blend-multiply" />
        ) : (
          <Pill size={64} className="text-med-blue opacity-50" />
        )}
      </div>

      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-med-blue bg-med-light-blue px-2 py-1 rounded">
            {translateCategory(product.category)}
          </span>
          {product.subCategory && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.subCategory}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        <p className="text-xs text-gray-600 line-clamp-2 italic mb-4 flex-grow">{product.description || product.usage}</p>
        
        <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-bold uppercase">{t('common.price')}</span>
            <span className="text-xl font-bold text-med-blue">₹{product.price || Math.floor(Math.random() * 500) + 50}</span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="bg-med-blue text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ShoppingCart size={16} />
            {t('common.add')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

