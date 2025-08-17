import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AuthPage from '../pages/AuthPage';

vi.mock('../lib/appwrite', () => {
  const mockSession = { expire: new Date(Date.now() + 60_000).toISOString() };
  // user shape mocked per test
  return {
    account: {
      get: vi.fn().mockRejectedValue(new Error('no session')),
      createAnonymousSession: vi.fn().mockResolvedValue({}),
      createEmailPasswordSession: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({}),
      getSession: vi.fn().mockResolvedValue(mockSession as any),
      updateSession: vi.fn().mockResolvedValue({} as any),
      deleteSession: vi.fn().mockResolvedValue({} as any),
      createMagicURLToken: vi.fn().mockResolvedValue({} as any),
      updateMagicURLSession: vi.fn().mockResolvedValue({} as any),
      createEmailToken: vi.fn().mockResolvedValue({ userId: 'u1' }),
      createPhoneToken: vi.fn().mockResolvedValue({ userId: 'u2' }),
      createSession: vi.fn().mockResolvedValue({}),
    },
    ID: { unique: () => 'unique' },
  };
});

describe('AuthPage', () => {
  beforeEach(() => {
    // Ensure clean URL (guard for jsdom limitations)
    try {
      window.history.replaceState({}, '', '/');
    } catch {}
  });

  it('renders and shows user when logged in', async () => {
    const { account } = await import('../lib/appwrite');
    (account.get as any).mockResolvedValueOnce({ name: 'Test User', email: 'test@example.com' });
    render(<AuthPage />);
    expect(await screen.findByText(/Signed in as/i)).toBeTruthy();
  });

  it('can trigger anonymous login', async () => {
  const { account } = await import('../lib/appwrite');
  render(<AuthPage />);
    const btn = await screen.findByText(/Continue as Guest/i);
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(account.createAnonymousSession).toHaveBeenCalled();
  });

  it('can extend session from controls', async () => {
    const { account } = await import('../lib/appwrite');
  (account.get as any).mockResolvedValueOnce({ name: 'Test User', email: 'test@example.com' });
  render(<AuthPage />);
    const extend = await screen.findByText('Extend');
    await act(async () => {
      fireEvent.click(extend);
    });
    expect(account.updateSession).toHaveBeenCalledWith('current');
  });

  it('shows session controls', async () => {
  const { account } = await import('../lib/appwrite');
  (account.get as any).mockResolvedValueOnce({ name: 'Test User', email: 'test@example.com' });
  render(<AuthPage />);
    expect(await screen.findByText(/Session/)).toBeTruthy();
    expect(await screen.findByText(/Expires:/)).toBeTruthy();
  });
});
