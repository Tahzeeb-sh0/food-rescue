import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Utensils, Clock, CheckCircle, Package, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  AVAILABLE: { label: 'Available for Pickup', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  CLAIMED:   { label: 'Pickup in Progress', color: 'bg-primary-50 text-primary-700 border-primary-200', dot: 'bg-primary-500' },
  COMPLETED: { label: 'Pickup Completed', color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
};

const fmt = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

const DonationPublicPage = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/donations/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(setDonation)
      .catch(() => setError('This donation could not be found. It may have been claimed or removed.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-700" size={40} />
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold font-serif text-slate-900 mb-2">Donation Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm">{error}</p>
        <Link to="/" className="btn-primary px-8">Back to Home</Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[donation.status] || STATUS_CONFIG.AVAILABLE;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero image */}
      <div className="relative h-72 bg-slate-200 overflow-hidden">
        <img
          src={donation.photoUrl || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=1200'}
          alt={donation.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border inline-flex items-center gap-2 ${status.color}`}>
            <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
            {status.label}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-6 relative z-10">
        <div className="structured-card bg-white p-8 mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to FoodRescue
          </Link>

          <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">{donation.title}</h1>
          {donation.description && (
            <p className="text-slate-600 leading-relaxed mb-6">{donation.description}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              <Utensils size={20} className="text-primary-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</p>
                <p className="text-xl font-bold text-slate-900">{donation.capacity} meals</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              <Clock size={20} className="text-primary-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted</p>
                <p className="text-sm font-bold text-slate-900">{fmt(donation.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3 mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</p>
            {[
              { icon: <Package size={14} />, label: 'Posted', time: donation.createdAt, done: true },
              { icon: <Clock size={14} />, label: 'Claimed', time: donation.claimedAt, done: !!donation.claimedAt },
              { icon: <CheckCircle size={14} />, label: 'Completed', time: donation.completedAt, done: !!donation.completedAt },
            ].map(({ icon, label, time, done }) => (
              <div key={label} className={`flex items-center gap-3 ${done ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-400'}`}>
                  {icon}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{label}</span>
                  <span className="text-xs text-slate-400">{time ? fmt(time) : '—'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          {donation.status === 'AVAILABLE' && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 text-center">
              <p className="text-sm font-medium text-primary-800 mb-4">
                This food is available for pickup. Are you a registered NGO?
              </p>
              <Link to="/ngo/login" className="btn-primary px-8">
                Sign in to Claim
              </Link>
            </div>
          )}
          {donation.status === 'COMPLETED' && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-center">
              <CheckCircle size={32} className="text-green-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-green-800">
                This food was successfully picked up and delivered to those in need.
              </p>
            </div>
          )}
        </div>

        {/* Promote the platform */}
        <div className="structured-card bg-primary-900 text-white p-8 text-center">
          <h3 className="text-xl font-bold font-serif mb-2">Have surplus food to donate?</h3>
          <p className="text-primary-200 text-sm mb-6">Join thousands of businesses rescuing food every day.</p>
          <Link to="/donor/register" className="btn-accent px-8">Start Donating</Link>
        </div>
      </div>
    </div>
  );
};

export default DonationPublicPage;
