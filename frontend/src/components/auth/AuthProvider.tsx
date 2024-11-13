import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    const authenticateUser  = async () => {
      try {
        const isAuthenticated = await checkAuth(); // Use the checkAuth method from the store
        if (isAuthenticated) {
          // Optionally, you can log the user data here if needed
          // const user = useAuthStore.getState().user; // Get the user from the store
          // console.log('User  data:', user);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        toast.error('Failed to authenticate user.'); // Provide feedback to the user
      }
    };

    if (!isAuthenticated) {
      authenticateUser ();
    }
  }, [isAuthenticated, checkAuth]); // Include checkAuth in the dependency array

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