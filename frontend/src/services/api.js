import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Session management
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('stylehub_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('stylehub_session_id', sessionId);
  }
  return sessionId;
};

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only data part of response
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.detail || error.response.data.message || 'Server error');
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check your connection');
    } else {
      // Other error
      throw new Error('Request failed');
    }
  }
);

// Products API
export const productsAPI = {
  // Get all products with optional filters
  getProducts: (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.sale) params.append('sale', 'true');
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    return api.get(`/products?${params.toString()}`);
  },
  
  // Get single product
  getProduct: (productId) => {
    return api.get(`/products/${productId}`);
  },
  
  // Create product (admin)
  createProduct: (productData) => {
    return api.post('/products', productData);
  },
  
  // Update product (admin)
  updateProduct: (productId, productData) => {
    return api.put(`/products/${productId}`, productData);
  },
  
  // Delete product (admin)
  deleteProduct: (productId) => {
    return api.delete(`/products/${productId}`);
  }
};

// Categories API
export const categoriesAPI = {
  getCategories: () => {
    return api.get('/categories');
  }
};

// Cart API
export const cartAPI = {
  // Add item to cart
  addToCart: (productId, selectedSize, selectedColor, quantity = 1) => {
    return api.post('/cart', {
      session_id: getSessionId(),
      product_id: productId,
      selected_size: selectedSize,
      selected_color: selectedColor,
      quantity: quantity
    });
  },
  
  // Get cart items
  getCart: () => {
    return api.get(`/cart/${getSessionId()}`);
  },
  
  // Update cart item quantity
  updateCartItem: (itemId, quantity) => {
    return api.put(`/cart/${getSessionId()}/item/${itemId}`, {
      quantity: quantity
    });
  },
  
  // Remove item from cart
  removeCartItem: (itemId) => {
    return api.delete(`/cart/${getSessionId()}/item/${itemId}`);
  },
  
  // Clear entire cart
  clearCart: () => {
    return api.delete(`/cart/${getSessionId()}`);
  }
};

// Orders API
export const ordersAPI = {
  // Create order
  createOrder: (customerInfo) => {
    return api.post('/orders', {
      session_id: getSessionId(),
      customer_info: customerInfo
    });
  },
  
  // Get order by ID
  getOrder: (orderId) => {
    return api.get(`/orders/${orderId}`);
  },
  
  // Get orders by session
  getOrdersBySession: () => {
    return api.get(`/orders/session/${getSessionId()}`);
  }
};

// Search API
export const searchAPI = {
  // Search products
  searchProducts: (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters.category) params.append('category', filters.category);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    return api.get(`/search?${params.toString()}`);
  },
  
  // Get search suggestions
  getSuggestions: (query) => {
    return api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
  }
};

// Health check
export const healthAPI = {
  ping: () => api.get('/'),
  healthCheck: () => api.get('/health')
};

export default api;