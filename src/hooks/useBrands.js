// Custom hook for fetching brands from API
import { useState, useEffect } from 'react';
import { catalog } from '../lib/api';

export function useBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await catalog.getBrands();
        
        if (isMounted) {
          setBrands(result.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Error fetching brands:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBrands();

    return () => {
      isMounted = false;
    };
  }, []);

  return { brands, loading, error };
}

