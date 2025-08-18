import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

export function useThemeLangSettings() {
  const { lang, setLang } = useI18n();
  const [theme, setThemeState] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('auth.theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('auth.theme', theme);
  }, [theme]);

  return {
    lang,
    setLang,
    theme,
    setTheme: (t: 'dark' | 'light') => setThemeState(t),
  };
}

export function useApiKeySetting() {
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem('apiKey') || '');
  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);
  return {
    apiKey,
    setApiKey: setApiKeyState,
  };
}
