import React from 'react';
import { 
  Scale, 
  ShieldCheck, 
  FileCheck, 
  AlertCircle, 
  Download, 
  BookOpen,
  Gavel,
  Verified
} from 'lucide-react';

const CompliancePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Corporate Header */}
      <div className="bg-slate-900 py-24 border-b border-slate-800 text-center relative overflow-hidden">
         <Gavel className="absolute -bottom-10 -left-10 w-64 h-64 text-slate-800 opacity-50 -rotate-12" />
         <div className="max-w-3xl mx-auto px-6 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">Legal & Regulatory Compliance</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Our platform operates under strict adherence to international food safety regulations and national Good Samaritan acts to protect both donors and receiving agencies.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 grid lg:grid-cols-3 gap-12">
         {/* Sidebar: Compliance Documents */}
         <div className="lg:col-span-1 space-y-6">
            <div className="structured-card p-8 bg-white border-l-4 border-primary-700">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 pb-4 border-b border-slate-100">Verification Portfolio</h3>
               <div className="space-y-4">
                  {[
                    "Federal 501(c)(3) Standards",
                    "HACCP Safety Protocols",
                    "ISO 22000 Compliance",
                    "EU Food Waste Directives"
                  ].map(doc => (
                    <button key={doc} className="w-full flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200 text-left hover:bg-white hover:border-primary-300 transition-all group">
                       <span className="text-xs font-bold text-slate-700">{doc}</span>
                       <Download size={14} className="text-slate-400 group-hover:text-primary-700" />
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-primary-900 rounded-lg p-8 text-white shadow-xl">
               <ShieldCheck className="w-10 h-10 text-accent-400 mb-6" />
               <h4 className="text-xl font-bold mb-3">Donor Immunity Shield</h4>
               <p className="text-primary-200 text-sm leading-relaxed mb-6">
                 We provide automated legal indemnification documentation for every rescue batch logged in our system.
               </p>
               <button className="text-accent-400 text-xs font-bold uppercase tracking-widest hover:underline">Read Legal Abstract →</button>
            </div>
         </div>

         {/* Content: Legal Frameworks */}
         <div className="lg:col-span-2 space-y-12">
            <section>
               <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white rounded border border-slate-200 shadow-sm text-primary-700"><Scale size={24}/></div>
                  <h2 className="text-3xl font-bold font-serif text-slate-900">Good Samaritan Protection</h2>
               </div>
               <div className="structured-card p-8 bg-white text-slate-600 leading-relaxed space-y-6">
                  <p>
                    The <strong>Bill Emerson Good Samaritan Food Donation Act</strong> (1996) provides comprehensive liability protection for corporate food donors. Our platform ensures compliance by enforcing the following standards:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="flex gap-3 text-sm font-medium">
                        <CheckCircle size={18} className="text-green-600 shrink-0" /> Good Faith Intent
                     </div>
                     <div className="flex gap-3 text-sm font-medium">
                        <CheckCircle size={18} className="text-green-600 shrink-0" /> Safety Standards Audit
                     </div>
                     <div className="flex gap-3 text-sm font-medium">
                        <CheckCircle size={18} className="text-green-600 shrink-0" /> Verified NGO Recipient
                     </div>
                     <div className="flex gap-3 text-sm font-medium">
                        <CheckCircle size={18} className="text-green-600 shrink-0" /> No Individual Handouts
                     </div>
                  </div>
               </div>
            </section>

            <section>
               <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white rounded border border-slate-200 shadow-sm text-primary-700"><FileCheck size={24}/></div>
                  <h2 className="text-3xl font-bold font-serif text-slate-900">Food Safety Protocol (HACCP)</h2>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="structured-card p-6 bg-white">
                     <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Verified size={18} className="text-primary-700" /> Temperature Control
                     </h4>
                     <p className="text-sm text-slate-500">All perishables must be registered after maintaining a cold chain of 4°C or below during storage.</p>
                  </div>
                  <div className="structured-card p-6 bg-white">
                     <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Verified size={18} className="text-primary-700" /> Transit Sourcing
                     </h4>
                     <p className="text-sm text-slate-500">NGOs must utilize insulated containers or refrigerated vehicles for hauls exceeding 5km.</p>
                  </div>
                  <div className="structured-card p-6 bg-white">
                     <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Verified size={18} className="text-primary-700" /> Packaging Matrix
                     </h4>
                     <p className="text-sm text-slate-500">Only commercially-viable, tamper-evident packaging is eligible for logarithmic broadcast.</p>
                  </div>
                  <div className="structured-card p-6 bg-white">
                     <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Verified size={18} className="text-primary-700" /> Audit Logging
                     </h4>
                     <p className="text-sm text-slate-500">Verification of safety standards is required by both donor and recipient via the platform UI.</p>
                  </div>
               </div>
            </section>

            <div className="bg-amber-50 border border-amber-100 p-8 rounded-lg flex gap-6">
               <AlertCircle className="text-amber-600 shrink-0" size={32} />
               <div className="text-sm">
                  <h4 className="font-bold text-amber-900 mb-2 uppercase tracking-widest text-xs">Compliance Infraction Notice</h4>
                  <p className="text-amber-800 leading-relaxed font-medium mb-4">
                    Minor safety infractions result in temporary credentials suspension (7 days). Major infractions or gross negligence will result in immediate permanent expulsion from the Global Food Rescue network.
                  </p>
                  <button className="text-amber-900 font-bold underline">Review Penalty Matrix</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CompliancePage;
