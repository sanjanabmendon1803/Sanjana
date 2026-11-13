import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-forest-700 block">
          We're Here For You
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Contact LOCALROOTS Support
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mx-auto">
          Have questions about an order, seller onboarding, or platform suggestions? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Information */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-soft space-y-6">
          <h3 className="font-serif font-bold text-lg text-charcoal-900 pb-2 border-b border-cream-200">
            Reach Out Directly
          </h3>

          <div className="space-y-4 text-xs text-charcoal-600">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-charcoal-900">Email Inquiries:</strong>
                <span>support@localroots.in</span>
                <span className="block text-[10px] text-charcoal-400 mt-0.5">Response within 24 hours</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-terracotta-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-charcoal-900">Maker Help Desk:</strong>
                <span>+91 98451 23456</span>
                <span className="block text-[10px] text-charcoal-400 mt-0.5">Mon - Sat (9:00 AM - 6:00 PM IST)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-charcoal-900">Artisan Community Hubs:</strong>
                <p>Bengaluru • Jaipur • Mumbai • Kochi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-soft">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-charcoal-900">Message Received</h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                Thank you, {name}. Our community coordinator will respond to {email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-charcoal-900 pb-2 border-b border-cream-200">
                Send a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question about homemade pickle ingredients"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
