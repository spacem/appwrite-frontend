import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './app-layout.css';
import { I18nProvider } from './i18n';
import SetupScreen from './components/SetupScreen';
import ProfileScreen from './components/ProfileScreen';
import MagicScreen from './components/MagicScreen';
import AdvancedScreen from './components/AdvancedScreen';
import SessionControls from './components/auth/SessionControls';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import RootEntry from './components/RootEntry';

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  // Show nav on all pages except /auth and /
  const showNav = location.pathname !== '/auth' && location.pathname !== '/';

  return (
    <div className="app-layout">
      {showNav && (
        <nav className="main-nav">
          <button onClick={() => navigate('/setup')} className={location.pathname === '/setup' ? 'active' : ''} title="Setup">Setup</button>
          <button onClick={() => navigate('/profile')} className={location.pathname === '/profile' ? 'active' : ''} title="Profile">Profile</button>
          <button onClick={() => navigate('/magic')} className={location.pathname === '/magic' ? 'active' : ''} title="Magic">Magic</button>
          <button onClick={() => navigate('/advanced')} className={location.pathname === '/advanced' ? 'active' : ''} title="Advanced">Advanced</button>
          <span style={{ flex: 1 }} />
          <SessionControls />
        </nav>
      )}
      <main>
        <Routes>
          <Route path="/" element={<RootEntry />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/setup" element={<SetupScreen />} />
          <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
          <Route path="/magic" element={<ProtectedRoute><MagicScreen /></ProtectedRoute>} />
          <Route path="/advanced" element={<ProtectedRoute><AdvancedScreen /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Router>
        <AppLayout />
      </Router>
    </I18nProvider>
  );
}
