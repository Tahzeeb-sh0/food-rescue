import React, { useState } from 'react';
import { LayoutDashboard, Heart, History, Settings, LogOut, Menu, X, User, ShieldCheck, Globe, Bell } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import NotificationCenter from '../NotificationCenter';

// Internal helper — must be defined before DashboardLayout (const TDZ)
const Building = ({ size, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="9" y1="22" x2="9" y2="18"></line>
    <line x1="15" y1="22" x2="15" y2="18"></line>
    <line x1="18" y1="6" x2="18" y2="6"></line>
    <line x1="18" y1="10" x2="18" y2="10"></line>
    <line x1="18" y1="14" x2="18" y2="14"></line>
    <line x1="6" y1="6" x2="6" y2="6"></line>
    <line x1="6" y1="10" x2="6" y2="10"></line>
    <line x1="6" y1="14" x2="6" y2="14"></line>
  </svg>
);

const DashboardLayout = ({ children, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: role === 'NGO' ? '/ngo/dashboard' : '/donor/dashboard' },
    { icon: <Heart size={20} />, label: role === 'NGO' ? 'Available Food' : 'Donate Food', path: role === 'NGO' ? '/ngo/dashboard' : '/donor/dashboard' },
    { icon: <Globe size={20} />, label: 'Impact Data', path: '/impact' },
    { icon: <User size={20} />, label: 'Organization Profile', path: '/profile' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 
        transform transition-all duration-500 ease-in-out flex flex-col shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-24 flex items-center px-8 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-slate-900 tracking-tight leading-none">FoodRescue</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5">Ops Terminal</span>
            </div>
          </Link>
          <button 
            className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-10 px-6 custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Operations Hub</p>
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`
                    w-full flex items-center px-4 py-3.5 rounded-2xl transition-all group relative
                    ${active 
                      ? 'bg-primary-900 text-white shadow-xl shadow-primary-900/10' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`
                    ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}
                    mr-4 transition-colors
                  `}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                  {active && (
                     <div className="absolute right-4 w-1.5 h-1.5 bg-accent-400 rounded-full shadow-[0_0_10px_#FFD700]"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer spacer */}
          <div className="mt-12"></div>
        </div>

        {/* User Card */}
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4 group hover:border-primary-200 transition-colors cursor-pointer">
            <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-primary-700 shrink-0 group-hover:scale-110 transition-transform">
               {user?.role === 'NGO' ? <Building size={18} /> : <User size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate leading-tight">{user?.name || 'Authorized User'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">{role === 'NGO' ? 'NGO Agent' : 'Donor Node'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-600 hover:bg-red-50/50 transition-all w-full rounded-xl border border-transparent hover:border-red-100"
          >
            <LogOut size={16} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="h-20 sm:h-24 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-4 sm:px-8 lg:px-12 sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-6">
            <button 
              className="lg:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 focus:outline-none transition-colors"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-serif font-bold tracking-tight text-slate-900 group">
                    {location.pathname.includes('profile') ? 'My Profile' : 
                     location.pathname.includes('impact') ? 'Impact Dashboard' : 
                     location.pathname.includes('settings') ? 'Settings' :
                     'Dashboard'}
                  </h2>
               </div>
               <p className="text-[10px] font-bold text-slate-400 font-medium uppercase tracking-[0.2em]">Verified Session Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group hover:border-primary-100 transition-all cursor-default relative">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Connected</span>
            </div>
            <button className="relative p-2.5 text-slate-400 rounded-xl hover:bg-slate-50 transition-all group" aria-label="Notifications">
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(255,215,0,0.4)]"></span>
              <Bell size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
