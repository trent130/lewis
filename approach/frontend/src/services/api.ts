import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

export interface TokenResponse {
  data: { access: any; refresh: any; };
  access: string;
  refresh: string;
}

export interface LoginResponse extends TokenResponse {
  user: User;
  credentials: {
    access: string;
    refresh: string;
  };
}

export interface User {
  user: User | null | undefined;
  id: string;
  email: string;
  username: string;
}

// Create the base API instance
const api = axios.create({
  baseURL: 'https://41f2-102-210-40-102.ngrok-free.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000, // 10 second timeout
});

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If there's no config, we can't retry the request
    if (!originalRequest) {
      return Promise.reject(error);
    }
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
    
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post<TokenResponse>('/users/token/refresh/', {
          refresh: refreshToken
        });

        const { access, refresh } = response.data;
        
        // Update tokens in store
        useAuthStore.getState().setTokens(access, refresh);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Process queued requests
        processQueue(null, access);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<LoginResponse>('/users/login/', credentials);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Login failed';
        toast.error(message);
      }
      throw error;
    }
  },

  register: async (userData: { 
    email: string; 
    password: string; 
    username: string 
  }): Promise<User> => {
    try {
      const { data } = await api.post<User>('/users/register/', userData);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Registration failed';
        toast.error(message);
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/users/logout/');
      useAuthStore.getState().clearTokens();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const { data } = await api.get<User>('/users/me/');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    try {
      const { data } = await api.post<TokenResponse>('/users/token/refresh/', {
        refresh: refreshToken
      });
      return data;
    } catch (error) {
      useAuthStore.getState().logout();
      throw error;
    }
  }
};

export default api;