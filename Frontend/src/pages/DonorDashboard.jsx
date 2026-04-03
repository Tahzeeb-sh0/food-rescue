import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import DashboardLayout from '../components/layout/DashboardLayout';
import ChatBox from '../components/ChatBox';
import MapView from '../components/MapView';
import { 
  Heart, 
  PlusCircle, 
  MapPin, 
  CheckCircle, 
  Navigation, 
  History,
  ChevronRight,
  Clock,
  Package,
  Info,
  X,
  AlertCircle,
  BarChart3,
  ShieldCheck,
  FileText,
  Truck,
  Zap,
  Leaf
} from 'lucide-react';

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'history', 'partners'
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState('');
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchData(parsedUser.id);
    }
  }, []);

  const fetchData = async (userId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/donations/donor/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setDonations(data);
      }
    } catch (err) {
      console.error("Sync failed.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(() => socket);
    client.debug = () => {}; 

    client.connect({}, () => {
      client.subscribe('/topic/donations/claimed', (msg) => {
        const d = JSON.parse(msg.body);
        setDonations(prev => prev.map(item => item.id === d.id ? d : item));
      });
      client.subscribe('/topic/donations/completed', (msg) => {
        const d = JSON.parse(msg.body);
        setDonations(prev => prev.map(item => item.id === d.id ? d : item));
      });
    });

    return () => { if (client.connected) client.disconnect(); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!navigator.geolocation) return alert("Geolocation required for safe routing");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch('http://localhost:8080/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donorId: user?.id,
            title, 
            capacity: parseInt(capacity),
            photoUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800',
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude
          })
        });
        if (res.ok) {
          const newDonation = await res.json();
          setDonations([newDonation, ...donations]);
          setTitle('');
          setCapacity('');
          setShowForm(false);
          setActiveTab('active');
        }
      } catch (err) {
        alert("Verification server error.");
      }
    });
  };

  const activeDonations = donations.filter(d => d.status !== 'COMPLETED');
  const pastDonations = donations.filter(d => d.status === 'COMPLETED');

  // KPIS
  const totalMeals = pastDonations.reduce((acc, curr) => acc + curr.capacity, 0);
  const activeCount = activeDonations.length;
  const carbonImpact = (totalMeals * 0.5).toFixed(1); // 0.5kg of CO2 per meal diversion

  return (
    <DashboardLayout role="DONOR">
      
      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-100 text-primary-700 rounded-lg">
                 <Zap size={20} className="fill-current" />
              </div>
              <h1 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">Logistics Command Center</h1>
           </div>
           <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Verified Professional Node • {user?.name || 'Authorized Account'}
           </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button 
             onClick={() => setShowForm(!showForm)}
             className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${showForm ? 'bg-slate-200 text-slate-700' : 'bg-primary-700 text-white hover:bg-primary-800'}`}
           >
             {showForm ? <><X size={18}/> Cancel Log</> : <><PlusCircle size={18}/> Initiate Donation</>}
           </button>
        </div>
      </div>

      {/* 2. PERSISTENT STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
         <div className="structured-card p-5 bg-white border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Meals Diverted</p>
            <div className="flex items-end justify-between">
               <h4 className="text-3xl font-bold font-serif text-slate-900">{totalMeals}</h4>
               <Heart className="text-primary-700 mb-1" size={18}/>
            </div>
         </div>
         <div className="structured-card p-5 bg-white border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CO2 Mitigated</p>
            <div className="flex items-end justify-between">
               <h4 className="text-3xl font-bold font-serif text-slate-900">{carbonImpact}k</h4>
               <Leaf className="text-green-600 mb-1" size={18}/>
            </div>
         </div>
         <div className="structured-card p-5 bg-primary-950 border-none text-white">
            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-1">Active Transfers</p>
            <div className="flex items-end justify-between">
               <h4 className="text-3xl font-bold font-serif">{activeCount}</h4>
               <Truck className="text-accent-400 mb-1" size={18}/>
            </div>
         </div>
         <div className="structured-card p-5 bg-white border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Platform Score</p>
            <div className="flex items-end justify-between">
               <h4 className="text-3xl font-bold font-serif text-slate-900">9.8</h4>
               <BarChart3 className="text-blue-600 mb-1" size={18}/>
            </div>
         </div>
      </div>

      {showForm && (
        <div className="grid lg:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-top-6 duration-500">
          <div className="lg:col-span-2 structured-card overflow-hidden bg-white border-slate-200 shadow-2xl rounded-3xl flex flex-col md:flex-row">
            <div className="bg-primary-950 p-10 md:w-1/3 text-white flex flex-col justify-center border-r border-primary-900">
               <div className="w-14 h-14 bg-primary-800 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  <Package className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-3xl font-bold font-serif mb-4 leading-tight">Log Surplus Inventory.</h3>
               <p className="text-primary-300 text-sm leading-relaxed mb-8">Accurate data ensures immediate dispatch of verified NGO agents.</p>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-accent-400 uppercase tracking-widest">
                     <ShieldCheck size={18} /> Safety Compliance Log
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-accent-400 uppercase tracking-widest">
                     <FileText size={18} /> Tax-Deductible Auto-Sync
                  </div>
               </div>
            </div>
            <div className="p-10 md:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.2em]">Item Categorization / Description</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 15 Trays Fresh Bakery (End-of-Day)" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-all text-sm font-semibold bg-slate-50 text-slate-900 shadow-inner" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-[0.2em]">Throughput Capacity (Est. Meals)</label>
                   <div className="relative">
                      <input type="number" required value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="0" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-all text-sm font-semibold bg-slate-50 text-slate-900 shadow-inner" />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-widest">Units</span>
                   </div>
                </div>
                <button type="submit" className="w-full py-5 bg-primary-700 text-white rounded-xl font-bold hover:bg-primary-800 shadow-xl transition-all uppercase tracking-[0.2em] text-xs active:scale-[0.98]">
                  Confirm & Dispatch Hub
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-4">
             <div className="structured-card p-6 bg-amber-50 border-amber-100 rounded-3xl">
                <div className="flex items-center gap-3 text-amber-800 font-bold mb-6">
                   <div className="p-2 bg-white rounded-lg shadow-sm"><Info size={20} className="text-amber-600" /></div>
                   <h4 className="text-sm uppercase tracking-widest">Logistics Guide</h4>
                </div>
                <div className="space-y-6">
                   <div className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-amber-800">1</div>
                      <p className="text-xs font-medium text-amber-900/80 leading-relaxed">Package perishables in food-safe containers with secure seals.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-amber-800">2</div>
                      <p className="text-xs font-medium text-amber-900/80 leading-relaxed">Include allergen markers (Gluten, Dairy, Nuts) where possible.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-amber-800">3</div>
                      <p className="text-xs font-medium text-amber-900/80 leading-relaxed">Verification code must be spoken only to the uniformed agent.</p>
                   </div>
                </div>
             </div>
             <div className="structured-card p-6 bg-slate-900 text-white rounded-3xl">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                   <ShieldCheck size={16} className="text-accent-500" /> Compliance
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">Your data is logged under the Global Zero-Waste Protocol. Automated CSR reports will be available on the 1st of each month.</p>
             </div>
          </div>
        </div>
      )}

      {/* 3. TABBED OPERATIONS AREA */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
         {/* Internal Tab Nav */}
         <div className="flex items-center gap-2 p-3 bg-slate-50/50 border-b border-slate-100">
            {[
               { id: 'active', label: 'Active Pipeline', icon: <Truck size={14}/>, count: activeCount },
               { id: 'history', label: 'Impact Ledger', icon: <History size={14}/>, count: pastDonations.length },
               { id: 'partners', label: 'Partner Mesh', icon: <MapIcon size={14}/>, count: null }
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white shadow-md text-primary-800 border-slate-100 border' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {tab.icon}
                  {tab.label}
                  {tab.count !== null && <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] border ${activeTab === tab.id ? 'bg-primary-50 border-primary-100' : 'bg-slate-100 border-slate-200'}`}>{tab.count}</span>}
               </button>
            ))}
         </div>

         {/* Tab Views */}
         <div className="flex-1 p-6 lg:p-10">
            {activeTab === 'active' && (
               <div className="space-y-8 h-full">
                  {activeDonations.length > 0 ? (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeDonations.map(d => (
                           <div key={d.id} className="structured-card bg-white border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-primary-300 transition-colors group">
                               <div className="p-8 pb-4">
                                  <div className="flex items-center justify-between mb-6">
                                     <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${d.status === 'AVAILABLE' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-primary-50 text-primary-700 border-primary-100'}`}>
                                        {d.status === 'AVAILABLE' ? 'Searching Hubs...' : 'Agent Dispatched'}
                                     </div>
                                     <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">NODE_{d.id.slice(-6)}</span>
                                  </div>
                                  <h3 className="text-2xl font-bold font-serif text-slate-900 mb-3">{d.title}</h3>
                                  <div className="flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
                                     <span className="flex items-center gap-2"><PlusCircle size={14} className="text-primary-700"/> {d.capacity} Meals</span>
                                     <span className="flex items-center gap-2"><Clock size={14} className="text-primary-700"/> {new Date(d.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  </div>

                                  {d.status === 'CLAIMED' ? (
                                     <div className="space-y-6">
                                        <div className="bg-slate-950 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group/code overflow-hidden">
                                           <div className="absolute inset-0 bg-primary-800/10 opacity-0 group-hover/code:opacity-100 transition-opacity"></div>
                                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-3 relative z-10">Secure Handover Code</p>
                                           <p className="text-6xl font-mono font-bold text-white tracking-[0.3em] font-serif italic mb-4 relative z-10">{d.confirmationCode}</p>
                                           <p className="text-[10px] text-accent-500 font-bold uppercase tracking-widest relative z-10">Authorized Representative Only</p>
                                        </div>
                                        <div className="pt-2">
                                           <ChatBox donationId={d.id} currentUser={user} />
                                        </div>
                                     </div>
                                  ) : (
                                     <div className="py-12 flex flex-col items-center justify-center text-center border-t border-slate-50 mt-4 h-[300px]">
                                        <div className="relative">
                                           <div className="absolute inset-0 animate-ping rounded-full bg-primary-100 opacity-20"></div>
                                           <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-700 relative z-10">
                                              <Zap size={32} className="animate-pulse" />
                                           </div>
                                        </div>
                                        <h4 className="font-bold text-slate-900 mt-6 uppercase tracking-widest text-xs">Live Broadcast Active</h4>
                                        <p className="text-xs text-slate-400 mt-2 max-w-[200px]">NGO distribution nodes across your sector are currently being notified of this surplus.</p>
                                     </div>
                                  )}
                               </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-32">
                        <Package className="w-20 h-20 text-slate-200 mb-6" />
                        <h4 className="text-xl font-bold font-serif text-slate-900 mb-2">No Active Operational Transfers</h4>
                        <p className="text-sm font-medium text-slate-500 max-w-sm">Every surplus diversion begins with a log. Use the 'Initiate Donation' action to start a new rescue mission.</p>
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'history' && (
               <div className="h-full animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                     <h3 className="font-bold font-serif text-slate-900 text-lg">Verified Impact Ledger</h3>
                     <button className="text-[10px] font-bold text-primary-700 hover:text-primary-800 uppercase tracking-widest flex items-center gap-1.5">
                        Download ESG Audit (CSV) <FileText size={14}/>
                     </button>
                  </div>
                  {pastDonations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastDonations.map(item => (
                        <div key={item.id} className="structured-card p-6 bg-white border-slate-100 group hover:border-primary-300 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-6">
                             <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                <CheckCircle size={20} />
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">NODE_{item.id.slice(-6)}</span>
                          </div>
                          <h4 className="font-bold font-serif text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{new Date(item.completedAt).toLocaleDateString()}</p>
                          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Handled {item.capacity} Meals</p>
                             <div className="text-primary-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Details</span>
                                <ChevronRight size={14} />
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-32">
                       <History className="w-20 h-20 text-slate-200 mb-6" />
                       <p className="text-sm font-medium text-slate-500">Log ledger is currently empty. Impact data will generate upon mission completion.</p>
                    </div>
                  )}
               </div>
            )}

            {activeTab === 'partners' && (
               <div className="h-full animate-in fade-in zoom-in-95 duration-500 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="font-bold font-serif text-slate-900 text-lg">Partner Network Mesh</h3>
                        <p className="text-xs text-slate-500">Visualizing verified distribution nodes within your operational radius.</p>
                     </div>
                     <span className="px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent-100">Live Telemetry</span>
                  </div>
                  <div className="flex-1 rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-100 relative min-h-[400px]">
                     <MapView donations={[]} type="DONOR" />
                     <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl max-w-xs">
                        <h5 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <ShieldCheck size={14} className="text-primary-700" /> Secure Visibility
                        </h5>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Map shows verified NGOs currently scanning the network for donations. Exact locations are obfuscated for sector security.</p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>

    </DashboardLayout>
  );
};

// Map Icon helper
const MapIcon = ({size, className}) => <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>;

export default DonorDashboard;
