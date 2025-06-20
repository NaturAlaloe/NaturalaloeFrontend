import axios from 'axios';

const api = axios.create({
  baseURL: 'https://naturalaloebackend-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <-- Esto permite enviar y recibir cookies
});

export default api;