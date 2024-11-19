import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/api/auth/user/');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/api/auth/token/', { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    await checkAuthStatus();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register/', userData);  // Update the endpoint
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;  // Add this line
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
