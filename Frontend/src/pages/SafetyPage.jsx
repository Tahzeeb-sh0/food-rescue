import React from 'react';
import { ShieldCheck, ThermometerSnowflake, FileCheck, Anchor } from 'lucide-react';

const SafetyPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Heavy Corporate Header */}
      <div className="bg-primary-900 py-24 pb-32 border-b-8 border-primary-800 text-center">
         <h1 className="text-5xl font-bold font-serif text-white mb-6">Food Safety & Pathogen Mitigation</h1>
         <p className="text-primary-200 text-xl max-w-3xl mx-auto leading-relaxed">
           Our entire computational infrastructure is utterly useless if the transferred food is compromised. We enforce uncompromising legal standards of supply-chain integrity.
         </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10 mb-20 grid md:grid-cols-3 gap-8">
         <div className="structured-card p-10 bg-white">
            <ThermometerSnowflake className="w-10 h-10 text-primary-700 mb-6" />
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">Time-Temperature Constraint</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Logistics algorithms instantly un-list any hot-held catering batch if NGO collection does not execute within a 90-minute strict window.
            </p>
         </div>
         <div className="structured-card p-10 bg-white border-b-4 border-b-accent-600">
            <FileCheck className="w-10 h-10 text-accent-600 mb-6" />
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">Facility Licensing</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              NGOs cannot claim loads without an API-verified, state-assigned food handler's facility number loaded into their profile. Expired licenses suspend accounts immediately.
            </p>
         </div>
         <div className="structured-card p-10 bg-white">
            <Anchor className="w-10 h-10 text-slate-700 mb-6" />
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">Payload Indemnity</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              If an NGO observes poor packaging standards upon pickup, they possess absolute platform authority to report and reject the batch without algorithmic penalty.
            </p>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
         <div className="structured-card p-10 sm:p-14 bg-white border-l-4 border-l-primary-700">
            <div className="flex gap-4 items-center mb-8 pb-6 border-b border-slate-200">
               <ShieldCheck className="w-8 h-8 text-primary-800 shrink-0"/>
               <h2 className="text-2xl font-bold font-serif text-slate-900">Good Samaritan Food Donation Act</h2>
            </div>
            
            <div className="prose max-w-none text-slate-600">
               <p className="leading-relaxed mb-6 font-medium text-lg text-slate-700">
                 The Federal Emerson Good Samaritan Food Donation Act (42 U.S.C. § 1791) provides powerful legal insulation for corporate donors routing unserved food via our network.
               </p>
               <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">Liability Shield</h3>
               <p className="mb-6 leading-relaxed text-sm">
                 Pursuant to the Act, a person or gleaner shall not be subject to civil or criminal liability arising from the nature, age, packaging, or condition of apparently wholesome food or an apparently fit grocery product that the person or gleaner donates in good faith to a nonprofit organization for ultimate distribution to needy individuals.
               </p>
               <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">Platform Obligation</h3>
               <p className="mb-6 leading-relaxed text-sm">
                 By strictly acting alongside authorized 501(c)(3) receiver bodies, our APIs ensure donors meet the required federal thresholds to access this absolute indemnification from prosecution.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SafetyPage;
