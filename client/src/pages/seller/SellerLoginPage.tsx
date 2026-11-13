import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ShieldCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SellerLoginPage: React.FC = () => {
  const { loginSeller } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await loginSeller({ email, password });
      navigate('/seller/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Seller@123');
    setLoading(true);
    try {
      await loginSeller({ email: demoEmail, password: 'Seller@123' });
      navigate('/seller/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mx-auto mb-2">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Maker Portal Sign In
        </h1>
        <p className="text-xs text-charcoal-500">
          Manage your products, receive orders, and configure your delivery area.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Demo Quick Logins */}
      <div className="bg-cream-50 p-4 rounded-3xl border border-[#E8E1D3] space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          Instant Demo Seller Logins:
        </span>
        <div className="grid grid-cols-1 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleDemoLogin('amma@localroots.in')}
            className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-forest-50 border border-[#D6CCB8] text-charcoal-800 font-medium transition flex items-center justify-between"
          >
            <span>Amma's Homemade Pickles (Jaipur/BLR)</span>
            <span className="text-[10px] text-forest-700 font-bold">1-Click Sign In →</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('priya@localroots.in')}
            className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-forest-50 border border-[#D6CCB8] text-charcoal-800 font-medium transition flex items-center justify-between"
          >
            <span>Homemade Treats (Mumbai Bakery)</span>
            <span className="text-[10px] text-forest-700 font-bold">1-Click Sign In →</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('anu@localroots.in')}
            className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-forest-50 border border-[#D6CCB8] text-charcoal-800 font-medium transition flex items-center justify-between"
          >
            <span>Handmade by Anu (Kochi Crafts)</span>
            <span className="text-[10px] text-forest-700 font-bold">1-Click Sign In →</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-card space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
            Registered Email / Phone
          </label>
          <input
            type="text"
            required
            placeholder="amma@localroots.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In to Dashboard'}
        </button>

        <p className="text-center text-xs text-charcoal-500 pt-2">
          New maker?{' '}
          <Link to="/seller/register" className="font-bold text-forest-700 hover:underline">
            Register Your Storefront
          </Link>
        </p>
      </form>
    </div>
  );
};
