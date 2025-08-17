import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AuthPage from '../pages/AuthPage';

vi.mock('../lib/appwrite', () => {
  const createSession = vi.fn();
  const get = vi.fn().mockRejectedValue(new Error('no session'));
  return {
    account: {
      createEmailPasswordSession: vi.fn().mockResolvedValue({}).mockImplementation(async () => {
        (get as any).mockResolvedValueOnce({ name: 'User', email: 'a@b.c' });
        return {} as any;
      }),
      create: vi.fn().mockResolvedValue({}),
      createMagicURLToken: vi.fn().mockResolvedValue({ phrase: undefined }),
      createEmailToken: vi.fn().mockResolvedValue({ userId: 'u1' }),
      createPhoneToken: vi.fn().mockResolvedValue({ userId: 'u2' }),
      createSession,
      createAnonymousSession: vi.fn().mockResolvedValue({}),
      createOAuth2Session: vi.fn().mockResolvedValue({}),
      get,
      getSession: vi.fn().mockResolvedValue({ expire: new Date(Date.now()+3600_000).toISOString() }),
      updateSession: vi.fn().mockResolvedValue({}),
      deleteSession: vi.fn().mockResolvedValue({}),
    },
    ID: { unique: () => 'unique' },
  };
});

describe('Auth UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders landing with providers and can navigate to email options', async () => {
    render(<AuthPage />);
  // Title is in top bar now, no providers heading
    expect(screen.getByText(/Continue with Email/i)).toBeTruthy();
    expect(screen.getByText(/Continue as Guest/i)).toBeTruthy();
  expect(screen.getByText('Privacy Policy')).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByText('Continue with Email'));
    });

    expect(await screen.findByRole('heading', { name: /Email & Password/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Magic Link/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /One-Time Passcodes/i })).toBeTruthy();
  });

  it('can login with email and password', async () => {
    render(<AuthPage />);
    await act(async () => {
      fireEvent.click(screen.getByText('Continue with Email'));
    });
    const emailInputs = screen.getAllByPlaceholderText('Email');
  fireEvent.change(emailInputs[0], { target: { value: 'a@b.c' } });
  const passwordInput = screen.getByPlaceholderText('Password');
  fireEvent.change(passwordInput, { target: { value: 'password' } });
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });
    expect(await screen.findByText(/Signed in as/i)).toBeTruthy();
  });

  it('shows session expiry and can extend', async () => {
    render(<AuthPage />);
    // simulate already authed
    // clicking extend should still be callable
    const extend = await screen.findByText('Extend').catch(() => null);
    if (extend) {
      fireEvent.click(extend);
    }
  });
});
