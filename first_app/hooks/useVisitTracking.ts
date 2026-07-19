// app/hooks/useVisitTracking.ts
import { useEffect, useRef } from 'react';
import api from '@/lib/api';

export function useVisitTracking() {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    const trackVisit = async () => {
      try {
        const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
        
        let sessionId = localStorage.getItem('sessionId');
        let sessionTimestamp = localStorage.getItem('sessionTimestamp');
        let browserSessionId = sessionStorage.getItem('browserSessionId');
        const now = Date.now();

        const isNewBrowserSession = !browserSessionId;
        const isSessionValid = sessionId && sessionTimestamp && 
          (now - parseInt(sessionTimestamp)) < SESSION_EXPIRY_MS;

        if (!sessionId || !isSessionValid || isNewBrowserSession) {
          sessionId = `session_${now}_${Math.random().toString(36).substring(2, 15)}`;
          localStorage.setItem('sessionId', sessionId);
          localStorage.setItem('sessionTimestamp', now.toString());
          sessionStorage.setItem('browserSessionId', 'active');
          sessionStorage.removeItem('visitTracked');
          hasTracked.current = false;
        }

        const alreadyTracked = sessionStorage.getItem('visitTracked');
        if (alreadyTracked) {
          hasTracked.current = true;
          return;
        }

        // Track the visit
        await api.post('/visits/track', {
          page: window.location.pathname,
        }, {
          headers: {
            'X-Session-ID': sessionId,
          },
        });

        // ✅ Dispatch event to notify VisitsAnalytics component
        window.dispatchEvent(new CustomEvent('visitTracked'));

        sessionStorage.setItem('visitTracked', 'true');
        hasTracked.current = true;
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    const timer = setTimeout(trackVisit, 1000);
    return () => clearTimeout(timer);
  }, []);
}