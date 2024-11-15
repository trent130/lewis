import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}