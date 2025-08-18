

import { useState, useEffect } from 'react';
import { account } from '../lib/appwrite';
import { useThemeLangSettings } from './useSettings';
import { useI18n } from '../i18n';

export default function SetupScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameEdit, setNameEdit] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyEdit, setApiKeyEdit] = useState(false);
  const { theme, setTheme, lang, setLang } = useThemeLangSettings();
  const [notice, setNotice] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    account.get().then(async u => {
      setUser(u);
      setName(u.name || '');
      // Load API key from preferences if present
      try {
        const prefs = await account.getPrefs();
        setApiKey(prefs.apiKey || '');
      } catch {
        setApiKey('');
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const saveName = async () => {
    setLoading(true);
    setError(null);
    try {
      await account.updateName(name);
      const u = await account.get();
      setUser(u);
      setName(u.name || '');
      setNotice(t('setup.nameUpdated'));
      setNameEdit(false);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async () => {
    setLoading(true);
    setError(null);
    try {
      // Save API key to preferences (merge with existing prefs)
      const prefs = await account.getPrefs();
      await account.updatePrefs({ ...prefs, apiKey });
      setNotice(t('setup.apiKeyUpdated'));
      setApiKeyEdit(false);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !nameEdit) return <div className="card">Loading…</div>;
  if (error && !nameEdit) return <div className="card error">{error}</div>;

  return (
    <div className="card setup-screen">
      {notice && <div className="card" role="status">{notice}</div>}
      {/* Name field, inline edit */}
      <div className="field">
        <label>{t('label.name')}</label>
        {nameEdit ? (
          <div className="row">
            <input value={name} onChange={e => setName(e.target.value)} />
            <button className="btn primary" onClick={saveName} disabled={loading}>{t('btn.save')}</button>
            <button className="btn" onClick={() => { setNameEdit(false); setError(null); }}>{t('btn.cancel')}</button>
          </div>
        ) : (
          <div className="row">
            <span>{user?.name || <em>{t('setup.notSet')}</em>}</span>
            <button className="btn" onClick={() => { setNameEdit(true); setError(null); }}>{t('btn.edit')}</button>
          </div>
        )}
      </div>
      {/* API Key field, inline edit */}
      <div className="field">
        <label>{t('label.apiKey')}</label>
        {apiKeyEdit ? (
          <div className="row">
            <input value={apiKey} onChange={e => setApiKey(e.target.value)} />
            <button className="btn primary" onClick={saveApiKey} disabled={loading}>{t('btn.save')}</button>
            <button className="btn" onClick={() => { setApiKeyEdit(false); setError(null); }}>{t('btn.cancel')}</button>
          </div>
        ) : (
          <div className="row">
            <span>{apiKey ? <code>{apiKey}</code> : <em>{t('setup.notSet')}</em>}</span>
            <button className="btn" onClick={() => { setApiKeyEdit(true); setError(null); }}>{t('btn.edit')}</button>
          </div>
        )}
      </div>
      {/* Theme */}
      <div className="field">
        <label>{t('label.theme')}</label>
        <div className="row">
          <label><input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} /> {t('theme.dark')}</label>
          <label><input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} /> {t('theme.light')}</label>
        </div>
      </div>
      {/* Language */}
      <div className="field">
        <label>{t('label.language')}</label>
        <select value={lang} onChange={e => setLang(e.target.value as any)}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>
  );
}
