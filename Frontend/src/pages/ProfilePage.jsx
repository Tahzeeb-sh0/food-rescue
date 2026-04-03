import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Building, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Save, 
  Loader2, 
  Camera,
  CheckCircle as CheckCircleIcon 
} from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: 'contact@organization.org',
    bio: 'Dedicated to humanitarian food rescue and zero-waste logistics.',
    website: 'www.rescue-network.org'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setFormData(prev => ({ 
        ...prev, 
        name: parsed.name, 
        phone: parsed.phone,
        email: parsed.role === 'NGO' ? 'verify@ngo-agency.org' : 'csr@corporate-donor.com'
      }));
      if (parsed.profileImage) setProfileImage(parsed.profileImage);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        // Persist to localStorage for demo
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
           const parsed = JSON.parse(savedUser);
           const updated = { ...parsed, profileImage: base64String };
           localStorage.setItem('user', JSON.stringify(updated));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Persist updated names to localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
       const parsed = JSON.parse(savedUser);
       const updated = { ...parsed, ...formData };
       localStorage.setItem('user', JSON.stringify(updated));
       setUser(updated);
    }
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  if (!user) return null;

  return (
    <DashboardLayout role={user.role === 'NGO' ? 'NGO' : 'Donor'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
           <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Organization Profile</h1>
           <p className="text-slate-500">Manage your verified identity and contact credentials.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Verification */}
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
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 p-2 bg-primary-700 text-white rounded-full shadow-lg hover:bg-primary-800 transition-colors"
                  >
                     <Camera size={16} />
                  </button>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">{formData.name}</h3>
               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-green-100">
                  <ShieldCheck size={14} /> Verified {user.role}
               </div>
               <p className="text-xs text-slate-400 leading-relaxed px-4">Account active since March 2026. All credentials audited for Good Samaritan compliance.</p>
            </div>

            <div className="structured-card p-6 bg-primary-900 text-white border-none shadow-primary-900/20">
               <h4 className="font-bold mb-3 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-accent-400" /> Security Audit
               </h4>
               <p className="text-sm text-primary-200 leading-relaxed mb-4">
                  Your organization is currently in 100% compliance with local health and safety protocols.
               </p>
               <button type="button" className="w-full py-2 bg-primary-800 hover:bg-primary-700 text-xs font-bold rounded transition-colors uppercase tracking-widest">
                  View Certificates
               </button>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2">
            <div className="structured-card p-8 bg-white">
              <form onSubmit={handleSave} className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Public Organization Name</label>
                    <div className="relative">
                       <Building className="absolute left-3 top-3 text-slate-400" size={18} />
                       <input 
                          type="text" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                        />
                    </div>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Contact Phone</label>
                       <div className="relative">
                          <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                          <input 
                             type="tel" 
                             value={formData.phone}
                             onChange={(e) => setFormData({...formData, phone: e.target.value})}
                             className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                          />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Director Email</label>
                       <div className="relative">
                          <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                          <input 
                             type="email" 
                             value={formData.email}
                             readOnly
                             className="w-full pl-10 pr-4 py-2.5 bg-slate-200 border border-slate-300 rounded text-slate-500 cursor-not-allowed text-sm"
                          />
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Mission Statement / Bio</label>
                    <textarea 
                       rows={4}
                       value={formData.bio}
                       onChange={(e) => setFormData({...formData, bio: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm resize-none"
                    ></textarea>
                 </div>

                 <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button 
                       type="submit" 
                       disabled={isLoading}
                       className={`flex items-center gap-2 px-8 py-3 rounded font-bold text-sm transition-all shadow-sm ${
                          isSaved ? 'bg-green-600 text-white' : 'bg-primary-700 hover:bg-primary-800 text-white'
                       }`}
                    >
                       {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isSaved ? <CheckCircleIcon size={18} /> : <Save size={18} />)}
                       {isSaved ? 'Identity Updated' : 'Save Profile Changes'}
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
