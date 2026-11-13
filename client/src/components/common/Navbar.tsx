import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Store,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  PackageCheck,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { name: 'Pickles & Preserves', slug: 'pickles-preserves' },
  { name: 'Homemade Food', slug: 'homemade-food' },
  { name: 'Snacks & Sweets', slug: 'snacks-sweets' },
  { name: 'Bakery', slug: 'bakery' },
  { name: 'Handmade Crafts', slug: 'handmade-crafts' },
  { name: 'Jewellery', slug: 'jewellery' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Home Decor', slug: 'home-decor' },
  { name: 'Customized Gifts', slug: 'customized-gifts' },
  { name: 'Other Products', slug: 'other-products' },
];

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { role, seller, adminUser } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E8E1D3]">
      {/* Top Banner: Marketplace Trust Promise */}
      <div className="bg-forest-600 text-cream-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <span>🌱 100% Direct From Local Makers • No Middlemen • No Hidden Fees • Pure Homemade Quality</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-forest-600 flex items-center justify-center text-cream-100 shadow-md group-hover:bg-forest-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current text-terracotta-200" viewBox="0 0 24 24">
                <path d="M12 2L4 9v12h16V9l-8-7zm0 3.5l5 4.375V19H7v-9.125L12 5.5z"/>
                <circle cx="12" cy="14" r="2.5" fill="#FAF8F2"/>
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-forest-700 block leading-none">
                LOCALROOTS
              </span>
              <span className="text-[10px] uppercase tracking-widest text-terracotta-600 font-semibold mt-1 block">
                Small Businesses. Big Dreams.
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search homemade pickles, brownies, earrings, artisans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream-200/80 border border-[#D6CCB8] focus:border-forest-600 focus:bg-white text-sm rounded-full py-2.5 pl-11 pr-4 outline-none transition text-charcoal-800 placeholder-charcoal-400"
              />
              <Search className="w-4 h-4 text-charcoal-400 absolute left-4 top-3.5" />
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-charcoal-700">
            <Link to="/" className="hover:text-forest-600 transition">Home</Link>
            <Link to="/explore" className="hover:text-forest-600 transition">Explore</Link>

            {/* Categories Dropdown */}
            <div className="relative" onMouseLeave={() => setIsCategoryOpen(false)}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                onMouseEnter={() => setIsCategoryOpen(true)}
                className="flex items-center gap-1 hover:text-forest-600 transition py-2"
              >
                Categories
                <ChevronDown className="w-4 h-4 text-charcoal-400" />
              </button>

              {isCategoryOpen && (
                <div
                  className="absolute top-full -left-12 w-64 bg-white border border-[#E8E1D3] shadow-card rounded-2xl py-2 z-50"
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-charcoal-400 border-b border-cream-200">
                    Handmade Categories
                  </div>
                  {CATEGORIES.map(c => (
                    <Link
                      key={c.slug}
                      to={`/explore?category=${c.slug}`}
                      onClick={() => setIsCategoryOpen(false)}
                      className="block px-4 py-2 text-xs text-charcoal-700 hover:bg-cream-100 hover:text-forest-600 transition"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/track" className="flex items-center gap-1.5 hover:text-forest-600 transition">
              <PackageCheck className="w-4 h-4 text-terracotta-500" />
              Track Order
            </Link>
          </nav>

          {/* Right Actions: Cart & Seller/Admin Portal Buttons */}
          <div className="flex items-center gap-3">
            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-cream-200/80 hover:bg-cream-300 text-charcoal-700 hover:text-forest-700 transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-soft-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Portal Action Buttons (Role Based) */}
            {role === 'seller' ? (
              <Link
                to="/seller/dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-600 text-cream-100 text-xs font-semibold hover:bg-forest-700 transition shadow-sm"
              >
                <Store className="w-4 h-4" />
                Seller Dashboard
              </Link>
            ) : role === 'admin' ? (
              <Link
                to="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal-800 text-cream-100 text-xs font-semibold hover:bg-charcoal-900 transition shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-turmeric-500" />
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/seller/register"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-forest-600 text-forest-700 hover:bg-forest-600 hover:text-white text-xs font-semibold transition"
              >
                <Store className="w-3.5 h-3.5" />
                Become a Seller
              </Link>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 lg:hidden text-charcoal-700 rounded-lg hover:bg-cream-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E1D3] bg-[#FAF8F2] px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products & makers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream-200 border border-[#D6CCB8] text-sm rounded-xl py-2 pl-10 pr-3 outline-none"
              />
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
            </div>
          </form>

          <div className="flex flex-col gap-2 font-medium text-sm text-charcoal-800">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-2 hover:bg-cream-200 rounded-lg">Home</Link>
            <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-2 hover:bg-cream-200 rounded-lg">Explore Marketplace</Link>
            <Link to="/track" onClick={() => setIsMobileMenuOpen(false)} className="py-2 px-2 hover:bg-cream-200 rounded-lg flex items-center justify-between">
              <span>Track Guest Order</span>
              <PackageCheck className="w-4 h-4 text-terracotta-500" />
            </Link>

            <div className="pt-2 border-t border-cream-200">
              <span className="text-[11px] font-bold uppercase text-charcoal-400 px-2 block mb-2">Shop Categories</span>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {CATEGORIES.slice(0, 8).map(c => (
                  <Link
                    key={c.slug}
                    to={`/explore?category=${c.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-1.5 px-2 hover:bg-cream-200 rounded-md text-charcoal-700"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-cream-200 flex flex-col gap-2">
              <Link
                to="/seller/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-center rounded-xl bg-forest-600 text-cream-100 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <span>Start Your Business Storefront</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/seller/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 px-4 text-center text-xs text-charcoal-600 hover:text-forest-600"
              >
                Seller Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
