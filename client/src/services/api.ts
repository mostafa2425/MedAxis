import axios from 'axios';

// Keep local development working even when VITE_API_URL is not defined.
// Vite proxies /api to the local backend (localhost:5000), while production
// can provide the absolute backend URL through VITE_API_URL.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach JWT from localStorage('token') ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        delete (config.headers as Record<string, unknown>)['Content-Type'];
        delete (config.headers as Record<string, unknown>)['content-type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 → redirect to /login ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
