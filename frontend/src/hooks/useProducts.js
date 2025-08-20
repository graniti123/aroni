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
      console.error('Error loading products:', err);
      setError(err.message);
      
      // Fallback to mock data if API fails
      const mockProducts = [
        {
          id: 'mock-1',
          name: 'Elegantes Sommerkleid',
          price: 89.99,
          original_price: 119.99,
          image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU1Njc0NzM3fDA&ixlib=rb-4.1.0&q=85',
          category: 'damen',
          is_on_sale: true,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Weiß', 'Schwarz', 'Navy'],
          description: 'Leichtes Sommerkleid aus atmungsaktivem Stoff, perfekt für warme Tage.'
        },
        {
          id: 'mock-2',
          name: 'Herren Business Hemd',
          price: 65.99,
          image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU1Njc0NzM3fDA&ixlib=rb-4.1.0&q=85',
          category: 'herren',
          is_on_sale: false,
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Weiß', 'Blau', 'Grau'],
          description: 'Klassisches Business-Hemd aus hochwertiger Baumwolle.'
        },
        {
          id: 'mock-3',
          name: 'Designer Handtasche',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1654707636800-a8f0acefaee9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGNhdGFsb2d8ZW58MHx8fHwxNzU1Njc0NzQyfDA&ixlib=rb-4.1.0&q=85',
          category: 'accessoires',
          is_on_sale: false,
          sizes: ['Einheitsgröße'],
          colors: ['Grün', 'Schwarz', 'Braun'],
          description: 'Elegante Handtasche aus echtem Leder mit praktischen Fächern.'
        },
        {
          id: 'mock-4',
          name: 'Sport Sneaker',
          price: 95.99,
          original_price: 125.99,
          image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcHJvZHVjdHN8ZW58MHx8fHwxNzU1Njc0NzQ4fDA&ixlib=rb-4.1.0&q=85',
          category: 'schuhe',
          is_on_sale: true,
          sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
          colors: ['Weiß', 'Schwarz', 'Grau'],
          description: 'Bequeme Sneaker für Sport und Freizeit mit optimaler Dämpfung.'
        }
      ];
      
      // Filter mock products based on current filters
      const combinedFilters = { ...filters, ...newFilters };
      let filteredMockProducts = mockProducts;
      if (combinedFilters.category) {
        filteredMockProducts = mockProducts.filter(p => p.category === combinedFilters.category);
      }
      if (combinedFilters.sale) {
        filteredMockProducts = mockProducts.filter(p => p.is_on_sale);
      }
      
      setProducts(filteredMockProducts);
      setTotal(filteredMockProducts.length);
      setError('API nicht verfügbar - Fallback-Daten angezeigt');
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
        console.error('Error loading product:', err);
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