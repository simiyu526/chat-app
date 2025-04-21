import axios from 'axios';
import { getToken } from './auth';

const API = axios.create({
  baseURL: 'https://chatbackend-jtib.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
