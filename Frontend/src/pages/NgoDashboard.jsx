import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Leaf, Clock, MapPin, CheckCircle, TrendingUp, ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react';

const NgoDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [activeClaim, setActiveClaim] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');

  const ngoId = 'ngo-456';

  const fetchNearby = (lon, lat) => {
    fetch(`http://localhost:8080/api/donations/nearby?lon=${lon}&lat=${lat}&radiusKm=10`)
      .then(r => r.json())
      .then(data => setDonations(data))
      .catch(err => {
        console.warn("Backend offline. Injecting mock scans for UI demo.");
        setDonations([
           { id: 'mock-1', title: 'Corporate Catering Surplus', capacity: 150, photoUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800' },
           { id: 'mock-2', title: 'Bakery End-of-Day Logistics', capacity: 45, photoUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1200' }
        ]);
      });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchNearby(pos.coords.longitude, pos.coords.latitude);
      });
    }

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
            setActiveClaim({...activeClaim, status: 'COMPLETED'});
         }
      })
    });

    return () => { if (client.connected) client.disconnect(); };
  }, [activeClaim]);

  const handleClaim = async (donationId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/donations/${donationId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId })
      });
      if (res.ok) setActiveClaim(await res.json());
      else alert("Notice: Logistics batch already secured by another agency.");
    } catch (err) {
      console.warn("Backend offline. Mocking successful secure of batch.");
      const claimedObject = donations.find(d => d.id === donationId) || { id: donationId, title: 'Mock Claim', capacity: 100 };
      setActiveClaim({ ...claimedObject, status: 'CLAIMED' });
    }
  };

  const handleComplete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/donations/${activeClaim.id}/complete`, {
         method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId, confirmationCode })
      });
      if (res.ok) setActiveClaim(await res.json());
      else alert("Error: Verification code incorrect.");
    } catch (err) {
      if(confirmationCode.length >= 4) {
         setActiveClaim({...activeClaim, status: 'COMPLETED'});
      } else {
         alert("Mock Demo Error: Enter any code 4+ chars long to proceed.");
      }
    }
  };

  return (
    <DashboardLayout role="NGO">
      {/* Overview Metrics - Corporate Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="structured-card p-6 border-l-4 border-l-primary-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Batches Secured</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">1,204</h3>
              <p className="text-sm text-green-700 font-semibold mt-3 flex items-center gap-1.5"><TrendingUp size={14}/> +12% MoM Efficiency</p>
            </div>
            <div className="p-3 bg-primary-50 text-primary-700 rounded-md">
              <Leaf size={20} />
            </div>
          </div>
        </div>
        
        <div className="structured-card p-6 border-l-4 border-l-emerald-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Current Sector Scans</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">{donations.length}</h3>
              <p className="text-sm text-emerald-700 font-semibold mt-3 flex items-center gap-1.5"><MapPin size={14}/> Active within 10km</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-md">
              <MapPin size={20} />
            </div>
          </div>
        </div>

        <div className="structured-card p-6 border-l-4 border-l-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Avg Dispatch Latency</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">14m</h3>
              <p className="text-sm text-slate-700 font-semibold mt-3 flex items-center gap-1.5"><Clock size={14}/> Superior Logistics Rating</p>
            </div>
            <div className="p-3 bg-slate-100 text-slate-700 rounded-md">
              <Clock size={20} />
            </div>
          </div>
        </div>
      </div>

      {activeClaim ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200 max-w-4xl mx-auto">
          <div className="relative h-64 border-b border-slate-200 bg-slate-100">
            <img src={activeClaim.photoUrl || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1200"} alt="Surplus Batch" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
            <div className="absolute bottom-6 left-8 text-white max-w-xl">
              <div className="inline-flex items-center px-3 py-1 rounded bg-accent-600 text-white text-xs font-bold uppercase tracking-widest mb-3">
                 Dispatch Active
              </div>
              <h2 className="text-3xl font-bold font-serif mb-2">{activeClaim.title}</h2>
              <div className="flex items-center gap-4 text-sm font-medium text-slate-200">
                <p className="flex items-center gap-1.5"><Leaf size={16}/> Capacity: {activeClaim.capacity} Users</p>
                <p className="flex items-center gap-1.5"><MapPin size={16}/> Distance: ~4.5 km</p>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 bg-white">
            {activeClaim.status !== 'COMPLETED' ? (
               <div className="flex flex-col md:flex-row gap-8 items-start">
                 <div className="flex-1">
                   <h3 className="text-2xl font-bold text-slate-900 mb-4">Operations Directives</h3>
                   <ul className="space-y-4 text-slate-600 text-sm leading-relaxed mb-6">
                      <li className="flex gap-2 items-start"><span className="font-bold text-slate-900">1.</span> Proceed immediately to the designated corporate or facility donor location.</li>
                      <li className="flex gap-2 items-start"><span className="font-bold text-slate-900">2.</span> Request the required numerical authorization code from the facility manager.</li>
                      <li className="flex gap-2 items-start"><span className="font-bold text-slate-900">3.</span> Ensure goods are packaged in compliance strictly with transport safety codes.</li>
                   </ul>
                   <div className="p-4 bg-slate-50 border border-slate-200 rounded text-sm text-slate-700 flex gap-3">
                      <AlertTriangle size={18} className="text-accent-600 flex-shrink-0" />
                      <p>Failure to acquire the confirmation code will result in an uncompleted log and penalty to the NGO standing.</p>
                   </div>
                 </div>
                 
                 <div className="w-full md:w-80 bg-slate-50 p-6 rounded border border-slate-200 shadow-sm text-center">
                   <h4 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">Input Authorization Code</h4>
                   <input type="text" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} placeholder="000000" maxLength={6} className="w-full px-4 py-3 text-center text-3xl font-mono tracking-[0.2em] font-bold text-slate-900 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors mb-4 bg-white" />
                   <button onClick={handleComplete} className="w-full btn-primary py-3 flex justify-center items-center gap-2">
                     <ShieldCheck size={18}/> Verify Code
                   </button>
                 </div>
               </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-50 rounded flex items-center justify-center mx-auto mb-6 border border-green-100">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-slate-900 mb-2">Transfer Successfully Logged</h3>
                <p className="text-slate-600 text-sm mb-8">System reflects possession handover of food for {activeClaim.capacity} individuals.</p>
                <button onClick={() => setActiveClaim(null)} className="btn-outline">
                  Return to Active Scans
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900">Live Logistics Grid</h2>
              <p className="text-slate-500 text-sm mt-1">Real-time alerts for unassigned surplus inventory</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
               <span className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-600"></span>
               </span>
               <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">System Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.length === 0 ? (
               <div className="col-span-full bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center py-20 px-6">
                 <div className="w-16 h-16 bg-slate-50 rounded flex items-center justify-center mb-4">
                   <Clock size={28} className="text-slate-400" />
                 </div>
                 <h3 className="font-bold text-slate-800 text-lg mb-1">Grid is Clear</h3>
                 <p className="text-sm text-slate-500 mb-6">No current surplus inventories reported within operational radius.</p>
                 <button onClick={() => fetchNearby(-74.006, 40.7128)} className="text-sm font-semibold text-primary-700 hover:underline">Force Manual Resync</button>
               </div>
            ) : (
              donations.map(d => (
                <div key={d.id} className="structured-card overflow-hidden flex flex-col">
                  <div className="relative h-48 border-b border-slate-100 bg-slate-100">
                    <img src={d.photoUrl || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=800&auto=format&fit=crop"} alt="Surplus Batch" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-primary-900 text-white rounded text-xs font-bold uppercase tracking-widest">
                        Cap: {d.capacity}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-4">
                       <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1">{d.title}</h3>
                       <p className="text-slate-500 text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                          <MapPin size={12}/> Approx Sector {(Math.random() * 8 + 1).toFixed(1)} km
                       </p>
                    </div>
                    <button onClick={() => handleClaim(d.id)} className="mt-auto w-full btn-primary text-sm py-2.5 flex justify-between items-center px-4">
                      Initiate Claim <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default NgoDashboard;
