import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';
import api from '../services/api';

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
  sessionId: string | null;
  refreshToken: string | null;
  accessToken: string | null;
  lastLogin: Date | null;

  //actions
  login: (data: LoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  setTokens: (access: string, refresh: string) => void;
  updateLastLogin: () => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,
      sessionId: null,
      lastLogin: null,

      setTokens: (access: string, refresh: string) => {
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      },	

      clearTokens: () => {
        set({ accessToken: null, refreshToken: null });
        delete api.defaults.headers.common['Authorization'];
      },

      updateLastLogin: () => {
        set({ lastLogin: new Date() });
      },

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(data);
          const {user, credentials: { access, refresh} } = response;
          
          get().setTokens(access, refresh);
          get().updateLastLogin();

          set({
            user: {
              ...response.user,
              id: Number(response.user.id)
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastLogin: new Date()
          });
          
          toast.success('Login successful');
          return true;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
            accessToken: null,
            refreshToken: null
          });
          toast.error(errorMessage);
          return false;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.register(data);
          const loginResponse = await authApi.login({
            email: data.email,
            password: data.password
          });
          
          const { access, refresh } = loginResponse.credentials;
          get().setTokens(access, refresh);
          get().updateLastLogin();
          set({
            user: {
              id: Number(user.id),
              email: user.email,
              username: user.username
            },
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          // localStorage.setItem('sessionId', response.sessionId);
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
            error: null,
            accessToken: null,
            refreshToken: null
          });
          delete api.defaults.headers.common['Authorization'];
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

      checkAuth: async (): Promise<boolean> => {
        set({ isLoading: true, error: null });
        const refreshToken = get().refreshToken;
        const accessToken = get().accessToken;

        if(!refreshToken || !accessToken) {
          set({ isAuthenticated: false });
          return false;
        }

        if (refreshToken && accessToken) {
          try {
            const response = await authApi.getCurrentUser();
            set({
              user: {
                ...response,
                id: Number(response.id)
              },
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return true;
          } catch (error) {
            try {
              const refreshResponse = await authApi.refreshToken(refreshToken);
              const {access: newAccess, refresh: newRefresh} = refreshResponse.data;
              get().setTokens(newAccess, newRefresh);
              return true;
            } catch (refreshError) {
              get().logout();
              return false;
            }
          }
        }
        return false;
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId,
        refreshToken: state.refreshToken,
        accessToken: state.accessToken,
        lastLogin: state.lastLogin
      })
    }
  )
);