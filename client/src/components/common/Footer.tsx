import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, Store, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 text-cream-200 border-t border-charcoal-700 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-charcoal-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-700/60 flex items-center justify-center shrink-0 text-turmeric-500">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-cream-50">100% Direct Maker Support</h4>
              <p className="text-xs text-charcoal-400 mt-1 leading-relaxed">
                Every rupee goes directly to independent housewives, home bakers, and rural craft artisans. Zero distributor cut.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-700/60 flex items-center justify-center shrink-0 text-turmeric-500">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-cream-50">Fresh Local Delivery</h4>
              <p className="text-xs text-charcoal-400 mt-1 leading-relaxed">
                Freshly prepared pickles, baked goods, and handcrafted gifts dispatched straight from home kitchens and workshops.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-700/60 flex items-center justify-center shrink-0 text-turmeric-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-cream-50">No Mandatory Login</h4>
              <p className="text-xs text-charcoal-400 mt-1 leading-relaxed">
                Enjoy seamless guest shopping with verified OTP tracking. Your privacy and simplicity come first.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-charcoal-800 text-sm">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-forest-600 flex items-center justify-center text-white font-serif font-bold text-lg">
                LR
              </div>
              <span className="font-serif text-xl font-bold text-cream-50">LOCALROOTS</span>
            </div>
            <p className="text-xs text-charcoal-400 leading-relaxed">
              Empowering India's micro-entrepreneurs, home chefs, and traditional artisans with simple, zero-commission digital storefronts.
            </p>
            <div className="text-xs text-charcoal-400 space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
                <span>Operating across Jaipur, Bengaluru, Mumbai, Kochi & Pan-India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-terracotta-400" />
                <span>support@localroots.in</span>
              </div>
            </div>
          </div>

          {/* Customer Discovery */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-cream-100 uppercase tracking-wider mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-xs text-charcoal-300">
              <li><Link to="/explore" className="hover:text-cream-50 transition">All Homemade Products</Link></li>
              <li><Link to="/explore?category=pickles-preserves" className="hover:text-cream-50 transition">Pickles & Preserves</Link></li>
              <li><Link to="/explore?category=bakery" className="hover:text-cream-50 transition">Artisanal Bakery & Treats</Link></li>
              <li><Link to="/explore?category=handmade-crafts" className="hover:text-cream-50 transition">Clay & Handmade Crafts</Link></li>
              <li><Link to="/track" className="hover:text-cream-50 transition">Track Guest Order</Link></li>
              <li><Link to="/cart" className="hover:text-cream-50 transition">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Artisans & Sellers */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-cream-100 uppercase tracking-wider mb-4">
              For Makers
            </h5>
            <ul className="space-y-2.5 text-xs text-charcoal-300">
              <li><Link to="/seller/register" className="hover:text-cream-50 transition font-medium text-terracotta-300">Start Your Digital Store</Link></li>
              <li><Link to="/seller/login" className="hover:text-cream-50 transition">Seller Dashboard Login</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cream-50 transition">How Selling Works</Link></li>
              <li><Link to="/about" className="hover:text-cream-50 transition">Our Maker Community</Link></li>
              <li><Link to="/admin/login" className="hover:text-cream-50 transition text-charcoal-500">Platform Admin</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-cream-100 uppercase tracking-wider mb-4">
              Platform & Legal
            </h5>
            <ul className="space-y-2.5 text-xs text-charcoal-300">
              <li><Link to="/about" className="hover:text-cream-50 transition">About LOCALROOTS</Link></li>
              <li><Link to="/contact" className="hover:text-cream-50 transition">Help & Grievance Contact</Link></li>
              <li><Link to="/terms" className="hover:text-cream-50 transition">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-cream-50 transition">Privacy Policy</Link></li>
              <li><span className="text-[11px] text-charcoal-500 block pt-1">Direct Settlement Architecture Verified</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>© {new Date().getFullYear()} LOCALROOTS. Made with heart for Indian small business owners.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-cream-200">Terms</Link>
            <Link to="/privacy" className="hover:text-cream-200">Privacy</Link>
            <Link to="/contact" className="hover:text-cream-200">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
