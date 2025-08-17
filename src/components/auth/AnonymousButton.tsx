import { account } from '../../lib/appwrite';
import type { ReactNode } from 'react';
import './anonymous-button.css';

export default function AnonymousButton({ onSuccess, onError, className, children }: { onSuccess: () => void; onError: (e: unknown) => void; className?: string; children?: ReactNode }) {
  const go = async () => {
    try {
      // If a session exists, log out first for a clean guest session
      const current = await account.get().catch(() => null);
      if (current) {
        await account.deleteSession('current').catch(() => {});
      }
      await account.createAnonymousSession();
      onSuccess();
    } catch (e: any) {
      onError(e);
    }
  };

  return (
  <button className={className ?? 'btn ghost'} onClick={go}>{children ?? 'Continue as Guest'}</button>
  );
}
