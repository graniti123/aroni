import { useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cartAPI.getCart();
      
      if (response.success) {
        setCartItems(response.data.cart_items || []);
        setCartSummary({
          subtotal: response.data.subtotal || 0,
          shipping: response.data.shipping || 0,
          total: response.data.total || 0
        });
      } else {
        throw new Error(response.message || 'Failed to load cart');
      }
    } catch (err) {
      // If cart is empty or doesn't exist, don't show error
      if (err.message.includes('404') || err.message.includes('not found')) {
        setCartItems([]);
        setCartSummary({ subtotal: 0, shipping: 0, total: 0 });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, selectedSize, selectedColor, quantity = 1) => {
    try {
      setError(null);
      
      await cartAPI.addToCart(productId, selectedSize, selectedColor, quantity);
      await loadCart(); // Reload cart to get updated data
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setError(null);
      
      if (quantity <= 0) {
        await removeCartItem(itemId);
      } else {
        await cartAPI.updateCartItem(itemId, quantity);
        await loadCart();
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      setError(null);
      
      await cartAPI.removeCartItem(itemId);
      await loadCart();
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      
      await cartAPI.clearCart();
      setCartItems([]);
      setCartSummary({ subtotal: 0, shipping: 0, total: 0 });
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    cartItems,
    cartSummary,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    refetchCart: loadCart
  };
};