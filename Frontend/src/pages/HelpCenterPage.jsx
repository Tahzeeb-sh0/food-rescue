import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenterPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
       q: "What qualifies as 'viable surplus food'?",
       a: "Viable surplus food includes any unserved, safely stored catered food, bakery goods, or intact agricultural produce. We cannot accept half-eaten buffet items, food left at improper temperatures for >2 hours, or expired perishables. Strict adherence to local health codes is mandatory."
    },
    {
       q: "How does the matching algorithm select an NGO?",
       a: "Our proprietary dispatch engine utilizes a multi-variable calculation incorporating Euclidean distance (capped at 10km), the NGO's declared transit capacity, and the specific dietary tags of the payload. The first verified NGO to successfully 'lock' the claim via WebSocket secures the batch."
    },
    {
       q: "What if the claiming NGO fails to arrive?",
       a: "NGOs are subjected to strict SLAs (Service Level Agreements). If an NGO fails to arrive within the donor's specified operational window, the batch is automatically un-locked and re-broadcasted to the network. The failing NGO incurs a strike against their credibility score."
    },
    {
       q: "How is the 6-Digit authorization code utilized?",
       a: "The authorization code acts as an unbreakable chain-of-custody link. The donor's portal generates the code upon a successful claim. When the physical NGO agent arrives, they must input this code into their portal to finalize the operational handshake and trigger the generation of tax documents."
    },
    {
       q: "Can individuals claim food directly through the platform?",
       a: "No. The Global Food Rescue Initiative operates strictly as a B2B logistics bridge between corporate entities and state-verified 501(c)(3) organizations. Individual relief must be sought directly through your local municipal pantry network."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
       {/* Hero Search Area */}
       <div className="bg-primary-900 border-b border-primary-800 text-white py-24 px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Operational Knowledge Base</h1>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">Access standard operating procedures, compliance documentation, and system navigation guidelines.</p>
          
          <div className="max-w-xl mx-auto relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input type="text" placeholder="Query the documentation (e.g., 'Tax deductions')" className="w-full pl-12 pr-4 py-4 rounded bg-white text-slate-900 text-lg shadow-xl outline-none focus:ring-4 ring-primary-500/30 transition-shadow" />
          </div>
       </div>

       <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-16 grid lg:grid-cols-3 gap-12">
          {/* Quick Links */}
          <div className="lg:col-span-1 space-y-6">
             <div className="structured-card p-6 border-l-4 border-l-primary-700 bg-white">
                <BookOpen className="w-6 h-6 text-primary-700 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Platform Tutorials</h3>
                <p className="text-sm text-slate-600 mb-4">Step-by-step PDF guides for first-time NGOs and Donors.</p>
                <Link to="#" className="text-primary-700 font-semibold text-sm hover:underline">Download Guides Library</Link>
             </div>
             
             <div className="structured-card p-6 border-l-4 border-l-accent-600 bg-white">
                <AlertCircle className="w-6 h-6 text-accent-600 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Submit Support Ticket</h3>
                <p className="text-sm text-slate-600 mb-4">Encountered an anomaly in the dispatch system? Contact engineering directly.</p>
                <Link to="/contact" className="text-primary-700 font-semibold text-sm hover:underline">Open Jira Ticket →</Link>
             </div>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-2">
             <h2 className="text-2xl font-bold font-serif text-slate-900 mb-8 border-b border-slate-200 pb-4">Frequently Asked Questions</h2>
             
             <div className="space-y-4">
                {faqs.map((faq, idx) => (
                   <div key={idx} className="structured-card bg-white overflow-hidden transition-all duration-200">
                      <button 
                        onClick={() => setOpenFaq(idx === openFaq ? -1 : idx)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                      >
                         <span className={`font-bold text-base pr-4 ${openFaq === idx ? 'text-primary-700' : 'text-slate-800'}`}>{faq.q}</span>
                         {openFaq === idx ? <ChevronUp className="w-5 h-5 text-primary-700 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                      </button>
                      
                      {openFaq === idx && (
                         <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                            {faq.a}
                         </div>
                      )}
                   </div>
                ))}
             </div>
             
             <div className="mt-10 text-center text-sm font-medium text-slate-500">
                Data point untouched? <Link to="/contact" className="text-primary-700 hover:underline">Escalate to a human representative.</Link>
             </div>
          </div>
       </div>
    </div>
  );
};

export default HelpCenterPage;
