import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) throw new Error('No refresh token');

      const response = await api.post('/api/auth/token/refresh/', {
        refresh: refresh
      });

      const { access } = response.data;
      localStorage.setItem('token', access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      return true;
    } catch (error) {
      handleLogout();
      return false;
    }
  }, [handleLogout]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/user/');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          const response = await api.get('/api/auth/user/');
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      }
    } finally {
      setLoading(false);
    }
  }, [refreshToken, handleLogout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/token/', { email, password });
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout: handleLogout,
    refreshToken,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
