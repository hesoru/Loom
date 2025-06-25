import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Products API
export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add any filters to the query params
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// This function has been removed as it's a duplicate of the one below

export const searchProducts = async (query) => {
  try {
    const params = new URLSearchParams({ q: query });
    const response = await api.get('/products/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const getProductAttributes = async (productId) => {
  try {
    console.log(productId);
    const response = await api.get(`/products/${productId}/attributes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching attributes for product ${productId}:`, error);
    throw error;
  }
};

// Categories API
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryName) => {
  try {
    console.log('Fetching products for category:', categoryName);
    // Properly encode the category name for the URL
    const encodedCategoryName = encodeURIComponent(categoryName);
    
    // Try the new categories endpoint first
    try {
      const response = await api.get(`/categories/${encodedCategoryName}/products`);
      return response.data;
    } catch (firstError) {
      console.log('Falling back to legacy endpoint');
      // Fall back to the original endpoint if the first one fails
      const response = await api.get(`products/category/${encodedCategoryName}`);
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching products for category ${categoryName}:`, error);
    throw error;
  }
};

// Shopping Cart API
export const getCart = async (sessionId) => {
  try {
    const response = await api.get(`/cart/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const createCart = async () => {
  try {
    const response = await api.post('/cart');
    return response.data;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
};

export const addToCart = async (sessionId, productAttributePriceId, quantity = 1) => {
  try {
    console.log('Adding to cart:', { sessionId, productAttributePriceId, quantity });
    const response = await api.post(`/cart/${sessionId}/items`, {
      productAttributePriceId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (sessionId, itemId, updateData) => {
  try {
    console.log('Updating cart item:', { sessionId, itemId, updateData });
    // Make sure we're sending the quantity as a number
    const quantity = parseInt(updateData.quantity, 10);
    const response = await api.put(`/cart/${sessionId}/items/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (sessionId, itemId) => {
  try {
    const response = await api.delete(`/cart/${sessionId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

// Orders API
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Admin API
export const getAllCarts = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching all carts:', error);
    throw error;
  }
};

// Auth API
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export default api;
