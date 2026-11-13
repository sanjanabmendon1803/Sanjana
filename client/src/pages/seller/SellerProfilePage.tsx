import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CheckCircle2, AlertCircle, Store } from 'lucide-react';

export const SellerProfilePage: React.FC = () => {
  const { seller, refreshSellerProfile } = useAuth();

  const [businessName, setBusinessName] = useState(seller?.business_name || '');
  const [description, setDescription] = useState(seller?.description || '');
  const [story, setStory] = useState(seller?.story || '');
  const [businessCategory, setBusinessCategory] = useState(seller?.business_category || 'Homemade Food');
  const [logoUrl, setLogoUrl] = useState(seller?.logo_url || '');
  const [bannerUrl, setBannerUrl] = useState(seller?.banner_url || '');
  const [phoneNumber, setPhoneNumber] = useState(seller?.phone_number || '');
  const [addressLine, setAddressLine] = useState(seller?.address_line || '');
  const [locality, setLocality] = useState(seller?.locality || '');
  const [city, setCity] = useState(seller?.city || '');
  const [state, setState] = useState(seller?.state || '');
  const [pinCode, setPinCode] = useState(seller?.pin_code || '');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.updateSellerProfile({
        business_name: businessName,
        description,
        story,
        business_category: businessCategory,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        phone_number: phoneNumber,
        address_line: addressLine,
        locality,
        city,
        state,
        pin_code: pinCode,
      });

      if (res.success) {
        await refreshSellerProfile();
        setMessage('Storefront profile updated successfully!');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-[#E8E1D3]">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Store Profile & Story
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          This information is displayed publicly on your personal storefront at{' '}
          <strong className="text-forest-700">/store/{seller?.slug}</strong>.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-card space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Category
            </label>
            <input
              type="text"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
            Short Tagline / Summary
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
            Your Maker Story (Public)
          </label>
          <textarea
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Storefront Logo URL
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Storefront Banner URL
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Locality
            </label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Home PIN Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-card transition active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};
