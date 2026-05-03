import { useState, useEffect, useCallback } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import DashboardLayout from '../components/layout/DashboardLayout';
import ChatBox from '../components/ChatBox';
import MapView from '../components/MapView';
import { 
  Leaf, 
  Clock, 
  MapPin, 
  CheckCircle, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle, 
  Map as MapIcon, 
  Grid,
  History,
  Activity,
  Loader2,
  Info,
  Bell,
  X,
  Package,
  AlertCircle
} from 'lucide-react';

// ── Alert Toast Component ──────────────────────────────────────────────────────
const DonationAlert = ({ donation, onClaim, onDismiss }) => (
  <div className="flex items-start gap-4 bg-white rounded-xl shadow-2xl border border-primary-100 p-4 w-full max-w-sm animate-in slide-in-from-right-8 duration-300">
    <div className="p-2.5 bg-accent-50 rounded-lg shrink-0">
      <Package size={20} className="text-accent-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
        </span>
        <p className="text-[10px] font-bold text-accent-600 uppercase tracking-widest">New Food Available!</p>
      </div>
      <p className="text-sm font-bold text-slate-900 truncate">{donation.title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{donation.capacity} meals · nearby</p>
      <button
        onClick={() => { onClaim(donation.id); onDismiss(donation.id); }}
        className="mt-3 w-full py-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-widest"
      >
        Claim Now
      </button>
    </div>
    <button onClick={() => onDismiss(donation.id)} className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 mt-0.5">
      <X size={16} />
    </button>
  </div>
);

const NgoDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [activeClaim, setActiveClaim] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [claimError, setClaimError] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [fetchError, setFetchError] = useState('');
  // Alert queue: array of donation objects
  const [alerts, setAlerts] = useState([]);

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const dismissAlert = useCallback((donationId) => {
    setAlerts(prev => prev.filter(a => a.id !== donationId));
  }, []);

  const showAlert = useCallback((donation) => {
    setAlerts(prev => {
      // Don't duplicate
      if (prev.find(a => a.id === donation.id)) return prev;
      return [donation, ...prev].slice(0, 4); // max 4 stacked
    });
    // Auto-dismiss after 8 seconds
    setTimeout(() => dismissAlert(donation.id), 8000);

    // Browser notification (works when tab is in background)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🍱 New Food Available!', {
        body: `${donation.title} — ${donation.capacity} meals nearby. Claim it before it's gone!`,
        icon: '/vite.svg',
        tag: donation.id, // prevents duplicate notifications
      });
    }
  }, [dismissAlert]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchNearby(parsedUser.location?.x || -74.006, parsedUser.location?.y || 40.7128, parsedUser.id);
    }
  }, []);

  const fetchNearby = (lon, lat, userId) => {
    setIsLoading(true);
    setFetchError('');
    fetch(`http://localhost:8080/api/donations/nearby?lon=${lon}&lat=${lat}&radiusKm=10`)
      .then(r => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      })
      .then(data => setDonations(data))
      .catch(() => setFetchError('Could not load nearby donations. Check your connection and refresh.'))
      .finally(() => setIsLoading(false));

    fetch(`http://localhost:8080/api/donations/ngo/${userId}`)
      .then(r => r.json())
      .then(data => {
        setHistory(data);
        const active = data.find(d => d.status === 'CLAIMED');
        if (active) setActiveClaim(active);
      })
      .catch(() => console.warn('History sync failed.'));
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect({}, () => {
      client.subscribe('/topic/donations/new', (msg) => {
        const newDonation = JSON.parse(msg.body);
        setDonations(prev => [newDonation, ...prev]);
        // Trigger the alert banner + browser notification
        showAlert(newDonation);
      });
      client.subscribe('/topic/donations/claimed', (msg) => {
        const claimed = JSON.parse(msg.body);
        setDonations(prev => prev.filter(d => d.id !== claimed.id));
        // Dismiss alert for this donation if it's still showing
        dismissAlert(claimed.id);
      });
      client.subscribe('/topic/donations/completed', (msg) => {
         const completed = JSON.parse(msg.body);
         if(activeClaim && activeClaim.id === completed.id) {
            setActiveClaim(completed);
            if(user) fetch(`http://localhost:8080/api/donations/ngo/${user.id}`).then(r => r.json()).then(setHistory);
         }
      });
    });

    return () => { if (client.connected) client.disconnect(); };
  }, [activeClaim, user, showAlert, dismissAlert]);

  const handleClaim = async (donationId) => {
    if (!user) return;
    setClaimError('');
    try {
      const res = await fetch(`http://localhost:8080/api/donations/${donationId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId: user.id })
      });
      if (res.ok) {
        const claimed = await res.json();
        setActiveClaim(claimed);
        setHistory([claimed, ...history]);
      } else {
        setClaimError('This donation was already claimed by another NGO.');
      }
    } catch {
      setClaimError('Could not connect to server. Please try again.');
    }
  };

  const handleComplete = async () => {
    if (!user || !activeClaim) return;
    setCodeError('');
    try {
      const res = await fetch(`http://localhost:8080/api/donations/${activeClaim.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId: user.id, confirmationCode })
      });
      if (res.ok) {
        const completed = await res.json();
        setActiveClaim(completed);
      } else {
        setCodeError('Incorrect code. Please check with the donor and try again.');
      }
    } catch {
      setCodeError('Could not connect to server. Please try again.');
    }
  };

  return (
    <DashboardLayout role="NGO">
      {/* ── Alert Toast Stack (bottom-right, fixed) ── */}
      {alerts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
          {alerts.map(donation => (
            <DonationAlert
              key={donation.id}
              donation={donation}
              onClaim={handleClaim}
              onDismiss={dismissAlert}
            />
          ))}
        </div>
      )}

      {/* ── Browser Notification Permission Banner ── */}
      {'Notification' in window && Notification.permission === 'default' && (
        <div className="mb-6 flex items-center gap-4 bg-primary-50 border border-primary-100 rounded-xl px-5 py-4">
          <Bell size={18} className="text-primary-700 shrink-0" />
          <p className="text-sm text-primary-800 font-medium flex-1">
            Enable browser notifications to get alerted about new food donations even when this tab is in the background.
          </p>
          <button
            onClick={() => Notification.requestPermission()}
            className="px-4 py-2 bg-primary-700 text-white text-xs font-bold rounded-lg hover:bg-primary-800 transition-colors uppercase tracking-widest shrink-0"
          >
            Enable
          </button>
        </div>
      )}
      {/* 1. OPERATIONS KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="structured-card p-6 border-l-4 border-l-primary-700 bg-white border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Meals Delivered</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">
                {history.reduce((acc, curr) => acc + (curr.status === 'COMPLETED' ? curr.capacity : 0), 0)}
              </h3>
              <p className="text-xs text-green-700 font-bold mt-3 flex items-center gap-1.5 uppercase tracking-wider"><TrendingUp size={12}/> All time total</p>
            </div>
            <div className="p-3 bg-primary-50 text-primary-700 rounded-lg">
              <Leaf size={20} />
            </div>
          </div>
        </div>
        
        <div className="structured-card p-6 border-l-4 border-l-emerald-600 bg-white border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Local Network Activity</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">{donations.length}</h3>
              <p className="text-xs text-emerald-700 font-bold mt-3 flex items-center gap-1.5 uppercase tracking-wider"><MapPin size={12}/> Scanning within 10km</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
              <MapPin size={20} />
            </div>
          </div>
        </div>

        <div className="structured-card p-6 border-l-4 border-l-slate-800 bg-white border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Completed Pickups</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">
                {history.filter(d => d.status === 'COMPLETED').length}
              </h3>
               <p className="text-xs text-slate-700 font-bold mt-3 flex items-center gap-1.5 uppercase tracking-wider"><Clock size={12}/> All time</p>
            </div>
            <div className="p-3 bg-slate-100 text-slate-700 rounded-lg">
              <Clock size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* 2. LIVE GRID / ACTIVE CLAIM */}
        <div className="lg:col-span-3">
          {fetchError && !activeClaim && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{fetchError}</p>
              <button onClick={() => user && fetchNearby(user.location?.x || -74.006, user.location?.y || 40.7128, user.id)} className="ml-auto text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-widest">
                Retry
              </button>
            </div>
          )}
          {activeClaim ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
              <div className="relative h-72 border-b border-slate-200 bg-slate-100">
                <img src={activeClaim.photoUrl || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1200"} alt="Surplus Batch" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-8 left-8 text-white max-w-2xl">
                  <div className="inline-flex items-center px-3 py-1 rounded bg-accent-600 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
                     Pickup In Progress
                  </div>
                  <h2 className="text-4xl font-bold font-serif mb-3 tracking-tight">{activeClaim.title}</h2>
                  <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-primary-200">
                    <p className="flex items-center gap-2"><Leaf size={16} className="text-accent-400"/> Capacity: {activeClaim.capacity} Meals</p>
                    <p className="flex items-center gap-2"><MapPin size={16} className="text-accent-400"/> Pickup Location</p>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-white">
                {activeClaim.status !== 'COMPLETED' ? (
                   <div className="grid lg:grid-cols-2 gap-12 items-start">
                     <div>
                       <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Pickup Instructions</h3>
                       <ul className="space-y-5 text-slate-600 text-sm leading-relaxed mb-8">
                          <li className="flex gap-4 items-start border-l-2 border-primary-200 pl-4 py-1">
                             <div className="bg-primary-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                             Head to the donor's location to pick up the food.
                          </li>
                          <li className="flex gap-4 items-start border-l-2 border-primary-200 pl-4 py-1">
                             <div className="bg-primary-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                             Ask the donor for the 6-digit confirmation code.
                          </li>
                          <li className="flex gap-4 items-start border-l-2 border-primary-200 pl-4 py-1">
                             <div className="bg-primary-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                             Enter the code below to confirm the pickup is complete.
                          </li>
                       </ul>
                       <div className="p-4 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex gap-3 mb-8 font-medium">
                          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
                          <p>The confirmation code verifies the handover and protects both parties under food donation laws.</p>
                       </div>
                       
                       {/* Chat Coordination */}
                       <div className="pt-6 border-t border-slate-100">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Chat with Donor</h4>
                          {user && <ChatBox donationId={activeClaim.id} currentUser={user} />}
                       </div>
                     </div>
                     
                     <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 shadow-inner text-center sticky top-24">
                       <h4 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-6">Enter Confirmation Code</h4>
                       <input 
                          type="text" 
                          value={confirmationCode} 
                          onChange={(e) => setConfirmationCode(e.target.value)} 
                          placeholder="000000" 
                          maxLength={6} 
                          className="w-full px-6 py-5 text-center text-5xl font-mono tracking-[0.4em] font-bold text-slate-900 border-2 border-slate-200 rounded-lg shadow-sm focus:border-primary-500 outline-none transition-all mb-8 bg-white" 
                        />
                       <button onClick={handleComplete} className="w-full py-5 bg-primary-700 text-white rounded-lg font-bold hover:bg-primary-800 transition-all flex justify-center items-center gap-3 shadow-lg uppercase tracking-widest text-xs">
                         <ShieldCheck size={20}/> Confirm Pickup
                       </button>
                       {codeError && <p className="text-sm text-red-600 text-center mt-3">{codeError}</p>}
                     </div>
                   </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100 shadow-sm">
                       <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold font-serif text-slate-900 mb-4 tracking-tight">Pickup Complete!</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">The pickup has been confirmed. The food is on its way to those who need it.</p>
                    <button onClick={() => setActiveClaim(null)} className="px-10 py-4 bg-white border-2 border-primary-700 text-primary-700 font-bold rounded-lg hover:bg-primary-50 transition-all shadow-md uppercase tracking-widest text-xs">
                      Back to Donations
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-end bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">Available Food Donations</h2>
                  <p className="text-slate-500 text-sm mt-1">Real-time alerts for unclaimed food in your area.</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                      <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-primary-700' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={18}/></button>
                      <button onClick={() => setViewMode('map')} className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-md text-primary-700' : 'text-slate-400 hover:text-slate-600'}`}><MapIcon size={18}/></button>
                   </div>
                   <div className="flex items-center gap-2 bg-primary-950 px-4 py-2.5 rounded-lg text-white shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Live Updates</span>
                   </div>
                </div>
              </div>
              
              {isLoading ? (
                 <div className="py-40 flex flex-col items-center justify-center text-slate-300">
                    <Loader2 className="animate-spin w-12 h-12 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Initializing...</p>
                 </div>
              ) : viewMode === 'map' ? (
                 <div className="structured-card h-[600px] rounded-xl overflow-hidden border-slate-200">
                    <MapView donations={donations} onClaim={handleClaim} />
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {donations.length > 0 ? donations.map(d => (
                  <div key={d.id} className="structured-card overflow-hidden flex flex-col group hover:border-primary-400 transition-all bg-white rounded-xl shadow-sm">
                    <div className="relative h-56 border-b border-slate-100 bg-slate-100 overflow-hidden">
                       <img src={d.photoUrl || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800"} alt="Surplus Batch" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 bg-primary-950/90 backdrop-blur-md text-white rounded-md text-[10px] font-bold uppercase tracking-widest border border-white/20">
                            Cap: {d.capacity} Meals
                          </span>
                       </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-6">
                         <h3 className="text-xl font-bold text-slate-900 line-clamp-1 mb-2 font-serif">{d.title}</h3>
                         <div className="flex items-center justify-between">
                            <p className="text-slate-400 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-widest">
                               <MapPin size={12} className="text-primary-600"/> NY Metropolitan Sector
                            </p>
                            <span className="text-[10px] font-bold text-slate-300 uppercase underline decoration-primary-300/50 underline-offset-4 cursor-help">Logistics Details</span>
                         </div>
                      </div>
                      <button onClick={() => handleClaim(d.id)} className="mt-auto w-full py-4 bg-primary-900 text-white rounded-lg font-bold hover:bg-primary-950 transition-all flex justify-between items-center px-6 shadow-md uppercase tracking-widest text-[10px]">
                        Claim Donation <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )) : (
                   <div className="md:col-span-2 py-32 text-center bg-white rounded-xl border border-dashed border-slate-200 p-12">
                      <Info className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                      <h4 className="text-xl font-bold font-serif text-slate-900 mb-2">No Donations Nearby</h4>
                      <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">No food donations are available in your area right now. We'll notify you when something comes in.</p>
                   </div>
                )}
              </div>
              {claimError && (
                <p className="text-sm text-red-600 text-center mt-4 font-medium">{claimError}</p>
              )}
              )}
            </div>
          )}
        </div>

        {/* 3. LOGISTICS HISTORY SIDEBAR */}
        <div className="lg:col-span-1">
           <div className="structured-card p-6 bg-white border-slate-200 shadow-sm rounded-xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                 <h3 className="font-bold font-serif text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <History className="text-primary-700" size={16} />
                    Pickup History
                 </h3>
                 <span className="text-[9px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded tracking-widest font-mono">Live</span>
              </div>
              
              <div className="space-y-6 flex-1 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
                 {history.length > 0 ? history.map((item) => (
                    <div key={item.id} className="group relative pl-6 border-l border-slate-100 flex flex-col gap-1 pb-4 last:border-0 last:pb-0">
                       <div className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${item.status === 'COMPLETED' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-primary-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]'}`}></div>
                       <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-tight group-hover:text-primary-700 transition-colors">{item.title}</h4>
                       <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                          <span>{item.capacity} Meals</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                       </div>
                       <span className={`mt-2 text-[8px] font-bold px-2 py-0.5 rounded-full self-start tracking-[0.1em] border uppercase ${item.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-primary-50 text-primary-700 border-primary-100'}`}>
                          {item.status}
                       </span>
                    </div>
                 )) : (
                    <div className="py-20 text-center flex flex-col items-center justify-center opacity-40">
                       <Activity size={32} className="mb-4 text-slate-300" />
                       <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">No pickups yet.</p>
                    </div>
                 )}
              </div>
              
              <div className="mt-10 pt-6 border-t border-slate-100">
                 <button className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md group">
                    Download Report <ChevronRight className="inline-block ml-1 group-hover:translate-x-1 transition-transform" size={14} />
                 </button>
                 <p className="text-[9px] text-slate-400 font-medium text-center mt-4">Pickup history</p>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NgoDashboard;
