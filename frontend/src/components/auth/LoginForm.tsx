import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(), // Add rememberMe to the schema
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success('Login successful!');
    } catch (error) {
      // Error is handled by API interceptor
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

      {/* Flex container for Remember Me and Forgot Password */}
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
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md  hover:bg-red-700 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}