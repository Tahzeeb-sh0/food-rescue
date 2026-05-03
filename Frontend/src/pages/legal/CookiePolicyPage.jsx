import React from 'react';
import { Cookie, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 lg:px-8 border-b border-primary-900 border-b-8">
      <div className="max-w-4xl mx-auto structured-card p-10 sm:p-16">
         <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 mb-10 transition-colors uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Home
         </Link>
         
         <div className="flex items-start gap-5 mb-12 pb-8 border-b border-slate-200">
            <div className="p-4 bg-primary-50 rounded border border-primary-100 shrink-0">
               <Cookie className="w-8 h-8 text-primary-800"/>
            </div>
            <div>
               <h1 className="text-4xl font-extrabold font-serif text-slate-900 mb-2 tracking-tight">Cookie Policy</h1>
               <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Effective Date: October 1, 2026</div>
            </div>
         </div>
         
         <div className="prose max-w-none text-slate-600">
            <p className="text-lg font-medium leading-relaxed mb-8">
               The Global Food Rescue Initiative platform strictly utilizes essential cookies imperative to the security and functioning of the logistics portal. We do not engage in cross-site tracking or advertising profiling.
            </p>
            
            <h3 className="text-xl font-bold font-serif text-slate-900 mt-10 mb-4">Essential Authentication Nodes</h3>
            <p className="mb-6 leading-relaxed">Secure JSON Web Tokens (JWT) and CSRF protection mechanisms are embedded within operational session cookies. These are mandatory to cryptographically verify NGO or Donor identity post-authentication and cannot be disabled without revoking platform access.</p>
            
            <h3 className="text-xl font-bold font-serif text-slate-900 mt-10 mb-4">Analytics Diagnostics</h3>
            <p className="mb-6 leading-relaxed">A singular, anonymized telemetry token establishes platform performance metrics (latency, crash rates, and dispatch rendering times). This ensures the real-time WebSocket infrastructure remains optimized for mission-critical operations under heavy load.</p>
         </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;