import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

const BoardPage = () => {
  const board = [
    { name: 'Dr. Sarah Jenkins', role: 'Executive Director', dept: 'Global Operations', bio: 'Former logistics coordinator for the UN World Food Programme. Dr. Jenkins pioneered the initial geographic routing algorithms responsible for matching decaying surplus with hyper-local pantries.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
    { name: 'Michael Obanya', role: 'Head of Technological Infrastructure', dept: 'Engineering', bio: 'Veteran systems architect from major aerospace logistics. Obanya oversees the WebSocket scaling preventing latency during mass emergency donations.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
    { name: 'Elena Rostova', role: 'VP of Global NGO Partnerships', dept: 'Compliance', bio: 'With 15 years managing international disaster relief supply chains, Rostova handles the 501(c)(3) verification desk parsing thousands of applications monthly.', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop' },
    { name: 'David Chen', role: 'Chief Financial Officer', dept: 'Grants & Fiduciary', bio: 'Formerly holding VP of Finance at a major commercial grid, David secures our incredibly tight 5.2% overhead margin.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' },
    { name: 'Dr. Robert E. Hughes', role: 'Director of Supply Chain Security', dept: 'Operations & QA', bio: 'Dr. Hughes authors the uncompromising temperature algorithms assuring that all routed food complies strictly with federal health protocols.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop' },
    { name: 'Fatima Al-Sayed', role: 'Head of Civic Integration', dept: 'Government Affairs', bio: 'Al-Sayed maintains federal and municipal pipelines to ensure Good Samaritan protections actively shield our corporate dispatch partners.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-primary-900 py-24 pb-32 border-b-8 border-primary-800 text-center">
         <h1 className="text-5xl font-bold font-serif text-white mb-6">Board of Directors</h1>
         <p className="text-primary-200 text-xl max-w-3xl mx-auto leading-relaxed">
           Executive leadership dictating the strategic, technological, and fiduciary direction of the highest-throughput food rescue platform on the planet.
         </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         {board.map((member, idx) => (
            <div key={idx} className="structured-card bg-white overflow-hidden group hover:-translate-y-1 transition-transform">
               <div className="aspect-square w-full overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale mix-blend-multiply opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
               </div>
               <div className="p-8">
                  <div className="flex gap-2 mb-4">
                     <span className="text-[10px] font-bold bg-primary-50 text-primary-700 px-2 py-1 rounded-sm uppercase tracking-widest border border-primary-100">{member.dept}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">{member.role}</p>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-8">
                     {member.bio}
                  </p>
                  
                  <div className="flex items-center gap-4 text-slate-400">
                     <a href="#" className="hover:text-primary-700 transition-colors"><Linkedin size={20}/></a>
                     <a href="#" className="hover:text-primary-700 transition-colors"><Mail size={20}/></a>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default BoardPage;
