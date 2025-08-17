import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import de from './locales/de';
// The following locales are currently disabled to reduce maintenance. Re-enable as needed.
// import pt from './locales/pt';
// import it from './locales/it';
// import ja from './locales/ja';
// import ko from './locales/ko';
// import zh from './locales/zh';
// import ru from './locales/ru';
// import ar from './locales/ar';
// import hi from './locales/hi';

export type LangCode = 'en' | 'es' | 'fr' | 'de';

const maps: Record<LangCode, Record<string, string>> = { en, es, fr, de };

function detectLang(): LangCode {
  const saved = localStorage.getItem('lang') as LangCode | null;
  if (saved && saved in maps) return saved;
  const nav = navigator.language.split('-')[0] as LangCode;
  return (nav && nav in maps ? nav : 'en');
}

const I18nCtx = createContext<{ lang: LangCode; setLang: (l: LangCode) => void; t: (k: string) => string }>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(detectLang());
  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    const dict = maps[lang] ?? maps.en;
    return (k: string) => dict[k] ?? maps.en[k] ?? k;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() { return useContext(I18nCtx); }
export const supportedLangs = Object.keys(maps) as LangCode[];
