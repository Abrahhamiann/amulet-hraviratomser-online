import axios from 'axios';

const resolveApiBaseURL = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    try {
      const apiUrl = new URL(configuredUrl);
      const pageHost = typeof window !== 'undefined' ? window.location.hostname : '';
      const isLoopbackApi = ['localhost', '127.0.0.1', '::1'].includes(apiUrl.hostname);
      const isLoopbackPage = ['localhost', '127.0.0.1', '::1'].includes(pageHost);

      if (isLoopbackApi && pageHost && !isLoopbackPage) {
        apiUrl.hostname = pageHost;
        return apiUrl.toString().replace(/\/$/, '');
      }
    } catch {
      return configuredUrl.replace(/\/$/, '');
    }

    return configuredUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }

  return 'http://127.0.0.1:5000/api';
};

const api = axios.create({
  baseURL: resolveApiBaseURL()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
