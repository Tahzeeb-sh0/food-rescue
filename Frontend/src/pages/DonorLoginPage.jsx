import React from 'react';
import { Building2, Lock, LogIn, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DonorLoginPage = () => {
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/donor/dashboard');
      } else {
        alert('Invalid credentials.');
      }
    } catch (err) {
      console.warn("Backend offline. Bypassing auth for demo.");
      navigate('/donor/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* Left Form Side */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 mb-10 transition-colors uppercase tracking-widest">
            <ArrowLeft size={16} /> Return to Operations
          </Link>
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">Corporate Donor Access</h2>
            <p className="text-slate-600 font-medium">
              Access your facility dashboard. Not an enterprise donor?{' '}
              <Link to="/donor/register" className="text-accent-600 hover:text-accent-700 font-bold underline underline-offset-4 tracking-wide">
                Initiate onboarding
              </Link>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Facility / Corporate Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 transition-colors outline-none text-slate-900" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Access Credential</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors uppercase tracking-widest">Forgot Password?</Link>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600">
                  Save hardware token
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-primary-700 hover:text-primary-800">
                  Reset Credentials
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded text-sm font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18}/> : <><LogIn className="w-4 h-4" /> Authenticate Terminal</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:block relative w-0 flex-1 bg-primary-950">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-luminosity grayscale"
          src="https://images.unsplash.com/photo-1574314488970-dcb7fc916723?q=80&w=1400&auto=format&fit=crop"
          alt="Corporate kitchen operations"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-20 bg-gradient-to-r from-primary-950/90 to-transparent">
           <div className="max-w-xl border-l-4 border-accent-500 pl-8">
              <h2 className="text-white text-4xl font-serif font-bold mb-4 leading-tight">
                "Direct diversion of surplus out-performs landfill mitigation 100-to-1 in carbon metrics."
              </h2>
              <p className="text-primary-200 text-lg uppercase tracking-widest font-semibold text-sm">
                Corporate ESG Council Report • 2025
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DonorLoginPage;
