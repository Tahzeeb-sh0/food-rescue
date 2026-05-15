import { useState, useEffect, useCallback } from 'react';
import { WifiOff, ServerCrash } from 'lucide-react';
import { API_BASE, API_BACKEND_DISPLAY } from '../utils/api';

const POLL_MS = 45_000;

export default function ConnectionBanner() {
  const [online, setOnline] = useState(() => typeof navigator !== 'undefined' && navigator.onLine);
  const [apiOk, setApiOk] = useState(null);

  const ping = useCallback(async () => {
    if (!navigator.onLine) {
      setApiOk(false);
      return;
    }
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(`${API_BASE}/api/health`, { signal: ctrl.signal });
      clearTimeout(t);
      setApiOk(res.ok);
    } catch {
      setApiOk(false);
    }
  }, []);

  useEffect(() => {
    const onOff = () => setOnline(navigator.onLine);
    window.addEventListener('online', onOff);
    window.addEventListener('offline', onOff);
    const runPing = () => {
      queueMicrotask(() => {
        void ping();
      });
    };
    runPing();
    const id = setInterval(runPing, POLL_MS);
    return () => {
      window.removeEventListener('online', onOff);
      window.removeEventListener('offline', onOff);
      clearInterval(id);
    };
  }, [ping]);

  if (!online) {
    return (
      <div className="w-full min-w-0 bg-amber-600 text-white text-center text-xs font-bold py-2.5 px-3 sm:px-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <WifiOff size={14} className="shrink-0" />
        <span className="min-w-0 break-words">You are offline. Changes may not sync until you reconnect.</span>
      </div>
    );
  }

  if (apiOk === false) {
    return (
      <div className="w-full min-w-0 bg-red-700 text-white text-center text-xs font-bold py-2.5 px-3 sm:px-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <ServerCrash size={14} className="shrink-0" />
        <span className="min-w-0 max-w-full break-words hyphens-auto">
          Cannot reach the FoodRescue API. Check that the backend is running:{' '}
          <span className="font-mono font-normal break-all opacity-95">{API_BACKEND_DISPLAY}</span>
        </span>
      </div>
    );
  }

  return null;
}
