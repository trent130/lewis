import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true
});

// Request interceptor to add CSRF token
api.interceptors.request.use(async (config) => {
  try {
    const { data } = await axios.get('http://127.0.0.1:8000/users/get_csrf/');
    config.headers['X-CSRFToken'] = data.csrfToken;
  } catch (error) {
    toast.error('Failed to fetch CSRF token');
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await api.post('/users/login/', credentials);
    return data;
  },
  register: async (userData: { email: string; password: string; username: string }) => {
    const { data } = await api.post('/users/register/', userData);
    return data;
  },
  logout: async () => {
    const { data } = await api.post('/users/logout/');
    return data;
  }
};

export default api;