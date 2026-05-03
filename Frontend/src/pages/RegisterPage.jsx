import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Mail, Lock, ShieldAlert, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          password,
          role: 'NGO',
          longitude: -74.006,
          latitude: 40.7128
        })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/ngo/dashboard');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Registration failed. This phone number may already be registered.');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="w-full md:w-5/12 bg-primary-900 text-white flex flex-col justify-between p-10 lg:p-16 border-r border-primary-800 overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1593113565214-802c6110f0d4?q=80&w=1000&auto=format&fit=crop" 
            alt="Humanitarian efforts"
            className="w-full h-full object-cover opacity-10 mix-blend-overlay grayscale"
          />
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="text-xl font-bold font-serif tracking-tight mb-8 inline-block">FoodRescue NGO Portal</Link>
          <div className="mt-12">
            <h1 className="text-4xl font-bold font-serif leading-tight text-white mb-6">Official NGO Registration</h1>
            <p className="text-primary-200 text-lg leading-relaxed max-w-md">
              Verified non-governmental organizations gain priority access to high-volume donors and real-time logistical tools.
            </p>
          </div>
          
          <div className="mt-12 bg-primary-800/80 p-5 rounded border border-primary-700 flex gap-4 backdrop-blur-sm">
             <ShieldAlert className="text-accent-400 shrink-0 mt-1" size={24} />
             <div>
               <h4 className="font-bold text-white mb-1">Strict Verification Process</h4>
               <p className="text-sm text-primary-200">To maintain trust across our donor network, all submitted Official Registration Numbers are independently audited within 48 business hours.</p>
             </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-16 text-primary-400 text-sm">
           © 2026 Global Food Rescue Initiative
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Create NGO Account</h2>
          <p className="text-slate-600 mb-8 border-b border-slate-200 pb-6 text-sm">Fill in your details to apply for access.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Organization Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors outline-none bg-slate-50 text-slate-900" 
                  placeholder="e.g., Red Cross Local Chapter" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Official Contact Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="tel" 
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors outline-none bg-slate-50 text-slate-900" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required 
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors outline-none bg-slate-50 text-slate-900" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div className="flex items-start mt-4">
               <input id="terms" name="terms" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded mt-0.5" required/>
               <label htmlFor="terms" className="ml-2 block text-sm text-slate-600 leading-tight">
                 I agree to the <Link to="/terms" className="text-primary-700 font-semibold hover:underline">Terms of Service</Link> and confirm I will follow local food safety guidelines.
               </label>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 border border-transparent rounded shadow-sm text-sm font-bold text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
              >
                 {isLoading ? <Loader2 className="animate-spin" size={18}/> : 'Create Account'}
              </button>
              {error && <p className="text-sm text-red-600 text-center mt-3">{error}</p>}
            </div>
            
            <p className="mt-6 text-center text-sm text-slate-500 font-medium">
               Already have an account? <Link to="/ngo/login" className="text-primary-700 hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
