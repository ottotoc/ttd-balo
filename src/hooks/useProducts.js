// Custom hook for fetching products from API
import { useState, useEffect } from 'react';
import { products } from '../lib/api';

export function useProducts(params = {}) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await products.getAll(params);
        
        if (isMounted) {
          setData({
            items: result.data?.items || [],
            total: result.data?.pagination?.total || 0,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Error fetching products:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(params)]);

  return { products: data.items, total: data.total, loading, error };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const result = await products.getBySlug(slug);
        
        if (isMounted) {
          setProduct(result.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Error fetching product:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { product, loading, error };
}

