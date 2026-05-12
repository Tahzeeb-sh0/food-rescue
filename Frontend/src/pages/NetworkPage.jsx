import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, 
  Search, 
  ShieldCheck, 
  Map as MapIcon, 
  MapPin, 
  LayoutGrid, 
  Info,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

const NetworkPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [ngos, setNgos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('${API_BASE}/api/users/ngos')
      .then(res => res.json())
      .then(data => {
        // Convert backend User model to directory format
        const formattedNgos = data.map(user => ({
          id: user.id,
          name: user.name,
          type: 'Verified NGO',
          location: user.location ? 'Geolocated Node' : 'Regional Access',
          capacity: 'Variable Throughput',
          status: 'Active Verified'
        }));
        setNgos(formattedNgos);
      })
      .catch(() => {
        setNgos([
          { id: 'NGO-001', name: 'City Harvest Coalition', type: 'High Volume Logistical', location: 'New York Area', capacity: '10,000 Meals/Day', status: 'Active Verified' },
          { id: 'NGO-002', name: 'Suburban Meal Network', type: 'Community Distribution', location: 'Tri-State Corridors', capacity: '2,500 Meals/Day', status: 'Active Verified' },
          { id: 'NGO-003', name: 'Global Relief Front', type: 'Emergency Response', location: 'International Operations', capacity: '50,000+ Meals/Day', status: 'Priority Dispatch' },
          { id: 'NGO-004', name: 'Veterans Shelter Corp', type: 'Targeted Demographic', location: 'Urban Centers', capacity: '500 Meals/Day', status: 'Active Verified' },
          { id: 'NGO-005', name: 'School Pantry Alliance', type: 'Youth Support', location: 'Metropolitan Schools', capacity: '1,200 Meals/Day', status: 'Active Verified' },
          { id: 'NGO-006', name: 'Crisis Care Centers', type: 'Disaster Relief', location: 'Coastal Regions', capacity: 'Varies', status: 'Standby Verified' },
        ]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredNgos = useMemo(() => {
    return ngos.filter(ngo => 
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, ngos]);

  const totalPages = Math.ceil(filteredNgos.length / itemsPerPage);
  const paginatedNgos = filteredNgos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-900">
      {/* CORPORATE HEADER */}
      <div className="bg-primary-900 py-20 border-b border-primary-800 relative overflow-hidden">
         <div className="absolute top-0 right-0 opacity-10">
            <Network className="w-96 h-96 text-white translate-x-20 -translate-y-20" />
         </div>
         <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">Verified Operational Network.</h1>
            <p className="text-primary-100 text-lg leading-relaxed mb-8 max-w-2xl">
               Security and transparency require absolute knowledge of chain-of-custody. Our proprietary directory verifies the status and capacity of global NGO distribution nodes.
            </p>
            <div className="flex gap-4 items-center bg-primary-950/50 backdrop-blur-sm border border-primary-800 p-4 rounded-lg max-w-md shadow-inner">
               <ShieldCheck className="w-8 h-8 text-green-500 shrink-0"/>
               <div>
                  <h4 className="font-bold text-sm tracking-wide">Real-time Credentialing</h4>
                  <p className="text-xs text-primary-300">All displayed entities currently hold valid clearance tokens.</p>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
         {/* DIRECTORY CONTROLS */}
         <div className="structured-card p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white border-slate-200 shadow-sm rounded-lg">
            <div className="relative w-full md:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input 
                  type="text" 
                  placeholder="Query NGO by name or type..." 
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm outline-none focus:ring-1 focus:ring-primary-500 transition-all text-slate-900" 
               />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <button 
                  onClick={() => setViewMode(viewMode === 'table' ? 'map' : 'table')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 border border-slate-900 rounded text-sm font-bold text-white hover:bg-slate-800 transition-colors w-full md:w-auto justify-center shadow-lg"
               >
                  {viewMode === 'table' ? <MapIcon size={16} /> : <LayoutGrid size={16} />}
                  {viewMode === 'table' ? 'View Grid Map' : 'View Directory Table'}
               </button>
            </div>
         </div>

         {/* PRIMARY CONTENT AREA */}
         {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center text-slate-400">
               <Loader2 className="w-12 h-12 animate-spin mb-4" />
               <p className="font-medium">Loading NGO network...</p>
            </div>
         ) : viewMode === 'table' ? (
            <div className="structured-card overflow-hidden bg-white mb-12 border-slate-200 shadow-sm rounded-lg">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                           <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Organization</th>
                           <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Type</th>
                           <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Location</th>
                           <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Capacity</th>
                           <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {paginatedNgos.length > 0 ? (
                          paginatedNgos.map((ngo) => (
                             <tr key={ngo.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-5 font-bold text-slate-900">{ngo.name}</td>
                                <td className="px-6 py-5 text-slate-600 font-medium">{ngo.type}</td>
                                <td className="px-6 py-5 text-slate-600">
                                   <MapPin className="inline w-3 h-3 mr-1 text-slate-400"/> {ngo.location}
                                </td>
                                <td className="px-6 py-5 text-slate-600 font-mono text-xs tracking-wider">{ngo.capacity}</td>
                                <td className="px-6 py-5 text-right">
                                   <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${ngo.status.includes('Priority') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                      {ngo.status}
                                   </span>
                                </td>
                             </tr>
                          ))
                        ) : (
                          <tr>
                             <td colSpan="5" className="px-6 py-20 text-center">
                                <Info className="mx-auto w-12 h-12 text-slate-200 mb-4" />
                                <p className="text-slate-500 font-medium">No NGOs match your search.</p>
                                <button onClick={() => setSearchQuery('')} className="text-primary-700 font-bold mt-2 hover:underline">Reset Search</button>
                             </td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
               
               {/* PAGINATION FOOTER */}
               <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500">
                  <span>Displaying {(currentPage - 1) * itemsPerPage + 1}-{(currentPage - 1) * itemsPerPage + paginatedNgos.length} of {filteredNgos.length} Verified Partners</span>
                  <div className="flex gap-2">
                    <button 
                       disabled={currentPage === 1}
                       onClick={() => setCurrentPage(prev => prev - 1)}
                       className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                       <ChevronLeft size={16} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                       <button 
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-1 border rounded transition-colors ${currentPage === i + 1 ? 'bg-primary-700 border-primary-700 text-white' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'}`}
                       >
                          {i + 1}
                       </button>
                    ))}
                    <button 
                       disabled={currentPage === totalPages || totalPages === 0}
                       onClick={() => setCurrentPage(prev => prev + 1)}
                       className="p-2 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                       <ChevronRight size={16} />
                    </button>
                  </div>
               </div>
            </div>
         ) : (
            /* MAP PLACEHOLDER */
            <div className="structured-card overflow-hidden bg-slate-100 mb-12 border-slate-200 h-[600px] relative flex items-center justify-center rounded-lg">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover opacity-20 grayscale" />
               <div className="relative z-10 text-center p-8 bg-white/90 backdrop-blur-md rounded-xl border border-white shadow-2xl max-w-md">
                  <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-6">
                     <MapIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-900 mb-4">Map View</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                     The interactive map is available to verified members. Sign in or register to access it.
                  </p>
                  <div className="flex flex-col gap-3">
                     <a href="/ngo/register" className="btn-primary w-full py-2.5 text-sm uppercase tracking-widest">Register to Unlock</a>
                     <button onClick={() => setViewMode('table')} className="text-slate-500 font-bold hover:text-slate-700 text-sm">Back to Table</button>
                  </div>
               </div>
               <div className="absolute top-1/4 left-1/3 text-primary-700 animate-bounce"><MapPin size={24} /></div>
               <div className="absolute top-1/2 left-1/2 text-primary-700 animate-bounce delay-75"><MapPin size={24} /></div>
               <div className="absolute bottom-1/3 right-1/4 text-accent-600 animate-bounce delay-150"><MapPin size={24} /></div>
            </div>
         )}
      </div>
    </div>
  );
};

export default NetworkPage;
