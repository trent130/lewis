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

  const resetPassword = async (email) => {
  try {
    await api.post('/api/auth/reset-password/', { email });
    return true;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to send reset link. Please try again.'
    );
  }
  };

  const register = async (userData) => {
    try {
      console.log('Registration data being sent:', userData);

      const registerResponse = await api.post('/api/auth/register/', {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        user_type: userData.user_type
      });

      console.log('Registration response:', registerResponse.data);

      const loginResponse = await api.post('/api/auth/token/', {
        email: userData.email,
        password: userData.password,
      });

      const { access, refresh, user: newUserData } = loginResponse.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      setUser(newUserData);
      setIsAuthenticated(true);

      return registerResponse.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Registration failed: ';

        if (typeof errorData === 'object') {
          Object.entries(errorData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              errorMessage += `${key}: ${value.join(' ')} `;
            } else if (typeof value === 'string') {
              errorMessage += `${key}: ${value} `;
            }
          });
        } else {
          errorMessage += errorData;
        }

        throw new Error(errorMessage.trim());
      }
      
      throw new Error('An unexpected error occurred during registration.');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    resetPassword,
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


