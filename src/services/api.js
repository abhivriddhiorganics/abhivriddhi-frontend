export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://abhivriddhi-backend.onrender.com';
const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://abhivriddhi-backend.onrender.com/api';

/**
 * Returns the absolute URL for a PDF invoice download.
 * Using absolute URLs prevents Vercel proxy issues.
 */
export const GET_INVOICE_URL = (orderId) => `${BASE_URL}/payment/invoice/${orderId}`;


const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Create headers object
  const headers = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // Only add content-type: application/json if not sending FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  // Check if response is JSON to avoid "Unexpected token <" crash
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Server error (${response.status})`);
    }
    return data;
  } else {
    // If we get here, the server likely returned an HTML error page (e.g. 404/500)
    const errorText = await response.text();
    console.warn('[API] Non-JSON response received:', errorText.substring(0, 200));
    throw new Error(`Server Configuration Error: Received ${contentType || 'text/html'} (Status ${response.status}) instead of JSON.`);
  }
};

export const registerUser = (payload) => request('/auth/register', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const sendOTP = (payload) => request('/auth/send-otp', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const verifyOTP = (payload) => request('/auth/verify-otp', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const loginWithFirebase = (idToken) => request('/auth/firebase/login', {
  method: 'POST',
  body: JSON.stringify({ idToken })
});

export const registerWithFirebase = (payload) => request('/auth/firebase/register', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const resetPasswordWithFirebase = (payload) => request('/auth/firebase/reset', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const loginWithPassword = (payload) => request('/auth/login', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const getCurrentUser = () => request('/auth/me');

export const createOrder = (payload) => request('/payment/checkout', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const verifyPayment = (payload) => request('/payment/verify', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const forgotPassword = (payload) => request('/auth/forgot-password', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const resetPassword = (payload) => request('/auth/reset-password', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const fetchMyOrders = () => request('/payment/my-orders');

// User Profile & Address Management
export const updateProfile = (payload) => request('/users/profile', {
  method: 'PUT',
  body: JSON.stringify(payload)
});

export const fetchAddresses = () => request('/users/addresses');

export const addAddress = (payload) => request('/users/addresses', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const updateAddress = (id, payload) => request(`/users/addresses/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload)
});

export const deleteAddress = (id) => request(`/users/addresses/${id}`, {
  method: 'DELETE'
});

export const deactivateAccount = () => request('/users/deactivate', {
  method: 'PUT'
});

export const deleteAccount = () => request('/users/deactivate', {
  method: 'PUT'
});

// ─── Product Management (Public & Admin) ─────────────────────

export const fetchProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/products?${query}`);
};

export const fetchProductById = (id) => request(`/products/${id}`);

export const adminAddProduct = (payload) => request('/admin/products', {
  method: 'POST',
  body: payload
});

export const adminDeleteOrder = (id) => request(`/admin/orders/${id}`, {
  method: 'DELETE'
});

export const adminUpdateProduct = (id, payload) => request(`/admin/products/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload)
});

export const adminDeleteProduct = (id) => request(`/admin/products/${id}`, {
  method: 'DELETE'
});

export const adminFetchStats = () => request('/admin/stats/advanced');

// ─── WhatsApp & Sub-Admin Management ────────────────────────
export const getWhatsAppStatus = () => request('/admin/whatsapp/status');
export const relinkWhatsApp = () => request('/admin/whatsapp/relink', { method: 'POST' });
export const hardResetWhatsApp = () => request('/admin/whatsapp/hard-reset', { method: 'POST' });
export const fetchSubAdmins = () => request('/admin/sub-admins');
export const createSubAdmin = (payload) => request('/admin/sub-admins', {
  method: 'POST',
  body: JSON.stringify(payload)
});
export const deleteSubAdmin = (id) => request(`/admin/sub-admins/${id}`, {
  method: 'DELETE'
});

// ─── Site Settings ───────────────────────────────────────────
export const fetchSettings = () => request('/admin/settings');
export const updateSettings = (payload) => request('/admin/settings', {
  method: 'PUT',
  body: JSON.stringify(payload)
});

// Default export for unified access (used by Admin components)
const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, data) => request(url, { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' }),
};

export const handoverSetup = (payload) => request('/admin/handover', {
  method: 'POST',
  body: JSON.stringify(payload)
});

export const cleanSlate = (secret) => request('/admin/clean-slate', {
  method: 'POST',
  body: JSON.stringify({ secret })
});

export default api;

