import React, { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';

const NgoDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [activeClaim, setActiveClaim] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

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
    // Fetch available nearby
    fetch(`http://localhost:8080/api/donations/nearby?lon=${lon}&lat=${lat}&radiusKm=10`)
      .then(r => r.json())
      .then(data => setDonations(data))
      .catch(err => console.error("Nearby scans unreachable. Interface in offline mode."))
      .finally(() => setIsLoading(false));

    // Fetch account history and active claim
    fetch(`http://localhost:8080/api/donations/ngo/${userId}`)
      .then(r => r.json())
      .then(data => {
        setHistory(data);
        const active = data.find(d => d.status === 'CLAIMED');
        if (active) setActiveClaim(active);
      })
      .catch(err => console.error("History sync failed."));
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect({}, () => {
      client.subscribe('/topic/donations/new', (msg) => {
        setDonations(prev => [JSON.parse(msg.body), ...prev]);
      });
      client.subscribe('/topic/donations/claimed', (msg) => {
        const claimed = JSON.parse(msg.body);
        setDonations(prev => prev.filter(d => d.id !== claimed.id));
      });
      client.subscribe('/topic/donations/completed', (msg) => {
         const completed = JSON.parse(msg.body);
         if(activeClaim && activeClaim.id === completed.id) {
            setActiveClaim(completed);
            // Refresh history after completion
            if(user) fetch(`http://localhost:8080/api/donations/ngo/${user.id}`).then(r => r.json()).then(setHistory);
         }
      })
    });

    return () => { if (client.connected) client.disconnect(); };
  }, [activeClaim, user]);

  const handleClaim = async (donationId) => {
    if (!user) return;
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
        alert("Logistics notice: Batch already secured by another agency.");
      }
    } catch (err) {
      alert("Verification server unreachable. Secure physical handover is recommended.");
    }
  };

  const handleComplete = async () => {
    if (!user || !activeClaim) return;
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
        alert("Authentication Error: Numerical authorization code invalid.");
      }
    } catch (err) {
      alert("Network error during transfer verification.");
    }
  };

  return (
    <DashboardLayout role="NGO">
      {/* 1. OPERATIONS KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="structured-card p-6 border-l-4 border-l-primary-700 bg-white border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Impact Delivered</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">
                {history.reduce((acc, curr) => acc + (curr.status === 'COMPLETED' ? curr.capacity : 0), 0)}
              </h3>
              <p className="text-xs text-green-700 font-bold mt-3 flex items-center gap-1.5 uppercase tracking-wider"><TrendingUp size={12}/> +12% MoM Efficiency</p>
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
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Operational Rating</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">9.4</h3>
               <p className="text-xs text-slate-700 font-bold mt-3 flex items-center gap-1.5 uppercase tracking-wider"><Clock size={12}/> Tier 1 Logistics Accr.</p>
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
          {activeClaim ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
              <div className="relative h-72 border-b border-slate-200 bg-slate-100">
                <img src={activeClaim.photoUrl || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1200"} alt="Surplus Batch" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-8 left-8 text-white max-w-2xl">
                  <div className="inline-flex items-center px-3 py-1 rounded bg-accent-600 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
                     Tactical Dispatch Active
                  </div>
                  <h2 className="text-4xl font-bold font-serif mb-3 tracking-tight">{activeClaim.title}</h2>
                  <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-primary-200">
                    <p className="flex items-center gap-2"><Leaf size={16} className="text-accent-400"/> Capacity: {activeClaim.capacity} Meals</p>
                    <p className="flex items-center gap-2"><MapPin size={16} className="text-accent-400"/> Primary Sector Hub</p>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-white">
                {activeClaim.status !== 'COMPLETED' ? (
                   <div className="grid lg:grid-cols-2 gap-12 items-start">
                     <div>
                       <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Operations Directives</h3>
                       <ul className="space-y-5 text-slate-600 text-sm leading-relaxed mb-8">
                          <li className="flex gap-4 items-start border-l-2 border-primary-200 pl-4 py-1">
                             <div className="bg-primary-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                             Proceed immediately to the designated donor facility for physical handover.
                          </li>
                          <li className="flex gap-4 items-start border-l-2 border-primary-200 pl-4 py-1">
                             <div className="bg-primary-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                             Acquire the 6-digit numerical authorization code from the facility manager.
                          </li>
                          <li className="flex gap-4 items-start border-l-2 border-primary-200 pl-4 py-1">
                             <div className="bg-primary-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                             Input code below to formally close the logistical transfer and update ESG logs.
                          </li>
                       </ul>
                       <div className="p-4 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex gap-3 mb-8 font-medium">
                          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
                          <p>Handover verification is required under the Good Samaritan Regulatory Framework.</p>
                       </div>
                       
                       {/* Chat Coordination */}
                       <div className="pt-6 border-t border-slate-100">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Secured Comms Line</h4>
                          {user && <ChatBox donationId={activeClaim.id} currentUser={user} />}
                       </div>
                     </div>
                     
                     <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 shadow-inner text-center sticky top-24">
                       <h4 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-6">Verification Authorization</h4>
                       <input 
                          type="text" 
                          value={confirmationCode} 
                          onChange={(e) => setConfirmationCode(e.target.value)} 
                          placeholder="000000" 
                          maxLength={6} 
                          className="w-full px-6 py-5 text-center text-5xl font-mono tracking-[0.4em] font-bold text-slate-900 border-2 border-slate-200 rounded-lg shadow-sm focus:border-primary-500 outline-none transition-all mb-8 bg-white" 
                        />
                       <button onClick={handleComplete} className="w-full py-5 bg-primary-700 text-white rounded-lg font-bold hover:bg-primary-800 transition-all flex justify-center items-center gap-3 shadow-lg uppercase tracking-widest text-xs">
                         <ShieldCheck size={20}/> Verify & Close Batch
                       </button>
                     </div>
                   </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100 shadow-sm">
                       <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold font-serif text-slate-900 mb-4 tracking-tight">Mission Logged Successfully</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">Platform possession updated. Audit logs across the {activeClaim.capacity}-meal batch are now finalized and verified.</p>
                    <button onClick={() => setActiveClaim(null)} className="px-10 py-4 bg-white border-2 border-primary-700 text-primary-700 font-bold rounded-lg hover:bg-primary-50 transition-all shadow-md uppercase tracking-widest text-xs">
                      Return to Active Grid
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-end bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">Live Logistics Grid.</h2>
                  <p className="text-slate-500 text-sm mt-1">Real-time alerts for unassigned surplus inventory across verified hubs.</p>
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
                      <span className="text-[10px] font-bold uppercase tracking-widest">Sector Scan Active</span>
                   </div>
                </div>
              </div>
              
              {isLoading ? (
                 <div className="py-40 flex flex-col items-center justify-center text-slate-300">
                    <Loader2 className="animate-spin w-12 h-12 mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Initializing Tactical Matrix...</p>
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
                        Initiate Claim <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )) : (
                   <div className="md:col-span-2 py-32 text-center bg-white rounded-xl border border-dashed border-slate-200 p-12">
                      <Info className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                      <h4 className="text-xl font-bold font-serif text-slate-900 mb-2">Quiescent Sector Scan</h4>
                      <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">No active surplus registrations detected in your immediate radius. Monitoring network via WebSockets.</p>
                   </div>
                )}
              </div>
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
                    Audit Logs
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
                       <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">No finalized missions<br/>detected in ledger.</p>
                    </div>
                 )}
              </div>
              
              <div className="mt-10 pt-6 border-t border-slate-100">
                 <button className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md group">
                    Generate CSR Report <ChevronRight className="inline-block ml-1 group-hover:translate-x-1 transition-transform" size={14} />
                 </button>
                 <p className="text-[9px] text-slate-400 font-medium text-center mt-4">Authorized Log Retrieval • v4.1 Operational Matrix</p>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NgoDashboard;
