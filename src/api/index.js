import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API-Client erstellen
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor für Token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// API-Endpoints
export const api = {
  // Produkte
  getProducts: () => apiClient.get('/products'),
  getProduct: id => apiClient.get(`/products/${id}`),
  
  // Bestellungen
  createOrder: data => apiClient.post('/orders', data),
  
  // Kontakt
  sendContactMessage: data => apiClient.post('/contact', data),
  
  // Auth
  login: credentials => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.get('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me')
};

export default api;
