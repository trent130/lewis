import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import api from '../../services/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
      .min(8, 'Password must be at least 8 characters'),
      // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      // .regex(/[0-9]/, 'Password must contain at least one number')
      // .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, isLoading } = useAuthStore();
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setValue('email', rememberedEmail);
    }
  }, [setValue]);

  useEffect(() => {
    if (lockoutUntil && new Date() < lockoutUntil) {
      toast.error('Too many login attempts. Please try again later.');
    }
  }, [lockoutUntil]);

  useEffect(() => {
    if (errors.email || errors.password) {
      setAttemptCount(prevCount => prevCount + 1);
      setLockoutUntil(new Date(Date.now() + 30000)); // Lockout for 30 seconds
    }
  }, [errors]);

  useEffect(() => {
    if (attemptCount >= 3) {
      setLockoutUntil(new Date(Date.now() + 60000)); // Lockout for 1 minute
    }
  }, [attemptCount]);

  useEffect(() => {
    if (lockoutUntil && new Date() >= lockoutUntil) {
      setLockoutUntil(null);
      setAttemptCount(0);
    }
  }, [lockoutUntil]);

  useEffect(() => {
    if (isLoading) {
      toast.loading('Logging in...');
    }
  }, [isLoading]);

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf-token');
        const { token } = await response.json();
        api.defaults.headers.common['X-CSRF-Token'] = token;
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        toast.error('Security verification failed. Please refresh the page.');
      }
    };
    getCsrfToken();
  }, []);

  useAuthStore.subscribe((state) => {
    if (state.isAuthenticated) {
      toast.success('Login successful!');
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      if (data.rememberMe) {
        localStorage.setItem('rememberedEmail', data.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      toast.success('Login successful!');
      window.location.href = ('/'); // Redirect to home page or any desired route
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="mx-1 flex items-center">
          <input 
            {...register('rememberMe')}
            type="checkbox"
            className="mr-2 rounded form-checkbox h-4 w-4 text-red-600 rounded focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-700">
            Remember Me
          </label>
        </div>
        <a href="/forgotPassword" className="text-sm text-red-600 hover:underline hover:text-red-500">
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}