import axios from 'axios';

const resolveApiBaseURL = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    try {
      const apiUrl = new URL(configuredUrl);
      const pageHost = typeof window !== 'undefined' ? window.location.hostname : '';
      const isLoopbackApi = ['localhost', '127.0.0.1', '::1'].includes(apiUrl.hostname);
      if (isLoopbackApi && pageHost) {
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
  baseURL: resolveApiBaseURL(),
  withCredentials: true
});

export default api;
