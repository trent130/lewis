// stores/authStore.ts
import { create } from 'zustand';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; username: string }) => Promise<void>;
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
      toast.success('Logged in successfully');
    } catch (error) {
      console.error("Login failed:", error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true });
    try {
      const data = await authApi.register(userData);
      set({ user: data.user, isAuthenticated: true });
      toast.success('Registered successfully');
    } catch (error) {
      console.error("Registration failed:", error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
      set({ user: null, isAuthenticated: false });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      set({ isLoading: false });
    }
  }
}));