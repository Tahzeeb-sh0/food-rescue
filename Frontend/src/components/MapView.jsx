import React, { useState, useEffect } from 'react';
import { MapPin, Info, Navigation, ShieldCheck, Users, Zap } from 'lucide-react';

const MapView = ({ donations = [], type = 'NGO' }) => {
  // Simple Mock Map for demo (since we don't have Mapbox/Leaflet API keys)
  // type 'NGO' -> scans for donations
  // type 'DONOR' -> scans for nearby NGOs
  
  const [dots, setDots] = useState([]);

  useEffect(() => {
    // Generate some mock points based on type
    const points = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: 20 + Math.random() * 60,
      left: 20 + Math.random() * 60,
      title: type === 'DONOR' ? `Verified NGO Hub #${i+102}` : (donations[i]?.title || 'Surplus Alert'),
      capacity: type === 'DONOR' ? 'Active Dispatch' : (donations[i]?.capacity || 50)
    }));
    setDots(points);
  }, [type, donations]);

  return (
    <div className="bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl relative group h-full min-h-[500px]">
      {/* "Map" Canvas Background */}
      <div className="absolute inset-0 bg-[#0f172a] relative overflow-hidden">
         {/* Animated Grid Lines */}
         <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:60px_60px]"></div>
         
         {/* Sector Scan Pulse */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary-500/10 rounded-full animate-[ping_10s_linear_infinite]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary-500/20 rounded-full animate-[ping_6s_linear_infinite]"></div>

         {/* Center Point - User */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full animate-pulse absolute -inset-4"></div>
            <div className="relative w-10 h-10 bg-primary-700 rounded-2xl border-2 border-white/20 shadow-[0_0_20px_rgba(29,78,216,0.4)] flex items-center justify-center">
               <ShieldCheck size={18} className="text-white" />
            </div>
         </div>

         {/* Hotpots (Donations or NGOs) */}
         {dots.map((d) => (
            <div key={d.id} className="absolute z-10 transition-all duration-1000" style={{ top: `${d.top}%`, left: `${d.left}%` }}>
               <div className="relative group/pin">
                  <div className="w-8 h-8 bg-accent-500/10 rounded-full animate-bounce absolute -top-4"></div>
                  {type === 'DONOR' ? (
                     <div className="p-2 bg-accent-600 rounded-lg shadow-lg border border-accent-400/50 cursor-pointer hover:scale-110 transition-transform">
                        <Users size={16} className="text-white" />
                     </div>
                  ) : (
                     <MapPin className="text-primary-400 cursor-pointer drop-shadow-md hover:scale-125 transition-transform" size={28} />
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-52 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl opacity-0 group-hover/pin:opacity-100 transition-all pointer-events-none border border-slate-700 z-30 translate-y-2 group-hover/pin:translate-y-0">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">{d.title}</h5>
                     </div>
                     <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-3">
                        {type === 'DONOR' ? 'Operational node ready for surplus intake.' : `Rescue pending: ${d.capacity} meals requested.`}
                     </p>
                     <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-primary-900 text-primary-300 rounded text-[8px] font-bold uppercase tracking-widest border border-primary-800">Verified</span>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[8px] font-bold uppercase tracking-widest border border-slate-700">0.8km</span>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Map Controls */}
      <div className="absolute top-8 right-8 flex flex-col gap-3 z-20">
         <button className="p-3 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl text-white hover:bg-slate-700 transition-all shadow-xl">
            <Info size={20} />
         </button>
         <button className="p-3 bg-primary-700 border border-primary-600 rounded-xl text-white shadow-2xl hover:bg-primary-600 transition-all active:scale-95">
            <Navigation size={20} />
         </button>
      </div>

      <div className="absolute bottom-10 left-10 z-20 bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 max-w-xs shadow-2xl">
         <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 bg-primary-500/20 rounded-lg"><Zap size={16} className="text-primary-400 animate-pulse" /></div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Sector Telemetry</h4>
         </div>
         <p className="text-xs text-slate-400 font-medium leading-relaxed">
           Displaying {dots.length} verified {type === 'DONOR' ? 'distribution nodes' : 'active surplus alerts'} within your 5km operational radius.
         </p>
      </div>
    </div>
  );
};

export default MapView;
