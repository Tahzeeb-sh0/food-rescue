import React from 'react';
import { Terminal, Code, Settings, ShieldAlert, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApiDocsPage = () => {
  return (
    <div className="bg-[#0f172a] min-h-screen pb-24 text-slate-300">
      {/* Developer Header */}
      <div className="py-24 border-b border-slate-800 bg-[#0b1121]">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest mb-8 font-mono">
               <Terminal size={14}/> FOOD_RESCUE_REST_V2
            </div>
            <h1 className="text-5xl font-bold font-serif text-white mb-6">API Architectural Integration</h1>
            <p className="text-slate-400 text-xl max-w-3xl leading-relaxed">
              Programmatic payload bridging for Enterprise Catering Software. Submit surplus drops autonomously without launching a web portal.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 grid lg:grid-cols-4 gap-12">
         {/* API Sidebar */}
         <div className="col-span-1 hidden lg:block border-r border-slate-800 pr-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Documentation Index</h4>
            <ul className="space-y-4 text-sm font-medium">
               <li><a href="#" className="text-blue-400">Authentication</a></li>
               <li><a href="#" className="text-slate-400 hover:text-white">POST /surplus/create</a></li>
               <li><a href="#" className="text-slate-400 hover:text-white">GET /surplus/status</a></li>
               <li><a href="#" className="text-slate-400 hover:text-white">WebSocket Subscriptions</a></li>
               <li><a href="#" className="flex gap-2 text-slate-400 hover:text-white mt-8 pt-6 border-t border-slate-800"><Settings size={16}/> Webhooks Setup</a></li>
            </ul>
         </div>

         {/* Docs Content */}
         <div className="col-span-1 lg:col-span-3 space-y-16">
            
            <section>
               <h2 className="text-3xl font-bold text-white mb-4">Bearer Authentication</h2>
               <p className="text-slate-400 leading-relaxed mb-6">
                 Corporate hubs must append an encrypted Bearer token within the Authorization header. Development environments use parallel stateless endpoints.
               </p>
               <div className="bg-[#1e293b] rounded-lg p-6 border border-slate-700 font-mono text-sm shadow-xl">
                  <div className="text-slate-500 mb-2"># Request</div>
                  <div className="text-blue-300 break-all mb-4">
                     curl -X POST https://api.foodrescue.org/v2/auth \
                     <br/> -H "Content-Type: application/json" \
                     <br/> -d '&#123;"client_id": "CORP-NYC-902", "client_secret": "sk_live_xyz..."&#125;'
                  </div>
               </div>
            </section>

            <section>
               <div className="flex gap-4 items-center mb-6">
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-code text-sm font-bold tracking-widest">POST</span>
                  <h2 className="text-3xl font-bold text-white">/api/v2/surplus/create</h2>
               </div>
               <p className="text-slate-400 leading-relaxed mb-6">
                 Injects a real-time payload into the STOMP/WebSocket NGO dispatch grid. The `locationTag` must conform to 6-decimal point floating coordinates.
               </p>
               <div className="bg-[#1e293b] flex flex-col rounded-lg border border-slate-700 font-mono text-sm shadow-xl overflow-hidden">
                  <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700 text-slate-400 flex justify-between items-center">
                     Request Body (JSON)
                     <Code size={16}/>
                  </div>
                  <div className="p-6">
                     <span className="text-[#cba6f7]">&#123;</span><br/>
                     &nbsp;&nbsp;<span className="text-[#89b4fa]">"foodType"</span>: <span className="text-[#a6e3a1]">"Catered Sandwiches"</span>,<br/>
                     &nbsp;&nbsp;<span className="text-[#89b4fa]">"quantity"</span>: <span className="text-[#f9e2af]">250</span>,<br/>
                     &nbsp;&nbsp;<span className="text-[#89b4fa]">"locationTag"</span>: <span className="text-[#a6e3a1]">"40.712776, -74.005974"</span>,<br/>
                     &nbsp;&nbsp;<span className="text-[#89b4fa]">"strictExpiryHours"</span>: <span className="text-[#f9e2af]">2</span><br/>
                     <span className="text-[#cba6f7]">&#125;</span>
                  </div>
               </div>
            </section>

            <div className="p-8 border-l-4 border-l-amber-500 bg-amber-500/5 text-amber-200 rounded-r">
               <div className="flex gap-3 font-bold text-lg mb-2 items-center text-amber-500"><ShieldAlert size={20}/> Abuse Protection Protocol</div>
               <p className="text-sm">Submitting structurally identical payloads mapped to the exact coordinates within a 15-minute STOMP window will trigger rate limiting and drop HTTP connection. Please batch items logically.</p>
            </div>

            <div className="border-t border-slate-800 pt-16 flex justify-between items-center pb-20">
               <div>
                  <h3 className="text-white font-bold text-xl mb-2">Ready to compile?</h3>
                  <p className="text-slate-400 text-sm">Review sample applications via GitHub.</p>
               </div>
               <a href="#" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg transition-colors flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Cpu size={18}/> Access SDK Hub
               </a>
            </div>

         </div>
      </div>
    </div>
  );
};

export default ApiDocsPage;
