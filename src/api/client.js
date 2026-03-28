// API Configuration
const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token') || '';

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

// Products
export const getProducts = () => fetchAPI('/products');
export const getProduct = (id) => fetchAPI(`/products/${id}`);

// Auth
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

// Orders - Peut être appelé sans authentification
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

// Payment
export const createPaymentIntent = (orderId, amount) =>
  fetchAPI('/payment/create-intent', {
    method: 'POST',
    body: JSON.stringify({ orderId, amount }),
  });

// Telegram
export const linkTelegram = (code, userId, telegramId) =>
  fetchAPI('/telegram/link', {
    method: 'POST',
    body: JSON.stringify({ code, userId, telegramId }),
  });
