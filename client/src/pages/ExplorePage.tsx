import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  MapPin,
  SlidersHorizontal,
  PackageOpen,
  ArrowUpDown
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { api } from '../services/api';
import { Product, Category } from '../types';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State initialized from URL search params
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'newest';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [sort, setSort] = useState(initialSort);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Load Categories once
  useEffect(() => {
    api.getCategories().then(res => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  // Sync state whenever URL query params change (e.g. from Navbar or browser navigation)
  useEffect(() => {
    const urlCategory = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlSort = searchParams.get('sort') || 'newest';

    setSearch(urlSearch);
    setSelectedCategory(urlCategory);
    setSort(urlSort);
  }, [searchParams]);

  // Fetch Products based on filters
  useEffect(() => {
    let isCancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({
          search: search.trim() || undefined,
          category: selectedCategory || undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          city: city || undefined,
          pinCode: pinCode || undefined,
          sort: sort as any,
        });

        if (!isCancelled && res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isCancelled = true;
    };
  }, [search, selectedCategory, sort, city, pinCode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const trimmed = search.trim();
      if (trimmed) {
        next.set('search', trimmed);
      } else {
        next.delete('search');
      }
      return next;
    });
  };

  const handleClearSearch = () => {
    setSearch('');
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('search');
      return next;
    });
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (slug) {
        next.set('category', slug);
      } else {
        next.delete('category');
      }
      return next;
    });
  };

  const handlePriceApply = () => {
    api.getProducts({
      search: search.trim() || undefined,
      category: selectedCategory || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      city: city || undefined,
      pinCode: pinCode || undefined,
      sort: sort as any,
    }).then(res => {
      if (res.success) setProducts(res.data);
    });
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setCity('');
    setPinCode('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E1D3]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            Explore Homemade Products
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Handcrafted with love by authentic local makers, housewives, and small-batch kitchens.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by product, ingredient, or maker name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#D6CCB8] focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 text-sm rounded-2xl py-2.5 pl-10 pr-9 outline-none transition text-charcoal-800 placeholder-charcoal-400"
            />
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5" />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-3 text-charcoal-400 hover:text-charcoal-600 p-0.5"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-2xl text-xs font-semibold shadow-sm transition shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-[#E8E1D3] shadow-soft h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-forest-600" />
              Filter By
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-terracotta-600 hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-2">
              Categories
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedCategory === ''
                    ? 'bg-forest-100 text-forest-800 font-bold'
                    : 'text-charcoal-700 hover:bg-cream-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => handleCategorySelect(c.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    selectedCategory === c.slug
                      ? 'bg-forest-100 text-forest-800 font-bold'
                      : 'text-charcoal-700 hover:bg-cream-100'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery PIN Code Checker */}
          <div className="pt-4 border-t border-cream-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
              Serviceable PIN Code
            </label>
            <input
              type="text"
              placeholder="e.g. 560038, 400050"
              maxLength={6}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-cream-100 border border-[#D6CCB8] text-xs rounded-xl p-2.5 outline-none focus:border-forest-600 text-charcoal-800"
            />
            <span className="text-[10px] text-charcoal-400 mt-1 block">
              Filters products deliverable to your doorstep
            </span>
          </div>

          {/* Location / City Filter */}
          <div className="pt-4 border-t border-cream-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-1.5">
              Maker City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] text-xs rounded-xl p-2.5 outline-none focus:border-forest-600 text-charcoal-800"
            >
              <option value="">All Indian Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Kochi">Kochi</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Delhi">Delhi NCR</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-cream-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-2">
              Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] text-xs rounded-xl p-2 outline-none"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] text-xs rounded-xl p-2 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handlePriceApply}
              className="w-full py-1.5 bg-cream-200 hover:bg-cream-300 text-charcoal-800 text-xs font-semibold rounded-xl transition"
            >
              Apply Price
            </button>
          </div>
        </div>

        {/* PRODUCTS LISTING & SORT BAR */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E1D3] flex flex-wrap items-center justify-between gap-4 shadow-soft">
            <div className="text-xs font-semibold text-charcoal-600 flex flex-wrap items-center gap-2">
              <span>Showing <strong className="text-forest-700">{products.length}</strong> authentic creations</span>
              {search && (
                <span className="inline-flex items-center gap-1.5 bg-forest-50 text-forest-800 border border-forest-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                  Search: <strong>"{search}"</strong>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-forest-600 hover:text-forest-900 ml-0.5"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 bg-terracotta-50 text-terracotta-800 border border-terracotta-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                  Category: <strong>{categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}</strong>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('')}
                    className="text-terracotta-600 hover:text-terracotta-900 ml-0.5"
                    title="Clear category filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {city && (
                <span className="inline-flex items-center gap-1.5 bg-cream-200 text-charcoal-800 px-2.5 py-1 rounded-lg text-xs font-medium">
                  City: <strong>{city}</strong>
                  <button
                    type="button"
                    onClick={() => setCity('')}
                    className="text-charcoal-500 hover:text-charcoal-800 ml-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {pinCode && (
                <span className="inline-flex items-center gap-1.5 bg-cream-200 text-charcoal-800 px-2.5 py-1 rounded-lg text-xs font-medium">
                  PIN: <strong>{pinCode}</strong>
                  <button
                    type="button"
                    onClick={() => setPinCode('')}
                    className="text-charcoal-500 hover:text-charcoal-800 ml-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Trigger Button */}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-cream-200 rounded-xl text-xs font-semibold text-charcoal-700"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>

              <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-forest-600" />
                <span className="hidden sm:inline">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-cream-100 border border-[#D6CCB8] rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none text-charcoal-800"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Popularity / Loved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-[#E8E1D3] p-4 h-72 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E8E1D3] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-cream-200 text-charcoal-400 flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-charcoal-800">
                No Products Match Your Filter
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                Try adjusting your search terms, changing the delivery PIN code, or resetting your category filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-forest-600 text-white font-semibold text-xs shadow-sm hover:bg-forest-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Filters</h3>
              <button onClick={() => setIsFilterDrawerOpen(false)} className="p-1">
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  handleCategorySelect(e.target.value);
                  setIsFilterDrawerOpen(false);
                }}
                className="w-full bg-cream-100 border border-[#D6CCB8] text-xs rounded-xl p-2.5"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1.5">Delivery PIN Code</label>
              <input
                type="text"
                placeholder="e.g. 560038"
                maxLength={6}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-cream-100 border border-[#D6CCB8] text-xs rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1.5">Maker City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] text-xs rounded-xl p-2.5"
              >
                <option value="">All Indian Cities</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Kochi">Kochi</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setIsFilterDrawerOpen(false);
                }}
                className="flex-1 py-2.5 bg-cream-200 text-charcoal-800 rounded-xl text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-2.5 bg-forest-600 text-white rounded-xl text-xs font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
