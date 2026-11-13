import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { SellerProfile } from '../../types';

interface SellerCardProps {
  seller: SellerProfile;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-soft hover:shadow-card transition duration-300 flex flex-col justify-between">
      <div>
        {/* Header with Logo and Verified Badge */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={seller.logo_url}
            alt={seller.business_name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-forest-600/20 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-lg text-charcoal-900 leading-snug">
                {seller.business_name}
              </h3>
              <span title="Verified Local Maker">
                <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0" />
              </span>
            </div>
            <span className="inline-block text-[11px] font-semibold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full mt-1">
              {seller.business_category}
            </span>
          </div>
        </div>

        {/* Story & Description */}
        <p className="text-xs text-charcoal-600 line-clamp-3 leading-relaxed mb-4">
          "{seller.story || seller.description}"
        </p>

        {/* Location & Delivery meta */}
        <div className="space-y-1.5 text-xs text-charcoal-500 pt-2 border-t border-cream-200">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
            <span>{seller.locality}, {seller.city} ({seller.pin_code})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
            <span>Avg delivery: {seller.estimated_delivery_time}</span>
          </div>
        </div>
      </div>

      {/* Visit Storefront Action */}
      <div className="mt-6 pt-3">
        <Link
          to={`/store/${seller.slug}`}
          className="w-full py-2.5 px-4 rounded-xl border border-forest-600/30 text-forest-700 hover:bg-forest-600 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 group"
        >
          <span>Visit Storefront</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
