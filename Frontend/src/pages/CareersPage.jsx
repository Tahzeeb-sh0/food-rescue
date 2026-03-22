import React from 'react';
import { Briefcase, ArrowRight, HeartPulse, GraduationCap, Plane, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareersPage = () => {
  const jobs = [
    { title: 'Logistics Optimization Engineer', dept: 'Engineering', loc: 'New York, US (Hybrid)', type: 'Full-Time' },
    { title: 'NGO Verification Specialist', dept: 'Operations', loc: 'London, UK (Remote)', type: 'Full-Time' },
    { title: 'Corporate Donor Liaison', dept: 'Partnerships', loc: 'San Francisco, US', type: 'Full-Time' },
    { title: 'WebSocket Infrastructure Architect', dept: 'Engineering', loc: 'Remote', type: 'Contract' },
    { title: 'Regional Supply Chain Director', dept: 'Operations', loc: 'Nairobi, KE', type: 'Full-Time' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary-900 border-b border-primary-800 text-white py-24">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h1 className="text-5xl font-bold font-serif mb-6 leading-tight max-w-2xl">
              Solve the world's most critical <span className="text-accent-400">logistical puzzle.</span>
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl leading-relaxed mb-10">
              Joining the Global Food Rescue Initiative means your code, negotiations, and strategic planning directly divert food from landfills to vulnerable communities on a global scale.
            </p>
            <div className="flex gap-4">
              <a href="#positions" className="btn-accent px-8 py-3">View Open Deployments</a>
            </div>
         </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-24 bg-white border-b border-slate-200">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Uncompromising Support Structure</h2>
               <p className="text-slate-600 text-lg">We demand absolute excellence in executing our humanitarian mandate, and we provide unparalleled support structures to ensure our teams perform at their peak.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="structured-card p-8 hover:-translate-y-1 transition-transform">
                  <HeartPulse className="w-10 h-10 text-primary-700 mb-6" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Global Healthcare</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Comprehensive, zero-deductible medical coverage for you and your dependents globally.</p>
               </div>
               <div className="structured-card p-8 hover:-translate-y-1 transition-transform">
                  <Plane className="w-10 h-10 text-primary-700 mb-6" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Field Deployments</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Mandatory quarterly field visits to our NGO partners fully compensated by the organization.</p>
               </div>
               <div className="structured-card p-8 hover:-translate-y-1 transition-transform">
                  <GraduationCap className="w-10 h-10 text-primary-700 mb-6" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Continuous Education</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Annual $5,000 stipend dedicated to further supply-chain or computer science certifications.</p>
               </div>
               <div className="structured-card p-8 hover:-translate-y-1 transition-transform">
                  <Cpu className="w-10 h-10 text-primary-700 mb-6" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Infrastructure Autonomy</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Provisioning of top-tier hardware and a generous WFH infrastructure allowance.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Open Positions */}
      <div id="positions" className="bg-slate-50 py-24">
         <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10 pb-4 border-b border-slate-200">
               <h2 className="text-3xl font-bold font-serif text-slate-900">Current Headquarters Openings</h2>
               <p className="text-sm font-bold text-primary-700 uppercase tracking-widest">5 Roles Available</p>
            </div>
            
            <div className="space-y-4">
               {jobs.map((job, idx) => (
                  <div key={idx} className="structured-card p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-6 group hover:border-primary-300 transition-colors">
                     <div>
                        <div className="flex gap-3 mb-2">
                           <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded uppercase tracking-widest">{job.dept}</span>
                           <span className="text-xs font-bold bg-primary-50 text-primary-700 px-2.5 py-1 rounded uppercase tracking-widest border border-primary-100">{job.type}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary-700 transition-colors">{job.title}</h3>
                        <p className="text-slate-500 text-sm font-medium">{job.loc}</p>
                     </div>
                     <Link to="#" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 group-hover:text-primary-700 whitespace-nowrap">
                        Submit Dossier <ArrowRight size={16}/>
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default CareersPage;
