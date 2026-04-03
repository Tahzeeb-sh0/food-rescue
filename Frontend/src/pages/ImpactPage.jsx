import React, { useState, useEffect } from 'react';
import { ShieldCheck, HeartPulse, Globe2, ArrowRight, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImpactPage = () => {
  const [stats, setStats] = useState({ totalMeals: '12.5M', activeNgos: '8,400', co2DivertedTons: '45k' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/stats/impact')
      .then(res => res.json())
      .then(data => {
        setStats({
          totalMeals: data.totalMeals.toLocaleString(),
          activeNgos: data.activeNgos.toLocaleString(),
          co2DivertedTons: data.co2DivertedTons.toLocaleString() + 'T'
        });
      })
      .catch(err => console.warn("Using fallback static stats for Impact Page."))
      .finally(() => setIsLoading(false));
  }, []);
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section - Solid Corporate Header */}
      <div className="bg-primary-900 text-white py-24 pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl font-bold font-serif mb-6 leading-tight">
              Transparent <span className="text-primary-300">Impact.</span>
            </h1>
            <p className="text-xl text-primary-100 font-medium leading-relaxed mb-8">
              We monitor, verify, and quantify global food recovery operations to uphold strict adherence to our zero-waste mandate.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-800 text-primary-200 rounded text-sm font-semibold tracking-wide border border-primary-700 mt-2">
               <FileText size={16} /> DOWNLOAD 2025 IMPACT REPORT (PDF)
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section - Corporate Cards */}
      <div className="relative -mt-16 sm:-mt-20 z-10 px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="structured-card p-8 sm:p-12">
          <dl className="grid grid-cols-1 gap-12 sm:grid-cols-3 divide-y-2 sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="flex flex-col items-start justify-center text-left sm:pr-8">
              <dt className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Meals Rescued</dt>
              <dd className="text-5xl lg:text-6xl font-bold font-serif text-primary-700 mb-2">
                {isLoading ? <Loader2 className="animate-spin text-primary-200" size={40}/> : stats.totalMeals}
              </dd>
              <span className="text-sm text-slate-400 font-medium border-t border-slate-100 pt-3 w-full">Independently Verified</span>
            </div>
            <div className="flex flex-col items-start justify-center text-left sm:px-8 pt-10 sm:pt-0">
              <dt className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Active NGOs</dt>
              <dd className="text-5xl lg:text-6xl font-bold font-serif text-slate-800 mb-2">
                {isLoading ? <Loader2 className="animate-spin text-slate-200" size={40}/> : stats.activeNgos}
              </dd>
              <span className="text-sm text-slate-400 font-medium border-t border-slate-100 pt-3 w-full">Across 42 Countries</span>
            </div>
            <div className="flex flex-col items-start justify-center text-left sm:pl-8 pt-10 sm:pt-0">
              <dt className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">CO2 Diverted</dt>
              <dd className="text-5xl lg:text-6xl font-bold font-serif text-slate-800 mb-2">
                {isLoading ? <Loader2 className="animate-spin text-slate-200" size={40}/> : stats.co2DivertedTons}
              </dd>
              <span className="text-sm text-slate-400 font-medium border-t border-slate-100 pt-3 w-full">Methane Emissions Prevented</span>
            </div>
          </dl>
        </div>
      </div>

      {/* Sustainable Goals - Clean Grid */}
      <div className="py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Adherence to UN Sustainable Development Goals</h2>
            <p className="text-lg text-slate-600">Every donation processed directly targets core humanitarian objectives.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="structured-card p-8">
               <div className="w-12 h-12 rounded bg-accent-50 flex items-center justify-center mb-6">
                 <HeartPulse size={24} className="text-accent-600" />
               </div>
               <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">Zero Hunger (SDG 2)</h3>
               <p className="text-slate-600 leading-relaxed text-sm">Ending hunger and achieving food security through verifiable, localized logistical supply chains prioritizing vulnerable demographics.</p>
            </div>
            
            <div className="structured-card p-8">
               <div className="w-12 h-12 rounded bg-primary-50 flex items-center justify-center mb-6">
                 <Globe2 size={24} className="text-primary-700" />
               </div>
               <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">Climate Action (SDG 13)</h3>
               <p className="text-slate-600 leading-relaxed text-sm">Mitigating planetary damage by rapidly diverting decomposing organic food waste from overwhelmed municipal landfills.</p>
            </div>
            
            <div className="structured-card p-8 bg-slate-50 border-slate-200">
               <div className="w-12 h-12 rounded bg-slate-200 flex items-center justify-center mb-6">
                 <ShieldCheck size={24} className="text-slate-700" />
               </div>
               <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">Responsible Consumption</h3>
               <p className="text-slate-600 leading-relaxed text-sm">Establishing strict standard operating procedures for the catering industry regarding surplus management and secure packaging.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Layer */}
      <div className="bg-primary-950 py-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-3xl font-bold font-serif text-white mb-6">Establish a Corporate Partnership</h2>
            <p className="text-primary-200 mb-8 max-w-xl mx-auto">Engage your corporate social responsibility arm directly by integrating your cafeteria surplus with our API.</p>
            <Link to="/donor/register" className="btn-accent gap-2">
               Partner With Us <ArrowRight size={18}/>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ImpactPage;
