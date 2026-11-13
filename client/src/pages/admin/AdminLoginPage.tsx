import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@localroots.in');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await loginAdmin({ email, password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-charcoal-900 text-turmeric-500 flex items-center justify-center mx-auto mb-2 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Platform Administration
        </h1>
        <p className="text-xs text-charcoal-500">
          Moderate makers, approve applications, and review platform volume.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Demo Credentials Box */}
      <div className="bg-cream-200/80 p-4 rounded-2xl border border-[#D6CCB8] text-xs space-y-1">
        <span className="font-bold text-charcoal-800 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-forest-700" />
          Demo Administrator Credentials:
        </span>
        <p className="text-charcoal-600 font-mono text-[11px]">Email: admin@localroots.in</p>
        <p className="text-charcoal-600 font-mono text-[11px]">Password: Admin@123</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-card space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
            Admin Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-charcoal-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
        </button>

        <p className="text-center text-xs text-charcoal-400 pt-2">
          <Link to="/" className="hover:text-charcoal-700">← Back to Marketplace</Link>
        </p>
      </form>
    </div>
  );
};
