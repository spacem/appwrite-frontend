import { useState, useEffect } from 'react';
import { account } from '../../lib/appwrite';

export default function PasswordResetModal({ email, onClose, onSuccess }: { email: string, onClose: () => void, onSuccess: () => void }) {
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [secret, setSecret] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // Step 1: Request reset
  const requestReset = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use current window location as redirect
      await account.createRecovery(email, window.location.href);
      setNotice('Check your email for a reset link.');
      setStep('confirm');
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm reset
  const confirmReset = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!newPassword || newPassword !== confirm) {
        setError('Passwords do not match');
        return;
      }
      await account.updateRecovery(userId, secret, newPassword);
      setNotice('Password updated. You can now log in.');
      onSuccess();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  // Listen for userId/secret in URL
  useEffect(() => {
    const u = new URL(window.location.href);
    const uid = u.searchParams.get('userId');
    const sec = u.searchParams.get('secret');
    if (uid && sec) {
      setUserId(uid);
      setSecret(sec);
      setStep('confirm');
      // Clean params
      u.searchParams.delete('userId');
      u.searchParams.delete('secret');
      window.history.replaceState({}, '', u.toString());
    }
  }, []);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>Reset Password</h3>
          <button className="btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          {step === 'request' && (
            <>
              <p>Send a password reset link to <b>{email}</b>?</p>
              <button className="btn primary" onClick={requestReset} disabled={loading}>Send Reset Link</button>
            </>
          )}
          {step === 'confirm' && (
            <>
              <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <input type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} />
              <button className="btn primary" onClick={confirmReset} disabled={loading}>Update Password</button>
            </>
          )}
          {error && <div className="card error" role="alert">{error}</div>}
          {notice && <div className="card" role="status">{notice}</div>}
        </div>
      </div>
    </div>
  );
}
