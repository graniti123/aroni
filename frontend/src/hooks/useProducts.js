import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const loadProducts = async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const combinedFilters = { ...filters, ...newFilters };
      const response = await productsAPI.getProducts(combinedFilters);
      
      if (response.success) {
        setProducts(response.data.products);
        setTotal(response.total);
      } else {
        throw new Error(response.message || 'Failed to load products');
      }
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [JSON.stringify(filters)]);

  return {
    products,
    loading,
    error,
    total,
    refetch: loadProducts
  };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await productsAPI.getProduct(productId);
        
        if (response.success) {
          setProduct(response.data.product);
        } else {
          throw new Error(response.message || 'Failed to load product');
        }
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  return {
    product,
    loading,
    error
  };
};