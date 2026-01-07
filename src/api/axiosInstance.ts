import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.origin.replace(/\/+$/, '')}/api`
    : 'http://localhost:3000/api');

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb_admin_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


