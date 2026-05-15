import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, Package, CheckCircle, User, Trash2, XCircle } from 'lucide-react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE } from '../utils/api';

const ICON_MAP = {
  new:        <Package size={16} className="text-accent-600" />,
  claimed:    <User size={16} className="text-primary-600" />,
  completed:  <CheckCircle size={16} className="text-green-600" />,
  cancelled:  <XCircle size={16} className="text-amber-600" />,
};

function storageKeyFor(userId) {
  return userId ? `app_notifications_${userId}` : 'app_notifications_guest';
}

function readStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function writeStored(key, notifs) {
  localStorage.setItem(key, JSON.stringify(notifs.slice(0, 50)));
}

const NotificationCenter = ({ userId, role }) => {
  const storageKey = storageKeyFor(userId);
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(() => readStored(storageKey));
  const panelRef = useRef(null);
  const storageKeyRef = useRef(storageKey);
  storageKeyRef.current = storageKey;

  useEffect(() => {
    setNotifs(readStored(storageKey));
  }, [storageKey]);

  const unread = notifs.filter((n) => !n.read).length;

  const persist = useCallback((list) => {
    writeStored(storageKeyRef.current, list);
  }, []);

  const addNotif = useCallback((notif) => {
    setNotifs((prev) => {
      const updated = [notif, ...prev].slice(0, 50);
      persist(updated);
      return updated;
    });
  }, [persist]);

  // Subscribe to WebSocket events
  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS(`${API_BASE}/ws`);
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect({}, () => {
      if (role === 'NGO') {
        client.subscribe(`/topic/ngo/${userId}/donations/new`, (msg) => {
          const d = JSON.parse(msg.body);
          addNotif({
            id: `new-${d.id}-${Date.now()}`,
            type: 'new',
            title: 'New food near you',
            body: `${d.title} — ${d.capacity} meals within range`,
            time: new Date().toISOString(),
            read: false,
          });
        });
        client.subscribe('/topic/donations/cancelled', (msg) => {
          let cancelledId = msg.body;
          try {
            cancelledId = JSON.parse(msg.body);
          } catch {
            /* plain string id */
          }
          addNotif({
            id: `cancel-${cancelledId}-${Date.now()}`,
            type: 'cancelled',
            title: 'Donation removed',
            body: 'A nearby listing was cancelled or expired.',
            time: new Date().toISOString(),
            read: false,
          });
        });
      }

      if (role === 'DONOR') {
        client.subscribe('/topic/donations/claimed', (msg) => {
          const d = JSON.parse(msg.body);
          if (d.donorId === userId) {
            addNotif({
              id: `claimed-${d.id}-${Date.now()}`,
              type: 'claimed',
              title: 'Your donation was claimed!',
              body: `An NGO is on their way to pick up "${d.title}".`,
              time: new Date().toISOString(),
              read: false,
            });
          }
        });
        client.subscribe('/topic/donations/completed', (msg) => {
          const d = JSON.parse(msg.body);
          if (d.donorId === userId) {
            addNotif({
              id: `done-${d.id}-${Date.now()}`,
              type: 'completed',
              title: 'Pickup complete!',
              body: `"${d.title}" was successfully picked up. Thank you!`,
              time: new Date().toISOString(),
              read: false,
            });
          }
        });
      }
    });

    return () => {
      if (client.connected) client.disconnect();
    };
  }, [userId, role, addNotif]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    setNotifs((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      persist(updated);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifs([]);
    localStorage.removeItem(storageKeyRef.current);
  };

  const markRead = (id) => {
    setNotifs((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persist(updated);
      return updated;
    });
  };

  const [nowClock, setNowClock] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowClock(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const timeAgo = (iso) => {
    const diff = nowClock - new Date(iso);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const iconBg = (type) => {
    if (type === 'new') return 'bg-accent-50';
    if (type === 'completed') return 'bg-green-50';
    if (type === 'cancelled') return 'bg-amber-50';
    return 'bg-primary-50';
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) markAllRead();
        }}
        className="relative p-2.5 text-slate-400 rounded-xl hover:bg-slate-50 transition-all group"
        aria-label="Notifications"
      >
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
        <Bell size={22} className="group-hover:scale-110 transition-transform" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[min(20rem,calc(100vw-1.5rem))] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifs.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  aria-label="Clear all"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-12 text-center">
                <Bell size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
                <p className="text-xs text-slate-300 mt-1">Activity will appear here in real-time</p>
              </div>
            ) : (
              notifs.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${
                    !n.read ? 'bg-primary-50/40' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconBg(
                      n.type
                    )}`}
                  >
                    {ICON_MAP[n.type] ?? ICON_MAP.claimed}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {timeAgo(n.time)}
                    </p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-2" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
