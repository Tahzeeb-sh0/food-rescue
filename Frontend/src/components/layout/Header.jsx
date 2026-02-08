import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Users, Globe, ChevronDown,  Leaf } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'How It Works', path: '/howitworks', icon: <Heart className="w-4 h-4" /> },
    { name: 'Impact', path: '/impact', icon: <Globe className="w-4 h-4" /> },
    { name: 'Our Network', path: '/network', icon: <Users className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <nav className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 bg-gradient-to-br from-[#21c45d] to-[#16a34a] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Leaf className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">FoodRescue</h1>
            <p className="text-xs text-gray-500 font-medium">Connecting Hearts & Meals</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-[#21c45d]/10 text-[#21c45d]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-200 border border-gray-200"
            >
              <Users className="w-4 h-4" />
              I'm an NGO
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                <Link to="/ngo/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#21c45d]">
                  Login as NGO
                </Link>
                <Link to="/ngo/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#21c45d]">
                  Register NGO
                </Link>
                <hr className="my-2 border-gray-100" />
                <Link to="/ngo/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#21c45d]">
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <Link
            to="/donate"
            className="group relative px-6 py-2.5 bg-[#21c45d] hover:bg-[#16a34a] text-white text-sm font-bold rounded-full shadow-lg shadow-[#21c45d]/30 hover:shadow-xl hover:shadow-[#21c45d]/40 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Donate Food
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-5">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-[#21c45d]/10 text-[#21c45d]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <hr className="border-gray-100" />
            
            <Link
              to="/ngo/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <Users className="w-5 h-5" />
              I'm an NGO
            </Link>
            
            <Link
              to="/donate"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#21c45d] text-white font-bold rounded-xl shadow-lg shadow-[#21c45d]/30"
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