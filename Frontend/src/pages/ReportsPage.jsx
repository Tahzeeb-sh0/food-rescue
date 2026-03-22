import React from 'react';
import { FileText, Download, TrendingUp, DollarSign } from 'lucide-react';

const ReportsPage = () => {
  const reports = [
    { year: 2025, title: 'Annual Impact & Fiduciary Audit', size: '4.2 MB' },
    { year: 2024, title: 'Annual ESG Logistical Review', size: '3.8 MB' },
    { year: 2023, title: 'Global Foundational Audit', size: '5.1 MB' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Corporate Header */}
      <div className="bg-primary-950 py-24 pb-32 border-b-8 border-primary-900 border-b-8">
         <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold font-serif text-white mb-6">Financial Transparency</h1>
            <p className="text-primary-200 text-xl max-w-3xl mx-auto leading-relaxed">
              We operate under strict fiscal conservatism. 100% of our financial statements and aggregate logistical volume are subjected to independent third-party audits annually.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10 mb-20">
         <div className="grid md:grid-cols-2 gap-8">
            <div className="structured-card p-10 bg-white">
               <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-primary-50 rounded border border-primary-100">
                   <TrendingUp className="w-8 h-8 text-primary-700"/>
                 </div>
                 <h2 className="text-2xl font-bold font-serif text-slate-900">Program Efficiency</h2>
               </div>
               <p className="text-4xl font-bold text-slate-900 mb-3">91.4% <span className="text-lg text-slate-500 font-medium">to direct operations</span></p>
               <p className="text-slate-600 leading-relaxed text-sm">
                 Every dollar donated via grants is funneled directly into server uptime, algorithm maintenance, and enabling verified NGOs with field logistics technology. We maintain less than 6% administrative overhead.
               </p>
            </div>
            
            <div className="structured-card p-10 bg-white">
               <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-accent-50 rounded border border-accent-100">
                   <DollarSign className="w-8 h-8 text-accent-700"/>
                 </div>
                 <h2 className="text-2xl font-bold font-serif text-slate-900">Total Capital Routed</h2>
               </div>
               <p className="text-4xl font-bold text-slate-900 mb-3">$14.2M <span className="text-lg text-slate-500 font-medium">in food value mapped</span></p>
               <p className="text-slate-600 leading-relaxed text-sm">
                 Instead of handling cash value, our software logged and diverted over 14 million dollars worth of commercially viable surplus food directly into community distribution channels locally.
               </p>
            </div>
         </div>
      </div>

      {/* Audit List */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
         <h2 className="text-3xl font-bold font-serif text-slate-900 mb-8 border-b border-slate-200 pb-4">Independent SEC-Standard Audits</h2>
         
         <div className="space-y-4">
            {reports.map((doc, idx) => (
               <div key={idx} className="structured-card p-6 flex items-center justify-between hover:border-primary-300 transition-colors bg-white">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded flex flex-col justify-center items-center text-slate-700 font-bold">
                        <span className="text-xs uppercase tracking-widest text-slate-400">PDF</span>
                        {doc.year}
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{doc.title}</h3>
                        <p className="text-slate-500 text-sm font-medium flex gap-3 items-center">
                           <FileText size={14}/> Verified Data Set • {doc.size}
                        </p>
                     </div>
                  </div>
                  <button className="hidden sm:flex items-center gap-2 px-6 py-2 bg-slate-50 border border-slate-300 rounded text-slate-700 text-sm font-bold uppercase tracking-wide hover:bg-slate-100">
                     <Download size={16}/> Fetch Document
                  </button>
               </div>
            ))}
         </div>
         
         <div className="mt-12 text-center text-sm font-medium text-slate-500">
            For granular ESG metrics spanning back to 2022, please query our <a href="/api" className="text-primary-700 hover:underline">Public Analytics API</a>.
         </div>
      </div>
    </div>
  );
};

export default ReportsPage;
