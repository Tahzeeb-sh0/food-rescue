import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Heart, UploadCloud, MapPin, CheckCircle, Navigation, Star, Activity, Utensils, AlertCircle } from 'lucide-react';

const DonorDashboard = () => {
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState('');
  const [donation, setDonation] = useState(null);
  const [status, setStatus] = useState('');
  
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.debug = () => {}; 

    client.connect({}, () => {
      client.subscribe('/topic/donations/claimed', (msg) => {
        const d = JSON.parse(msg.body);
        if (donation && d.id === donation.id) {
          setDonation(d);
          setStatus('CLAIMED');
        }
      });
      client.subscribe('/topic/donations/completed', (msg) => {
        const d = JSON.parse(msg.body);
        if (donation && d.id === donation.id) {
          setDonation(d);
          setStatus('COMPLETED');
        }
      });
    });

    return () => { if (client.connected) client.disconnect(); };
  }, [donation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch('http://localhost:8080/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donorId: 'donor-123',
            title, capacity: parseInt(capacity),
            photoUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800',
            pickupLocation: { longitude: pos.coords.longitude, latitude: pos.coords.latitude }
          })
        });
        if (res.ok) {
          setDonation(await res.json());
          setStatus('AVAILABLE');
        } else {
          alert('Server rejected payload.');
        }
      } catch (err) {
        console.warn("Backend offline. Generating mock logistics dispatch for UI.");
        setDonation({ id: 'mock-1', title, capacity: parseInt(capacity), confirmationCode: '8X9F2A' });
        setStatus('AVAILABLE');
        setTimeout(() => setStatus('CLAIMED'), 3000);
      }
    });
  };

  return (
    <DashboardLayout role="Donor">
      {/* Overview Metrics - Corporate Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="structured-card p-6 border-l-4 border-l-primary-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Meals Processed</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">850</h3>
              <p className="text-sm text-green-700 font-semibold mt-3 flex items-center gap-1.5"><Activity size={14}/> Top 5% Contributor</p>
            </div>
            <div className="p-3 bg-primary-50 text-primary-700 rounded-md">
              <Heart size={20} />
            </div>
          </div>
        </div>
        
        <div className="structured-card p-6 border-l-4 border-l-accent-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Corporate Impact Score</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">4.2k</h3>
              <p className="text-sm text-accent-700 font-semibold mt-3 flex items-center gap-1.5"><Star size={14}/> Platinum Status</p>
            </div>
            <div className="p-3 bg-accent-50 text-accent-700 rounded-md">
              <Star size={20} className="fill-current" />
            </div>
          </div>
        </div>

        <div className="structured-card p-6 border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Active Transfers</p>
              <h3 className="text-4xl font-bold font-serif text-slate-900">{status && status !== 'COMPLETED' ? 1 : 0}</h3>
              <p className="text-sm text-blue-700 font-semibold mt-3 flex items-center gap-1.5"><Navigation size={14}/> GPS Tracking Enabled</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-md">
              <Navigation size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="structured-card overflow-hidden">
           {!donation ? (
             <div className="grid md:grid-cols-5 h-full">
               <div className="md:col-span-2 bg-primary-950 p-8 flex flex-col justify-center text-white border-r border-slate-200 min-h-[300px]">
                  <div className="w-12 h-12 bg-primary-800 rounded flex items-center justify-center mb-6">
                    <Utensils className="text-primary-100" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold font-serif mb-3 leading-tight">Log Surplus Inventory</h2>
                  <p className="text-primary-200 text-sm leading-relaxed">
                    Enter the details of your available unserved food. Our proprietary matching system will dispatch a verified NGO partner to your exact location based on capacity requirements.
                  </p>
               </div>
               <div className="md:col-span-3 p-8 sm:p-10 bg-white">
                 <div className="mb-8 border-b border-slate-200 pb-4">
                   <h2 className="text-xl font-bold text-slate-900">Surplus Entry Form</h2>
                   <p className="text-slate-500 text-sm mt-1">Please ensure accurate headcount estimates.</p>
                 </div>
                 
                 <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Inventory Description</label>
                      <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Wedding buffet leftovers (Rice, Curry)" className="w-full px-4 py-2.5 rounded-md border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none bg-slate-50 text-slate-900 sm:text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Estimated Capacity (Persons)</label>
                      <input type="number" required value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="e.g. 100" className="w-full px-4 py-2.5 rounded-md border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none bg-slate-50 text-slate-900 sm:text-sm" />
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-md mb-6">
                        <MapPin size={20} className="text-primary-700 flex-shrink-0 mt-0.5"/> 
                        <p className="text-sm text-slate-600 leading-snug">Facility coordinates will solely be transmitted to the verified NGO dispatched for pickup. Security and privacy maintained.</p>
                      </div>
                      <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2">
                         <UploadCloud size={18} /> Submit to Network
                      </button>
                    </div>
                 </form>
               </div>
             </div>
           ) : (
             <div className="flex flex-col items-center p-8 sm:p-12 text-center max-w-2xl mx-auto">
               <div className="mb-6 rounded bg-slate-100 p-4 inline-block">
                   <span className="text-4xl text-slate-700">🍲</span>
               </div>
               
               <h2 className="text-3xl font-bold font-serif text-slate-900 mb-3">{donation.title}</h2>
               <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded text-sm font-semibold text-slate-700 mb-10">
                  <Heart size={16} className="text-accent-600" /> Serves {donation.capacity} individuals
               </div>
               
               <div className={`w-full py-4 px-4 rounded-md font-bold text-sm mb-8 flex flex-col sm:flex-row items-center justify-center gap-2 border ${
                 status === 'AVAILABLE' ? 'bg-amber-50 text-amber-800 border-amber-200' : 
                 status === 'CLAIMED' ? 'bg-primary-50 text-primary-800 border-primary-200' : 'bg-green-50 text-green-800 border-green-200'
               }`}>
                 {status === 'AVAILABLE' && <><AlertCircle size={18} className="text-amber-600" /> Scanning network for available verified NGOs...</>}
                 {status === 'CLAIMED' && <><Navigation size={18} className="text-primary-600"/> Agent dispatched. Awaiting arrival at facility.</>}
                 {status === 'COMPLETED' && <><CheckCircle size={18} className="text-green-600"/> Transfer Complete. Log updated.</>}
               </div>
   
               {status === 'CLAIMED' && (
                 <div className="w-full bg-slate-50 p-8 rounded-md border border-slate-200 text-center">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Donor Authorization Code</p>
                   <div className="text-5xl font-mono font-bold tracking-[0.2em] text-primary-900">
                     {donation.confirmationCode}
                   </div>
                   <p className="text-sm font-medium text-slate-600 mt-4 max-w-sm mx-auto">Under no circumstances share this code digitally. Speak it only to the authorized agent arriving at your facility.</p>
                 </div>
               )}
               
               {status === 'COMPLETED' && (
                 <div className="w-full bg-slate-50 p-8 rounded-md border border-slate-200">
                   <p className="text-xl font-bold text-slate-900 mb-6">Rate Logistics Efficiency</p>
                   <div className="flex justify-center space-x-3 text-3xl mb-6">
                     {[1,2,3,4,5].map((i) => (
                        <button key={i} onClick={() => { setDonation(null); setStatus(''); }} className="text-slate-300 hover:text-accent-500 transition-colors">
                           ★
                        </button>
                     ))}
                   </div>
                   <button onClick={() => { setDonation(null); setStatus(''); }} className="text-sm font-semibold text-primary-700 hover:text-primary-800">Return to Portal</button>
                 </div>
               )}
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;
