import { defineMiddleware } from 'astro/middleware';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../services/api';

interface RouteConfig {
  path: string;
  requireAuth: boolean;
  roles?: string[];
}

const routeConfigs: RouteConfig[] = [
  { path: '/dashboard', requireAuth: true },
  { path: '/profile', requireAuth: true },
  { path: '/donate', requireAuth: true },
  { path: '/', requireAuth: false },
  { path: '/login', requireAuth: false },
  { path: '/register', requireAuth: false },
  // { path: '/admin', requireAuth: true, roles: ['admin'] }
];

export const onRequest = defineMiddleware(async (context, next) => {
  const currentPath = new URL(context.request.url).pathname;

  // Find matching route configuration
  const routeConfig = routeConfigs.find(config =>
    currentPath.startsWith(config.path)
  );

  // If no route config found, allow request
  if (!routeConfig) {
    return next();
  }

  // Authentication required for this route
  if (routeConfig.requireAuth) {
    try {
      // Get authentication state
      const authStore = useAuthStore.getState();
      const isAuthenticated = authStore.isAuthenticated;

      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        return context.redirect('/login');
      }

      // // Check user roles if specified
      // if (routeConfig.roles) {
      //   const userRole = authStore.user;

      //   if (!userRole || !routeConfig.roles.includes(userRole)) {
      //     // Unauthorized role, redirect to unauthorized page
      //     return context.redirect('/unauthorized');
      //   }
    // }

      // Optional: Refresh token if close to expiration
      // const isTokenExpiringSoon = authStore.isTokenExpiringSoon();
      // if (isTokenExpiringSoon) {
      //   try {
      //     await authApi.refreshToken(authStore.refreshToken);
      //   } catch (error) {
      //     // Token refresh failed, logout user
      //     authStore.logout();
      //     return context.redirect('/login');
      //   }
      // }

    } catch (error) {
    // Handle unexpected errors
    console.error('Authentication middleware error:', error);
    return context.redirect('/login');
  }
}

  return next();
});