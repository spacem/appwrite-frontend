// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { account } from '../../lib/appwrite';
import { OAuthProvider } from 'appwrite';
import type { ReactNode } from 'react';
import './provider-buttons.css';

export type OAuthProviderKey =
  | 'github'
  | 'discord'
  | 'google'
  | 'facebook'
  | 'apple'
  | 'gitlab'
  | 'microsoft'
  | 'notion'
  | 'slack';

const providerToEnum: Record<OAuthProviderKey, OAuthProvider> = {
  github: OAuthProvider.Github,
  discord: OAuthProvider.Discord,
  google: OAuthProvider.Google,
  facebook: OAuthProvider.Facebook,
  apple: OAuthProvider.Apple,
  gitlab: OAuthProvider.Gitlab,
  microsoft: OAuthProvider.Microsoft,
  notion: OAuthProvider.Notion,
  slack: OAuthProvider.Slack,
};

export interface ProviderButtonsProps {
  providers: OAuthProviderKey[];
  onError?: (err: unknown) => void;
  showIcons?: boolean;
  tileButtons?: boolean;
  horizontal?: boolean;
}

const Icons: Partial<Record<OAuthProviderKey, ReactNode>> = {
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.21.09 1.85 1.25 1.85 1.25 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5z"/></svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.32 4.37A19.74 19.74 0 0 0 16.36 3l-.2.37c2.06.63 3.04 1.53 3.04 1.53a9.97 9.97 0 0 0-3.9-1.25 10.53 10.53 0 0 0-2.47 0A9.97 9.97 0 0 0 8.93 4.9s-.98-.9-3.04-1.53L5.7 3a19.74 19.74 0 0 0-3.96 1.37C.21 8.09-.12 12.7.04 17.27c1.66 1.22 3.27 1.97 4.83 2.46l.38-.77c-1.33-.5-2.52-1.12-3.58-1.88l.9-.65c2.18 1.07 4.42 1.62 6.74 1.62s4.56-.55 6.74-1.62l.9.65c-1.06.76-2.25 1.38-3.58 1.88l.38.77c1.56-.49 3.17-1.24 4.83-2.46.23-5.13-.84-9.71-3.66-12.9zM8.89 14.78c-.9 0-1.64-.83-1.64-1.86 0-1.03.72-1.87 1.64-1.87.92 0 1.66.84 1.64 1.87 0 1.03-.72 1.86-1.64 1.86zm6.22 0c-.9 0-1.64-.83-1.64-1.86 0-1.03.72-1.87 1.64-1.87.92 0 1.66.84 1.64 1.87 0 1.03-.72 1.86-1.64 1.86z"/></svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.6c-.24 1.44-1.68 4.22-5.6 4.22-3.37 0-6.12-2.8-6.12-6.26S8.63 5.8 12 5.8c1.92 0 3.2.8 3.94 1.49l2.68-2.58C17.3 3.27 14.9 2.2 12 2.2 6.53 2.2 2.1 6.68 2.1 12.05S6.53 21.9 12 21.9c6.91 0 9.6-4.85 9.6-8.1 0-.54-.06-.95-.14-1.34H12z"/><path fill="#34A853" d="M3.17 7.15l3.27 2.4C7.24 7.72 9.4 5.8 12 5.8c1.92 0 3.2.8 3.94 1.49l2.68-2.58C17.3 3.27 14.9 2.2 12 2.2 8.22 2.2 4.87 4.42 3.17 7.15z"/><path fill="#FBBC05" d="M12 21.9c3.6 0 6.62-1.18 8.62-3.2l-3-2.46c-1.07.7-2.5 1.2-4.1 1.2-3.92 0-7.2-2.78-7.93-6.46l-3.32 2.56C3.2 18.7 7.2 21.9 12 21.9z"/><path fill="#4285F4" d="M21.6 13.8c0-.54-.06-.95-.14-1.34H12v3.9h5.6c-.24 1.44-1.68 4.22-5.6 4.22-3.37 0-6.12-2.8-6.12-6.26 0-.68.11-1.33.32-1.92l-3.32-2.56A9.77 9.77 0 0 0 2.1 12.05C2.1 17.42 6.53 21.9 12 21.9c6.91 0 9.6-4.85 9.6-8.1z"/></svg>
  ),
};

export default function ProviderButtons({ providers, onError, showIcons, tileButtons, horizontal }: ProviderButtonsProps) {
  const origin = window.location.origin;

  const startOAuth = async (key: OAuthProviderKey) => {
    try {
      // Use token flow to avoid third-party cookie issues
      const success = `${origin}?provider=${encodeURIComponent(key)}`;
      const failure = `${origin}?oauth_error=1&provider=${encodeURIComponent(key)}`;
      await account.createOAuth2Token(providerToEnum[key], success, failure);
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <div className={`provider-grid${horizontal ? ' horizontal' : ''}${tileButtons ? ' tiles' : ''}`}>
      {providers.map((p) => {
        const label = `Continue with ${p.charAt(0).toUpperCase() + p.slice(1)}`;
        const icon = Icons[p];
        return (
          <button key={p} className={`btn provider ${p}${tileButtons ? ' tile' : ''}${horizontal ? ' pill' : ''}`} onClick={() => startOAuth(p)}>
            {showIcons && (
              <span className="icon" aria-hidden="true">
                {icon ?? <span className="fallback">{p[0].toUpperCase()}</span>}
              </span>
            )}
            <span className="label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
