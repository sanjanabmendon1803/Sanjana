import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Truck,
  Store,
  CreditCard,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SellerDashboardLayout: React.FC = () => {
  const { seller, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', path: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'My Products', path: '/seller/products', icon: Package },
    { label: 'Add Product', path: '/seller/products/new', icon: PlusCircle },
    { label: 'Customer Orders', path: '/seller/orders', icon: ShoppingBag },
    { label: 'Delivery Areas', path: '/seller/delivery', icon: Truck },
    { label: 'Store Profile', path: '/seller/profile', icon: Store },
    { label: 'Settlement & Payouts', path: '/seller/payouts', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-[#E8E1D3] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={seller?.logo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'}
            alt="Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-serif font-bold text-sm text-charcoal-900 truncate max-w-[180px]">
            {seller?.business_name || 'Seller Dashboard'}
          </span>
        </div>

        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 text-charcoal-700"
        >
          {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E8E1D3] p-6 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0
        ${isMobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Seller Store Badge */}
          <div className="pb-4 border-b border-cream-200">
            <div className="flex items-center gap-3">
              <img
                src={seller?.logo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'}
                alt={seller?.business_name}
                className="w-12 h-12 rounded-2xl object-cover border border-forest-600/20 shadow-sm"
              />
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-sm text-charcoal-900 truncate">
                  {seller?.business_name || 'My Store'}
                </h3>
                <span className="text-[11px] text-terracotta-600 block truncate">
                  {seller?.business_category}
                </span>
              </div>
            </div>

            {seller?.slug && (
              <Link
                to={`/store/${seller.slug}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest-700 hover:text-forest-800 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-xl w-full justify-center transition"
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-forest-600 text-white shadow-sm'
                      : 'text-charcoal-700 hover:bg-cream-100 hover:text-forest-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-cream-200 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-charcoal-600 hover:text-forest-700 transition"
          >
            <span>← Back to Marketplace</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
};
