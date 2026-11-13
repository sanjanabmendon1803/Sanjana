import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-charcoal-400 mt-1">Last Updated: November 2026</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-soft space-y-6 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-charcoal-900">1. Zero-Account Guest Data Collection</h3>
          <p>
            LOCALROOTS does not require customer registration or login. When placing an order, we collect only the necessary delivery information: your full name, mobile number for delivery verification OTP, delivery address, and optional email for digital order receipts.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-charcoal-900">2. Customer Privacy Protection in Order Tracking</h3>
          <p>
            Public tracking endpoints do not expose your full physical address or contact phone numbers. Tracking requires your unique Order Reference along with a secure, verified mobile OTP.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-charcoal-900">3. Data Sharing with Sellers</h3>
          <p>
            Delivery address and mobile number are shared solely with the specific sellers whose products you ordered in that transaction, strictly for delivery fulfilment and customer communication. We do not sell or rent customer data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-charcoal-900">4. Payment Security</h3>
          <p>
            All payment transactions are encrypted and processed by PCI-DSS compliant payment gateways (Razorpay). LOCALROOTS never stores your credit card numbers, debit card details, or banking passwords.
          </p>
        </section>
      </div>
    </div>
  );
};
