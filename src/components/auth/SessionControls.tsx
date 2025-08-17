import { useEffect, useState } from 'react';
import { account } from '../../lib/appwrite';
import './session-controls.css';

export default function SessionControls({ onError }: { onError?: (e: unknown) => void } = {}) {
  const [sessionExpiry, setSessionExpiry] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
  }, []);

  const extend = async () => {
    try {
      setLoading(true);
      await account.updateSession('current');
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await account.deleteSession('current');
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('legal');
      window.history.replaceState({}, '', url.toString());
    } catch {}
    window.location.reload();
  };

  return (
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
  );
}
