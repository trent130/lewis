import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/auth/LoginForm';
import { useAuthStore } from '../stores/authStore';

// Define the interface for the return type of useAuthStore
interface AuthStore {
  login: (credentials: { email: string; password: string }) => void;
  isLoading: boolean;
}

// Mock the entire authStore module
vi.mock('../stores/authStore', () => ({
  useAuthStore: vi.fn()
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('LoginForm', () => {
  it('validates required fields', async () => {
    // Mock the return value with the defined interface
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: vi.fn(),
      isLoading: false,
    } as AuthStore);

    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockLogin = vi.fn();
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    } as AuthStore);
  
    render(<LoginForm />);
  
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});