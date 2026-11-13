import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Store, ShoppingBag, Truck, CreditCard, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-forest-700 block">
          Transparent Marketplace Process
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          How LOCALROOTS Operates
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 max-w-xl mx-auto leading-relaxed">
          A truly decentralized local marketplace that connects Indian customers directly to authentic micro-entrepreneurs.
        </p>
      </div>

      {/* For Customers */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 border-b border-cream-200 pb-3">
          For Shoppers (No Account Needed!)
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-charcoal-700">
          <div className="p-4 bg-white rounded-2xl border border-[#E8E1D3] flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 font-bold flex items-center justify-center shrink-0">1</div>
            <div>
              <strong className="block text-charcoal-900 font-serif text-base">Browse Curated Homemade Items</strong>
              <p className="text-charcoal-500 text-xs mt-1">Explore authentic pickles, cookies, cakes, earrings, and crafts. Filter by delivery PIN code to see makers servicing your neighborhood.</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E8E1D3] flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 font-bold flex items-center justify-center shrink-0">2</div>
            <div>
              <strong className="block text-charcoal-900 font-serif text-base">One Multi-Seller Cart</strong>
              <p className="text-charcoal-500 text-xs mt-1">Add items from different sellers into one cart. The cart automatically groups items and calculates delivery charges transparently per maker.</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E8E1D3] flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 font-bold flex items-center justify-center shrink-0">3</div>
            <div>
              <strong className="block text-charcoal-900 font-serif text-base">Guest Checkout & OTP Tracking</strong>
              <p className="text-charcoal-500 text-xs mt-1">Enter your delivery address and pay securely. Track live order statuses (Accepted, Preparing, Out for Delivery) using only your Order Reference and a mobile OTP.</p>
            </div>
          </div>
        </div>
      </div>

      {/* For Sellers */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 border-b border-cream-200 pb-3">
          For Home Businesses & Artisans
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-charcoal-700">
          <div className="p-4 bg-white rounded-2xl border border-[#E8E1D3] flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-700 font-bold flex items-center justify-center shrink-0">1</div>
            <div>
              <strong className="block text-charcoal-900 font-serif text-base">Set Up Your Storefront in 3 Minutes</strong>
              <p className="text-charcoal-500 text-xs mt-1">Register with your business name, story, and address. You get a dedicated public URL: <code>/store/your-store-name</code>.</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E8E1D3] flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-700 font-bold flex items-center justify-center shrink-0">2</div>
            <div>
              <strong className="block text-charcoal-900 font-serif text-base">You Control Prices & Delivery PINs</strong>
              <p className="text-charcoal-500 text-xs mt-1">You decide what to charge, your minimum order value, and which PIN codes you can deliver to. You can also offer local pickup.</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E8E1D3] flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-700 font-bold flex items-center justify-center shrink-0">3</div>
            <div>
              <strong className="block text-charcoal-900 font-serif text-base">Direct Customer Settlements</strong>
              <p className="text-charcoal-500 text-xs mt-1">Customer payments settle directly to your verified bank or UPI VPA account through connected-account payment infrastructure without intermediate platform holding.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/seller/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition"
        >
          <span>Start Your Business Today</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
