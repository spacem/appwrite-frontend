import { useState } from 'react';
import { account, ID } from '../../lib/appwrite';
import './magic-url-form.css';

export default function MagicUrlForm({ onSent, onError }: { onSent: (phrase?: string) => void; onError: (e: unknown) => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    try {
      setLoading(true);
      const res = await account.createMagicURLToken(ID.unique(), email, window.location.origin + '/auth/callback', false);
      onSent((res as any)?.phrase);
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Magic Link</h3>
      <div className="form-grid">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="row">
        <button className="btn" onClick={send} disabled={loading}>Send Magic Link</button>
      </div>
    </div>
  );
}
