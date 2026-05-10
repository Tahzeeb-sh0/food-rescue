import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Users, Globe, ChevronDown, ShieldCheck, Trophy } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: 'How It Works', path: '/howitworks', icon: <Heart className="w-4 h-4" /> },
    { name: 'Impact Report', path: '/impact', icon: <Globe className="w-4 h-4" /> },
    { name: 'Our Network', path: '/network', icon: <Users className="w-4 h-4" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Corporate Top Bar */}
      <div className="bg-primary-950 text-white py-1.5 px-4 text-xs font-semibold tracking-wider text-center sm:text-left flex justify-center sm:justify-between items-center max-w-7xl mx-auto">
         <span className="hidden sm:inline">Global Food Rescue Initiative • Established 2026</span>
         <a href="/ngo/login" className="hover:text-primary-300 transition-colors uppercase">NGO Portal Login →</a>
      </div>

      <nav className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-800 rounded flex items-center justify-center">
             <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-slate-900 tracking-tight leading-none">FoodRescue</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">International Network</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-800'
                    : 'text-slate-600 hover:text-primary-700 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* NGO Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 transition-all duration-200"
            >
              <Users className="w-4 h-4" />
              Partner Access
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg border border-slate-200 py-1 z-50 overflow-hidden">
                <Link to="/ngo/login" className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-100">
                  Account Login
                </Link>
                <Link to="/ngo/register" className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-slate-100">
                  Apply for Verification
                </Link>
                <Link to="/ngo/dashboard" className="block px-4 py-3 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100">
                  Enter Operations Portal
                </Link>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <Link
            to="/donate"
            className="flex items-center gap-2 px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white text-sm font-bold rounded shadow-sm transition-all duration-200 border border-transparent"
          >
            <Heart className="w-4 h-4" />
              Donate Food
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden p-2 rounded text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded text-base font-semibold ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-800'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="my-2 border-t border-slate-100" />
            
            <Link
              to="/ngo/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded text-base font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200"
            >
              <Users className="w-5 h-5" />
              Partner Access
            </Link>
            
            <Link
              to="/donate"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded shadow-sm mt-3"
            >
              <Heart className="w-5 h-5" />
                Donate Food
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;