import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  ArrowRight,
  Heart,
  Store,
  Clock,
  Sparkles
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderRef } = useParams<{ orderRef: string }>();
  const lastOtp = sessionStorage.getItem('last_order_otp') || '123456';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-current text-terracotta-600" />
          Thank You for Supporting Local Makers!
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Your Order Has Been Placed Successfully
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto leading-relaxed">
          The makers have received their independent suborders and are beginning preparation using fresh, authentic ingredients and materials.
        </p>
      </div>

      {/* Reference & OTP Credentials Card */}
      <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-card text-left max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <span className="text-xs text-charcoal-500 font-semibold uppercase tracking-wider">Order Reference</span>
          <span className="font-mono font-bold text-sm text-forest-800 bg-forest-50 px-2.5 py-1 rounded-lg">
            {orderRef}
          </span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div>
            <span className="text-xs text-charcoal-500 font-semibold uppercase tracking-wider block">
              Guest Tracking OTP
            </span>
            <span className="text-[10px] text-charcoal-400">Keep this code to track your delivery</span>
          </div>
          <span className="font-mono font-bold text-lg text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-lg tracking-widest">
            {lastOtp}
          </span>
        </div>

        <div className="pt-2 text-xs text-charcoal-500 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
          <span>
            You don't need an account. Simply enter this Order Reference and your OTP on our Track Order page at any time.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to={`/track?ref=${orderRef}`}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-card transition flex items-center justify-center gap-2"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>

        <Link
          to="/explore"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-cream-200 hover:bg-cream-300 text-charcoal-800 font-bold text-xs border border-[#D6CCB8] transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
