import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Your Spring Boot base URL
});


// Add request interceptor for protected routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.public) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;