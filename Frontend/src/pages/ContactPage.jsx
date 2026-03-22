import React from 'react';
import { Mail, Phone, MapPin, Send, Building, ShieldAlert } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Corporate Header */}
      <div className="bg-primary-900 py-20 border-b border-primary-800 text-center">
         <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">Institutional Support & Inquiries</h1>
         <p className="text-primary-100 text-lg max-w-2xl mx-auto">
           For corporate partnerships, media relations, or secure verification support, please direct your communication to the appropriate departmental endpoint.
         </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 grid lg:grid-cols-3 gap-12">
         {/* Direct Contact Info */}
         <div className="lg:col-span-1 space-y-8">
            <div className="structured-card p-8 bg-white">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-100 pb-4">Departmental Direct Lines</h3>
               
               <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <ShieldAlert className="w-4 h-4 text-primary-700"/> NGO Verification Desk
                    </div>
                    <p className="text-slate-600 text-sm mb-1">For audits of state licenses and backend portal access anomalies.</p>
                    <a href="mailto:verify@foodrescue.org" className="text-primary-700 font-semibold text-sm hover:underline">verify@foodrescue.org</a>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <Building className="w-4 h-4 text-primary-700"/> Corporate Partnerships
                    </div>
                    <p className="text-slate-600 text-sm mb-1">For CSR representatives establishing cafeteria surplus pipelines.</p>
                    <a href="mailto:corporate@foodrescue.org" className="text-primary-700 font-semibold text-sm hover:underline">corporate@foodrescue.org</a>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <Phone className="w-4 h-4 text-primary-700"/> Emergency Logistics Hotline
                    </div>
                    <p className="text-slate-600 text-sm mb-1">Strictly for active drivers requiring immediate dispatch rerouting.</p>
                    <span className="text-primary-700 font-mono font-bold tracking-wide">+1 (800) 555-0199</span>
                  </div>
               </div>
            </div>

            <div className="structured-card p-8 bg-primary-950 text-white border-primary-900">
               <h3 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-6 border-b border-primary-800 pb-4">Global Headquarters</h3>
               <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary-400 shrink-0"/>
                  <div>
                     <p className="font-bold mb-1">The Global Food Rescue Initiative</p>
                     <p className="text-primary-200 text-sm leading-relaxed">
                        Generosity Plaza, Suite 400<br/>
                        New York, NY 10001<br/>
                        United States of America
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Contact Form */}
         <div className="lg:col-span-2">
            <div className="structured-card bg-white p-8 sm:p-12">
               <h2 className="text-2xl font-bold font-serif text-slate-900 mb-2">Submit Official Inquiry</h2>
               <p className="text-slate-500 text-sm mb-8 pb-6 border-b border-slate-100">All submissions are strictly monitored. Average SLA for non-emergency tickets is 24 business hours.</p>

               <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Official Name / Representative</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm" placeholder="e.g. Jane Doe" />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Corporate or NGO Email Address</label>
                        <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm" placeholder="director@organization.org" />
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Inquiry Classification</label>
                     <select className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm">
                        <option>General Media/Press Inquiry</option>
                        <option>Donor Platform Integration (API)</option>
                        <option>NGO Registration Difficulty</option>
                        <option>Report Logistical Infraction</option>
                        <option>Financial/Grant Administration</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Message Payload</label>
                     <textarea rows="6" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm resize-none" placeholder="Provide full context here. Do not include highly sensitive personal identifiers (PII) beyond standard operational data."></textarea>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                     <button type="button" className="btn-primary w-full md:w-auto px-8 gap-2 uppercase tracking-widest text-sm">
                        <Send size={16} /> Transmit Inquiry
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ContactPage;
