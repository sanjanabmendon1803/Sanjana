import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Store, Users, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-terracotta-600 block">
          Our Story & Vision
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal-900 leading-tight">
          Small Businesses. Big Dreams. One Marketplace.
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
          LOCALROOTS was founded to empower India's housewives, home chefs, and traditional artisans to turn their culinary mastery and craft skills into thriving digital storefronts — with zero technical complexity.
        </p>
      </div>

      {/* The Problem & The Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-soft space-y-3">
          <h3 className="font-serif font-bold text-xl text-charcoal-900">
            The Traditional Problem
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Home-based food businesses and artisans often rely on fleeting WhatsApp groups, localized word-of-mouth, or predatory aggregators who charge 25-35% commission fees, dictate pricing, and own customer relationships.
          </p>
        </div>

        <div className="bg-forest-900 text-cream-100 rounded-3xl p-8 shadow-card space-y-3">
          <h3 className="font-serif font-bold text-xl text-cream-50">
            The LOCALROOTS Model
          </h3>
          <p className="text-xs sm:text-sm text-cream-200 leading-relaxed">
            We are ONLY a digital connection between buyers and makers. We do not own inventory, we do not dictate product pricing, and we do not act as middlemen. 100% of the customer's purchase settles directly to the artisan.
          </p>
        </div>
      </div>

      {/* Who We Empower */}
      <div className="space-y-6">
        <h2 className="font-serif text-3xl font-bold text-charcoal-900 text-center">
          Who We Stand Behind
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-charcoal-700">
          <div className="p-6 bg-cream-50 rounded-2xl border border-[#E8E1D3] space-y-2">
            <strong className="block text-sm font-serif text-charcoal-900">Housewives & Mothers</strong>
            <p className="leading-relaxed">Selling homemade sun-cured achars, traditional papads, spice blends, and thepla recipes passed down over generations.</p>
          </div>

          <div className="p-6 bg-cream-50 rounded-2xl border border-[#E8E1D3] space-y-2">
            <strong className="block text-sm font-serif text-charcoal-900">Home-Based Bakers</strong>
            <p className="leading-relaxed">Crafting preservative-free couverture brownies, tea cakes, and artisan cookies fresh upon every customer order.</p>
          </div>

          <div className="p-6 bg-cream-50 rounded-2xl border border-[#E8E1D3] space-y-2">
            <strong className="block text-sm font-serif text-charcoal-900">Handicraft & Jewellery Artisans</strong>
            <p className="leading-relaxed">Clay terracotta jewellery, crochet keychains, block-printed cotton bags, and hand-poured soy candles.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-forest-600 rounded-3xl p-8 sm:p-12 text-center text-white space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold">
          Join the Movement for Local Indian Craftsmanship
        </h3>
        <p className="text-xs sm:text-sm text-cream-200 max-w-xl mx-auto">
          Start your digital storefront in minutes, or explore fresh homemade items from makers near you.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            to="/seller/register"
            className="px-6 py-3 rounded-xl bg-white text-forest-800 font-bold text-xs shadow-md"
          >
            Become a Seller
          </Link>
          <Link
            to="/explore"
            className="px-6 py-3 rounded-xl bg-forest-700 text-white font-bold text-xs"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};
