import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/auth/LoginForm';
import { useAuthStore } from '../stores/authStore';

vi.mock('../stores/authStore');

afterEach(() => {
  vi.clearAllMocks();
});

describe('LoginForm', () => {
  it('validates required fields', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockLogin = vi.fn();
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });

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
