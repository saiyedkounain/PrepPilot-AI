import axios from 'axios';
import { API_BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem('prep_pilot_user');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore parse errors
    }
  }
  return config;
});

export default axiosInstance;