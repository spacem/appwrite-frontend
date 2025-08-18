import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../lib/appwrite';
import AuthPage from '../pages/AuthPage';

export default function RootEntry() {
  const [checked, setChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    account.get().then(() => {
      setIsLoggedIn(true);
      setChecked(true);
    }).catch(() => {
      setIsLoggedIn(false);
      setChecked(true);
    });
  }, []);
  useEffect(() => {
    if (!checked) return;
    if (isLoggedIn) {
      navigate('/profile', { replace: true });
    }
  }, [checked, isLoggedIn, navigate]);
  if (!checked) return <div className="card">Checking authentication…</div>;
  if (!isLoggedIn) return <AuthPage />;
  return null;
}
