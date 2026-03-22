import React, { useEffect, useState } from "react";
import { ArrowRight, BarChart2, CheckCircle2 } from "lucide-react";

const HomeHero = () => {
  const [mealCount, setMealCount] = useState(542918);

  useEffect(() => {
    const interval = setInterval(() => {
      setMealCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content - Structured & Typography Focused */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-8 border border-primary-100 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></span>
              Global Food Rescue Initiative
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold font-serif text-slate-900 leading-[1.15] mb-6">
              Transforming Surplus Food into <span className="text-primary-700">Hope.</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
              Our organization links hotels, event organizers, and corporate cafeterias directly with verified NGOs. We ensure perfectly viable surplus food reaches vulnerable communities securely and systematically.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="btn-primary">
                Donate Surplus Food
              </button>
              <button className="btn-outline">
                Register as NGO
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Meals Delivered</span>
                <span className="text-3xl font-bold font-serif text-slate-900 tabular-nums">
                  {mealCount.toLocaleString()}
                </span>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Active Partners</span>
                <span className="text-3xl font-bold font-serif text-slate-900">8,400+</span>
              </div>
            </div>
          </div>

          {/* Right Content - Clean Grid Collage */}
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-[4/5] rounded-lg overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50">
               <img 
                 src="https://images.unsplash.com/photo-1593113565214-802c6110f0d4?q=80&w=2940&auto=format&fit=crop" 
                 alt="Volunteers packing nutritious food for delivery" 
                 className="w-full h-full object-cover"
               />
            </div>
            
            {/* Overlay Info Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl shadow-slate-200/80 border border-slate-100 max-w-[280px]">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent-50 rounded flex items-center justify-center text-accent-600">
                     <CheckCircle2 size={24} />
                  </div>
                  <h3 className="font-bold font-serif text-slate-900">Quality Assured</h3>
               </div>
               <p className="text-sm text-slate-600 mb-4 font-medium">All food transfers adhere to strict safety and hygiene protocols.</p>
               <a href="#" className="inline-flex items-center text-primary-700 font-semibold text-sm hover:text-primary-800 uppercase tracking-wide">
                 Read Our Policy <ArrowRight size={16} className="ml-1" />
               </a>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Trust Bar */}
      <div className="bg-slate-50 border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Trusted by leading organizations globally</p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
             {/* Simulated Corporate Logos (Text for placeholder) */}
             <span className="text-2xl font-black font-serif text-slate-800">UNICEF</span>
             <span className="text-2xl font-black font-serif text-slate-800 tracking-tighter">RED CROSS</span>
             <span className="text-2xl font-bold text-slate-800 tracking-widest flex items-center gap-2"><BarChart2 className="inline"/> OXFAM</span>
             <span className="text-2xl font-black font-serif text-slate-800 tracking-tight">CARE Int.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
