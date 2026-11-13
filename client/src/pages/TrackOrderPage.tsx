import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  PackageCheck,
  Search,
  KeyRound,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  MapPin,
  ShieldCheck,
  Store,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

const STATUS_STEPS = [
  'Order Placed',
  'Accepted',
  'Preparing',
  'Ready for Dispatch',
  'Out for Delivery',
  'Delivered',
];

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [orderReference, setOrderReference] = useState(initialRef);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'enter_ref' | 'enter_otp' | 'tracking'>('enter_ref');
  const [maskedPhone, setMaskedPhone] = useState<string>('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If order reference is passed via query param and session has OTP, auto-fill
  useEffect(() => {
    if (initialRef) {
      const savedOtp = sessionStorage.getItem('last_order_otp');
      if (savedOtp) {
        setOtp(savedOtp);
      }
    }
  }, [initialRef]);

  // Step 1: Request OTP for Order Reference
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderReference.trim()) {
      setErrorMessage('Please enter an order reference number.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.requestTrackingOtp(orderReference.trim());
      if (res.success) {
        setMaskedPhone(res.maskedPhone || 'your mobile number');
        setStep('enter_otp');

        // If demo OTP was saved, pre-populate for frictionless experience
        const savedOtp = sessionStorage.getItem('last_order_otp');
        if (savedOtp) setOtp(savedOtp);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'No order found with this reference number.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.verifyTrackingOtp(orderReference.trim(), otp.trim());
      if (res.success && res.data) {
        setTrackingData(res.data);
        setStep('tracking');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid verification code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mx-auto mb-2">
          <PackageCheck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Track Your Guest Order
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500">
          Real-time tracking without logging in. All you need is your Order Reference and a quick verification OTP.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 max-w-md mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Enter Order Reference */}
      {step === 'enter_ref' && (
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 max-w-md mx-auto shadow-card space-y-6">
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-1.5">
                Order Reference Number
              </label>
              <input
                type="text"
                placeholder="e.g. LR-2026-XXXX or LR-123456-789"
                value={orderReference}
                onChange={(e) => setOrderReference(e.target.value.toUpperCase())}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600 font-mono"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                Found on your order confirmation screen or SMS.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {loading ? 'Locating Order...' : 'Verify Order'}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: Enter Verification OTP */}
      {step === 'enter_otp' && (
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 max-w-md mx-auto shadow-card space-y-6">
          <div className="space-y-1 text-center">
            <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">Verification Sent</span>
            <p className="text-xs text-charcoal-500">
              Enter the 6-digit verification code sent to <strong className="text-charcoal-800">{maskedPhone}</strong>
            </p>
            <p className="text-[11px] text-terracotta-600 italic">
              (For demo testing: use the OTP from your confirmation screen or demo code 123456)
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-1.5">
                6-Digit Verification OTP
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-center text-lg font-mono font-bold tracking-widest outline-none focus:border-forest-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('enter_ref')}
                className="py-3 px-4 bg-cream-200 text-charcoal-700 rounded-xl text-xs font-semibold hover:bg-cream-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                {loading ? 'Verifying...' : 'Show Live Tracking'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: Live Order Tracking Details */}
      {step === 'tracking' && trackingData && (
        <div className="space-y-8">
          {/* Order Snapshot Card */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-card flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-charcoal-400 block">Order Reference</span>
              <h2 className="font-mono font-bold text-xl sm:text-2xl text-charcoal-900 mt-0.5">
                {trackingData.order_reference}
              </h2>
              <span className="text-xs text-charcoal-500 mt-1 block">
                Deliver to: <strong className="text-charcoal-800">{trackingData.customer_name}</strong> in {trackingData.delivery_locality}, {trackingData.delivery_city} ({trackingData.delivery_pin_code})
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-charcoal-400 block">Payment Method</span>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-1 rounded-lg inline-block mt-0.5">
                {trackingData.payment_method} ({trackingData.payment_status})
              </span>
              <span className="font-serif font-bold text-lg text-charcoal-900 block mt-1 font-sans">
                ₹{trackingData.grand_total}
              </span>
            </div>
          </div>

          {/* Suborders List (Independent tracking per seller) */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-xl text-charcoal-900">
              Independent Seller Suborders ({trackingData.suborders?.length || 0})
            </h3>

            {trackingData.suborders?.map((sub: any) => {
              const currentStepIdx = getStepIndex(sub.status);
              const isCancelled = sub.status === 'Cancelled';

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-soft space-y-6"
                >
                  {/* Seller Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cream-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-700 font-bold">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-charcoal-900">
                          {sub.seller?.business_name || 'Artisan Workshop'}
                        </h4>
                        <span className="text-xs text-charcoal-400">
                          Suborder Ref: {sub.suborder_reference}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isCancelled
                          ? 'bg-red-100 text-red-700'
                          : sub.status === 'Delivered'
                          ? 'bg-forest-100 text-forest-800'
                          : 'bg-terracotta-100 text-terracotta-800'
                      }`}>
                        {sub.status}
                      </span>
                      {sub.estimated_delivery_date && (
                        <span className="text-[11px] text-charcoal-400 block mt-1">
                          Est: {sub.estimated_delivery_date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Stepper Timeline */}
                  {!isCancelled ? (
                    <div className="py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                        {STATUS_STEPS.map((stepName, idx) => {
                          const isDone = currentStepIdx >= idx;
                          const isCurrent = currentStepIdx === idx;

                          return (
                            <div key={stepName} className="text-center space-y-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition ${
                                isDone
                                  ? 'bg-forest-600 text-white'
                                  : 'bg-cream-200 text-charcoal-400'
                              } ${isCurrent ? 'ring-4 ring-forest-100' : ''}`}>
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span className={`block text-[11px] leading-tight ${
                                isCurrent ? 'font-bold text-forest-800' : 'text-charcoal-500'
                              }`}>
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700">
                      <strong>Order Cancelled:</strong> {sub.rejection_reason || 'Cancelled by maker or customer request.'}
                    </div>
                  )}

                  {/* Items in Suborder */}
                  <div className="space-y-2 pt-2 border-t border-cream-200">
                    <span className="text-xs font-bold uppercase text-charcoal-400 block">Items in this Package:</span>
                    <div className="divide-y divide-cream-100 text-xs text-charcoal-700">
                      {sub.items?.map((item: any) => (
                        <div key={item.id} className="py-2 flex justify-between">
                          <span>{item.quantity}x {item.product_name}</span>
                          <span className="font-semibold font-sans">₹{item.total_price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suborder Status History Logs */}
                  {sub.status_history && sub.status_history.length > 0 && (
                    <div className="pt-3 border-t border-cream-200">
                      <span className="text-xs font-bold uppercase text-charcoal-400 block mb-2">Activity Timeline</span>
                      <div className="space-y-1.5 text-xs text-charcoal-500">
                        {sub.status_history.map((h: any) => (
                          <div key={h.id} className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-terracotta-500 shrink-0" />
                            <span className="font-semibold text-charcoal-700">{h.status}:</span>
                            <span>{h.notes}</span>
                            <span className="text-[10px] text-charcoal-400 ml-auto">
                              {new Date(h.created_at).toLocaleDateString()} {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => {
                setStep('enter_ref');
                setTrackingData(null);
              }}
              className="px-6 py-2.5 bg-cream-200 hover:bg-cream-300 text-charcoal-800 rounded-xl text-xs font-semibold transition"
            >
              Track Another Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
