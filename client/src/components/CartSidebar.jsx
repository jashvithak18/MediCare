import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useCart();
  const { t } = useLanguage();

  const totalAmount = cartItems.reduce((acc, item) => acc + ((item.price || 50) * item.quantity), 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="text-med-blue" />
                {t('cart.title')}
              </h2>
              <button onClick={toggleCart} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  <ShoppingBag size={64} className="opacity-20" />
                  <p>{t('cart.empty')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.imageUrl || `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.brand}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-med-blue">₹{item.price || 50}</span>
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-400 hover:text-red-600 self-start p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-bold">{t('cart.totalAmount')}</span>
                <span className="text-2xl font-bold text-gray-900">₹{totalAmount}</span>
              </div>
              <button 
                disabled={cartItems.length === 0}
                className="w-full bg-med-blue text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  alert(t('cart.checkoutAlert'));
                  toggleCart();
                }}
              >
                {t('cart.checkout')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
