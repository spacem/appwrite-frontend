import { useEffect, useState } from 'react';
import { account } from '../../lib/appwrite';
import './session-controls.css';

export default function SessionControls({ onError, onChange }: { onError?: (e: unknown) => void, onChange?: () => void } = {}) {
  const [sessionExpiry, setSessionExpiry] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const s = await account.getSession('current');
      setSessionExpiry(new Date(s.expire).toLocaleString());
    } catch (e: any) {
      if (e?.code === 401) {
        setSessionExpiry('');
      } else {
        onError?.(e);
      }
    }
  };

  useEffect(() => {
    refresh();
    // Check if user is guest: no email and no phone
    import('../../lib/appwrite').then(({ account }) => {
      account.get().then(u => {
        setIsGuest(!u.email && !u.phone);
      }).catch(e => {
        setIsGuest(false);
        setError('Failed to fetch user: ' + (e?.message || String(e)));
        onError?.(e);
      });
    });
  }, []);

  const extend = async () => {
    setLoading(true);
    try {
      await account.updateSession('current');
      await refresh();
      onChange?.();
    } catch (e: any) {
      setError('Failed to extend session: ' + (e?.message || String(e)));
      onError?.(e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Always check guest status at click time
    let guest = isGuest;
    try {
      const u = await account.get();
      guest = !u.email && !u.phone;
    } catch (e: any) {
      setError('Failed to fetch user: ' + (e?.message || String(e)));
      onError?.(e);
      return;
    }
    if (guest) {
      setShowGuestPrompt(true);
      return;
    }
    try {
      await account.deleteSession('current');
      const url = new URL(window.location.href);
      url.searchParams.delete('legal');
      window.history.replaceState({}, '', url.toString());
      onChange?.();
    } catch (e: any) {
      setError('Failed to logout: ' + (e?.message || String(e)));
      onError?.(e);
    }
    // Do not reload here; only after guest confirms
  };

  const confirmGuestLogout = async () => {
    setShowGuestPrompt(false);
    try {
      await import('../../lib/appwrite').then(({ account }) => account.deleteSession('current'));
      const url = new URL(window.location.href);
      url.searchParams.delete('legal');
      window.history.replaceState({}, '', url.toString());
      onChange?.();
      window.location.reload();
    } catch (e: any) {
      setError('Failed to logout: ' + (e?.message || String(e)));
      onError?.(e);
    }
  };

  return (
    <>
      <div className="card">
        <h3>Session</h3>
        <div className="row spread">
          <span>Expires: {sessionExpiry || '—'}</span>
          <div className="row">
            <button className="btn" onClick={extend} disabled={loading}>Extend</button>
            <button className="btn danger" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
      {showGuestPrompt && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>Warning: Data will be lost</h3>
            </div>
            <div className="modal-body">
              <p>Your guest account and all data will be lost if you logout. To keep your data, set an email or link a social account in Profile Settings.</p>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowGuestPrompt(false)}>Cancel</button>
              <button className="btn danger" onClick={confirmGuestLogout}>Logout Anyway</button>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>Error</h3>
            </div>
            <div className="modal-body">
              <p>{error}</p>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setError(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
