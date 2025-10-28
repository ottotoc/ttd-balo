import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cart as cartAPI } from '../lib/api'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await cartAPI.get()
      setCart(result.data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Add item to cart
  const addItem = useCallback(async (productId, variantId = null, quantity = 1) => {
    try {
      await cartAPI.addItem({ productId, variantId, quantity })
      await fetchCart() // Refresh cart data
      return true
    } catch (err) {
      console.error('Error adding to cart:', err)
      throw err
    }
  }, [fetchCart])

  // Update item quantity
  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      await cartAPI.updateItem(itemId, { quantity })
      await fetchCart() // Refresh cart data
      return true
    } catch (err) {
      console.error('Error updating cart item:', err)
      throw err
    }
  }, [fetchCart])

  // Remove item from cart
  const removeItem = useCallback(async (itemId) => {
    try {
      await cartAPI.removeItem(itemId)
      await fetchCart() // Refresh cart data
      return true
    } catch (err) {
      console.error('Error removing from cart:', err)
      throw err
    }
  }, [fetchCart])

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clear()
      await fetchCart() // Refresh cart data
      return true
    } catch (err) {
      console.error('Error clearing cart:', err)
      throw err
    }
  }, [fetchCart])

  // Refresh cart manually (for external triggers)
  const refresh = fetchCart

  const value = {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refresh,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}


