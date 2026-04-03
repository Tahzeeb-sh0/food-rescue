import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Bell, 
  Lock, 
  Shield, 
  Mail, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Save, 
  Loader2, 
  CheckCircle,
  AlertTriangle,
  Globe,
  Settings
} from 'lucide-react';

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('security'); // 'security' or 'notifications'
  const [showPassword, setShowPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1500);
  };

  if (!user) return null;

  return (
    <DashboardLayout role={user.role === 'NGO' ? 'NGO' : 'Donor'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
           <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Account Control Center</h1>
           <p className="text-slate-500">Manage your institutional security protocols and communication preferences.</p>
        </div>

        <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
           <button 
             onClick={() => setActiveTab('security')}
             className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'security' ? 'bg-primary-700 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
           >
              <Lock size={16} /> Security Settings
           </button>
           <button 
             onClick={() => setActiveTab('notifications')}
             className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'notifications' ? 'bg-primary-700 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
           >
              <Bell size={16} /> Communication Hooks
           </button>
        </div>

        {activeTab === 'security' ? (
          <div className="space-y-8">
            <div className="structured-card p-10 bg-white">
               <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">Credential Update</h3>
               <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Current Identifier (Phone)</label>
                        <input type="tel" value={user.phone} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-slate-500 cursor-not-allowed text-sm font-mono" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Update Operational Email</label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                           <input type="email" placeholder="official@agency.org" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-sm transition-colors" />
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">New Access Token (Password)</label>
                     <div className="relative">
                        <Shield className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                           type={showPassword ? "text" : "password"} 
                           placeholder="••••••••••••" 
                           className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-sm font-mono" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                     </div>
                     <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">Minimum 12 characters required for enterprise security compliance.</p>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded flex gap-4">
                     <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                     <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        Changing your security credentials will invalidate all active hardware tokens and require a systematic re-login across all logistics terminals.
                     </p>
                  </div>

                  <div className="flex justify-end">
                     <button type="submit" disabled={isLoading} className={`px-8 py-3 rounded font-bold text-sm flex items-center gap-2 transition-all ${isSaved ? 'bg-green-600 text-white' : 'bg-primary-700 hover:bg-primary-800 text-white'}`}>
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isSaved ? <CheckCircle size={18} /> : <Save size={18} />)}
                        {isSaved ? 'Security Verified' : 'Update Security Protocol'}
                     </button>
                  </div>
               </form>
            </div>

            <div className="structured-card p-10 bg-slate-900 text-white border-none shadow-xl">
               <div className="flex items-center justify-between mb-8">
                  <div>
                     <h3 className="text-xl font-bold mb-1">MFA Verification</h3>
                     <p className="text-primary-300 text-sm">Require a biometric or SMS token for every sensitive transaction.</p>
                  </div>
                  <div className="w-14 h-8 bg-primary-800 rounded-full relative p-1 cursor-pointer">
                     <div className="w-6 h-6 bg-accent-500 rounded-full shadow-sm"></div>
                  </div>
               </div>
               
               <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-primary-800/40 rounded border border-primary-700">
                     <Smartphone className="mb-3 text-accent-400" size={24} />
                     <h4 className="font-bold mb-1">SMS Guard</h4>
                     <p className="text-xs text-primary-200">OTP requested for all batch claims over 100 units.</p>
                  </div>
                  <div className="p-4 bg-primary-800/40 rounded border border-primary-700">
                     <Globe className="mb-3 text-accent-400" size={24} />
                     <h4 className="font-bold mb-1">IP Whitelisting</h4>
                     <p className="text-xs text-primary-200">Restricts dashboard access to verified facility networks only.</p>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="structured-card p-10 bg-white">
             <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">Communication Hooks</h3>
             <form onSubmit={handleSave} className="space-y-10">
                <div className="space-y-6">
                   {[
                     { id: 'new_donations', label: 'Real-time Surplus Alerts', active: true, desc: 'Instant notification when a new surplus batch is logged within 10km.' },
                     { id: 'claim_updates', label: 'Claim Handshake Notifications', active: true, desc: 'Direct alerts for authorization code requests during physical handovers.' },
                     { id: 'impact_benchmarks', label: 'Monthly ESG Performance', active: false, desc: 'Aggregated analytics of your organizations environmental impact.' },
                     { id: 'system_logistics', label: 'Hardware & API Status', active: true, desc: 'Critical alerts regarding WebSocket maintenance or cloud uptime.' },
                   ].map(hook => (
                     <div key={hook.id} className="flex items-start justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="max-w-lg">
                           <h4 className="font-bold text-slate-900 mb-1">{hook.label}</h4>
                           <p className="text-xs text-slate-500 leading-relaxed font-medium">{hook.desc}</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${hook.active ? 'bg-primary-700' : 'bg-slate-200'}`}>
                           <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${hook.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                   <button type="submit" disabled={isLoading} className="btn-primary px-10">
                      {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Save Hook Preferences'}
                   </button>
                </div>
             </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
