/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  // Enable dark mode with a class
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },

        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          primary: '#2563EB',
          secondary: '#4B5563',
        },
        light: {
          bg: '#F3F4F6',
          surface: '#FFFFFF',
          primary: '#2563EB',
          secondary: '#6B7280',
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
  ],
};
