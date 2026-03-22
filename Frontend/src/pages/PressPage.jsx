import React from 'react';
import { Newspaper, Rss, ArrowRight, DownloadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

const PressPage = () => {
  const releases = [
    { date: 'OCT 24, 2026', title: 'Global Food Rescue Initiative processes 10th Million Load via WebSocket Protocol.', tag: 'Engineering' },
    { date: 'SEP 12, 2026', title: 'Hilton Worldwide integrates catering surplus directly into FR-API architecture.', tag: 'Corporate Partnerships' },
    { date: 'AUG 05, 2026', title: 'Independent Audit confirms incredible 91.4% operational density.', tag: 'Fiduciary' },
    { date: 'MAY 18, 2026', title: 'Executive Director Dr. Jenkins addresses UN Council on supply-chain bottlenecks.', tag: 'Leadership' },
    { date: 'JAN 02, 2026', title: 'Emergency Reactivation Protocol deployed during severe Mid-Atlantic grid closures.', tag: 'Operations' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Corporate Header */}
      <div className="bg-primary-950 py-24 pb-32 border-b-8 border-primary-900 border-b-8">
         <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
            <Rss className="w-12 h-12 text-primary-400 mb-6"/>
            <h1 className="text-5xl font-bold font-serif text-white mb-6">Press & Media Relations</h1>
            <p className="text-primary-200 text-xl max-w-2xl leading-relaxed">
              Official corporate dispatches, brand resources, and logistical milestone reporting.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10 grid lg:grid-cols-3 gap-12">
         {/* Media Inquiries & Kit */}
         <div className="lg:col-span-1 space-y-8">
            <div className="structured-card p-10 bg-white border-t-4 border-t-primary-700">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-100 pb-4">Media Contact</h3>
               <p className="text-sm text-slate-600 leading-relaxed mb-6">
                 For immediate scheduling, interviews with our engineering or logistics directors, or high-definition field photography, please bypass standard forms.
               </p>
               <a href="mailto:press@foodrescue.org" className="text-lg font-bold font-serif text-primary-700 hover:text-primary-800">
                  press@foodrescue.org
               </a>
            </div>

            <div className="structured-card p-10 bg-white">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-100 pb-4">Brand Kit Assets</h3>
               <p className="text-sm text-slate-600 leading-relaxed mb-6">
                 Download strict vector logos, typography protocols, and approved field-deployment photography packs.
               </p>
               <button className="flex items-center gap-3 w-full justify-center px-4 py-3 border border-slate-300 rounded text-slate-700 text-sm font-bold uppercase tracking-wide hover:bg-slate-50">
                  <DownloadCloud size={16}/> Download .ZIP Archive
               </button>
            </div>
         </div>

         {/* Press Release Timeline */}
         <div className="lg:col-span-2">
            <div className="structured-card bg-white p-10">
               <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
                  <Newspaper className="w-8 h-8 text-primary-800"/>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">Official Dispatches</h2>
               </div>

               <div className="space-y-6">
                  {releases.map((release, idx) => (
                     <div key={idx} className="group flex flex-col md:flex-row gap-6 md:items-center py-6 border-b border-slate-100 last:border-0 hover:border-primary-300 transition-colors">
                        <div className="w-32 shrink-0">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{release.date}</p>
                           <p className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest inline-block">{release.tag}</p>
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 flex-1 group-hover:text-primary-700 transition-colors cursor-pointer pr-4 leading-relaxed">
                           {release.title}
                        </h3>
                        <Link to="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors shrink-0">
                           <ArrowRight size={18}/>
                        </Link>
                     </div>
                  ))}
               </div>
               
               <div className="pt-10 mt-6 flex justify-center">
                  <button className="btn-outline px-8 rounded px-8">Load Historical Archive</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PressPage;
