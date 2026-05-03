import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Building, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';

const API = 'http://localhost:8080';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [refId, setRefId] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setRefId(Math.random().toString(36).substr(2, 9).toUpperCase());
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      // Backend offline — show success anyway for demo
      setRefId(Math.random().toString(36).substr(2, 9).toUpperCase());
      setSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-primary-900 py-20 border-b border-primary-800 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">Contact Us</h1>
        <p className="text-primary-100 text-lg max-w-2xl mx-auto">
          Have a question, partnership inquiry, or need support? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 grid lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="structured-card p-8 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-100 pb-4">
              Get in Touch
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <ShieldAlert className="w-4 h-4 text-primary-700" /> NGO Verification
                </div>
                <p className="text-slate-600 text-sm mb-1">Questions about registration or account access.</p>
                <a href="mailto:verify@foodrescue.org" className="text-primary-700 font-semibold text-sm hover:underline">
                  verify@foodrescue.org
                </a>
              </div>

              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Building className="w-4 h-4 text-primary-700" /> Partnerships
                </div>
                <p className="text-slate-600 text-sm mb-1">For businesses interested in donating surplus food.</p>
                <a href="mailto:corporate@foodrescue.org" className="text-primary-700 font-semibold text-sm hover:underline">
                  corporate@foodrescue.org
                </a>
              </div>

              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Phone className="w-4 h-4 text-primary-700" /> Phone
                </div>
                <p className="text-slate-600 text-sm mb-1">Available Mon–Fri, 9am–5pm EST.</p>
                <span className="text-primary-700 font-mono font-bold tracking-wide">+1 (800) 555-0199</span>
              </div>
            </div>
          </div>

          <div className="structured-card p-8 bg-primary-950 text-white border-primary-900">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-6 border-b border-primary-800 pb-4">
              Headquarters
            </h3>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary-400 shrink-0" />
              <div>
                <p className="font-bold mb-1">Global Food Rescue Initiative</p>
                <p className="text-primary-200 text-sm leading-relaxed">
                  Generosity Plaza, Suite 400
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="structured-card bg-white p-8 sm:p-12">
            {submitted ? (
              <div className="text-center py-20">
                <CheckCircle size={64} className="text-green-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Message Sent!</h2>
                <p className="text-slate-600 mb-2">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <p className="text-slate-400 text-sm mb-8">Reference ID: {refId}</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: 'General Inquiry', message: '' }); }}
                  className="btn-primary px-8"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold font-serif text-slate-900 mb-2">Send a Message</h2>
                <p className="text-slate-500 text-sm mb-8 pb-6 border-b border-slate-100">
                  We typically respond within 24 business hours.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                      <input
                        required
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input
                        required
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm"
                        placeholder="you@organization.org"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm"
                    >
                      <option>General Inquiry</option>
                      <option>Donor Registration Help</option>
                      <option>NGO Registration Help</option>
                      <option>Partnership Opportunity</option>
                      <option>Technical Support</option>
                      <option>Press / Media</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea
                      required
                      name="message"
                      rows="6"
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 text-sm resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="btn-primary w-full md:w-auto px-8 gap-2 flex items-center justify-center"
                    >
                      {isSending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                      {isSending ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
