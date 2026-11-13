import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Terms & Conditions
        </h1>
        <p className="text-xs text-charcoal-400 mt-1">Last Updated: November 2026</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-soft space-y-6 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-charcoal-900">1. Digital Connection Platform Only</h3>
          <p>
            LOCALROOTS operates strictly as an intermediary digital connection platform bringing independent homemade product vendors and customers together. LOCALROOTS does not own, manufacture, store, or warehouse any products, nor does it control product pricing.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-charcoal-900">2. Direct Seller Responsibility</h3>
          <p>
            Each seller is an independent business entity responsible for product quality, culinary hygiene, preparation, ingredient disclosure, and dispatch. Sellers set their own prices, minimum order quantities, and serviceable delivery areas.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-charcoal-900">3. Non-Intermediary Payment Settlement</h3>
          <p>
            LOCALROOTS does not manually pool, collect, or redistribute vendor funds. All customer payments are processed and settled directly to individual vendors through connected payment gateway infrastructure in compliance with applicable financial regulations.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-charcoal-900">4. Cancellations and Refunds</h3>
          <p>
            Given the perishable and freshly made nature of homemade culinary goods, orders can be cancelled prior to the maker marking the order as "Preparing". Inquiries regarding damaged transit items can be raised directly with the seller or via our support desk.
          </p>
        </section>
      </div>
    </div>
  );
};
