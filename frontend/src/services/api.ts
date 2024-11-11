import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'https://miniature-train-6w6gqvxrq4v3wqg-8000.app.github.dev/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

const fetchCSRFToken = async (): Promise<string> => {
  // If we already have a CSRF token, return it immediately
  if (csrfToken) return csrfToken;

  // If a promise to fetch the CSRF token is already in progress, return that promise
  if (csrfPromise) return csrfPromise;

  // Create a new promise to fetch the CSRF token
  csrfPromise = new Promise<string>(async (resolve, reject) => {
    try {
      const { data } = await api.get('/users/get_csrf/');
      csrfToken = data.csrfToken;

      // Ensure that csrfToken is not null before resolving
      if (csrfToken) {
        resolve(csrfToken);
      } else {
        reject(new Error("CSRF token is null")); // Handle case where token is null
      }
    } catch (error) {
      csrfPromise = null; // Reset promise on error for future attempts
      reject(error);
    }
  });

  // Return the csrfPromise
  return csrfPromise;
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