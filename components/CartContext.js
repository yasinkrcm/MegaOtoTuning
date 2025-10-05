'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isLoading = loading;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isLoading) return;

    try {
      if (isAuthenticated && user?._id) {
        const userKey = `cart_${user._id}`;
        const savedCart = localStorage.getItem(userKey);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('localStorage okuma hatası:', error);
      setCart([]);
    }
  }, [user, isAuthenticated, isLoading]);

  useEffect(() => {
    if (isLoading || !user?._id) return;

    try {
      const userKey = `cart_${user._id}`;
      localStorage.setItem(userKey, JSON.stringify(cart));
    } catch (error) {
      console.error('localStorage yazma hatası:', error);
    }
  }, [cart, user, isLoading]);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!isAuthenticated || !user?._id) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      try {
        if (router && typeof router.push === 'function') {
          router.push('/login?callbackUrl=' + encodeURIComponent(currentPath));
        } else if (typeof window !== 'undefined') {
          window.location.href = '/login?callbackUrl=' + encodeURIComponent(currentPath);
        }
      } catch (routerError) {
        console.error('Router error:', routerError);
        if (typeof window !== 'undefined') {
          window.location.href = '/login?callbackUrl=' + encodeURIComponent(currentPath);
        }
      }
      return;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => 
        item.productId === product._id
      );
      
      if (existingIndex >= 0) {
        // Ürün zaten sepette varsa, sadece quantity'yi artır
        return prevCart.map((item, index) => 
          index === existingIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Yeni ürün ekle
      return [
        ...prevCart,
        {
          productId: product._id,
          productName: product.productName || product.name || 'Bilinmeyen Ürün',
          imageUrl: product.imageUrl,
          price: product.price,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
  }, [isAuthenticated, user?._id, router]);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        toggleCart,
        setIsCartOpen: useCallback((value) => setIsCartOpen(value), []),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
