// API Configuration
const API_URL = 'http://localhost:5001/api';

// Get auth token from localStorage (user OR admin)
const getToken = () => {
  // Try admin token first (for admin pages)
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) return adminToken;
  
  // Fall back to user token
  return localStorage.getItem('token') || '';
};

// Fetch wrapper with auth
const fetchAPI = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (getToken()) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
};

// ============= PRODUCTS =============
export const getProducts = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  return fetchAPI(`/products?${params.toString()}`);
};

export const getProduct = (slug) => fetchAPI(`/products/${slug}`);

// ============= CATEGORIES =============
export const getCategories = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  return fetchAPI(`/categories?${params.toString()}`);
};

export const getCategory = (slug) => fetchAPI(`/categories/${slug}`);

export const createCategory = (data) =>
  fetchAPI('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateCategory = (id, data) =>
  fetchAPI(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteCategory = (id) =>
  fetchAPI(`/categories/${id}`, {
    method: 'DELETE',
  });

// ============= TAGS =============
export const getAllTags = () => fetchAPI('/tags');

// ============= AUTH =============
export const register = (email, password, phone) =>
  fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, phone }),
  });

export const login = (email, password) =>
  fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// ============= ORDERS =============
export const createOrder = (data) =>
  fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getOrder = (id) => fetchAPI(`/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  fetchAPI(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

// ============= PAYMENT =============
export const createPaymentIntent = (orderId, amount) =>
  fetchAPI('/payment/create-intent', {
    method: 'POST',
    body: JSON.stringify({ orderId, amount }),
  });

// ============= TELEGRAM =============
export const linkTelegram = (code, userId, telegramId) =>
  fetchAPI('/telegram/link', {
    method: 'POST',
    body: JSON.stringify({ code, userId, telegramId }),
  });

// ============= REVIEWS =============
export const getReviews = (productId) => fetchAPI(`/reviews/product/${productId}`);

export const createReview = (data) =>
  fetchAPI('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateReview = (id, data) =>
  fetchAPI(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteReview = (id) =>
  fetchAPI(`/reviews/${id}`, {
    method: 'DELETE',
  });

// ============= ADDRESSES =============
export const getAddresses = () => fetchAPI('/users/me/addresses');

export const createAddress = (data) =>
  fetchAPI('/users/me/addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateAddress = (id, data) =>
  fetchAPI(`/users/me/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteAddress = (id) =>
  fetchAPI(`/users/me/addresses/${id}`, {
    method: 'DELETE',
  });

// ============= CART =============
export const getCart = () => fetchAPI('/cart');

export const addToCart = (item) =>
  fetchAPI('/cart/items', {
    method: 'POST',
    body: JSON.stringify(item),
  });

export const updateCartItem = (item) =>
  fetchAPI('/cart/items', {
    method: 'PUT',
    body: JSON.stringify(item),
  });

export const removeFromCart = (productId) =>
  fetchAPI(`/cart/items/${productId}`, {
    method: 'DELETE',
  });

export const clearCart = () =>
  fetchAPI('/cart', {
    method: 'DELETE',
  });

// ============= ADMIN - PRODUCTS =============
export const createProduct = (data) =>
  fetchAPI('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateProduct = (id, data) =>
  fetchAPI(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteProduct = (id) =>
  fetchAPI(`/admin/products/${id}`, {
    method: 'DELETE',
  });

export const manageProductTags = (productId, action, tags) =>
  fetchAPI(`/admin/products/${productId}/tags`, {
    method: action === 'add' ? 'POST' : 'DELETE',
    body: JSON.stringify({ tags }),
  });

// ============= ADMIN - DASHBOARD =============
export const getAdminDashboard = (period = '30d') =>
  fetchAPI(`/admin/dashboard?period=${period}`);

// ============= ADMIN - ORDERS =============
export const getAdminOrders = (page = 0, limit = 20) =>
  fetchAPI(`/admin/orders?page=${page}&limit=${limit}`);

// ============= ADMIN - PRODUCTS =============
export const getAdminProducts = (page = 0, limit = 20) =>
  fetchAPI(`/admin/products?page=${page}&limit=${limit}`);

// ============= ADMIN - USERS =============
export const getAdminUsers = (page = 0, limit = 20) =>
  fetchAPI(`/admin/users?page=${page}&limit=${limit}`);

// ============= ADMIN - LOGS =============
export const getAdminLogs = (page = 0, limit = 50) =>
  fetchAPI(`/admin/logs?page=${page}&limit=${limit}`);

// ============= CONTENT (Static Data) =============
export const getSpecs = () => fetchAPI('/content/specs');

export const getFaqs = () => fetchAPI('/content/faqs');

export const getTickerItems = () => fetchAPI('/content/ticker');

// ============= UPLOAD =============
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  // Try both user token and admin token
  const token = getToken() || localStorage.getItem('adminToken') || '';
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload Error: ${response.statusText}`);
  }

  return response.json();
};
