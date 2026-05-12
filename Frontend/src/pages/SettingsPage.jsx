import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Bell, Lock, Shield, Eye, EyeOff, Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

import { apiFetch } from '../utils/api';

const DEFAULT_NOTIFICATIONS = [
  { id: 'new_donations', label: 'New Food Alerts', active: true, desc: 'Get notified when new food is available within 10km.' },
  { id: 'claim_updates', label: 'Pickup Notifications', active: true, desc: 'Alerts when a confirmation code is requested during a handover.' },
  { id: 'impact_benchmarks', label: 'Monthly Impact Summary', active: false, desc: "A monthly summary of your organization's environmental impact." },
  { id: 'system_status', label: 'System Status', active: true, desc: 'Critical alerts about platform maintenance or downtime.' },
];

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('security');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  // Notification prefs
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      // Load saved notification prefs from localStorage
      const savedNotifs = localStorage.getItem(`notifs_${parsed.id}`);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    }
  }, []);

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwError('');
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwLoading(true);
    try {
      const res = await apiFetch(`/api/users/${user.id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPwSaved(true);
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setPwSaved(false), 3000);
      } else {
        const text = await res.text();
        setPwError(text || 'Failed to update password.');
      }
    } catch {
      setPwError('Could not connect to server. Please try again.');
    } finally {
      setPwLoading(false);
    }
  };

  const toggleNotification = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n)));
  };

  const handleNotifSave = (e) => {
    e.preventDefault();
    setNotifLoading(true);
    // Persist to localStorage (no backend endpoint for this yet)
    setTimeout(() => {
      localStorage.setItem(`notifs_${user.id}`, JSON.stringify(notifications));
      setNotifLoading(false);
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 3000);
    }, 600);
  };

  if (!user) return null;

  return (
    <DashboardLayout role={user.role === 'NGO' ? 'NGO' : 'Donor'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Account Settings</h1>
          <p className="text-slate-500">Manage your security and notification preferences.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${
              activeTab === 'security' ? 'bg-primary-700 text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Lock size={16} /> Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${
              activeTab === 'notifications' ? 'bg-primary-700 text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Bell size={16} /> Notifications
          </button>
        </div>

        {activeTab === 'security' ? (
          <div className="structured-card p-10 bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">Change Password</h3>
            <form onSubmit={handlePasswordSave} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Phone (read-only)
                </label>
                <input
                  type="tel"
                  value={user.phone}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded text-slate-500 cursor-not-allowed text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Current Password
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">Minimum 8 characters.</p>
              </div>

              {pwError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded text-sm text-red-700 flex gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" /> {pwError}
                </div>
              )}

              <div className="p-4 bg-amber-50 border border-amber-100 rounded flex gap-4">
                <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Changing your password will log you out of all active sessions.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className={`px-8 py-3 rounded font-bold text-sm flex items-center gap-2 transition-all ${
                    pwSaved ? 'bg-green-600 text-white' : 'bg-primary-700 hover:bg-primary-800 text-white'
                  }`}
                >
                  {pwLoading ? <Loader2 className="animate-spin" size={18} /> : pwSaved ? <CheckCircle size={18} /> : <Save size={18} />}
                  {pwSaved ? 'Password Updated' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="structured-card p-10 bg-white">
            <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">Notification Preferences</h3>
            <form onSubmit={handleNotifSave} className="space-y-10">
              <div className="space-y-6">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="max-w-lg">
                      <h4 className="font-bold text-slate-900 mb-1">{n.label}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{n.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotification(n.id)}
                      className={`w-11 h-6 rounded-full relative p-0.5 transition-colors shrink-0 ml-6 ${
                        n.active ? 'bg-primary-700' : 'bg-slate-200'
                      }`}
                      aria-label={`Toggle ${n.label}`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          n.active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={notifLoading}
                  className={`btn-primary px-10 flex items-center gap-2 ${notifSaved ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {notifLoading ? <Loader2 className="animate-spin" size={18} /> : notifSaved ? <CheckCircle size={18} /> : null}
                  {notifSaved ? 'Saved' : 'Save Preferences'}
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
