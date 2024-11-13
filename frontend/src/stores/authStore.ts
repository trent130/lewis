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
  sessionId: string | null; // Add sessionId to the state
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
      sessionId: null, // Initialize sessionId

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(data);
          set({
            user: response.user, // Ensure response.user is of type User
            isAuthenticated: true,
            sessionId: response.sessionId,
            isLoading: false,
            error: null
          });
          localStorage.setItem('sessionId', response.sessionId);
          console.log(response.sessionId)
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
            user: response.user, // Ensure response.user is of type User
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          localStorage.setItem('sessionId', response.sessionId);
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
            sessionId: null,
            isLoading: false,
            error: null
          });
          localStorage.removeItem('sessionId');
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
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          try {
            const user = await authApi.getCurrent(); // Ensure this matches your API method
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
            localStorage.removeItem('sessionId'); // Clear session ID if failed
            return false;
          }
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
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
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId
      })
    }
  )
);