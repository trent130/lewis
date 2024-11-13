import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

interface User {
  id: number;
  username: string;
  email: string;
  // Add other fields as necessary
}

const api = axios.create({
  // baseURL: 'https://miniature-train-6w6gqvxrq4v3wqg-8000.app.github.dev/',
  baseURL: 'https://84fe-102-210-40-102.ngrok-free.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

const fetchCSRFToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken || '';  // Return an empty string if null
  if (csrfPromise) return csrfPromise;

  csrfPromise = new Promise<string>(async (resolve, reject) => {
    // Increase timeout duration
    const timeout = setTimeout(() => {
      console.error('CSRF Token Fetch Timeout Details:', {
        csrfToken,
        csrfPromise: !!csrfPromise
      });
      reject(new Error('Fetching CSRF token timed out'));
    }, 10000); // Increased to 10 seconds

    try {
      console.log('Attempting to fetch CSRF token...');

      // Use a direct axios call to eliminate any potential interceptor issues
      const response = await axios.get('https://84fe-102-210-40-102.ngrok-free.app/users/get_csrf/', {
        withCredentials: true,
        timeout: 8000, // Axios request timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('CSRF Token Fetch Response:', {
        status: response.status,
        data: response.data
      });

      clearTimeout(timeout);

      // Validate the response
      if (response.data && response.data.csrfToken) {
        csrfToken = response.data.csrfToken;
        resolve(csrfToken as string);
      } else {
        throw new Error('Invalid CSRF token response');
      }
    } catch (error) {
      clearTimeout(timeout);
      csrfPromise = null;

      // Detailed error logging
      console.error('Comprehensive CSRF Token Fetch Error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        isAxiosError: axios.isAxiosError(error),
        errorResponse: axios.isAxiosError(error) ? {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        } : null
      });

      reject(error);
    }
  });

  return csrfPromise;
};


// Modify the request interceptor to be more resilient
// In the request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      console.log('Preparing request:', config.url);

      if (!csrfToken) {
        console.log('CSRF token not found. Fetching...');
        try {
          csrfToken = await fetchCSRFToken();
          console.log('CSRF token successfully fetched:', csrfToken);
        } catch (fetchError) {
          console.error('Failed to fetch CSRF token:', fetchError);
          // Reject the request if CSRF token cannot be fetched
          return Promise.reject(new Error('CSRF token is required for this request.'));
        }
      }

      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  }
);

// In the response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const status = error.response?.status;
//     if (status === 401 || status === 403) {
//       csrfToken = null;  // Reset CSRF if unauthorized
//       try {
//         await fetchCSRFToken();
//         return api(error.config);  // Retry the request with new CSRF
//       } catch (retryError) {
//         return Promise.reject(retryError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

let retryCount = 0; // Initialize a retry counter
const MAX_RETRIES = 1; // Set a maximum number of retries

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // Log the original request for debugging
    console.error('Original request:', error.config);

    if (status === 401 || status === 403) {
      // Reset CSRF if unauthorized
      csrfToken = null;  

      // Check if we have exceeded the maximum number of retries
      if (retryCount < MAX_RETRIES) {
        retryCount++; // Increment the retry counter
        try {
          await fetchCSRFToken(); // Fetch a new CSRF token
          console.log('Fetched new CSRF token:', csrfToken);
          return api(error.config);  // Retry the request with new CSRF
        } catch (retryError) {
          console.error('Error fetching new CSRF token:', retryError);
          // Handle the case where fetching the CSRF token fails
          return Promise.reject(retryError);
        }
      } else {
        // If retries are exhausted, clear session data and redirect to login
        console.warn('Maximum retries reached. Redirecting to login.');
        useAuthStore.getState().logout(); // Call your logout function
        window.location.href = '/login'; // Redirect to login page
      }
    }

    // Log other types of errors
    console.error('API Error:', error.response?.data);
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
        toast.error('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
      } else {
        console.error('Unexpected login error:', error);
        toast.error('An unexpected error occurred');
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

  getCurrent: async (): Promise<User> => {
    const { sessionId } = useAuthStore.getState();

    try {
      if (!csrfToken) {
        csrfToken = await fetchCSRFToken();
      }

      const { data } = await api.get('/users/me/', {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${sessionId}`
        }
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          csrfToken = null;
        }
        console.error('Get current user error:', error.response?.data);
      } else {
        console.error('Unexpected getCurrentUser  error:', error);
      }
      throw error;
    }
  }
};

export default api;