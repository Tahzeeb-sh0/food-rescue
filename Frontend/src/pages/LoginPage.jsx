import React, { useState } from 'react';
import { Phone, Lock, LogIn, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';

const InputField = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, autoComplete, extra }) => {
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
      {extra}
    </div>
  );
};

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.token) localStorage.setItem('token', userData.token);
        if (userData.role === 'NGO') {
          navigate('/ngo/dashboard');
        } else {
          setError('This account is not registered as an NGO. Please use the donor login.');
        }
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">

      {/* ── Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">

          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-700 uppercase tracking-widest mb-10 transition-colors">
            <ArrowLeft size={14} /> Home
          </Link>

          {/* Brand mark */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <span className="font-serif font-bold text-lg text-slate-900 tracking-tight">FoodRescue</span>
          </div>

          <h1 className="text-3xl font-bold font-serif text-slate-900 mb-1">NGO Sign In</h1>
          <p className="text-sm text-slate-500 mb-8">
            New here?{' '}
            <Link to="/ngo/register" className="text-primary-700 font-semibold hover:underline">Create an account</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="Phone Number" icon={Phone} type="tel" value={phone}
              onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />

            <InputField label="Password" icon={Lock} type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
              extra={
                <div className="flex justify-end mt-1.5">
                  <Link to="/forgot-password" className="text-[11px] font-bold text-primary-600 hover:text-primary-800 uppercase tracking-widest transition-colors">
                    Forgot password?
                  </Link>
                </div>
              }
            />

            <div className="flex items-center gap-2 pt-1">
              <input id="remember" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer select-none">Remember this device</label>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-700 hover:bg-primary-800 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-900/20 transition-all disabled:opacity-60 mt-2">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><LogIn size={16} /> Sign In to Portal</>}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            NGO accounts only. Donors sign in{' '}
            <Link to="/donor/login" className="text-primary-600 hover:underline font-semibold">here</Link>.
          </p>
          <p className="mt-3 text-center text-xs text-slate-300">
            By signing in you agree to our{' '}
            <Link to="/terms" className="underline hover:text-slate-500 transition-colors">Terms of Service</Link>.
          </p>
        </div>
      </div>

      {/* ── Image Panel ── */}
      <div className="hidden lg:block relative w-0 flex-1 bg-primary-950">
        <img className="absolute inset-0 h-full w-full object-cover opacity-50"
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2874&auto=format&fit=crop"
          alt="Humanitarian food distribution" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/60 to-transparent" />
        <div className="absolute bottom-16 left-12 right-12">
          <div className="border-l-4 border-accent-500 pl-6 mb-6">
            <p className="text-white text-2xl font-serif font-bold leading-snug mb-3">
              "Efficiency in distribution is the difference between surplus and sustenance."
            </p>
            <p className="text-primary-300 text-sm font-semibold uppercase tracking-widest">
              Global Food Rescue Initiative
            </p>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <img key={i} src={`https://i.pravatar.cc/40?img=${i+10}`} alt=""
                  className="w-8 h-8 rounded-full border-2 border-primary-900" />
              ))}
            </div>
            <p className="text-primary-300 text-xs font-medium">Trusted by <span className="text-white font-bold">1,200+</span> NGOs worldwide</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
