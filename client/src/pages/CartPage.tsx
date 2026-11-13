import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  AlertCircle,
  MapPin,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    sellerGroups,
    subtotal,
    estimatedDeliveryTotal,
    grandTotal,
    updateQuantity,
    removeItem,
    clearCart,
    deliveryPinCode,
    setDeliveryPinCode,
    validateWithBackend,
  } = useCart();

  const [pinInput, setPinInput] = useState(deliveryPinCode);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 6) {
      setDeliveryPinCode(pinInput);
    }
  };

  const handleProceedToCheckout = async () => {
    setIsValidating(true);
    setValidationError(null);

    try {
      const res = await validateWithBackend(pinInput);
      if (!res.allValid) {
        const firstError = res.items.find((i: any) => !i.valid)?.error || 'One or more items in your cart cannot be delivered to this PIN.';
        setValidationError(firstError);
        setIsValidating(false);
        return;
      }
      navigate('/checkout');
    } catch (err: any) {
      setValidationError(err.message || 'Validation failed. Please check your PIN code.');
    } finally {
      setIsValidating(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-cream-200 text-charcoal-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-charcoal-900">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-charcoal-500 max-w-sm mx-auto">
          Discover traditional homemade pickles, freshly baked goodies, and handcrafted gifts made with heart.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest-600 text-white font-semibold text-sm shadow-card hover:bg-forest-700 transition"
        >
          <span>Explore Handmade Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D3]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Items are organized directly by each independent seller to preserve direct local delivery.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Seller Cart Groups */}
        <div className="lg:col-span-8 space-y-6">
          {sellerGroups.map((group) => (
            <div
              key={group.sellerId}
              className="bg-white rounded-3xl border border-[#E8E1D3] overflow-hidden shadow-soft"
            >
              {/* Seller Group Header */}
              <div className="bg-[#F4EFE6]/80 p-4 border-b border-[#E8E1D3] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-charcoal-500">Store:</span>
                  <Link
                    to={`/store/${group.sellerSlug}`}
                    className="font-serif font-bold text-charcoal-900 hover:text-forest-700 transition"
                  >
                    {group.sellerName}
                  </Link>
                  <ShieldCheck className="w-4 h-4 text-forest-600" />
                </div>

                <div className="text-xs text-charcoal-500 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-forest-600" />
                  <span>Est: {group.estimatedDeliveryTime}</span>
                </div>
              </div>

              {/* Items List in this Seller Group */}
              <div className="divide-y divide-cream-200 p-4 space-y-4">
                {group.items.map((item) => {
                  const image =
                    item.product.images?.find(i => i.is_primary)?.image_url ||
                    item.product.images?.[0]?.image_url ||
                    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80';

                  return (
                    <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                      <img
                        src={image}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-cream-200 border border-[#E8E1D3] shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-serif font-bold text-sm text-charcoal-900 hover:text-forest-600 transition block truncate"
                        >
                          {item.product.name}
                        </Link>
                        <span className="text-xs font-semibold text-charcoal-700 mt-0.5 block">
                          ₹{item.product.price} each
                        </span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#D6CCB8] rounded-xl bg-cream-50 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-charcoal-600 hover:bg-white"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-charcoal-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-charcoal-600 hover:bg-white"
                          disabled={item.quantity >= item.product.stock_quantity}
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price for item */}
                      <div className="text-right min-w-[70px]">
                        <span className="font-bold text-sm text-charcoal-900 block font-sans">
                          ₹{item.product.price * item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-[11px] text-terracotta-500 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtotal & Delivery details for this Seller Group */}
              <div className="bg-cream-100/70 p-4 border-t border-[#E8E1D3] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-charcoal-500">
                    Seller Subtotal: <strong className="text-charcoal-800 font-sans">₹{group.subtotal}</strong>
                  </span>
                  <span className="mx-2 text-charcoal-300">•</span>
                  <span className="text-charcoal-500">
                    Delivery: {group.deliveryCharge === 0 ? (
                      <strong className="text-forest-700 font-bold uppercase tracking-wider">FREE</strong>
                    ) : (
                      <strong className="text-charcoal-800 font-sans">₹{group.deliveryCharge}</strong>
                    )}
                  </span>
                </div>

                {group.freeDeliveryThreshold && group.subtotal < group.freeDeliveryThreshold && (
                  <span className="text-terracotta-600 text-[11px] font-medium">
                    Add ₹{group.freeDeliveryThreshold - group.subtotal} more for FREE delivery from this seller!
                  </span>
                )}
              </div>
            </div>
          ))}

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:underline pt-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Right Column: Order Summary & Guest Checkout CTA */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-soft space-y-6 sticky top-28">
          <h3 className="font-serif font-bold text-lg text-charcoal-900 pb-3 border-b border-cream-200">
            Order Summary
          </h3>

          {/* Delivery PIN Code input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
              Delivery PIN Code
            </label>
            <form onSubmit={handleUpdatePin} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN"
                className="flex-1 bg-cream-100 border border-[#D6CCB8] text-xs rounded-xl px-3 py-2 outline-none focus:border-forest-600"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-charcoal-800 text-white rounded-xl text-xs font-semibold hover:bg-charcoal-900 transition"
              >
                Apply
              </button>
            </form>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-charcoal-600 pt-2 border-t border-cream-200">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-charcoal-800 font-sans">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Combined Delivery Fees ({sellerGroups.length} {sellerGroups.length === 1 ? 'seller' : 'sellers'})</span>
              <span className="font-semibold text-charcoal-800 font-sans">₹{estimatedDeliveryTotal}</span>
            </div>
            <div className="pt-3 border-t border-cream-200 flex justify-between items-baseline">
              <span className="font-serif font-bold text-base text-charcoal-900">Total Payable</span>
              <span className="font-serif font-bold text-2xl text-forest-700 font-sans">₹{grandTotal}</span>
            </div>
          </div>

          {/* Guest Checkout Notice */}
          <div className="p-3 bg-forest-50 rounded-2xl border border-forest-100 text-[11px] text-forest-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
              <span>100% Guest Checkout</span>
            </div>
            <p className="text-forest-800 leading-relaxed">
              No account or password needed. You will track your order simply via verified mobile OTP.
            </p>
          </div>

          {/* Proceed to Checkout Button */}
          <button
            type="button"
            onClick={handleProceedToCheckout}
            disabled={isValidating}
            className="w-full py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-card transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isValidating ? (
              <span>Validating Inventory...</span>
            ) : (
              <>
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
