// services/api.ts
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

let csrfToken: string | null = null;

api.interceptors.request.use(async (config) => {
  if (!csrfToken) {
    try {
      const { data } = await axios.get('http://127.0.0.1:8000/users/get_csrf/', {
        withCredentials: true,
      });
      csrfToken = data.csrfToken;
    } catch (error) {
      toast.error('Failed to fetch CSRF token');
      return Promise.reject(error);
    }
  }
  config.headers['X-CSRFToken'] = csrfToken;
  return config;
});


// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await api.post('/users/login/', credentials);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: { email: string; password: string; username: string }) => {
    try {
      const { data } = await api.post('/users/register/', userData);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { data } = await api.post('/users/logout/');
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

export default api;