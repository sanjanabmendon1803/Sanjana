import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Truck,
  Check,
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [added, setAdded] = useState<boolean>(false);

  // Delivery check on page
  const [checkPin, setCheckPin] = useState<string>('560038');
  const [pinStatus, setPinStatus] = useState<{ checked: boolean; deliverable: boolean; message?: string }>({
    checked: false,
    deliverable: false,
  });

  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getProductById(id)
      .then(res => {
        if (res.success && res.data) {
          setProduct(res.data);
          const primary = res.data.images?.find((img: any) => img.is_primary)?.image_url || res.data.images?.[0]?.image_url;
          setSelectedImage(primary || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80');
          setQuantity(res.data.min_order_quantity || 1);
        }
      })
      .catch(err => console.error('Failed to load product', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity);
    navigate('/cart');
  };

  const handleCheckPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPin || checkPin.length !== 6 || !product) return;

    try {
      const res = await api.validateCheckout([{ productId: product.id, quantity: 1 }], checkPin);
      if (res.success) {
        const itemRes = res.items.find(i => i.productId === product.id);
        if (itemRes && itemRes.valid) {
          setPinStatus({
            checked: true,
            deliverable: true,
            message: `Available for delivery to PIN ${checkPin}! Delivery charge: ₹${itemRes.deliveryCharge}`,
          });
        } else {
          setPinStatus({
            checked: true,
            deliverable: false,
            message: itemRes?.error || `Sorry, seller does not deliver to ${checkPin} yet.`,
          });
        }
      }
    } catch {
      setPinStatus({
        checked: true,
        deliverable: false,
        message: 'Could not verify delivery for this PIN code.',
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-charcoal-500">Loading homemade product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal-800">Product Not Found</h2>
        <p className="text-sm text-charcoal-500">This product may have been archived or removed by the seller.</p>
        <Link to="/explore" className="inline-block px-6 py-2.5 bg-forest-600 text-white rounded-xl text-xs font-semibold">
          Back to Explore
        </Link>
      </div>
    );
  }

  const seller = product.seller;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-400">
        <Link to="/" className="hover:text-forest-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/explore" className="hover:text-forest-700">Explore</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/explore?category=${product.category.slug}`} className="hover:text-forest-700">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal-700 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-[#E8E1D3] shadow-card relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.is_popular && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-terracotta-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Community Favorite
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img.image_url
                      ? 'border-forest-600 shadow-sm'
                      : 'border-[#E8E1D3] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Category & Freshness Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-forest-100 text-forest-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category?.name || 'Homemade Item'}
            </span>
            {product.is_freshly_made && (
              <span className="bg-cream-200 text-charcoal-700 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-terracotta-500" />
                Freshly Made to Order
              </span>
            )}
          </div>

          {/* Product Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 leading-tight">
            {product.name}
          </h1>

          {/* Seller Attribution Box */}
          {seller && (
            <div className="flex items-center justify-between p-3.5 bg-cream-100 rounded-2xl border border-[#E8E1D3]">
              <div className="flex items-center gap-3">
                <img
                  src={seller.logo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'}
                  alt={seller.business_name}
                  className="w-10 h-10 rounded-full object-cover border border-forest-600/30"
                />
                <div>
                  <span className="text-[11px] text-charcoal-400 block">Crafted with care by</span>
                  <Link
                    to={`/store/${seller.slug}`}
                    className="font-serif font-bold text-sm text-charcoal-900 hover:text-forest-600 transition flex items-center gap-1"
                  >
                    <span>{seller.business_name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                  </Link>
                </div>
              </div>

              <div className="text-right text-xs text-charcoal-500">
                <div className="flex items-center gap-1 justify-end">
                  <MapPin className="w-3 h-3 text-terracotta-500" />
                  <span>{seller.locality}, {seller.city}</span>
                </div>
                <Link
                  to={`/store/${seller.slug}`}
                  className="text-[11px] text-terracotta-600 font-semibold hover:underline block mt-0.5"
                >
                  Visit Storefront →
                </Link>
              </div>
            </div>
          )}

          {/* Price & Taxes */}
          <div className="pt-2">
            <div className="flex items-baseline gap-3">
              <span className="font-sans font-bold text-3xl sm:text-4xl text-charcoal-900">
                ₹{product.price}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-base text-charcoal-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs font-bold text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
                  Save ₹{product.mrp - product.price}
                </span>
              )}
            </div>
            <span className="text-xs text-charcoal-400 mt-1 block">
              Direct vendor pricing. Inclusive of all taxes.
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2 text-sm text-charcoal-700 leading-relaxed pt-2 border-t border-cream-200">
            <h4 className="font-serif font-bold text-base text-charcoal-900">Description</h4>
            <p>{product.description}</p>
          </div>

          {/* Ingredients / Materials Details */}
          {product.ingredients_or_materials && (
            <div className="p-4 rounded-2xl bg-cream-50 border border-[#E8E1D3] space-y-1.5 text-xs text-charcoal-700">
              <strong className="block font-serif text-sm text-charcoal-900">
                Ingredients / Materials:
              </strong>
              <p className="leading-relaxed">{product.ingredients_or_materials}</p>
            </div>
          )}

          {/* Preparation & Freshness Notice */}
          {product.preparation_time && (
            <div className="flex items-center gap-2 text-xs text-charcoal-600">
              <Clock className="w-4 h-4 text-forest-600 shrink-0" />
              <span>Preparation time: <strong className="text-charcoal-800">{product.preparation_time}</strong></span>
            </div>
          )}

          {/* Stock availability & Quantity Selector */}
          <div className="space-y-3 pt-3 border-t border-cream-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-charcoal-500">Quantity</span>
              {product.stock_quantity > 0 ? (
                <span className="text-xs text-forest-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {product.stock_quantity} units available
                </span>
              ) : (
                <span className="text-xs text-terracotta-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Currently Out of Stock
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#D6CCB8] rounded-2xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max((product.min_order_quantity || 1), quantity - 1))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-charcoal-600 hover:bg-cream-100 transition"
                  disabled={quantity <= (product.min_order_quantity || 1)}
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-sm text-charcoal-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-charcoal-600 hover:bg-cream-100 transition"
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>

              {/* Add to Cart & Buy Now Buttons */}
              <div className="flex-1 flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity <= 0}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm ${
                    added
                      ? 'bg-forest-600 text-white'
                      : product.stock_quantity <= 0
                      ? 'bg-cream-300 text-charcoal-400 cursor-not-allowed'
                      : 'bg-forest-600 hover:bg-forest-700 text-white active:scale-95'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity <= 0}
                  className="py-3.5 px-6 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs transition shadow-sm active:scale-95 disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Delivery PIN Availability Checker */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8E1D3] space-y-2">
            <span className="text-xs font-bold uppercase text-charcoal-600 block flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-forest-600" />
              Check Delivery To Your PIN Code
            </span>

            <form onSubmit={handleCheckPin} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Indian PIN"
                maxLength={6}
                value={checkPin}
                onChange={(e) => setCheckPin(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-cream-100 border border-[#D6CCB8] text-xs rounded-xl px-3 py-2 outline-none focus:border-forest-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-charcoal-800 text-white text-xs font-semibold rounded-xl hover:bg-charcoal-900 transition"
              >
                Check
              </button>
            </form>

            {pinStatus.checked && (
              <p className={`text-xs mt-1 ${pinStatus.deliverable ? 'text-forest-700 font-semibold' : 'text-terracotta-600'}`}>
                {pinStatus.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
