import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, AlertCircle, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SellerPayoutsPage: React.FC = () => {
  const { seller } = useAuth();

  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState(seller?.business_name || '');
  const [vpaUpi, setVpaUpi] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#E8E1D3]">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Direct Vendor Settlement & Payouts
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          LOCALROOTS complies strictly with RBI non-intermediary regulations. Revenues settle directly to your verified account.
        </p>
      </div>

      {/* Architecture Transparency Banner */}
      <div className="p-6 rounded-3xl bg-forest-900 text-cream-100 space-y-3 shadow-card">
        <div className="flex items-center gap-2 text-turmeric-500 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Non-Intermediary Marketplace Architecture</span>
        </div>
        <h3 className="font-serif font-bold text-xl text-white">
          Zero Middlemen. Direct Linked Account Transfers.
        </h3>
        <p className="text-xs text-cream-200 leading-relaxed">
          Unlike aggregators who pool customer money in platform-owned accounts and enforce arbitrary payout holdbacks, LOCALROOTS routes payments using <strong>Marketplace Connected Account rails (Razorpay Route / Linked Accounts)</strong>. When a customer orders your homemade creations, payment settles straight into your registered bank or UPI account.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
          <span>Payout account details saved successfully!</span>
        </div>
      )}

      {/* Linked Account Configuration */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-soft space-y-6">
        <h3 className="font-serif font-bold text-base text-charcoal-900 pb-2 border-b border-cream-200 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-forest-600" />
          Linked Bank Account / UPI VPA for Direct Settlement
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Account Holder / Beneficiary Name *
            </label>
            <input
              type="text"
              required
              placeholder="As per bank passbook"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Bank Account Number
            </label>
            <input
              type="text"
              placeholder="e.g. 91823901928390"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Bank IFSC Code
            </label>
            <input
              type="text"
              placeholder="e.g. HDFC0000123"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Instant Settlement UPI ID / VPA
            </label>
            <input
              type="text"
              placeholder="e.g. ammapickles@okhdfcbank"
              value={vpaUpi}
              onChange={(e) => setVpaUpi(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>
        </div>

        <div className="pt-2 text-[11px] text-charcoal-400 space-y-1">
          <p>• Payout frequency: T+1 business day following confirmed order dispatch.</p>
          <p>• Zero commission fees deducted by the platform.</p>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-card transition active:scale-95"
        >
          Save Payout Information
        </button>
      </form>
    </div>
  );
};
