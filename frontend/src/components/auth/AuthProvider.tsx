import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/users/me/');
        console.log('User  data:', data); 
        if (data.user) {
          useAuthStore.setState({ 
            user: data.user, 
            isAuthenticated: true 
          });
        }
      } catch (error) {
        console.error('Authentication check failed:', error); 
        useAuthStore.setState({ 
          user: null, 
          isAuthenticated: false 
        });
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}

/* export default function AuthProvider({ children }: AuthProviderProps) {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);*/