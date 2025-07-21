import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.50.31.139:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token vencido o no válido
      const event = new CustomEvent('tokenExpired');
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default api;