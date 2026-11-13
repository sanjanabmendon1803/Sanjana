import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Store,
  ChevronRight,
  CheckCircle2,
  Package,
  Layers,
  Award
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { SellerCard } from '../components/common/SellerCard';
import { api } from '../services/api';
import { Product, Category, SellerProfile } from '../types';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featuredSellers, setFeaturedSellers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes, sellersRes] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
          api.getSellers(),
        ]);

        if (catsRes.success) setCategories(catsRes.data);
        if (prodsRes.success) {
          const prods = prodsRes.data;
          setTrendingProducts(prods.filter(p => p.is_popular).slice(0, 4));
          setNewProducts(prods.slice(0, 4));
        }
        if (sellersRes.success) setFeaturedSellers(sellersRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F4EFE6] to-[#FAF8F2] pt-8 pb-16 md:py-20 border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                <span>Empowering India's Local Home Artisans & Chefs</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 leading-[1.15] tracking-tight">
                Discover the Heart Behind Every{' '}
                <span className="text-forest-600 italic">Homemade</span> Product.
              </h1>

              <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Shop locally. Support small businesses. Buy directly from the people who make it.
                Zero middlemen. Zero markups. 100% authentic craftsmanship.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/explore"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm shadow-card hover:shadow-lifted transition flex items-center justify-center gap-2 group"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/seller/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-cream-200/90 hover:bg-cream-300 text-forest-800 font-semibold text-sm border border-[#D6CCB8] transition flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-terracotta-600" />
                  <span>Start Your Business</span>
                </Link>
              </div>

              {/* Trust Badges under Hero */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E8E1D3]/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block font-serif font-bold text-xl text-forest-700">0%</span>
                  <span className="text-xs text-charcoal-500">Platform inventory markups</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-xl text-terracotta-600">100%</span>
                  <span className="text-xs text-charcoal-500">Direct artisan payout</span>
                </div>
                <div>
                  <span className="block font-serif font-bold text-xl text-forest-700">Guest</span>
                  <span className="text-xs text-charcoal-500">Fast checkout, no account</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Mosaic Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-cream-200">
                  <img
                    src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1000&auto=format&fit=crop&q=80"
                    alt="Authentic Homemade Indian Pickles and Traditional Crafts"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-cream-50">
                    <span className="text-[11px] uppercase tracking-widest font-semibold text-turmeric-500">
                      Featured Artisan Spotlight
                    </span>
                    <p className="font-serif text-lg font-bold">
                      Sun-Cured Aam Ka Achar by Amma
                    </p>
                    <p className="text-xs text-cream-200">
                      Made on a rooftop terrace in Jaipur with 35-year heirloom recipes
                    </p>
                  </div>
                </div>

                {/* Floating Micro Badge 1 */}
                <div className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-card border border-[#E8E1D3] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center text-terracotta-600">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-charcoal-800">Support Women Makers</span>
                    <span className="text-[10px] text-charcoal-400">Direct community livelihood</span>
                  </div>
                </div>

                {/* Floating Micro Badge 2 */}
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-card border border-[#E8E1D3] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-charcoal-800">Verified Homemade</span>
                    <span className="text-[10px] text-charcoal-400">Zero factory preservatives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta-600 block mb-1">
              Handmade & Small Batch
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-900">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.slug}`}
              className="group bg-white rounded-2xl border border-[#E8E1D3] p-4 text-center hover:border-forest-600 hover:shadow-card transition duration-300 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-cream-200 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif font-bold text-sm text-charcoal-800 group-hover:text-forest-700 transition">
                {cat.name}
              </h3>
              <p className="text-[11px] text-charcoal-400 mt-1 line-clamp-1">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-forest-700 block mb-1">
              Loved by Neighbors
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-900">
              Trending Products
            </h2>
          </div>
          <Link
            to="/explore?sort=popular"
            className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1 group"
          >
            <span>See Top Sellers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. NEWLY ADDED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta-600 block mb-1">
              Fresh From Kitchens & Studios
            </span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-900">
              Newly Added Creations
            </h2>
          </div>
          <Link
            to="/explore?sort=newest"
            className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1 group"
          >
            <span>Browse New Additions</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED LOCAL SELLERS */}
      <section className="bg-[#F4EFE6]/70 py-16 border-y border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-forest-700 block mb-1">
              Meet The Artisans
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              Featured Local Storefronts
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-2">
              Every storefront on LOCALROOTS represents real families, housewives, and artisans turning their passions into livelihoods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW LOCALROOTS WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-terracotta-600 block mb-1">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-3xl font-bold text-charcoal-900">
            How LOCALROOTS Works
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-2">
            No middle distributors. No centralized warehouses. Just pure, direct connection between maker and buyer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-soft text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-800 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              01
            </div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900 mb-2">
              Discover Real Local Makers
            </h3>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              Explore authentic pickles, handmade baked goods, crochet art, and pottery made in home kitchens and studios across your city and region.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-soft text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-terracotta-100 text-terracotta-800 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              02
            </div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900 mb-2">
              Order Without Mandatory Login
            </h3>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              Add products from multiple independent sellers into one convenient cart. Checkout directly as a guest with verified PIN delivery.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-soft text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-cream-300 text-charcoal-800 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              03
            </div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900 mb-2">
              Fresh Direct Delivery & Payout
            </h3>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              The seller freshly prepares your order and dispatches it directly. Funds settle directly to the artisan's verified account.
            </p>
          </div>
        </div>
      </section>

      {/* 6. WHY SUPPORT SMALL BUSINESSES? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 rounded-3xl text-cream-100 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-card">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs uppercase tracking-widest font-bold text-turmeric-500 block mb-2">
              Our Guiding Purpose
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 leading-tight mb-4">
              Why Supporting Small Businesses Transforms Communities
            </h2>
            <p className="text-sm text-cream-200 leading-relaxed mb-8">
              When you buy from a small home business on LOCALROOTS, you are not paying corporate executive bonuses. You are funding children's school books, supporting women entrepreneurs gaining financial independence, and keeping age-old cultural recipes and crafts alive.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-cream-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-turmeric-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-cream-50 text-sm">Heirloom Recipes Preserved</strong>
                  Traditional sun-curing, cold-pressing, and stone-ground spices that commercial factories cannot replicate.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-turmeric-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-cream-50 text-sm">Zero Plastic Bulk Waste</strong>
                  Makers pack fresh batches with love, reusable glass jars, and natural materials.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-turmeric-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-cream-50 text-sm">Women Micro-Entrepreneurs</strong>
                  Over 85% of LOCALROOTS storefronts are operated by talented women and homemakers.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-turmeric-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-cream-50 text-sm">Fair & Honest Earnings</strong>
                  Sellers set their own fair prices without predatory platform cuts or forced discounts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BECOME A SELLER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 rounded-3xl text-white p-8 sm:p-12 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta-100 block">
              For Housewives, Chefs & Artisans
            </span>
            <h2 className="font-serif text-3xl font-bold leading-tight">
              Turn Your Kitchen or Workshop Into a Thriving Digital Storefront
            </h2>
            <p className="text-xs sm:text-sm text-terracotta-100 leading-relaxed">
              No technical knowledge needed. List your homemade food, snacks, jewelry, or handicrafts in under 3 minutes.
            </p>
          </div>

          <Link
            to="/seller/register"
            className="px-8 py-4 rounded-2xl bg-white text-terracotta-700 hover:bg-cream-100 font-bold text-sm shadow-md transition shrink-0 active:scale-95"
          >
            Create Your Free Storefront
          </Link>
        </div>
      </section>
    </div>
  );
};
