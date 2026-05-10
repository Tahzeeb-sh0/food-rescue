import React from 'react';
import { Camera, MapPin, BellRing, HeartHandshake } from 'lucide-react';

const HowItworksPage = () => {
  const steps = [
    {
      id: 1,
      name: 'Identify & Post',
      description: 'Donors register surplus food via our secure portal. The system instantly tags the geographic location, capacity, and attaches dietary metadata.',
      icon: Camera,
    },
    {
      id: 2,
      name: 'Algorithmic Dispatch',
      description: 'Our proprietary algorithm analyzes distance, traffic, and NGO capacity, instantly notifying verified partners within a strict 10km radius.',
      icon: MapPin,
    },
    {
      id: 3,
      name: 'Secure Claim & Lock',
      description: 'The first authorized NGO claims the batch. To prevent duplication and ensure transparency, the batch is instantly locked from the network.',
      icon: BellRing,
    },
    {
      id: 4,
      name: 'Handshake Verification',
      description: 'Upon physical arrival, the NGO representative inputs a donor-provided 6-digit cryptographic pin to formally document the transfer.',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header - Corporate Solid Blue */}
      <div className="bg-primary-900 py-20 border-b border-primary-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold leading-7 text-accent-500 uppercase tracking-widest mb-3">Operational Framework</h2>
          <p className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
            Four Steps to Zero Waste.
          </p>
          <p className="mx-auto max-w-2xl text-lg text-primary-100 font-medium leading-relaxed">
            Our platform utilizes WebSocket technology and real-time geolocation matching to guarantee vulnerable food reaches designated NGOs securely and transparently.
          </p>
        </div>
      </div>

      <div className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Image grid - hidden on mobile to avoid layout crush */}
            <div className="hidden lg:grid grid-cols-2 gap-6 relative">
              <div className="aspect-[3/4] rounded bg-primary-100 overflow-hidden border border-slate-200 shadow-sm">
                 <img 
                  src="https://images.unsplash.com/photo-1618331835717-81498c8dc117?q=80&w=1000&auto=format&fit=crop" 
                  alt="Donors organizing food" 
                  className="w-full h-full object-cover"
                 />
              </div>
              <div className="aspect-[3/4] rounded bg-primary-100 overflow-hidden border border-slate-200 shadow-sm mt-12">
                 <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop" 
                  alt="NGO receiving distribution" 
                  className="w-full h-full object-cover"
                 />
              </div>
            </div>

            {/* Right side Steps list - Structured */}
            <div className="space-y-12">
              {steps.map((step) => (
                <div key={step.id} className="relative flex gap-6">
                  {/* Vertical Line */}
                  {step.id !== steps.length && (
                    <div className="absolute top-14 bottom-[-48px] left-[27px] w-px bg-slate-300"></div>
                  )}
                  
                  <div className="flex-shrink-0 relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded bg-primary-50 text-primary-700 border border-primary-200 shadow-sm z-10 relative">
                      <step.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  
                  <div className="flex-1 pb-2">
                    <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">
                      Phase {step.id}: {step.name}
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItworksPage;
