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

// Function to get CSRF token - Use the configured api instance
const fetchCSRFToken = async () => {
  try {
    const { data } = await api.get('/users/get_csrf/');  // Use api instead of axios
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
};

// Add debug interceptors to track requests and responses
api.interceptors.request.use(
  async (config) => {
    if (!csrfToken) {
      csrfToken = await fetchCSRFToken();
    }
    config.headers['X-CSRFToken'] = csrfToken;
    
    // Debug log
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Debug log
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  async (error) => {
    if (error.response?.status === 403) {
      csrfToken = null;
      try {
        await fetchCSRFToken();
        return api(error.config);
      } catch (retryError) {
        console.error('Failed to refresh CSRF token:', retryError);
      }
    }

    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await api.post('/users/login/', credentials);
      // After successful login, fetch CSRF token again
      await fetchCSRFToken();
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error.response?.data);
      } else {
        console.error('Unexpected login error:', error);
      }
      throw error;
    }
  },

  register: async (userData: { email: string; password: string; username: string }) => {
    try {
      const { data } = await api.post('/users/register/', userData);
      // After successful registration, fetch CSRF token
      await fetchCSRFToken();
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration error:', error.response?.data);
      } else {
        console.error('Unexpected registration error:', error);
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const { data } = await api.post('/users/logout/');
      // Clear CSRF token after logout
      csrfToken = null;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Logout error:', error.response?.data);
      } else {
        console.error('Unexpected logout error:', error);
      }
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data } = await api.get('/users/me/');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // If unauthorized, clear csrf token
          csrfToken = null;
        }
        console.error('Get current user error:', error.response?.data);
      } else {
        console.error('Unexpected getCurrentUser error:', error);
      }
      throw error;
    }
  }
};

export default api;