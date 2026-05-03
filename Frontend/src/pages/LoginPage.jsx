import React from 'react';
import { Phone, Lock, LogIn, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
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
      const res = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/ngo/dashboard');
      } else {
        setError('Invalid phone number or password.');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* Left Form Side - Clean & Structured */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 mb-10 transition-colors">
            <ArrowLeft size={16} /> Back to homepage
          </Link>
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">NGO Sign In</h2>
            <p className="text-slate-600 font-medium">
              Access your dashboard. Need an account?{' '}
              <Link to="/ngo/register" className="text-primary-700 hover:text-primary-800 font-semibold underline underline-offset-4">
                Register here
              </Link>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="tel" 
                  required 
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors outline-none text-slate-900" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors outline-none text-slate-900" 
                  placeholder="••••••••" 
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors uppercase tracking-widest">Forgot Password?</Link>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember this device
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18}/> : <><LogIn className="w-4 h-4" /> Sign In to Portal</>}
              </button>
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            
            <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
              <span className="text-xs text-slate-400 text-center">NGO accounts only. Donors sign in <Link to="/donor/login" className="text-primary-700 hover:underline">here</Link>.</span>
            </div>
          </form>
          
          <p className="mt-8 text-xs text-slate-500 text-center leading-relaxed max-w-sm mx-auto">
            By logging in, you agree to our <Link to="/terms" className="underline">Terms of Service</Link>.
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
