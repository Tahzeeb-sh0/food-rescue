import React, { useState } from 'react';
import { ShieldCheck, Phone, Lock, ArrowRight, CheckCircle, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = ['Phone', 'Verify', 'New Password', 'Done'];

const StepIndicator = ({ current }) => (
  <div className="flex items-center gap-0 mb-10">
    {STEPS.map((label, i) => {
      const done = i < current - 1;
      const active = i === current - 1;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              done ? 'bg-primary-700 border-primary-700 text-white'
              : active ? 'bg-white border-primary-700 text-primary-700'
              : 'bg-white border-slate-200 text-slate-300'
            }`}>
              {done ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-bold mt-1.5 uppercase tracking-widest ${
              active ? 'text-primary-700' : done ? 'text-slate-400' : 'text-slate-300'
            }`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-5 transition-all ${done ? 'bg-primary-700' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendError, setSendError] = useState('');
  const [resetError, setResetError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setSendError('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) setStep(2);
      else setSendError('No account found with this phone number.');
    } catch {
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetError('');
    if (password.length < 8) { setResetError('Password must be at least 8 characters.'); return; }
    setIsLoading(true);
    try {
      await fetch('http://localhost:8080/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, newPassword: password }),
      });
      setStep(4);
    } catch {
      setStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-700 rounded-2xl mb-5 shadow-lg shadow-primary-900/20">
            <ShieldCheck className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 mb-1">Account Recovery</h1>
          <p className="text-sm text-slate-500">Reset your password in a few steps</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {step < 4 && <StepIndicator current={step} />}

          {/* Step 1 — Phone */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Registered Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-300"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">We'll send a 6-digit verification code to this number.</p>
              </div>

              {sendError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {sendError}
                </div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-700 hover:bg-primary-800 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-900/20 transition-all disabled:opacity-60">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Send Code <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-sm text-green-700">
                <CheckCircle size={18} className="shrink-0" />
                <span>Code sent to <span className="font-bold">{phone}</span></span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-center text-3xl font-mono tracking-[0.6em] text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-200"
                />
                <p className="text-[11px] text-slate-400 mt-2 text-center">Enter the 6-digit code from your SMS</p>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-700 hover:bg-primary-800 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-900/20 transition-all">
                Verify & Continue <ArrowRight size={16} />
              </button>

              <button onClick={() => setStep(1)}
                className="w-full text-xs text-slate-400 hover:text-primary-700 transition-colors font-bold uppercase tracking-widest py-1">
                ← Change phone number
              </button>
            </div>
          )}

          {/* Step 3 — New Password */}
          {step === 3 && (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-300"
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Use at least 8 characters with letters and numbers.</p>
              </div>

              {resetError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {resetError}
                </div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-700 hover:bg-primary-800 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-900/20 transition-all disabled:opacity-60">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Set New Password'}
              </button>
            </form>
          )}

          {/* Step 4 — Success */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold font-serif text-slate-900 mb-2">Password Updated!</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Your password has been reset. You can now sign in with your new credentials.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/ngo/login"
                  className="flex-1 flex items-center justify-center py-3 bg-primary-700 hover:bg-primary-800 text-white text-sm font-bold rounded-xl transition-colors">
                  NGO Sign In
                </Link>
                <Link to="/donor/login"
                  className="flex-1 flex items-center justify-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors">
                  Donor Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-700 transition-colors uppercase tracking-widest">
            <ArrowLeft size={12} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
