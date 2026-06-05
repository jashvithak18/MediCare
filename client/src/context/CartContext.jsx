import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { lang } = useLanguage();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('medicare_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('medicare_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Translate cart items on language change
  useEffect(() => {
    if (cartItems.length === 0) return;
    const fetchTranslatedProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?lang=${lang}`);
        if (!response.ok) return;
        const products = await response.json();
        setCartItems(prevItems => {
          return prevItems.map(item => {
            const matchedProduct = products.find(p => p._id === item._id);
            if (matchedProduct) {
              return {
                ...item,
                name: matchedProduct.name,
                brand: matchedProduct.brand,
                category: matchedProduct.category,
                subCategory: matchedProduct.subCategory
              };
            }
            return item;
          });
        });
      } catch (err) {
        console.error('Failed to translate cart items:', err);
      }
    };
    fetchTranslatedProducts();
  }, [lang]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCartItems(prev => 
      prev.map(item => item._id === id ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setCartItems([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      toggleCart,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

