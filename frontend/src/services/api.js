import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || '';
    const isAuthEndpoint = url.startsWith('/auth/');
    const onAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

    // Only force-redirect for expired/invalid sessions on protected calls.
    // Otherwise login/register errors would reload the page and hide messages.
    if (status === 401 && !isAuthEndpoint && !onAuthPage) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
