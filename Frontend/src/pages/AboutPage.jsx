import React from 'react';
import { Target, Users, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  const boardMembers = [
    { name: 'Dr. Sarah Jenkins', role: 'Executive Director', desc: 'Former logistics coordinator for the UN World Food Programme.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
    { name: 'Michael Obanya', role: 'Head of Technological Infrastructure', desc: 'Veteran systems architect from major aerospace logistics.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
    { name: 'Elena Rostova', role: 'VP of Global NGO Partnerships', desc: '15 years managing international disaster relief supply chains.', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Formal Header */}
      <div className="bg-primary-900 py-24 pb-32 border-b border-primary-800 text-white">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h1 className="text-5xl font-bold font-serif mb-6 leading-tight max-w-2xl">
              Eliminating systemic food waste through <span className="text-primary-300">precision logistics.</span>
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl leading-relaxed">
              We operate at the nexus of corporate surplus and humanitarian deficit. Our platform ensures that viable food reaches verified communities within strict safety and operational windows.
            </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10 mb-20">
         <div className="structured-card p-10 sm:p-14 grid md:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-3xl font-bold font-serif text-slate-900 mb-6">Our Foundational Mandate</h2>
               <p className="text-slate-600 leading-relaxed mb-6">
                 Established in 2026, the Global Food Rescue Initiative was founded upon a singular, data-driven observation: hunger is rarely a problem of aggregate supply, but rather a persistent failure of logistical distribution.
               </p>
               <ul className="space-y-4">
                  {[
                    "Zero tolerance for landfill diversion of viable organics.",
                    "Strict technological verification of all receiving NGOs.",
                    "Real-time geographical matching to minimize transit latency."
                  ].map((item, idx) => (
                     <li key={idx} className="flex gap-3 items-start">
                        <CheckCircle2 className="w-6 h-6 text-primary-700 shrink-0" />
                        <span className="text-slate-700 font-medium">{item}</span>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="bg-slate-100 rounded border border-slate-200 aspect-[4/3] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=1000&auto=format&fit=crop" alt="Operations Center" className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80" />
            </div>
         </div>
      </div>

      {/* Financial Transparency */}
      <div className="bg-white py-24 border-y border-slate-200">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Financial Transparency</h2>
               <p className="text-slate-600 text-lg">As a registered 501(c)(3), maintaining rigorous fiduciary responsibility over donor capital ensures our logistical network remains highly performant and scalable.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <div className="structured-card p-8 border-t-4 border-t-primary-700">
                  <BarChart3 className="w-10 h-10 text-primary-700 mb-6" />
                  <h3 className="text-4xl font-bold text-slate-900 mb-2">91.4%</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Program Allocation</p>
                  <p className="text-slate-600 text-sm">Direct expenditure on cloud infrastructure, logistical algorithms, and NGO enablement.</p>
               </div>
               <div className="structured-card p-8 border-t-4 border-t-slate-400">
                  <Users className="w-10 h-10 text-slate-600 mb-6" />
                  <h3 className="text-4xl font-bold text-slate-900 mb-2">5.2%</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Administrative Overhead</p>
                  <p className="text-slate-600 text-sm">Executive compensation, legal compliance, and operational leasing.</p>
               </div>
               <div className="structured-card p-8 border-t-4 border-t-accent-500">
                  <TrendingUp className="w-10 h-10 text-accent-600 mb-6" />
                  <h3 className="text-4xl font-bold text-slate-900 mb-2">3.4%</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Fundraising</p>
                  <p className="text-slate-600 text-sm">Corporate outreach, donor acquisition, and annual audits.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Board of Directors */}
      <div className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-12 text-center">Board of Directors & Executive Leadership</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {boardMembers.map((member, idx) => (
                 <div key={idx} className="structured-card overflow-hidden">
                    <img src={member.img} alt={member.name} className="w-full h-64 object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
                    <div className="p-6">
                       <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                       <p className="text-sm font-bold text-primary-700 uppercase tracking-widest mb-4">{member.role}</p>
                       <p className="text-slate-600 text-sm leading-relaxed">{member.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AboutPage;
