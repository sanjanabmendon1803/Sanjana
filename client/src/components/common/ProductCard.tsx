import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, MapPin, Sparkles, Clock } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const primaryImage =
    product.images?.find(img => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const sellerName = product.seller?.business_name || 'Verified Artisan';
  const sellerSlug = product.seller?.slug || '';
  const sellerCity = product.seller?.city || 'Local Maker';
  const estDelivery = product.seller?.estimated_delivery_time || '1-2 Days';

  return (
    <div className="group bg-white rounded-2xl border border-[#E8E1D3] overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full">
      {/* Image Thumbnail Container */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-cream-200">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.is_popular && (
            <span className="inline-flex items-center gap-1 bg-terracotta-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" />
              Community Favorite
            </span>
          )}
          {product.is_freshly_made && (
            <span className="inline-flex items-center gap-1 bg-forest-600 text-cream-100 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              Freshly Made
            </span>
          )}
        </div>

        {/* Stock Out Badge */}
        {product.stock_quantity <= 0 && (
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-charcoal-800 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller Store Link */}
          {sellerSlug ? (
            <Link
              to={`/store/${sellerSlug}`}
              className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 mb-1 transition"
            >
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{sellerName} ({sellerCity})</span>
            </Link>
          ) : (
            <span className="text-[11px] font-semibold text-charcoal-400 block mb-1">
              {sellerCity}
            </span>
          )}

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif font-bold text-charcoal-800 text-base leading-snug line-clamp-2 hover:text-forest-600 transition">
              {product.name}
            </h3>
          </Link>

          {/* Delivery estimate */}
          <div className="flex items-center gap-1 text-[11px] text-charcoal-400 mt-2">
            <Clock className="w-3 h-3 text-forest-600 shrink-0" />
            <span>Est. delivery: {estDelivery}</span>
          </div>
        </div>

        {/* Bottom Price & Add to Cart action */}
        <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-charcoal-900 font-sans">
                ₹{product.price}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-charcoal-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            <span className="text-[10px] text-charcoal-400 block">incl. all taxes</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${
              added
                ? 'bg-forest-600 text-white'
                : product.stock_quantity <= 0
                ? 'bg-cream-300 text-charcoal-400 cursor-not-allowed'
                : 'bg-forest-600 hover:bg-forest-700 text-white active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
