import AuthPage from './pages/AuthPage';
import { I18nProvider } from './i18n';

export default function App() {
  return (
    <I18nProvider>
      <AuthPage />
    </I18nProvider>
  );
}
