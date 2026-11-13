import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SellerRegisterPage: React.FC = () => {
  const { registerSeller } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Pickles & Preserves');
  const [businessDescription, setBusinessDescription] = useState('');
  const [story, setStory] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [pickupAvailable, setPickupAvailable] = useState(false);
  const [defaultDeliveryCharge, setDefaultDeliveryCharge] = useState('40');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('500');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('1-2 Days');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !email || !mobileNumber || !businessName || !city || !pinCode) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    try {
      await registerSeller({
        fullName,
        email,
        mobileNumber,
        password,
        businessName,
        businessCategory,
        businessDescription,
        story,
        addressLine,
        locality,
        city,
        state,
        pinCode,
        logoUrl: logoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        pickupAvailable,
        defaultDeliveryCharge: parseFloat(defaultDeliveryCharge) || 40,
        freeDeliveryThreshold: freeDeliveryThreshold ? parseFloat(freeDeliveryThreshold) : null,
        estimatedDeliveryTime,
      });

      navigate('/seller/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mx-auto mb-2">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Create Your Maker Storefront
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-md mx-auto">
          Start selling your homemade food, snacks, jewelry, or handmade crafts directly to customers. No tech skills needed.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-10 shadow-card space-y-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal-900 pb-2 border-b border-cream-200">
            1. Your Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sunita Devi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="sunita@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Mobile Number (WhatsApp) *</label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9845123456"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>
          </div>
        </div>

        {/* Business Storefront Details */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal-900 pb-2 border-b border-cream-200">
            2. Business Storefront Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Amma's Homemade Pickles"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Primary Category *</label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              >
                <option value="Pickles & Preserves">Pickles & Preserves</option>
                <option value="Homemade Food">Homemade Food</option>
                <option value="Snacks & Sweets">Snacks & Sweets</option>
                <option value="Bakery">Bakery</option>
                <option value="Handmade Crafts">Handmade Crafts</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Clothing">Clothing</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Customized Gifts">Customized Gifts</option>
                <option value="Other Products">Other Products</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Short Business Tagline</label>
            <input
              type="text"
              placeholder="e.g. Heirloom Rajasthani sun-cured pickles made with pure cold-pressed mustard oil"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Your Maker Story</label>
            <textarea
              rows={3}
              placeholder="Share your story: How did you start? Who taught you your craft or recipes? Customers love authentic stories!"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>
        </div>

        {/* Location & Delivery Settings */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal-900 pb-2 border-b border-cream-200">
            3. Workshop Location & Delivery Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Street Address</label>
              <input
                type="text"
                placeholder="House / Workshop location"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Locality</label>
              <input
                type="text"
                placeholder="e.g. Indiranagar or Bandra"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">City *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">State</label>
              <input
                type="text"
                placeholder="e.g. Karnataka"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Home PIN Code *</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="560038"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Delivery Charge (₹)</label>
              <input
                type="number"
                value={defaultDeliveryCharge}
                onChange={(e) => setDefaultDeliveryCharge(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Free Delivery Above (₹)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Delivery Time</label>
              <input
                type="text"
                value={estimatedDeliveryTime}
                onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs text-charcoal-700 font-medium">
            <input
              type="checkbox"
              checked={pickupAvailable}
              onChange={(e) => setPickupAvailable(e.target.checked)}
              className="w-4 h-4 accent-forest-600 rounded"
            />
            <span>Allow customers to pick up orders directly from my address</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-card transition active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Creating Your Storefront...' : 'Launch Your Digital Storefront'}
        </button>

        <p className="text-center text-xs text-charcoal-500">
          Already registered as a maker?{' '}
          <Link to="/seller/login" className="font-bold text-forest-700 hover:underline">
            Sign In Here
          </Link>
        </p>
      </form>
    </div>
  );
};
