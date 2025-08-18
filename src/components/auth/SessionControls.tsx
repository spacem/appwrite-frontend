
import { useEffect, useState } from 'react';
import { account } from '../../lib/appwrite';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';
import './session-controls.css';


export default function SessionControls({ onError, onChange }: { onError?: (e: unknown) => void, onChange?: () => void } = {}) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  const logout = async () => {
    // Try to check guest status, but if forbidden, just proceed to logout
    let guest = isGuest;
    try {
      const u = await account.get();
      guest = !u.email && !u.phone;
    } catch (e: any) {
      // If forbidden, assume guest and proceed
      guest = true;
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
      navigate('/auth', { replace: true });
    } catch (e: any) {
      setError(t('logout.failed') + ': ' + (e?.message || String(e)));
      onError?.(e);
    }
  };

  const confirmGuestLogout = async () => {
    setShowGuestPrompt(false);
    try {
      await import('../../lib/appwrite').then(({ account }) => account.deleteSession('current'));
      const url = new URL(window.location.href);
      url.searchParams.delete('legal');
      window.history.replaceState({}, '', url.toString());
      onChange?.();
      navigate('/auth', { replace: true });
    } catch (e: any) {
      setError(t('logout.failed') + ': ' + (e?.message || String(e)));
      onError?.(e);
    }
  };

  return (
    <>
      <div className="card">
        <button className="btn danger" onClick={logout}>{t('btn.logout')}</button>
      </div>
      {showGuestPrompt && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>{t('logout.guestWarningTitle')}</h3>
            </div>
            <div className="modal-body">
              <p>{t('logout.guestWarningBody')}</p>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowGuestPrompt(false)}>{t('btn.cancel')}</button>
              <button className="btn danger" onClick={confirmGuestLogout}>{t('logout.logoutAnyway')}</button>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>{t('error.title')}</h3>
            </div>
            <div className="modal-body">
              <p>{error}</p>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setError(null)}>{t('btn.close')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
