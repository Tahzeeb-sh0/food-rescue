import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* Left Form Side - Clean & Structured */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 mb-10 transition-colors">
            <ArrowLeft size={16} /> Back to homepage
          </Link>
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">NGO Portal Login</h2>
            <p className="text-slate-600 font-medium">
              Access your dashboard to orchestrate food rescues. Need an account?{' '}
              <Link to="/ngo/register" className="text-primary-700 hover:text-primary-800 font-semibold underline underline-offset-4">
                Apply for registration
              </Link>.
            </p>
          </div>

          <form action="#" method="POST" className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Official Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input type="email" required className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors outline-none text-slate-900" placeholder="director@ngo-domain.org" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input type="password" required className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors outline-none text-slate-900" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember this device
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-primary-700 hover:text-primary-800">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/ngo/dashboard" className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                <LogIn className="w-4 h-4" /> Sign In to Portal
              </Link>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
              <span className="text-xs text-slate-500 text-center uppercase tracking-widest font-semibold mb-4">Authorized Access Only</span>
            </div>
          </form>
          
          <p className="mt-8 text-xs text-slate-500 text-center leading-relaxed max-w-sm mx-auto">
            By logging in, you agree to our strictly enforced <a href="/terms" className="underline">Terms of Service</a> regarding food safety and handling.
          </p>
        </div>
      </div>

      {/* Right Image Side - Corporate Humanitarian Aesthetic */}
      <div className="hidden lg:block relative w-0 flex-1 bg-slate-900">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-overlay"
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2874&auto=format&fit=crop"
          alt="Humanitarian food distribution"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-20 bg-gradient-to-t from-primary-950/90 via-primary-900/40 to-transparent">
           <div className="max-w-2xl border-l-4 border-accent-500 pl-6">
              <h2 className="text-white text-4xl font-serif font-bold mb-4 leading-tight">
                "Efficiency in distribution is the difference between surplus and sustenance."
              </h2>
              <p className="text-primary-100 text-lg">
                Logistics Hub • Global Food Rescue Initiative
              </p>
           </div>
        </div>
      </div>
      
    </div>
  );
};

export default LoginPage;
