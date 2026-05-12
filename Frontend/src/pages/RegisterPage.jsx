import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Phone, Lock, ShieldCheck, Loader2, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';

const InputField = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, autoComplete, hint }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
        <input
          type={isPassword && show ? 'text' : type}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-300"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {hint && <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
};

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('${API_BASE}/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password, role: 'NGO', longitude: -74.006, latitude: 40.7128 }),
      });
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(await res.json()));
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

  const perks = [
    'Real-time alerts for nearby food donations',
    'Verified donor network — no cold outreach',
    'Digital pickup receipts & impact tracking',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">

      {/* ── Left Brand Panel ── */}
      <div className="w-full lg:w-[42%] bg-primary-900 text-white flex flex-col justify-between p-8 lg:p-14 relative overflow-hidden min-h-[260px] lg:min-h-screen">
        {/* Background texture */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1593113565214-802c6110f0d4?q=80&w=1000&auto=format&fit=crop"
            alt="" className="w-full h-full object-cover opacity-10 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-900" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-300 hover:text-white uppercase tracking-widest mb-10 transition-colors">
            <ArrowLeft size={13} /> Back to home
          </Link>

          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight">FoodRescue NGO Portal</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold font-serif leading-tight mb-4">
            Join the Network.<br />Feed Communities.
          </h1>
          <p className="text-primary-200 text-base leading-relaxed max-w-sm mb-10">
            Verified NGOs get priority access to high-volume donors and real-time logistics tools.
          </p>

          <ul className="space-y-4">
            {perks.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-accent-400 shrink-0 mt-0.5" size={18} />
                <span className="text-sm text-primary-100 leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 p-4 bg-white/5 border border-white/10 rounded-xl flex gap-3 backdrop-blur-sm">
            <ShieldCheck className="text-accent-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-bold text-white mb-0.5">Strict Verification</p>
              <p className="text-xs text-primary-300 leading-relaxed">All NGO registrations are independently audited within 48 business hours.</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-primary-500 text-xs mt-8 lg:mt-0">© 2026 Global Food Rescue Initiative</p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-12 lg:px-16 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold font-serif text-slate-900 mb-1">Create NGO Account</h2>
          <p className="text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
            Already have an account?{' '}
            <Link to="/ngo/login" className="text-primary-700 font-semibold hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="Organization Name" icon={Building2} value={name}
              onChange={e => setName(e.target.value)} placeholder="e.g. Red Cross Local Chapter" autoComplete="organization" />

            <InputField label="Contact Phone" icon={Phone} type="tel" value={phone}
              onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />

            <InputField label="Password" icon={Lock} type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" autoComplete="new-password"
              hint="Use at least 8 characters with a mix of letters and numbers." />

            {/* Terms */}
            <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors group">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 mt-0.5 cursor-pointer" />
              <span className="text-sm text-slate-600 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" onClick={e => e.stopPropagation()} className="text-primary-700 font-semibold hover:underline">Terms of Service</Link>
                {' '}and confirm I will follow local food safety guidelines.
              </span>
            </label>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading || !agreed}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-700 hover:bg-primary-800 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-900/20 transition-all disabled:opacity-50 mt-2">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;
