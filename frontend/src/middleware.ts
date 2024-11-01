import { defineMiddleware } from 'astro/middleware';
import { useAuthStore } from './stores/authStore';

export const onRequest = defineMiddleware(async (context, next) => {
  const protectedPaths = ['/dashboard', '/profile', '/donate'];
  const publicPaths = ['/', '/login', '/register'];
  
  const currentPath = new URL(context.request.url).pathname;
  const isProtectedRoute = protectedPaths.some(path => currentPath.startsWith(path));
  const isPublicRoute = publicPaths.includes(currentPath);

  if (isProtectedRoute) {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    
    if (!isAuthenticated) {
      return context.redirect('/login');
    }
  }

  return next();
});