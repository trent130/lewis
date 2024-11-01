import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/Buttons';

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Lewis Paul Foundation</span>
            </a>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.name}</span>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-x-4">
                <a href="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </a>
                <a href="/register" className="text-gray-700 hover:text-gray-900">
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}