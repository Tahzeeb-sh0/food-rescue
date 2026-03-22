import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin,
  ArrowUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    organization: [
      { name: 'Our Mission', path: '/about' },
      { name: 'Financial Transparency', path: '/reports' },
      { name: 'Board of Directors', path: '/board' },
      { name: 'Press & Media', path: '/press' },
    ],
    operations: [
      { name: 'Logistics Framework', path: '/howitworks' },
      { name: 'Annual Impact Report', path: '/impact' },
      { name: 'Global Network', path: '/network' },
      { name: 'Safety Standards', path: '/safety' },
    ],
    partnerships: [
      { name: 'Corporate Intake', path: '/donate' },
      { name: 'NGO Verification', path: '/ngo/register' },
      { name: 'API Documentation', path: '/api' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Compliance Code', path: '/compliance' },
    ],
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-950 text-white border-t border-primary-900 border-t-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">
        
        {/* Top Info Banner */}
        <div className="bg-primary-900 border border-primary-800 rounded p-8 md:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold font-serif mb-2">
              Transforming Surplus into Sustenance.
            </h3>
            <p className="text-primary-200 font-medium">
              Join the verified network of international donors and logistical NGOs.
            </p>
          </div>
          <Link
            to="/donate"
            className="btn-accent px-8"
          >
            Initiate Corporate Partnership
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-800 rounded flex items-center justify-center border border-primary-700">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-serif tracking-tight">FoodRescue</span>
            </Link>
            <p className="text-primary-200 text-sm leading-relaxed mb-6">
              A registered 501(c)(3) maintaining zero tolerance for food waste through verified demographic targeting.
            </p>
            {/* Contact Info */}
            <div className="space-y-4">
              <a href="mailto:director@foodrescue.org" className="flex items-center gap-3 text-primary-200 hover:text-white transition-colors text-sm font-medium">
                <Mail className="w-4 h-4 text-primary-400" />
                director@foodrescue.org
              </a>
              <a href="tel:+18005550199" className="flex items-center gap-3 text-primary-200 hover:text-white transition-colors text-sm font-medium">
                <Phone className="w-4 h-4 text-primary-400" />
                +1 (800) 555-0199
              </a>
              <div className="flex items-start gap-3 text-primary-200 text-sm font-medium">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400" />
                <span>Global Headquarters<br />Generosity Plaza, NY 10001</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
               <h4 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-5">
                 {category}
               </h4>
               <ul className="space-y-3">
                 {links.map((link) => (
                   <li key={link.name}>
                     <Link
                       to={link.path}
                       className="text-primary-100 hover:text-white hover:underline transition-colors text-sm font-medium"
                     >
                       {link.name}
                     </Link>
                   </li>
                 ))}
               </ul>
            </div>
          ))}
        </div>

        {/* Divider & Bottom */}
        <div className="border-t border-primary-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-primary-300 text-sm font-medium">
              © {currentYear} The Global Food Rescue Initiative. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
               <a href="#" className="w-10 h-10 bg-primary-900 border border-primary-800 hover:bg-primary-800 rounded flex items-center justify-center transition-colors text-primary-300 hover:text-white">
                 <Facebook className="w-4 h-4" />
               </a>
               <a href="#" className="w-10 h-10 bg-primary-900 border border-primary-800 hover:bg-primary-800 rounded flex items-center justify-center transition-colors text-primary-300 hover:text-white">
                 <Twitter className="w-4 h-4" />
               </a>
               <a href="#" className="w-10 h-10 bg-primary-900 border border-primary-800 hover:bg-primary-800 rounded flex items-center justify-center transition-colors text-primary-300 hover:text-white">
                 <Linkedin className="w-4 h-4" />
               </a>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="px-4 py-2 bg-primary-900 border border-primary-800 hover:bg-primary-800 rounded flex items-center gap-2 transition-colors text-sm font-bold tracking-wide"
            >
              TOP <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;