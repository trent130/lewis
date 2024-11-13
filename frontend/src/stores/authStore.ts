import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  username: string;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(data);
          set({ 
            user: response.user, 
            isAuthenticated: true,
            isLoading: false,
            error: null 
          });
          toast.success('Login successful');
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            error: errorMessage 
          });
          toast.error(errorMessage);
          return false;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          set({ 
            user: response.user, 
            isAuthenticated: true,
            isLoading: false,
            error: null 
          });
          toast.success('Registration successful');
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            error: errorMessage 
          });
          toast.error(errorMessage);
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authApi.logout();
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false,
            error: null 
          });
          toast.success('Logged out successfully');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Logout failed';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          toast.error(errorMessage);
        }
      },

      checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.getCurrentUser();
          set({ 
            user, 
            isAuthenticated: true,
            isLoading: false,
            error: null 
          });
          return true;
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false,
            error: 'Authentication failed' 
          });
          return false;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // name of the item in storage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);