import { useEffect, useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { account } from '../lib/appwrite';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    account.get().then(() => {
      setIsLoggedIn(true);
      setAuthChecked(true);
    }).catch(() => {
      setIsLoggedIn(false);
      setAuthChecked(true);
    });
  }, []);

  if (!authChecked) {
    return <div className="card">Checking authentication…</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
