// Custom hook for fetching categories from API
import { useState, useEffect } from 'react';
import { catalog } from '../lib/api';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await catalog.getCategories();
        
        if (isMounted) {
          setCategories(result.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Error fetching categories:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading, error };
}

