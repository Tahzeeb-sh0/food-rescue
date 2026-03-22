import React from 'react';
import { Camera, MapPin, Truck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Camera,
      title: 'Step 1: Secure Declaration',
      description: 'Corporate donors register surplus inventory utilizing our compliant web portal. Information includes dietary tags and mass.',
      color: 'bg-primary-50',
      iconColor: 'text-primary-700',
    },
    {
      icon: MapPin,
      title: 'Step 2: Logistical Match',
      description: 'The algorithmic dispatcher assigns the batch to the closest capacity-verified NGO partner.',
      color: 'bg-primary-50',
      iconColor: 'text-primary-700',
    },
    {
      icon: Truck,
      title: 'Step 3: Protocol Transfer',
      description: 'The authorized NGO secures the payload via confirmation code, verifying the chain of custody.',
      color: 'bg-primary-50',
      iconColor: 'text-primary-700',
    },
  ];

  const stats = [
    { value: '12.5M', label: 'MEALS SERVED' },
    { value: '8,400', label: 'VERIFIED NGOs' },
    { value: '1,500T', label: 'VOLUME DIVERTED' },
    { value: '45K', label: 'CO2 MITIGATED' },
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">
            A Transparent Operations Framework
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Our platform guarantees seamless logistical execution while simultaneously enforcing strict standards of accountability.
          </p>
        </div>

        {/* Steps Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step) => (
            <div
              key={step.title}
              className="structured-card p-10 hover:border-primary-300 transition-colors"
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${step.color} border border-primary-100 rounded flex items-center justify-center mb-6`}>
                <step.icon className={`w-6 h-6 ${step.iconColor}`} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="bg-primary-900 rounded border border-primary-800 px-8 py-12 md:px-16 shadow-sm relative overflow-hidden">
          {/* Subtle graphic interference pattern */}
          <div className="absolute inset-0 opacity-10 background-pattern"></div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center px-4 border-slate-700 last:border-0 lg:border-r border-slate-700/50">
                <div className="text-4xl md:text-5xl font-bold font-serif text-white mb-3">
                  {stat.value}
                </div>
                <div className="text-primary-300 text-xs font-bold uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;