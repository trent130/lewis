import { afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import '@testing-library/jest-dom';

interface LoginRequestBody {
  email: string;
  password: string;
}

const server = setupServer(
  http.get('http://127.0.0.1:8000/get_csrf', () => {
    return HttpResponse.json({ csrf_token: 'test-token' });
  }),

  http.post('http://127.0.0.1:8000/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequestBody;

    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({ user: { id: 1, email: body.email } });
    } else if (body.email !== 'test@example.com') {
      // Set the status code directly in the second argument
      return HttpResponse.json({ error: 'Invalid email' }, { status: 401 });
    } else if (body.password !== 'password123') {
      // Set the status code directly in the second argument
      return HttpResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
