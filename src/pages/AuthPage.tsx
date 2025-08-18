import { useEffect, useState } from 'react';
import { Mail, User } from 'lucide-react';
import ProviderButtons, { type OAuthProviderKey } from '../components/auth/ProviderButtons';
import EmailPasswordForm from '../components/auth/EmailPasswordForm';
// Magic URL is hidden in the simplified flow
// import MagicUrlForm from '../components/auth/MagicUrlForm';
// OTP is integrated into the login form (code option)
import AnonymousButton from '../components/auth/AnonymousButton';
import SessionControls from '../components/auth/SessionControls';
import ProfileSettings from '../components/auth/ProfileSettings';
import { account } from '../lib/appwrite';
import './auth-page.css';
import LegalContent, { type LegalType } from '../components/legal/LegalContent';
import { useI18n } from '../i18n';

const enabledProviders: OAuthProviderKey[] = ['github', 'discord', 'google'];

import { useNavigate } from 'react-router-dom';

export default function AuthPage({ redirectPath }: { redirectPath?: string }) {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [mode, setMode] = useState<'landing' | 'email'>('landing');
  const [emailMode, setEmailMode] = useState<'login' | 'register'>('login');
  const [showPolicy, setShowPolicy] = useState(false);
  const [showTos, setShowTos] = useState(false);
  const { t, lang, setLang } = useI18n();
  // UI customization controls (keep only theme)
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => ((localStorage.getItem('auth.theme') as any) || prefersDark() || 'dark') as 'dark' | 'light'
  );

  useEffect(() => {
    // Handle Magic URL / phone / OAuth token callback
    const url = new URL(window.location.href);
    const userId = url.searchParams.get('userId');
    const secret = url.searchParams.get('secret');
  const provider = url.searchParams.get('provider');
  const oauthErr = url.searchParams.get('oauth_error');
  const legal = url.searchParams.get('legal') as LegalType | null;
    if (oauthErr && provider && !userId && !secret) {
      setError(`Login with ${provider} failed. Check the provider credentials and redirect URLs in Appwrite and the ${provider} developer portal.`);
      // Clean query params
      url.searchParams.delete('oauth_error');
      window.history.replaceState({}, '', url.toString());
    } else if (userId && secret) {
      // For magic URL and phone/OAuth token flows, create a session from token
      account
        .createSession(userId, secret)
        .then(onAuthSuccess)
        .catch((e) => setError(formatError(e)))
        .finally(() => {
          // Clean query params
          url.searchParams.delete('userId');
          url.searchParams.delete('secret');
          window.history.replaceState({}, '', url.toString());
        });
    }

  if (legal === 'privacy') setShowPolicy(true);
  if (legal === 'tos') setShowTos(true);

    account
      .get()
      .then((u) => setUserName(userLabel(u)))
      .catch((e) => {
        if (e?.code === 401) {
          // Not logged in; no banner needed
          setUserName(null);
        } else {
          setError(formatError(e));
          setUserName(null);
        }
      });
  }, []);

  // Apply theme to document root and persist selection
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('auth.theme', theme);
  }, [theme]);

  const onAuthSuccess = async () => {
    try {
      const u = await account.get();
      setUserName(userLabel(u));
      setError(null);
      // Redirect after login (for OAuth or email)
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (e) {
      setError('Could not fetch user');
    }
  };

  const LandingControls = (
    <div className="landing-controls">
      <div className="title">{t('title.signIn')}</div>
      <div className="selects">
        <label>
          {t('label.language')}
          <select value={lang} onChange={(e) => setLang(e.target.value as any)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </label>
        <label>
          {t('label.theme')}
          <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
            <option value="dark">{t('theme.dark')}</option>
            <option value="light">{t('theme.light')}</option>
          </select>
        </label>
      </div>
    </div>
  );

  const ProvidersBlock = (
    <>
  <ProviderButtons providers={enabledProviders} onError={(e) => setError(formatError(e))} showIcons mode="auth" />
    </>
  );

  const EmailGuestRow = (
    <div className="provider-row">
      <button className="btn provider email" onClick={() => setMode('email')}>
        <span className="icon" aria-hidden="true"><Mail size={18} /></span>
        <span className="label">{t('btn.continueEmail')}</span>
      </button>
      <AnonymousButton onSuccess={onAuthSuccess} onError={(e) => setError(formatError(e))} className="btn provider guest">
        <span className="icon" aria-hidden="true"><User size={18} /></span>
        <span className="label">{t('btn.continueGuest')}</span>
      </AnonymousButton>
    </div>
  );


  // Helper to refresh userName after profile update or session change
  const refreshUser = async () => {
    try {
      const u = await account.get();
      setUserName(userLabel(u));
    } catch {
      setUserName(null);
    }
  };

  return (
    <div className={`auth-layout variant-centered`}>
      {userName ? (
        <>
          <div className="card success">
            <p>{t('msg.signedInAs')} <strong>{userName}</strong></p>
            <SessionControls onChange={refreshUser} />
          </div>
          <ProfileSettings onChange={refreshUser} />
        </>
      ) : (
        <>
          {error && <div className="card error">{error}</div>}
          {mode === 'landing' && (
            <>
              {LandingControls}
              <div className="centered-sheet">
                <div className="sheet">
                  {EmailGuestRow}
                  {ProvidersBlock}
                </div>
              </div>
            </>
          )}
          {mode === 'email' && (
            <div className="stack">
              <button className="btn" onClick={() => setMode('landing')}>← {t('btn.back')}</button>
              <div className="card">
                <div className="row" role="radiogroup" aria-label="Email options">
                  <label><input type="radio" name="emailMode" checked={emailMode==='login'} onChange={() => setEmailMode('login')} /> {t('emailOpt.login')}</label>
                  <label><input type="radio" name="emailMode" checked={emailMode==='register'} onChange={() => setEmailMode('register')} /> {t('emailOpt.register')}</label>
                </div>
              </div>
              <EmailPasswordForm onSuccess={onAuthSuccess} onError={(e) => setError(formatError(e))} mode={emailMode} />
            </div>
          )}
        </>
      )}

      <footer>
    <a className="linklike" href="?legal=privacy" onClick={(e) => { e.preventDefault(); setShowPolicy(true); updateQuery('privacy'); }}>{t('footer.privacy')}</a>
        <span className="muted">·</span>
    <a className="linklike" href="?legal=tos" onClick={(e) => { e.preventDefault(); setShowTos(true); updateQuery('tos'); }}>{t('footer.tos')}</a>
      </footer>

  {showPolicy && (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
      <h3>{t('footer.privacy')}</h3>
      <button className="btn" onClick={() => { setShowPolicy(false); clearQuery(); }} aria-label={t('btn.close')}>×</button>
            </div>
            <div className="modal-body">
      <LegalContent type="privacy" />
            </div>
            <div className="modal-actions">
      <button className="btn" onClick={() => { setShowPolicy(false); clearQuery(); }}>{t('btn.close')}</button>
            </div>
          </div>
        </div>
      )}

  {showTos && (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
      <h3>{t('footer.tos')}</h3>
      <button className="btn" onClick={() => { setShowTos(false); clearQuery(); }} aria-label={t('btn.close')}>×</button>
            </div>
            <div className="modal-body">
      <LegalContent type="tos" />
            </div>
            <div className="modal-actions">
      <button className="btn" onClick={() => { setShowTos(false); clearQuery(); }}>{t('btn.close')}</button>
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

function prefersDark() {
  try {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

function userLabel(u: any): string {
  return u?.name || u?.email || 'Guest';
}

function updateQuery(legal: 'privacy' | 'tos') {
  const url = new URL(window.location.href);
  url.searchParams.set('legal', legal);
  window.history.replaceState({}, '', url.toString());
}

function clearQuery() {
  const url = new URL(window.location.href);
  url.searchParams.delete('legal');
  window.history.replaceState({}, '', url.toString());
}
