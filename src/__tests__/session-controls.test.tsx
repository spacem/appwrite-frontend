import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SessionControls from '../components/auth/SessionControls';

vi.mock('../lib/appwrite', () => {
  let isGuest = true;
  return {
    account: {
      get: vi.fn().mockImplementation(() => isGuest ? Promise.resolve({ labels: ['anonymous'] }) : Promise.resolve({ labels: [] })),
      getSession: vi.fn().mockResolvedValue({ expire: new Date(Date.now()+3600_000).toISOString() }),
      updateSession: vi.fn().mockResolvedValue({}),
      deleteSession: vi.fn().mockResolvedValue({}),
    },
    setGuest: (v: boolean) => { isGuest = v; },
  };
});

describe('SessionControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows guest logout warning modal and cancels', async () => {
    render(<SessionControls />);
    const logoutBtn = await screen.findByText('Logout');
    await act(async () => {
      fireEvent.click(logoutBtn);
    });
  expect((await screen.findAllByText(/data will be lost/i)).length).toBeGreaterThan(0);
    // Cancel
    await act(async () => {
      fireEvent.click(screen.getByText('Cancel'));
    });
  expect(screen.queryAllByText(/data will be lost/i)).toHaveLength(0);
  });

  it('shows guest logout warning modal and confirms', async () => {
    render(<SessionControls />);
    const logoutBtn = await screen.findByText('Logout');
    await act(async () => {
      fireEvent.click(logoutBtn);
    });
  expect((await screen.findAllByText(/data will be lost/i)).length).toBeGreaterThan(0);
    // Confirm
    await act(async () => {
      fireEvent.click(screen.getByText('Logout Anyway'));
    });
    // Modal should disappear (simulate reload)
  expect(screen.queryAllByText(/data will be lost/i)).toHaveLength(0);
  });

  it('does not show guest warning for non-guest', async () => {
    // Switch to non-guest
    const { setGuest } = await import('../lib/appwrite');
  setGuest();
    render(<SessionControls />);
    const logoutBtn = await screen.findByText('Logout');
    await act(async () => {
      fireEvent.click(logoutBtn);
    });
    // Modal should not appear
    expect(screen.queryByText(/data will be lost/i)).toBeNull();
  });
});
