import { useEffect, useState } from 'react';
import PasswordResetModal from './PasswordResetModal';
import { account } from '../../lib/appwrite';
import ProviderButtons, { type OAuthProviderKey } from './ProviderButtons';
import './profile-settings.css';

export default function ProfileSettings({ onChange }: { onChange?: () => void }) {
  // i18n not used yet
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailEdit, setEmailEdit] = useState(false);
  const [nameEdit, setNameEdit] = useState(false);
  const [pwdEdit, setPwdEdit] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [showPwdReset, setShowPwdReset] = useState(false);

  useEffect(() => {
    account.get().then(u => {
      setUser(u);
      setName(u.name || '');
      setEmail(u.email || '');
      setLoading(false);
    }).catch(e => {
      setError(e.message || String(e));
      setLoading(false);
    });
  }, []);

  const saveName = async () => {
    setLoading(true);
    setError(null);
    try {
      await account.updateName(name);
      const u = await account.get();
      setUser(u);
      setName(u.name || '');
      setNotice('Name updated');
      setNameEdit(false);
      onChange?.();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const saveEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      let pwd = password || '';
      // If user has no email and no password, generate a strong random password
      if (!user?.email && !user?.passwordHash && !password) {
        pwd = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
      }
      await account.updateEmail(email, pwd);
      const u = await account.get();
      setUser(u);
      setEmail(u.email || '');
      setNotice('Email updated');
      setEmailEdit(false);
      onChange?.();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };


  // Password change now uses reset modal


  // Only show loading card if loading and not editing
  if (loading && !nameEdit && !emailEdit && !pwdEdit) return <div className="card">Loading…</div>;

  return (
    <div className="card profile-settings">
      <h3>Profile Settings</h3>
      {notice && <div className="card" role="status">{notice}</div>}
      <div className="field">
        <label>Name</label>
        {nameEdit ? (
          <>
            {error && <div className="card error">{error}</div>}
            <div className="row">
              <input value={name} onChange={e => setName(e.target.value)} />
              <button className="btn primary" onClick={saveName} disabled={loading}>Save</button>
              <button className="btn" onClick={() => { setNameEdit(false); setError(null); }}>Cancel</button>
            </div>
          </>
        ) : (
          <div className="row">
            <span>{user.name || <em>Not set</em>}</span>
            <button className="btn" onClick={() => { setNameEdit(true); setError(null); }}>Edit</button>
          </div>
        )}
      </div>
      <div className="field">
        <label>Email</label>
        {emailEdit ? (
          <>
            {error && <div className="card error">{error}</div>}
            <div className="row">
              <input value={email} onChange={e => setEmail(e.target.value)} />
              {user.passwordHash && <input type="password" placeholder="Current password" value={password} onChange={e => setPassword(e.target.value)} />}
              <button className="btn primary" onClick={saveEmail} disabled={loading}>Save</button>
              <button className="btn" onClick={() => { setEmailEdit(false); setError(null); }}>Cancel</button>
            </div>
          </>
        ) : (
          <div className="row">
            <span>{user.email}</span>
            <button className="btn" onClick={() => { setEmailEdit(true); setError(null); }}>Edit</button>
          </div>
        )}
      </div>
      <div className="field">
        <label>Password</label>
        <div className="row">
          <span>••••••••</span>
          <button className="btn" onClick={() => setShowPwdReset(true)}>Change</button>
        </div>
      </div>
      {showPwdReset && (
        <PasswordResetModal
          email={user?.email || ''}
          onClose={() => setShowPwdReset(false)}
          onSuccess={() => {
            setShowPwdReset(false);
            setNotice('Password updated. You can now log in.');
            onChange?.();
          }}
        />
      )}
      <div className="field">
        <label>Link Social Accounts</label>
  <ProviderButtons providers={['github','discord','google'] as OAuthProviderKey[]} showIcons mode="profile" />
      </div>
    </div>
  );
}
