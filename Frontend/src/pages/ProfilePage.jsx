import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Building, ShieldCheck, Mail, Phone, Save, Loader2, Camera, CheckCircle, Globe } from 'lucide-react';

const API = 'http://localhost:8080';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', bio: '', website: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setFormData({
        name: parsed.name || '',
        phone: parsed.phone || '',
        bio: parsed.bio || '',
        website: parsed.website || '',
      });
      if (parsed.profileImage) setProfileImage(parsed.profileImage);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfileImage(base64);
      const saved = localStorage.getItem('user');
      if (saved) {
        const updated = { ...JSON.parse(saved), profileImage: base64 };
        localStorage.setItem('user', JSON.stringify(updated));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name }),
      });
      if (res.ok) {
        const updated = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setError('Failed to save. Please try again.');
      }
    } catch {
      // Backend offline — save locally
      const updated = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout role={user.role === 'NGO' ? 'NGO' : 'Donor'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Profile</h1>
          <p className="text-slate-500">Manage your organization's public information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar & Status */}
          <div className="lg:col-span-1 space-y-6">
            <div className="structured-card p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Building size={48} className="text-slate-300" />
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 p-2 bg-primary-700 text-white rounded-full shadow-lg hover:bg-primary-800 transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{formData.name || user.name}</h3>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-green-100">
                <ShieldCheck size={14} /> Verified {user.role}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed px-4">
                Member since {new Date().getFullYear()}. Compliant with food safety standards.
              </p>
            </div>

            <div className="structured-card p-6 bg-primary-900 text-white">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-accent-400" /> Compliance Status
              </h4>
              <p className="text-sm text-primary-200 leading-relaxed mb-4">
                Your account is in good standing and meets all platform requirements.
              </p>
              <div className="w-full bg-primary-800 rounded-full h-2">
                <div className="bg-accent-500 h-2 rounded-full w-full"></div>
              </div>
              <p className="text-xs text-primary-300 mt-2">100% compliant</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="structured-card p-8 bg-white">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      Phone (read-only)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input
                        type="tel"
                        value={formData.phone}
                        readOnly
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-200 border border-slate-300 rounded text-slate-500 cursor-not-allowed text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="www.yourorg.org"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    About / Mission
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about your organization's mission..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm resize-none"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-8 py-3 rounded font-bold text-sm transition-all shadow-sm ${
                      isSaved ? 'bg-green-600 text-white' : 'bg-primary-700 hover:bg-primary-800 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : isSaved ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    {isSaved ? 'Saved' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
