import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenterPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
       q: "What qualifies as viable surplus food?",
       a: "Viable surplus includes unserved catered food, bakery goods, and intact produce. We cannot accept food left at unsafe temperatures for over 2 hours, half-eaten items, or expired perishables. All donations must comply with local health codes."
    },
    {
       q: "How does the platform match a donation to an NGO?",
       a: "When a donation is posted, nearby verified NGOs within 10km are notified in real time. The first NGO to claim the donation secures it. Our system factors in distance and NGO capacity to ensure a good match."
    },
    {
       q: "What happens if the NGO doesn't show up?",
       a: "NGOs are expected to arrive within the donor's specified window. If they don't, the donation is released back to the network for other NGOs to claim. Repeated no-shows affect the NGO's standing on the platform."
    },
    {
       q: "How does the 6-digit confirmation code work?",
       a: "When an NGO claims a donation, the donor receives a 6-digit code. At pickup, the NGO enters this code to confirm the handover. This creates a verified record of the transfer and triggers any tax documentation."
    },
    {
       q: "Can individuals claim food directly?",
       a: "No. The platform connects businesses with verified NGOs and charities only. If you need food assistance, please contact your local food bank or community pantry."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
       {/* Hero Search Area */}
       <div className="bg-primary-900 border-b border-primary-800 text-white py-24 px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Help Center</h1>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">Find answers to common questions about donating food, claiming donations, and using the platform.</p>
          
          <div className="max-w-xl mx-auto relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input type="text" placeholder="Search for help (e.g. 'how to donate')" className="w-full pl-12 pr-4 py-4 rounded bg-white text-slate-900 text-lg shadow-xl outline-none focus:ring-4 ring-primary-500/30 transition-shadow" />
          </div>
       </div>

       <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-16 grid lg:grid-cols-3 gap-12">
          {/* Quick Links */}
          <div className="lg:col-span-1 space-y-6">
             <div className="structured-card p-6 border-l-4 border-l-primary-700 bg-white">
                <BookOpen className="w-6 h-6 text-primary-700 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Guides & Tutorials</h3>
                <p className="text-sm text-slate-600 mb-4">Step-by-step guides for first-time NGOs and donors.</p>
                <Link to="#" className="text-primary-700 font-semibold text-sm hover:underline">Download Guides</Link>
             </div>
             
             <div className="structured-card p-6 border-l-4 border-l-accent-600 bg-white">
                <AlertCircle className="w-6 h-6 text-accent-600 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Contact Support</h3>
                <p className="text-sm text-slate-600 mb-4">Having trouble? Reach out to our support team directly.</p>
                <Link to="/contact" className="text-primary-700 font-semibold text-sm hover:underline">Get in Touch →</Link>
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
                Still need help? <Link to="/contact" className="text-primary-700 hover:underline">Contact our support team.</Link>
             </div>
          </div>
       </div>
    </div>
  );
};

export default HelpCenterPage;
