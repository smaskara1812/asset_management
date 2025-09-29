import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Asset API
export const assetAPI = {
  getAll: () => api.get('/assets/'),
  getById: (id) => api.get(`/assets/${id}/`),
  create: (data) => api.post('/assets/', data),
  update: (id, data) => api.put(`/assets/${id}/`, data),
  delete: (id) => api.delete(`/assets/${id}/`),
  search: (query) => api.get(`/assets/search/?q=${query}`),
  byStatus: (statusId) => api.get(`/assets/by_status/?status_id=${statusId}`),
  byCategory: (categoryId) => api.get(`/assets/by_category/?category_id=${categoryId}`),
};

// Asset Category API
export const categoryAPI = {
  getAll: () => api.get('/categories/'),
  getById: (id) => api.get(`/categories/${id}/`),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.put(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
};

// Asset Status API
export const statusAPI = {
  getAll: () => api.get('/statuses/'),
  getById: (id) => api.get(`/statuses/${id}/`),
  create: (data) => api.post('/statuses/', data),
  update: (id, data) => api.put(`/statuses/${id}/`, data),
  delete: (id) => api.delete(`/statuses/${id}/`),
};


// Location API
export const locationAPI = {
  getAll: () => api.get('/locations/'),
  getById: (id) => api.get(`/locations/${id}/`),
  create: (data) => api.post('/locations/', data),
  update: (id, data) => api.put(`/locations/${id}/`, data),
  delete: (id) => api.delete(`/locations/${id}/`),
};

// Vendor API
export const vendorAPI = {
  getAll: () => api.get('/vendors/'),
  getById: (id) => api.get(`/vendors/${id}/`),
  create: (data) => api.post('/vendors/', data),
  update: (id, data) => api.put(`/vendors/${id}/`, data),
  delete: (id) => api.delete(`/vendors/${id}/`),
  getActive: () => api.get('/vendors/active/'),
};

// Invoice API
export const invoiceAPI = {
  getAll: () => api.get('/invoices/'),
  getById: (id) => api.get(`/invoices/${id}/`),
  create: (data) => api.post('/invoices/', data),
  update: (id, data) => api.put(`/invoices/${id}/`, data),
  delete: (id) => api.delete(`/invoices/${id}/`),
};

// Warranty API
export const warrantyAPI = {
  getAll: () => api.get('/warranties/'),
  getById: (id) => api.get(`/warranties/${id}/`),
  create: (data) => api.post('/warranties/', data),
  update: (id, data) => api.put(`/warranties/${id}/`, data),
  delete: (id) => api.delete(`/warranties/${id}/`),
  getExpiringSoon: (days = 30) => api.get(`/warranties/expiring_soon/?days=${days}`),
};

// Maintenance API
export const maintenanceAPI = {
  getAll: () => api.get('/maintenances/'),
  getById: (id) => api.get(`/maintenances/${id}/`),
  create: (data) => api.post('/maintenances/', data),
  update: (id, data) => api.put(`/maintenances/${id}/`, data),
  delete: (id) => api.delete(`/maintenances/${id}/`),
  getByAsset: (assetId) => api.get(`/maintenances/by_asset/?asset_id=${assetId}`),
};

// Depreciation API
export const depreciationAPI = {
  getAll: () => api.get('/depreciations/'),
  getById: (id) => api.get(`/depreciations/${id}/`),
  create: (data) => api.post('/depreciations/', data),
  update: (id, data) => api.put(`/depreciations/${id}/`, data),
  delete: (id) => api.delete(`/depreciations/${id}/`),
};

// Depreciation Method API
export const depreciationMethodAPI = {
  getAll: () => api.get('/depreciation-methods/'),
  getById: (id) => api.get(`/depreciation-methods/${id}/`),
  create: (data) => api.post('/depreciation-methods/', data),
  update: (id, data) => api.put(`/depreciation-methods/${id}/`, data),
  delete: (id) => api.delete(`/depreciation-methods/${id}/`),
};

// End of Life API
export const endOfLifeAPI = {
  getAll: () => api.get('/end-of-life/'),
  getById: (id) => api.get(`/end-of-life/${id}/`),
  create: (data) => api.post('/end-of-life/', data),
  update: (id, data) => api.put(`/end-of-life/${id}/`, data),
  delete: (id) => api.delete(`/end-of-life/${id}/`),
};

export default api;
