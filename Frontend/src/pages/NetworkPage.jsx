import React from 'react';
import { Network, Search, Filter, ShieldCheck, Map, MapPin } from 'lucide-react';

const NetworkPage = () => {
  const ngos = [
    { name: 'City Harvest Coalition', type: 'High Volume Logistical', location: 'New York Area', capacity: '10,000 Meals/Day', status: 'Active Verified' },
    { name: 'Suburban Meal Network', type: 'Community Distribution', location: 'Tri-State Corridors', capacity: '2,500 Meals/Day', status: 'Active Verified' },
    { name: 'Global Relief Front', type: 'Emergency Response', location: 'International Operations', capacity: '50,000+ Meals/Day', status: 'Priority Dispatch' },
    { name: 'Veterans Shelter Corp', type: 'Targeted Demographic', location: 'Urban Centers', capacity: '500 Meals/Day', status: 'Active Verified' },
    { name: 'School Pantry Alliance', type: 'Youth Support', location: 'Metropolitan Schools', capacity: '1,200 Meals/Day', status: 'Active Verified' },
    { name: 'Crisis Care Centers', type: 'Disaster Relief', location: 'Coastal Regions', capacity: 'Varies', status: 'Standby Verified' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Corporate Header */}
      <div className="bg-primary-900 py-20 border-b border-primary-800">
         <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-white">
               <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">Verified Operational Network.</h1>
               <p className="text-primary-100 text-lg leading-relaxed mb-8">
                 Security and transparency require absolute knowledge of chain-of-custody. Our proprietary directory verifies the status and capacity of over 8,400 global NGO distribution nodes.
               </p>
               <div className="flex gap-4 items-center bg-primary-950 border border-primary-800 p-4 rounded max-w-md">
                 <ShieldCheck className="w-8 h-8 text-green-500 shrink-0"/>
                 <div>
                    <h4 className="text-white font-bold text-sm">Real-time Credentialing</h4>
                    <p className="text-xs text-primary-300">All displayed entities currently hold valid clearance tokens.</p>
                 </div>
               </div>
            </div>
            <div className="hidden lg:block">
               <Network className="w-64 h-64 text-primary-800 opacity-50" />
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
         {/* Directory Controls */}
         <div className="structured-card p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
            <div className="relative w-full md:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input type="text" placeholder="Query NGO by name or ID..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm outline-none focus:border-primary-500 transition-colors text-slate-900" />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded text-sm font-semibold text-slate-700 hover:bg-slate-50 w-full md:w-auto justify-center">
                  <Filter size={16} /> Filter Radius
               </button>
               <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-900 rounded text-sm font-semibold text-white hover:bg-slate-800 w-full md:w-auto justify-center">
                  <Map size={16} /> View Grid Map
               </button>
            </div>
         </div>

         {/* Directory Table Grid */}
         <div className="structured-card overflow-hidden bg-white">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-xs">Organization Identifier</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-xs">Operational Paradigm</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-xs">Primary Sector</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-xs">Throughput Cap</th>
                        <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-xs text-right">Clearance Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {ngos.map((ngo, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-5 font-bold text-slate-900">{ngo.name}</td>
                           <td className="px-6 py-5 text-slate-600 font-medium">{ngo.type}</td>
                           <td className="px-6 py-5 text-slate-600"><MapPin className="inline w-3 h-3 mr-1 text-slate-400"/> {ngo.location}</td>
                           <td className="px-6 py-5 text-slate-600 font-mono text-xs tracking-wider">{ngo.capacity}</td>
                           <td className="px-6 py-5 text-right">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border ${ngo.status.includes('Priority') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                 {ngo.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-sm font-medium text-slate-500">
               <span>Displaying 1-6 of 8,402 Verified Logistics Partners</span>
               <div className="flex gap-2">
                 <button className="px-3 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-50">Prev</button>
                 <button className="px-3 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100">Next</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default NetworkPage;
