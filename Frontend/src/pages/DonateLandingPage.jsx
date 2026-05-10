import React from 'react';
import { ArrowRight, Calculator, PieChart, ShieldCheck, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const DonateLandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Corporate Pitch Header */}
      <div className="bg-primary-950 border-b-4 border-primary-900 text-white py-24">
         <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
            <div className="max-w-2xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-accent-600 bg-accent-600/10 text-accent-400 text-sm font-bold uppercase tracking-widest mb-8">
                 <ShieldCheck size={16}/> Corporate Partnership Intake
               </div>
               <h1 className="text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
                 Elevate your CSR through <span className="text-primary-300">verified zero-waste logistics.</span>
               </h1>
               <p className="text-xl text-primary-200 leading-relaxed mb-10">
                 Convert your cafeteria and event surplus into verified humanitarian impact. Our API securely matches your location to 501(c)(3) relief organizations within 15 minutes.
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                 <Link to="/donor/register" className="btn-accent px-8 py-4 text-center">
                    Register as a Donor
                 </Link>
                 <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-white text-base font-semibold rounded-md hover:bg-primary-900 transition-colors text-center">
                    Talk to Our Team
                 </Link>
               </div>
            </div>
            
            {/* Trust Imagery */}
            <div className="hidden lg:block relative flex-1">
               <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop" className="rounded shadow-2xl border border-primary-800 opacity-80" alt="Corporate cafeteria surplus" />
               <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded border border-slate-200 shadow-xl max-w-xs text-slate-800">
                  <div className="text-3xl font-bold font-serif text-primary-700 mb-1">Tax-Deductible</div>
                  <p className="text-sm font-medium text-slate-600">Every logged transaction automatically generates IRS-compliant receipt documentation via the claiming NGO.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
         <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Why Partner With Our Initiative?</h2>
            <p className="text-slate-600 text-lg">We remove the logistical and legal friction preventing major corporations from acting immediately on food surplus.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-8 mb-24">
            <div className="structured-card p-10 hover:-translate-y-1 transition-all">
               <div className="w-14 h-14 bg-primary-50 rounded flex items-center justify-center border border-primary-100 mb-6">
                 <Scale className="w-6 h-6 text-primary-700" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Good Samaritan Protection</h3>
               <p className="text-slate-600 text-sm leading-relaxed">Operate confidently under full federal Good Samaritan Food Donation Act protections. Our legal structure totally insulates your corporation provided food is donated in good faith.</p>
            </div>

            <div className="structured-card p-10 hover:-translate-y-1 transition-all">
               <div className="w-14 h-14 bg-accent-50 rounded flex items-center justify-center border border-accent-100 mb-6">
                 <Calculator className="w-6 h-6 text-accent-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Automated Tax Receipts</h3>
               <p className="text-slate-600 text-sm leading-relaxed">Deduct inventory costs effortlessly. Our system automatically collates payload mass data and generates end-of-quarter aggregated NGO tax receipts for your finance department.</p>
            </div>

            <div className="structured-card p-10 hover:-translate-y-1 transition-all">
               <div className="w-14 h-14 bg-slate-100 rounded flex items-center justify-center border border-slate-200 mb-6">
                 <PieChart className="w-6 h-6 text-slate-700" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-4">Verifiable ESG Metrics</h3>
               <p className="text-slate-600 text-sm leading-relaxed">Directly pull real-time CO2 diversion and demographic impact metrics from our WebSocket API to populate your next corporate Environmental Social Governance (ESG) report.</p>
            </div>
         </div>
         
         <div className="bg-primary-900 rounded p-12 text-center text-white border border-primary-800 shadow-sm relative overflow-hidden">
             <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold font-serif mb-6">Ready to secure your cafeteria logistics?</h3>
                <Link to="/donor/register" className="btn-accent px-8">Get Started <ArrowRight size={18} className="ml-2"/></Link>
             </div>
         </div>
      </div>
    </div>
  );
};

export default DonateLandingPage;
