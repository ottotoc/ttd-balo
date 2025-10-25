// Custom hook for cart management
import { useState, useEffect, useCallback } from 'react';
import { cart as cartApi } from '../lib/api';

export function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await cartApi.get();
      setCart(result.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (productId, variantId = null, quantity = 1) => {
    try {
      await cartApi.addItem({ productId, variantId, quantity });
      await fetchCart(); // Refresh cart
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  }, [fetchCart]);

  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      await cartApi.updateItem(itemId, { quantity });
      await fetchCart(); // Refresh cart
      return true;
    } catch (err) {
      console.error('Error updating cart item:', err);
      throw err;
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId) => {
    try {
      await cartApi.removeItem(itemId);
      await fetchCart(); // Refresh cart
      return true;
    } catch (err) {
      console.error('Error removing from cart:', err);
      throw err;
    }
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    try {
      await cartApi.clear();
      await fetchCart(); // Refresh cart
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      throw err;
    }
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refresh: fetchCart,
  };
}

