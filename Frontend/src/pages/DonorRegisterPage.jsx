import React from 'react';
import { Building2, Briefcase, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';

const DonorRegisterPage = () => {
  const [corpName, setCorpName] = React.useState('');
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
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: corpName,
          phone,
          password,
          role: 'DONOR',
          longitude: -74.006,
          latitude: 40.7128
        })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        if (user.token) localStorage.setItem('token', user.token);
        if (user.role) sessionStorage.setItem('activeRole', user.role);
        navigate('/donor/dashboard');
      } else {
        const raw = await res.text();
        let msg = raw || 'Registration failed.';
        try {
          const j = JSON.parse(raw);
          msg = typeof j === 'string' ? j : (j.message || j.error || raw);
        } catch {
          /* plain text body */
        }
        setError(msg);
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Pitch Panel */}
      <div className="w-full lg:w-5/12 bg-primary-950 text-white flex flex-col justify-center p-8 lg:p-16 border-r-4 border-primary-900 relative overflow-hidden min-h-[280px] lg:min-h-screen">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-400 via-primary-900 to-primary-950 blur-xl"></div>
        <div className="relative z-10">
          <Link to="/" className="text-2xl font-bold font-serif tracking-tight mb-8 inline-block">FoodRescue Corporate Registration</Link>
          <div className="mt-8">
            <h1 className="text-4xl lg:text-5xl font-bold font-serif leading-tight text-white mb-6">Scale Your Zero-Waste Operations</h1>
            <p className="text-primary-200 text-lg leading-relaxed max-w-md">
              Integrate your cafeteria, bakery, or event venue into the largest secured logistics network for surplus routing. 
            </p>
          </div>
          
          <ul className="mt-12 space-y-6">
             <li className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent-500 shrink-0"/>
                <div>
                   <h4 className="font-bold mb-1">Tax-Deductible Compliance</h4>
                   <p className="text-sm text-primary-300 leading-relaxed">System automates mass calculation and fetches end-of-year 501(c)(3) tax receipt summaries.</p>
                </div>
             </li>
             <li className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent-500 shrink-0"/>
                <div>
                   <h4 className="font-bold mb-1">Good Samaritan Insulation</h4>
                   <p className="text-sm text-primary-300 leading-relaxed">Full operational coverage under federal Good Samaritan statutes given accurate logistical representations.</p>
                </div>
             </li>
          </ul>
        </div>
      </div>
      
      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col py-12 px-6 sm:px-12 lg:px-20 bg-white">
        <div className="max-w-xl w-full mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Create Your Donor Account</h2>
          <p className="text-slate-500 mb-8 border-b border-slate-200 pb-6 text-sm">Fill in your details to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Parent Corporation Name</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building2 className="h-5 w-5 text-slate-400" /></div>
                     <input 
                        type="text" 
                        required 
                        value={corpName}
                        onChange={(e) => setCorpName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none  text-slate-900 text-sm bg-slate-50" 
                        placeholder="e.g. Hilton Global" 
                      />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Facility Contact Phone</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Briefcase className="h-5 w-5 text-slate-400" /></div>
                     <input 
                        type="tel" 
                        required 
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm bg-slate-50" 
                        placeholder="+1 (555) 000-0000" 
                      />
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                <input 
                  type="password" 
                  required 
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm bg-slate-50" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Facility Throughput Estimation</label>
              <select className="block w-full px-4 py-2.5 border border-slate-300 rounded outline-none text-slate-900 text-sm bg-slate-50">
                 <option>Low Volume (Under 50 Meals / Week)</option>
                 <option>Medium Volume (50 - 250 Meals / Week)</option>
                 <option>Enterprise Volume (250+ Meals / Week)</option>
                 <option>Event/Ad-Hoc Massive Surplus</option>
              </select>
            </div>

            <div className="flex items-start mt-6 p-4 bg-slate-50 border border-slate-200 rounded">
               <input id="director-cert" type="checkbox" className="h-4 w-4 text-primary-600 border-slate-300 rounded mt-0.5" required/>
               <label htmlFor="director-cert" className="ml-3 block text-sm text-slate-600 leading-relaxed font-medium">
                 I agree to the <Link to="/terms" className="text-primary-700 font-bold hover:underline">Terms of Service</Link> and confirm this facility will follow food safety guidelines.
               </label>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-8">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 border border-transparent rounded shadow-sm text-sm font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors uppercase tracking-widest disabled:opacity-50"
              >
                 {isLoading ? <Loader2 className="animate-spin" size={18}/> : 'Create Account'}
              </button>
              {error && <p className="text-sm text-red-600 text-center mt-3">{error}</p>}
            </div>
            
            <p className="mt-8 text-center text-sm text-slate-500 font-medium pb-12">
               Already have an account? <Link to="/donor/login" className="text-primary-700 hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorRegisterPage;
