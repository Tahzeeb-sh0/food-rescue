import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 lg:px-8 border-b border-primary-900 border-b-8">
      <div className="max-w-4xl mx-auto structured-card p-10 sm:p-16">
         <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 mb-10 transition-colors uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Home
         </Link>
         
         <div className="flex items-start gap-5 mb-12 pb-8 border-b border-slate-200">
            <div className="p-4 bg-primary-50 rounded border border-primary-100 shrink-0">
               <Shield className="w-8 h-8 text-primary-800"/>
            </div>
            <div>
               <h1 className="text-4xl font-extrabold font-serif text-slate-900 mb-2 tracking-tight">Privacy Policy</h1>
               <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Effective Date: October 1, 2026</div>
            </div>
         </div>
         
         <div className="prose max-w-none text-slate-600">
            <p className="text-lg font-medium leading-relaxed mb-8">
               Your organization's data privacy is a foundational pillar of the Global Food Rescue Initiative. This document dictates how donor and NGO metadata is managed within our systems.
            </p>
            
            <h3 className="text-xl font-bold font-serif text-slate-900 mt-10 mb-4">Geolocation Data</h3>
            <p className="mb-6 leading-relaxed">Donor coordinates are never exposed to the public internet. GPS markers are securely encrypted at rest and are exclusively transmitted via WebSocket directly to the singular NGO that successfully completes the claim authorization process.</p>
            
            <h3 className="text-xl font-bold font-serif text-slate-900 mt-10 mb-4">Organizational Identifiers</h3>
            <p className="mb-6 leading-relaxed">To facilitate tax-deductible compliance logs for donors, basic NGO identifying information (Name, Federal ID, Contact email) will be securely compiled in our internal databases and solely utilized during the generation of the Annual Impact Reports.</p>
         </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;