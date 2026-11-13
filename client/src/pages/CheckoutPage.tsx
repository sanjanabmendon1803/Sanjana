import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    sellerGroups,
    subtotal,
    estimatedDeliveryTotal,
    grandTotal,
    deliveryPinCode,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddressLine, setDeliveryAddressLine] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryLocality, setDeliveryLocality] = useState('Indiranagar');
  const [deliveryCity, setDeliveryCity] = useState('Bengaluru');
  const [deliveryState, setDeliveryState] = useState('Karnataka');
  const [pinCode, setPinCode] = useState(deliveryPinCode);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'upi'>('razorpay');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(customerPhone.trim())) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9845123456).');
      return;
    }
    if (!deliveryAddressLine.trim()) {
      setErrorMessage('Please enter your house or building address.');
      return;
    }
    if (!/^[1-9][0-9]{5}$/.test(pinCode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setLoading(true);

    try {
      // 1. Submit guest order to backend
      const res = await api.createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddressLine: deliveryAddressLine.trim(),
        deliveryStreet: deliveryStreet.trim() || undefined,
        deliveryLocality: deliveryLocality.trim(),
        deliveryCity: deliveryCity.trim(),
        deliveryState: deliveryState.trim(),
        deliveryPinCode: pinCode.trim(),
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        paymentMethod,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      });

      if (res.success) {
        // If payment method is razorpay, initiate sandbox gateway order & verify
        if (paymentMethod === 'razorpay' || paymentMethod === 'upi') {
          try {
            const payOrderRes = await api.createPaymentOrder(res.orderReference, res.order.grandTotal);
            if (payOrderRes.success) {
              // Verify in sandbox
              await api.verifyPaymentSignature({
                razorpay_order_id: payOrderRes.data.orderId,
                razorpay_payment_id: `pay_test_${Date.now()}`,
                razorpay_signature: 'sandbox_verified_signature',
                orderReference: res.orderReference,
              });
            }
          } catch (payErr) {
            console.warn('Sandbox payment verification step completed with fallback:', payErr);
          }
        }

        // Save order tracking info in session
        sessionStorage.setItem('last_order_ref', res.orderReference);
        sessionStorage.setItem('last_order_otp', res.trackingOtp);

        clearCart();
        navigate(`/order-confirmation/${res.orderReference}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please check address and availability.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal-800">Your cart is empty</h2>
        <p className="text-xs text-charcoal-500">Please add products to your cart before proceeding to checkout.</p>
        <Link to="/explore" className="inline-block px-6 py-2.5 bg-forest-600 text-white rounded-xl text-xs font-semibold">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-100 text-forest-800 text-xs font-bold rounded-full mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
          <span>Zero-Registration Guest Checkout</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Delivery & Payment Details
        </h1>
        <p className="text-xs text-charcoal-500 mt-1">
          No login needed. Your phone number will be used exclusively for delivery updates and order tracking OTP.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Guest Address & Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Contact */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-soft space-y-4">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 pb-2 border-b border-cream-200">
              1. Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sen"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                  Mobile Number (for delivery OTP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-xs text-charcoal-500 font-semibold">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9845123456"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 pl-10 text-xs outline-none focus:border-forest-600 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Email Address (Optional, for digital receipt)
              </label>
              <input
                type="email"
                placeholder="ananya@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-soft space-y-4">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 pb-2 border-b border-cream-200">
              2. Delivery Address
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Flat / House No. / Building Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Flat 401, Rosewood Residency"
                value={deliveryAddressLine}
                onChange={(e) => setDeliveryAddressLine(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                  Street / Area / Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12th Main Road, near Metro station"
                  value={deliveryStreet}
                  onChange={(e) => setDeliveryStreet(e.target.value)}
                  className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                  Locality *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar"
                  value={deliveryLocality}
                  onChange={(e) => setDeliveryLocality(e.target.value)}
                  className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value)}
                  className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Delivery Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please ring bell twice or leave with security."
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-soft space-y-4">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 pb-2 border-b border-cream-200">
              3. Payment Method
            </h3>

            <div className="space-y-3">
              <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition ${
                paymentMethod === 'razorpay' ? 'border-forest-600 bg-forest-50/50' : 'border-[#E8E1D3] hover:border-cream-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="accent-forest-600 w-4 h-4"
                  />
                  <CreditCard className="w-5 h-5 text-forest-700" />
                  <div className="flex-1">
                    <span className="block font-bold text-xs text-charcoal-900">
                      Online Gateway / UPI / Cards (Razorpay Sandbox)
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      Fast, instant payment simulation with backend signature verification.
                    </span>
                  </div>
                </div>
              </label>

              <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition ${
                paymentMethod === 'cod' ? 'border-forest-600 bg-forest-50/50' : 'border-[#E8E1D3] hover:border-cream-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-forest-600 w-4 h-4"
                  />
                  <Banknote className="w-5 h-5 text-terracotta-600" />
                  <div className="flex-1">
                    <span className="block font-bold text-xs text-charcoal-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      Pay in cash or UPI directly to delivery person upon arrival.
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* Direct Vendor Settlement Notice */}
            <div className="p-3.5 rounded-2xl bg-cream-100 border border-[#E8E1D3] text-[11px] text-charcoal-600 space-y-1">
              <span className="font-bold text-charcoal-800 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-forest-700" />
                Direct-To-Vendor Payment Architecture Notice:
              </span>
              <p className="leading-relaxed">
                LOCALROOTS does not pool or redistribute vendor revenues. In production, payments are settled directly to each seller's linked bank account using connected-account marketplace rails (e.g. Razorpay Route). In this sandbox mode, checkout is verified safely for testing.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Seller Order Breakdown & Pay CTA */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-soft space-y-6">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 pb-3 border-b border-cream-200">
              Your Multi-Seller Order
            </h3>

            {/* Group breakdown */}
            <div className="space-y-4">
              {sellerGroups.map((g) => (
                <div key={g.sellerId} className="p-3 bg-cream-50 rounded-2xl border border-cream-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-charcoal-800 font-serif">
                      {g.sellerName}
                    </span>
                    <span className="text-charcoal-500 font-sans">
                      ₹{g.subtotal + g.deliveryCharge}
                    </span>
                  </div>

                  <div className="text-[11px] text-charcoal-500 space-y-1">
                    {g.items.map(item => (
                      <div key={item.product.id} className="flex justify-between">
                        <span className="truncate max-w-[200px]">{item.quantity}x {item.product.name}</span>
                        <span>₹{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-1 border-t border-cream-200 text-charcoal-600">
                      <span>Delivery Fee:</span>
                      <span>{g.deliveryCharge === 0 ? 'FREE' : `₹${g.deliveryCharge}`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 text-xs text-charcoal-600 pt-3 border-t border-cream-200">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-charcoal-800 font-sans">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fees Total</span>
                <span className="font-semibold text-charcoal-800 font-sans">₹{estimatedDeliveryTotal}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-cream-200">
                <span className="font-serif font-bold text-base text-charcoal-900">Grand Total</span>
                <span className="font-serif font-bold text-2xl text-forest-700 font-sans">₹{grandTotal}</span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-card transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order • ₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
