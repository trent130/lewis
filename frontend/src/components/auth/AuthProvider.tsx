import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const authenticateUser = async () => {
      console.log('Authenticating user...');
      try {
        // const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
          // Success case - no need for empty block
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast.error('Unable to verify your login status. Please try again.');
      }
    };

    if (!isAuthenticated) {
      authenticateUser();
    }
  }, [isAuthenticated, checkAuth]);

  return <>{children}</>;
}