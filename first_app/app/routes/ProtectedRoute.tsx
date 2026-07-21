// app/routes/ProtectedRoute.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean | null>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    // ✅ Prevent multiple checks
    if (hasChecked.current) return;
    hasChecked.current = true;

    const authStatus = isAuthenticated();
    setIsAuthenticatedState(authStatus);
    
    if (!authStatus) {
      router.push('/login');
    }
  }, [router]);

  // Loading state while checking authentication
  if (isAuthenticatedState === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!isAuthenticatedState) return null;

  return <>{children}</>;
}