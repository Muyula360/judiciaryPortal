'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Avoid rendering on the server to prevent flash of content
  if (!isClient) return null;

  // Only render children if authenticated
  if (!isAuthenticated()) return null;

  return <>{children}</>;
}