import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { account, ID } from '../../lib/appwrite';
import { useI18n } from '../../i18n';
import './email-password-form.css';

export default function EmailPasswordForm({ onSuccess, onError, mode }: { onSuccess: () => void; onError: (e: unknown) => void; mode?: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'password' | 'code'>('code');
  const [otpUserId, setOtpUserId] = useState('');
  const [otpSecret, setOtpSecret] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetUserId, setResetUserId] = useState('');
  const [resetSecret, setResetSecret] = useState('');
  const { t } = useI18n();
  const [showPwd, setShowPwd] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => { emailRef.current?.focus(); }, []);
  useEffect(() => { if (otpUserId) otpRef.current?.focus(); }, [otpUserId]);
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const id = setInterval(() => setResendSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [resendSeconds]);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const identifierValid = emailValid;
  const pwdValid = useMemo(() => password.length >= 8, [password]);
  const effectiveMode: 'login' | 'register' = mode ?? 'login';
  const needsPassword = (effectiveMode === 'register') || (effectiveMode === 'login' && loginMethod === 'password');
  const submitDisabled = loading || !identifierValid || (needsPassword && !pwdValid);

  const register = async () => {
    try {
      setLoading(true);
  setError(null);
  setNotice(null);
  await account.create(ID.unique(), email, password);
      await account.createEmailPasswordSession(email, password);
      onSuccess();
    } catch (e) {
      setError(formatError(e));
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
  setError(null);
  setNotice(null);
  await account.createEmailPasswordSession(email, password);
      onSuccess();
    } catch (e) {
      setError(formatError(e));
      onError(e);
    } finally {
      setLoading(false);
    }
  };
  const sendCode = async () => {
    try {
      setLoading(true);
      setError(null);
      setNotice(null);
  const res = await account.createEmailToken(ID.unique(), email.trim(), false);
  setOtpUserId(res.userId);
  setNotice(t('otp.sentEmail'));
  setResendSeconds(30);
    } catch (e) {
      setError(formatError(e));
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      setError(null);
      await account.createSession(otpUserId, otpSecret);
      onSuccess();
    } catch (e) {
      setError(formatError(e));
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') return register();
    return login();
  };

  // Forgot password removed; code login provides a simple recovery alternative

  // If URL has userId & secret (from recovery link), open reset modal
  useEffect(() => {
    const u = new URL(window.location.href);
    const uid = u.searchParams.get('userId');
    const sec = u.searchParams.get('secret');
    if (uid && sec) {
      setResetUserId(uid);
      setResetSecret(sec);
      setResetOpen(true);
      // Clean params to avoid leaking
      u.searchParams.delete('userId');
      u.searchParams.delete('secret');
      window.history.replaceState({}, '', u.toString());
    }
  }, []);

  const doReset = async () => {
    try {
      setLoading(true);
  setError(null);
  setNotice(null);
      if (!resetPassword || resetPassword !== resetConfirm) {
        setError(t('error.passwordMismatch'));
        return;
      }
  await account.updateRecovery(resetUserId, resetSecret, resetPassword);
      setResetOpen(false);
  setResetPassword('');
  setResetConfirm('');
  setNotice(t('reset.success'));
    } catch (e) {
      setError(formatError(e));
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="card" aria-live="polite">
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="field">
          <input ref={emailRef} type="email" placeholder={t('label.email')} value={email} onChange={(e) => setEmail(e.target.value)} aria-label={t('label.email')} autoComplete="email" aria-invalid={!identifierValid && email ? true : undefined} />
          {!identifierValid && email && <div className="hint error-inline">{t('error.emailInvalid')}</div>}
        </div>
        {loginMethod === 'password' && (
          <div className="field password-field">
            <input type={showPwd ? 'text' : 'password'} placeholder={t('label.password')} value={password} onChange={(e) => setPassword(e.target.value)} aria-label={t('label.password')} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} aria-invalid={!pwdValid && password ? true : undefined} />
            <button type="button" className="btn icon" aria-label={showPwd ? t('aria.hidePassword') : t('aria.showPassword')} onClick={() => setShowPwd(v => !v)}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {!pwdValid && password && <div className="hint error-inline">{t('error.passwordTooShort')}</div>}
          </div>
        )}
        {mode === 'login' && (
          <div className="row" role="radiogroup" aria-label={t('aria.loginMethod')}>
            <label><input type="radio" name="loginMethod" checked={loginMethod==='code'} onChange={() => setLoginMethod('code')} /> {t('login.method.code')}</label>
            <label><input type="radio" name="loginMethod" checked={loginMethod==='password'} onChange={() => setLoginMethod('password')} /> {t('login.method.password')}</label>
          </div>
        )}
        {mode === 'login' && loginMethod === 'code' && !otpUserId && (
          <div className="hint">{t('otp.helperEmail')}</div>
        )}
        <div className="row">
          {(mode === 'login' || !mode) && (
            <button className="btn primary" type="submit" disabled={submitDisabled} onClick={loginMethod==='code' && !otpUserId ? (e)=>{e.preventDefault(); sendCode();} : undefined}>
              {loading ? '…' : (loginMethod==='code' && !otpUserId ? t('otp.send') : t('btn.login'))}
            </button>
          )}
          {(mode === 'register' || !mode) && (
            <button className="btn" type="submit" disabled={submitDisabled}>{t('btn.register')}</button>
          )}
        </div>
      </form>
      {loginMethod === 'code' && mode === 'login' && otpUserId && (
        <div className="form-grid" aria-live="polite">
          <div className="field">
            <input ref={otpRef} type="text" placeholder={t('otp.secretPlaceholder')} value={otpSecret} onChange={(e) => setOtpSecret(e.target.value)} aria-label={t('otp.secretLabel')} />
          </div>
          <div className="row">
            <button className="btn" onClick={sendCode} disabled={loading || !identifierValid || resendSeconds > 0}>
              {resendSeconds > 0 ? `${t('otp.resend')} (${resendSeconds})` : t('otp.resend')}
            </button>
            <button className="btn primary" onClick={verifyCode} disabled={loading || !otpUserId || !otpSecret}>{t('otp.verify')}</button>
          </div>
        </div>
      )}
  {error && <div className="card error" role="alert">{error}</div>}
  {notice && <div className="card" role="status">{notice}</div>}

      {resetOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>{t('reset.title')}</h3>
              <button className="btn" onClick={() => setResetOpen(false)} aria-label="Close">×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <input type="password" placeholder={t('reset.new')} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} />
                <input type="password" placeholder={t('reset.confirm')} value={resetConfirm} onChange={(e) => setResetConfirm(e.target.value)} />
              </div>
              {error && <div className="card error" role="alert">{error}</div>}
            </div>
            <div className="modal-actions">
              <button className="btn primary" onClick={doReset} disabled={loading}>{t('reset.submit')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatError(e: any): string {
  if (!e) return 'Unknown error';
  const msg = e?.message || e?.response?.message || String(e);
  const code = e?.code || e?.response?.code;
  return code ? `${msg} (code ${code})` : msg;
}
