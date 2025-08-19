import React, { useState } from 'react';
import { callAdvancedFunction } from '../lib/functions';

export default function AdvancedScreen() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Send the input as an object, but the backend now ignores it
      const res = await callAdvancedFunction({});
      if (res && typeof res === 'object' && 'message' in res) {
        setResult(res.message);
      } else if (res && res.error) {
        setError(res.error);
      } else {
        setError('Invalid response from function');
      }
    } catch (e: any) {
      setError(e?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card advanced-screen">
      <h2>Advanced</h2>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={5}
        style={{ width: '100%', marginBottom: 12 }}
        placeholder="Type something..."
        disabled={loading}
      />
      <br />
      <button onClick={handleSend} disabled={loading || !input.trim()}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      <div style={{ marginTop: 16 }}>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>Error: {error}</div>}
        {result && (
          <div>
            <strong>Output:</strong>
            <div style={{ background: '#f4f4f4', padding: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
