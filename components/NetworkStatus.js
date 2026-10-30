'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

// Registers the offline service worker (production only) and shows a toast
// when the connection drops or comes back.
export default function NetworkStatus() {
  const [state, setState] = useState(null); // null | 'offline' | 'online'

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    let timer;
    const off = () => { clearTimeout(timer); setState('offline'); };
    const on = () => { setState('online'); timer = setTimeout(() => setState(null), 3000); };
    if (!navigator.onLine) off();
    window.addEventListener('offline', off);
    window.addEventListener('online', on);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('offline', off);
      window.removeEventListener('online', on);
    };
  }, []);

  if (!state) return null;
  return (
    <div className={`net-toast ${state}`} role="status">
      {state === 'offline' ? <WifiOff /> : <Wifi />}
      <span>
        {state === 'offline'
          ? 'You are offline. Pages you have visited are still available.'
          : 'Back online.'}
      </span>
    </div>
  );
}
