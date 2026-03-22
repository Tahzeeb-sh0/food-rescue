import React, { useState } from 'react';
import { LayoutDashboard, Heart, History, Settings, LogOut, Bell, Menu, X, User } from 'lucide-react';

const DashboardLayout = ({ children, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', active: true },
    { icon: <Heart size={20} />, label: role === 'NGO' ? 'Available Donations' : 'Create Donation', active: false },
    { icon: <History size={20} />, label: 'Impact Report', active: false },
    { icon: <Settings size={20} />, label: 'Account Settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Clean Corporate White */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out flex flex-col shadow-sm lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-200 bg-white">
          <div className="w-8 h-8 bg-primary-700 rounded-sm flex items-center justify-center">
            <span className="text-white font-serif font-bold text-lg">F</span>
          </div>
          <span className="ml-3 font-serif font-bold text-xl text-primary-950 tracking-tight">FoodRescue</span>
          <button 
            className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-600 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Main Menu</p>
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`
                  w-full flex items-center px-3 py-2.5 rounded-md transition-colors group
                  ${item.active 
                    ? 'bg-primary-50 text-primary-800' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className={`
                  ${item.active ? 'text-primary-700' : 'text-slate-400 group-hover:text-slate-600'}
                  mr-3
                `}>
                  {item.icon}
                </div>
                <span className={`text-sm ${item.active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 p-2 rounded-md bg-white border border-slate-200 mb-2">
            <div className="h-8 w-8 bg-primary-100 rounded flex items-center justify-center text-primary-700 shrink-0">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">UNHCR Branch</p>
              <p className="text-xs text-slate-500 truncate">{role === 'NGO' ? 'Verified NGO' : 'Corporate Donor'}</p>
            </div>
          </div>
          <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full rounded-md border border-transparent hover:border-red-100">
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Corporate Trust Blue */}
        <header className="h-20 bg-primary-900 border-b border-primary-800 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-30 shadow-sm text-white">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 bg-primary-800 rounded-md text-white hover:bg-primary-700 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-xl font-serif font-bold tracking-tight text-white">Dashboard Overview</h2>
              <p className="text-sm text-primary-200 mt-0.5 font-medium">Global Food Rescue Network Operations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-primary-200 hover:text-white transition-colors rounded-full hover:bg-primary-800">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-primary-900"></span>
              <Bell size={20} />
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-white text-primary-900 px-4 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-slate-100 transition-colors">
              <Heart size={16} className="text-accent-600" />
              <span>{role === 'NGO' ? 'Locate Food' : 'Log Donation'}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 overflow-auto p-6 sm:p-10 pb-20">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
