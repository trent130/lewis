/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  // Enable dark mode with a class
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0a0a0a',
        },

        // Dark theme colors
        dark: {
          bg: '#000000',
          surface: '#1a1a1a',
          primary: '#ffffff',
          secondary: '#a3a3a3',
          accent: '#737373', // Optional accent
        },

        // Light theme colors
        light: {
          bg: '#ffffff',
          surface: '#f5f5f5',
          primary: '#000000',
          secondary: '#737373',
          accent: '#4b4b4b', // Optional accent
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Menlo', 'monospace'],
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
  ],
};
