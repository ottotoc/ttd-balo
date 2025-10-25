import { useState, useEffect } from 'react'
import { products } from '../lib/api'

/**
 * Hook to fetch single product by slug
 * @param {string} slug - Product slug
 */
export function useProduct(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await products.getBySlug(slug)
        setProduct(response.data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return { product, loading, error }
}

export default useProduct

