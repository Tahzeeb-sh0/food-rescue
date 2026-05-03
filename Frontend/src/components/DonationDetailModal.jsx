import { X, MapPin, Utensils, Clock, CheckCircle, Package, User } from 'lucide-react';

const STATUS_CONFIG = {
  AVAILABLE: { label: 'Available', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  CLAIMED:   { label: 'Claimed — Pickup in Progress', color: 'bg-primary-50 text-primary-700 border-primary-200' },
  COMPLETED: { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200' },
};

const fmt = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

const DonationDetailModal = ({ donation, onClose, onClaim, currentUserRole }) => {
  if (!donation) return null;
  const status = STATUS_CONFIG[donation.status] || STATUS_CONFIG.AVAILABLE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Photo */}
        <div className="relative h-56 bg-slate-100 rounded-t-2xl overflow-hidden">
          <img
            src={donation.photoUrl || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800'}
            alt={donation.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-slate-600 hover:text-slate-900 transition-colors shadow"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-900 mb-1">{donation.title}</h2>
            {donation.description && (
              <p className="text-sm text-slate-600 leading-relaxed">{donation.description}</p>
            )}
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              <Utensils size={18} className="text-primary-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</p>
                <p className="text-lg font-bold text-slate-900">{donation.capacity} meals</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              <Clock size={18} className="text-primary-600 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted</p>
                <p className="text-sm font-bold text-slate-900">{fmt(donation.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</p>
            <div className="space-y-2">
              <TimelineRow icon={<Package size={14} />} label="Posted" time={donation.createdAt} active />
              <TimelineRow icon={<User size={14} />} label="Claimed" time={donation.claimedAt} active={!!donation.claimedAt} />
              <TimelineRow icon={<CheckCircle size={14} />} label="Completed" time={donation.completedAt} active={!!donation.completedAt} />
            </div>
          </div>

          {/* Confirmation code — only shown to donor when claimed */}
          {donation.status === 'CLAIMED' && donation.confirmationCode && currentUserRole === 'DONOR' && (
            <div className="bg-slate-950 rounded-xl p-5 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Handover Code</p>
              <p className="text-4xl font-mono font-bold text-white tracking-[0.4em]">{donation.confirmationCode}</p>
              <p className="text-[10px] text-accent-400 font-bold uppercase tracking-widest mt-2">Share only with the NGO representative</p>
            </div>
          )}

          {/* Claim button for NGOs */}
          {donation.status === 'AVAILABLE' && currentUserRole === 'NGO' && onClaim && (
            <button
              onClick={() => { onClaim(donation.id); onClose(); }}
              className="w-full py-4 bg-primary-700 text-white rounded-xl font-bold hover:bg-primary-800 transition-colors shadow-lg uppercase tracking-widest text-xs"
            >
              Claim This Donation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TimelineRow = ({ icon, label, time, active }) => (
  <div className={`flex items-center gap-3 ${active ? 'opacity-100' : 'opacity-30'}`}>
    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-400'}`}>
      {icon}
    </div>
    <div className="flex-1 flex items-center justify-between">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="text-xs text-slate-400">{time ? new Date(time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}</span>
    </div>
  </div>
);

export default DonationDetailModal;
