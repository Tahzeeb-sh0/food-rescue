import React from 'react';
import { Scale, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 lg:px-8 border-b border-primary-900 border-b-8">
      <div className="max-w-4xl mx-auto structured-card p-10 sm:p-16">
         <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 mb-10 transition-colors uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Home
         </Link>
         
         <div className="flex items-start gap-5 mb-12 pb-8 border-b border-slate-200">
            <div className="p-4 bg-primary-50 rounded border border-primary-100 shrink-0">
               <Scale className="w-8 h-8 text-primary-800"/>
            </div>
            <div>
               <h1 className="text-4xl font-extrabold font-serif text-slate-900 mb-2 tracking-tight">Terms of Service</h1>
               <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Effective Date: October 1, 2026</div>
            </div>
         </div>
         
         <div className="prose max-w-none text-slate-600">
            <p className="text-lg font-medium leading-relaxed mb-8">
               By accessing the Global Food Rescue Initiative logistics port, you represent and warrant that you are authorized to bind your organization to these Terms of Service.
            </p>
            
            <h3 className="text-xl font-bold font-serif text-slate-900 mt-10 mb-4">1. Eligibility and Authorization</h3>
            <p className="mb-6 leading-relaxed">Only verified 501(c)(3) entities or state-recognized relief organizations may claim logistics batches. End consumers are strictly forbidden from establishing direct claims upon the platform. Partner organizations must maintain fully compliant local food handling licenses to maintain node connectivity.</p>
            
            <h3 className="text-xl font-bold font-serif text-slate-900 mt-10 mb-4">2. Liability and Quality Assurance</h3>
            <p className="mb-6 leading-relaxed">Donors must declare in good faith the absolute safety of the surplus food payload prior to posting. While FoodRescue minimizes transit friction, we assume no liability for the food safety. Claiming NGOs maintain full authority to refuse any batch that physically exhibits safety violations upon collection.</p>

            <h3 className="text-xl font-bold font-serif text-slate-900 mt-10 mb-4">3. Algorithmic Integrity & API Abuse</h3>
            <p className="mb-6 leading-relaxed">Utilization of unauthorized REST or WebSocket clients to "snipe" or hoard logistics claims causes active damage to our humanitarian infrastructure. Detection of concurrent automated script usage will result in the immediate revocation of the NGO’s authorization token and a permanent platform ban.</p>
         </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;