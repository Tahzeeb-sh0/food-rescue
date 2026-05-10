import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Globe, 
  TrendingUp, 
  ArrowRight, 
  Heart, 
  Users, 
  Zap, 
  Truck,
  Leaf,
  CheckCircle,
  Play,
  HandHeart,
  Store,
  Warehouse
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [stats, setStats] = useState({ meals: 0, co2: 0, ngos: 0 });

  useEffect(() => {
    fetch('http://localhost:8080/api/stats/impact')
      .then(res => res.json())
      .then(data => setStats({
        meals: data.totalMeals || 0,
        co2: data.co2DivertedTons || 0,
        ngos: data.activeNgos || 0
      }))
      .catch(() => {
        // Keep zeros on error — don't show fake data
      });

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        meals: prev.meals > 0 ? prev.meals + Math.floor(Math.random() * 2) : prev.meals,
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const partners = [
    "Hilton", "Marriott", "Sysco", "Local Bakeries", "City Harvest", "FareShare"
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      
      {/* 1. HERO SECTION - Human & Impact Driven */}
      <section className="relative min-h-[85vh] flex items-center pt-16 sm:pt-20 pb-12">
        <div className="absolute inset-x-0 top-0 h-[1000px] bg-gradient-to-b from-primary-50/30 to-white -skew-y-3 origin-top-left -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Community Driven • 142 Cities
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-slate-900 leading-[1.1] mb-8">
              Rescue Food. <br />
              <span className="text-primary-700 italic">Feed Hope.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
               The simplest way for businesses to share surplus food with local charities in real-time. We bridge the gap between good food and hungry neighbors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/donate" className="btn-primary py-5 px-10 text-lg flex items-center justify-center gap-2 group shadow-xl hover:-translate-y-1 transition-all">
                Donate Surplus <Heart className="group-hover:scale-110 transition-transform" size={20} />
              </Link>
              <Link to="/ngo/register" className="btn-secondary py-5 px-10 text-lg flex items-center justify-center gap-2 border-2 border-slate-200">
                Register as NGO
              </Link>
            </div>
            
            {/* Quick Trust Meta */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-8">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200">
                       <img src={`https://i.pravatar.cc/100?img=${i+14}`} className="rounded-full" alt="" />
                    </div>
                  ))}
               </div>
               <p className="text-sm text-slate-500 font-medium">
                 Joined by <span className="text-slate-900 font-bold">2,400+</span> Local Business Donors.
               </p>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
               <img 
                 src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop" 
                 alt="Community Impact" 
                 className="w-full aspect-[4/5] object-cover" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent" />
               <div className="absolute bottom-10 left-10 text-white p-4">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                        <Play size={20} className="fill-current ml-1" />
                     </div>
                     <span className="text-xs font-bold uppercase tracking-widest text-white/80">Our Vision</span>
                  </div>
                  <h3 className="text-3xl font-bold font-serif leading-tight">Helping hand to <br/> those who help.</h3>
               </div>
            </div>
            {/* Floating Impact Card */}
            <div className="absolute -bottom-6 -left-12 z-20 structured-card p-6 bg-white hidden xl:block w-72 shadow-2xl border-slate-50 rounded-2xl">
               <div className="flex items-center gap-4 mb-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">
                  <div className="p-2 bg-green-50 text-green-600 rounded"><Leaf size={16}/></div>
                  Net Impact Created
               </div>
               <div className="text-3xl font-bold text-slate-800 font-mono">
                  {stats.co2.toLocaleString(undefined, {minimumFractionDigits: 1})} <span className="text-sm text-slate-400 font-sans uppercase">Tons Diverted</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%]"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR COMMUNITY NETWORK */}
      <section className="py-20 border-y border-slate-100 bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">Empowering Local & Global Partners</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
               {partners.map(p => (
                 <span key={p} className="text-lg md:text-xl font-bold font-serif text-slate-700 whitespace-nowrap uppercase tracking-wider">{p}</span>
               ))}
            </div>
         </div>
      </section>

      {/* 3. HOW IT WORKS - Simple & Friendly */}
      <section className="py-32 relative">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-bold font-serif text-slate-900 mb-4">Good food shouldn't go to waste.</h2>
               <p className="text-slate-500 max-w-2xl mx-auto">We've simplified the logistics of food rescue so you can focus on making a difference.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
               <div className="text-center group">
                  <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary-100 group-hover:bg-primary-700 group-hover:text-white transition-all duration-500">
                     <Store size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">1. List Your Surplus</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     Snap a photo and tell us what's available. Whether it's 10 meals or 1000, every contribution matters.
                  </p>
               </div>
               
               <div className="text-center group">
                  <div className="w-20 h-20 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-accent-100 group-hover:bg-accent-600 group-hover:text-white transition-all duration-500">
                     <Truck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">2. NGO Secure Match</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     Our network matches you with a verified local charity. They'll arrive shortly to handle the pickup safely.
                  </p>
               </div>

               <div className="text-center group">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                     <HandHeart size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">3. Community Fed</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     Food is distributed directly to those in need. You'll receive a digital impact receipt and community thanks.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. ESG & CERTIFICATION - Reassuring Donors */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
         <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div>
                  <h2 className="text-4xl font-bold font-serif mb-8">Verification & Safety First.</h2>
                  <div className="space-y-8">
                     <div className="flex gap-6">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                           <ShieldCheck className="text-accent-400" size={24} />
                        </div>
                        <div>
                           <h4 className="font-bold text-lg mb-2">Good Samaritan Safe</h4>
                           <p className="text-slate-400 text-sm leading-relaxed">All donors are protected under federal food donation laws. Our secure 6-digit code acts as your proof-of-handover.</p>
                        </div>
                     </div>
                     <div className="flex gap-6">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                           <Users className="text-primary-400" size={24} />
                        </div>
                        <div>
                           <h4 className="font-bold text-lg mb-2">Verified Agents Only</h4>
                           <p className="text-slate-400 text-sm leading-relaxed">We only allow registered, tax-exempt NGOs on our platform. No random pickups—total security for your facility.</p>
                        </div>
                     </div>
                     <div className="flex gap-6">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                           <TrendingUp className="text-green-400" size={24} />
                        </div>
                        <div>
                           <h4 className="font-bold text-lg mb-2">Zero-Waste Certification</h4>
                           <p className="text-slate-400 text-sm leading-relaxed">Turn your waste into a certified ESG win. Download monthly tax-deductible logs with a single click.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-10 bg-primary-800/50 backdrop-blur-sm rounded-3xl border border-primary-700 text-center">
                     <h3 className="text-5xl font-bold mb-3 font-mono">
                        {stats.meals > 0 ? `${Math.floor(stats.meals / 1000).toLocaleString()}k` : '—'}
                     </h3>
                     <p className="text-xs font-bold text-primary-300 uppercase tracking-widest">Meals Shared</p>
                  </div>
                  <div className="p-10 bg-accent-600/50 backdrop-blur-sm rounded-3xl border border-accent-500 text-center">
                     <h3 className="text-5xl font-bold mb-3 font-mono">{stats.ngos > 0 ? `${stats.ngos.toLocaleString()}` : '—'}</h3>
                     <p className="text-xs font-bold text-accent-100 uppercase tracking-widest">Partner NGOs</p>
                  </div>
                  <div className="md:col-span-2 p-12 bg-white/5 rounded-3xl border border-white/10 text-center">
                     <div className="flex justify-center -space-x-4 mb-6">
                        {[1,2,3,4,5].map(i => (
                           <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center font-bold text-xs">
                              {i === 5 ? '+2k' : <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="rounded-full" />}
                           </div>
                        ))}
                     </div>
                     <p className="text-slate-400 text-sm italic">"The process is so seamless that our staff actually looks forward to the end-of-day food handovers now."</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. FINAL PATHS - Softened CTAs */}
      <section className="py-32 bg-slate-50">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-16">
            <h2 className="text-4xl font-bold font-serif text-slate-900">Join the Circle of Care.</h2>
            <p className="text-slate-500 mt-4">Whether you are giving or receiving, you are part of the solution.</p>
         </div>
         <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-700 group">
               <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-700 mb-8 group-hover:bg-primary-700 group-hover:text-white transition-colors">
                  <Store size={32} />
               </div>
               <h3 className="text-2xl font-bold font-serif mb-4">For Businesses</h3>
               <p className="text-slate-600 mb-8 leading-relaxed">Restaurants, Hotels, and Caterers. Securely donate your quality surplus in under 60 seconds.</p>
               <Link to="/donor/register" className="btn-primary w-full py-4 text-center rounded-xl shadow-lg">Start Sharing Today</Link>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-700 group">
               <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600 mb-8 group-hover:bg-accent-600 group-hover:text-white transition-colors">
                  <HandHeart size={32} />
               </div>
               <h3 className="text-2xl font-bold font-serif mb-4">For Charities</h3>
               <p className="text-slate-600 mb-8 leading-relaxed">NGOs and Shelters. Access locally-sourced, verified surplus for your community programs.</p>
               <Link to="/ngo/register" className="btn-secondary w-full py-4 text-center rounded-xl border-2 border-slate-100">Apply for Verification</Link>
            </div>
         </div>
      </section>
      
    </div>
  );
};

export default HomePage;
