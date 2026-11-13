import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Truck,
  Phone,
  Mail,
  Heart,
  MessageSquare,
  Sparkles,
  ChevronRight,
  PackageOpen
} from 'lucide-react';
import { api } from '../services/api';
import { SellerProfile, Product, SellerDeliveryArea } from '../types';
import { ProductCard } from '../components/common/ProductCard';

export const SellerStorefrontPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([
      api.getSellerBySlug(slug),
      api.getSellerProducts(slug),
    ])
      .then(([sellerRes, prodsRes]) => {
        if (sellerRes.success && sellerRes.data) {
          setSeller(sellerRes.data);
        }
        if (prodsRes.success && prodsRes.data) {
          setProducts(prodsRes.data);
        }
      })
      .catch(err => console.error('Failed to load seller storefront', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-charcoal-500">Loading storefront...</p>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal-800">Storefront Not Found</h2>
        <p className="text-sm text-charcoal-500">This business storefront is not available or inactive.</p>
        <Link to="/explore" className="inline-block px-6 py-2.5 bg-forest-600 text-white rounded-xl text-xs font-semibold">
          Discover Other Local Sellers
        </Link>
      </div>
    );
  }

  const deliveryAreas = seller.deliveryAreas || [];

  return (
    <div className="space-y-10 pb-16">
      {/* Store Banner Hero */}
      <div className="relative bg-charcoal-900 border-b border-[#E8E1D3]">
        {seller.banner_url ? (
          <div className="h-64 sm:h-80 w-full overflow-hidden relative">
            <img
              src={seller.banner_url}
              alt={seller.business_name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-900/40 to-transparent" />
          </div>
        ) : (
          <div className="h-48 w-full bg-forest-900" />
        )}

        {/* Store Profile Floating Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              <img
                src={seller.logo_url}
                alt={seller.business_name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-card bg-white"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {seller.business_name}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-forest-600 text-cream-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-turmeric-500" />
                    Verified Local Maker
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-cream-200 font-medium">
                  {seller.business_category} • {seller.locality}, {seller.city}
                </p>
              </div>
            </div>

            {/* Contact Seller Action Button */}
            <div className="flex items-center justify-center sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-white text-forest-800 hover:bg-cream-100 font-semibold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-terracotta-500" />
                Contact Maker
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Story & Delivery Guidelines Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Story Column */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-forest-700">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                The Artisan's Journey & Heritage
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed whitespace-pre-line">
              {seller.story || seller.description}
            </p>
          </div>

          {/* Delivery & Ordering Guidelines */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-soft space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-forest-600" />
              Delivery & Order Rules
            </h3>

            <div className="space-y-3 text-xs text-charcoal-600">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-terracotta-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Estimated Prep & Delivery:</strong>
                  <p>{seller.estimated_delivery_time}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Standard Delivery Charge:</strong>
                  <p>₹{seller.default_delivery_charge}</p>
                  {seller.free_delivery_threshold && (
                    <p className="text-forest-700 font-semibold mt-0.5">
                      FREE delivery on orders above ₹{seller.free_delivery_threshold}!
                    </p>
                  )}
                </div>
              </div>

              {seller.pickup_available && (
                <div className="p-2.5 rounded-xl bg-forest-50 text-forest-800 text-[11px] font-medium">
                  ✓ Local pickup available directly from maker's address
                </div>
              )}

              {/* Serviceable PIN codes list */}
              {deliveryAreas.length > 0 && (
                <div className="pt-2 border-t border-cream-200">
                  <span className="font-semibold text-charcoal-700 block mb-1">
                    Direct Serviceable PIN Codes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {deliveryAreas.map(da => (
                      <span key={da.id} className="bg-cream-200 text-charcoal-800 text-[10px] font-mono px-2 py-0.5 rounded-md">
                        {da.pin_code} ({da.locality_name || da.city})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products by this Seller */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                Products by {seller.business_name}
              </h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                {products.length} homemade creations available
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E8E1D3] p-12 text-center space-y-3">
              <PackageOpen className="w-8 h-8 text-charcoal-400 mx-auto" />
              <p className="text-sm text-charcoal-600">No active products currently listed by this maker.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Seller Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-lifted">
            <h3 className="font-serif font-bold text-xl text-charcoal-900">
              Contact {seller.business_name}
            </h3>
            <p className="text-xs text-charcoal-500">
              You can connect directly with the maker for custom order inquiries, dietary adjustments, or bulk festive orders.
            </p>

            <div className="space-y-3 pt-2 text-xs text-charcoal-700">
              <div className="p-3 bg-cream-100 rounded-2xl flex items-center gap-3">
                <Phone className="w-4 h-4 text-forest-600" />
                <div>
                  <span className="text-[10px] text-charcoal-400 block">Phone / WhatsApp</span>
                  <a href={`tel:${seller.phone_number}`} className="font-bold text-charcoal-900 hover:text-forest-600">
                    +91 {seller.phone_number}
                  </a>
                </div>
              </div>

              <div className="p-3 bg-cream-100 rounded-2xl flex items-center gap-3">
                <MapPin className="w-4 h-4 text-terracotta-500" />
                <div>
                  <span className="text-[10px] text-charcoal-400 block">Workshop Location</span>
                  <p className="font-semibold text-charcoal-800">
                    {seller.address_line}, {seller.locality}, {seller.city} - {seller.pin_code}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="w-full py-2.5 bg-forest-600 text-white rounded-xl text-xs font-semibold hover:bg-forest-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
