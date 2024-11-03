import { create } from 'zustand';
import { authApi } from '../services/api';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const data = await authApi.login(credentials);
      set({ user: data.user, isAuthenticated: true });
    } catch (error) {

      console.error("Login failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true });
    try {
      const data = await authApi.register(userData);
      set({ user: data.user, isAuthenticated: true });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  }
}));

