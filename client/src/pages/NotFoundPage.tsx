import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, PackageOpen } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-cream-200 text-charcoal-400 flex items-center justify-center mx-auto">
        <PackageOpen className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600 block">
          404 - Page Not Found
        </span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Looks Like You've Wandered Off The Local Path
        </h1>
        <p className="text-xs text-charcoal-500 leading-relaxed">
          The homemade delicacy or storefront you're looking for doesn't exist or has moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-forest-600 text-white font-semibold text-xs shadow-card hover:bg-forest-700 transition flex items-center justify-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Go to Marketplace Home</span>
        </Link>
        <Link
          to="/explore"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cream-200 text-charcoal-800 font-semibold text-xs hover:bg-cream-300 transition flex items-center justify-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          <span>Explore Products</span>
        </Link>
      </div>
    </div>
  );
};
