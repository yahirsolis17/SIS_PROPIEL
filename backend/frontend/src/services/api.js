// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  // withCredentials: false, // Ya no necesitas cookies
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Interceptor para adjuntar el header Authorization
api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Si 401 y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Pedir un nuevo access con el refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error("No hay refresh token");

        const { data } = await axios.post('http://localhost:8000/api/auth/refresh/', {
          refresh: refreshToken
        });
        // data => { access: "nuevo token" }

        // Guardar el nuevo access en localStorage
        localStorage.setItem('accessToken', data.access);

        // Reintentar la request original con el nuevo access
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        return axios(originalRequest);

      } catch (e) {
        // Si falla, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
