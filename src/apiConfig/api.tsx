import axios from 'axios';

const api = axios.create({
  baseURL: 'https://10.50.31.139:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <-- Esto permite enviar y recibir cookies
});

export default api;