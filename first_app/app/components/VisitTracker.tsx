
'use client';

import { useVisitTracking } from '@/hooks/useVisitTracking';
import { usePathname } from 'next/navigation';

export default function VisitTracker() {
  const pathname = usePathname();
  //This hook will only track unique or first time
  //visits on the home page and the root path. You can modify this logic to include other pages if needed.

  // if you what to track visits on other pages, you can add additional conditions here. For example:
  //   const TRACKED_PAGES = ['/', '/home', '/about', '/services'];
  //   export default function VisitTracker() {
  //     const pathname = usePathname();
  //     const shouldTrack = TRACKED_PAGES.includes(pathname || '');
  //     useVisitTracking();
  //     return null;
  //   }
  
  const isHomePage = pathname === '/' || pathname === '/home';
  useVisitTracking();
  return null;
}