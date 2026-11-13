import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Image as ImageIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { Category } from '../../types';

export const SellerAddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stockQuantity, setStockQuantity] = useState('25');
  const [minOrderQuantity, setMinOrderQuantity] = useState('1');
  const [ingredientsOrMaterials, setIngredientsOrMaterials] = useState('');
  const [preparationTime, setPreparationTime] = useState('Fresh batch, 1 day');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getCategories().then(res => {
      if (res.success && res.data.length > 0) {
        setCategories(res.data);
        setCategoryId(res.data[0].id);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !price || !categoryId) {
      setErrorMessage('Product name, category, and price are required.');
      return;
    }

    setLoading(true);

    const images = [imageUrl, imageUrl2].filter(Boolean);
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80');
    }

    try {
      const res = await api.createSellerProduct({
        name: name.trim(),
        description: description.trim(),
        categoryId,
        price: parseFloat(price),
        mrp: mrp ? parseFloat(mrp) : undefined,
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        minOrderQuantity: parseInt(minOrderQuantity, 10) || 1,
        ingredientsOrMaterials: ingredientsOrMaterials.trim(),
        preparationTime: preparationTime.trim(),
        images,
        isActive: true,
      });

      if (res.success) {
        navigate('/seller/products');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D3]">
        <div>
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="inline-flex items-center gap-1 text-xs text-charcoal-500 hover:text-forest-700 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </button>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Add New Product
          </h1>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-card space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal-900 pb-2 border-b border-cream-200">
            Basic Information
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Traditional Sun-Cured Mango Pickle (500g)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Preparation Time
              </label>
              <input
                type="text"
                placeholder="e.g. Freshly baked, within 4 hours"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Full Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe what makes this homemade product special, flavor notes, texture, or artisan techniques..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Ingredients or Craft Materials
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Raw Mango, Mustard Oil, Yellow Mustard, Fenugreek, Salt, Spices (or: Terracotta Clay, Acrylic Glaze)"
              value={ingredientsOrMaterials}
              onChange={(e) => setIngredientsOrMaterials(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4 pt-4 border-t border-cream-200">
          <h3 className="font-serif font-bold text-base text-charcoal-900 pb-2 border-b border-cream-200">
            Pricing & Inventory
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="150"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                MRP (₹, Optional)
              </label>
              <input
                type="number"
                placeholder="180"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min={0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Min Order Quantity
              </label>
              <input
                type="number"
                min={1}
                value={minOrderQuantity}
                onChange={(e) => setMinOrderQuantity(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="space-y-4 pt-4 border-t border-cream-200">
          <h3 className="font-serif font-bold text-base text-charcoal-900 pb-2 border-b border-cream-200">
            Product Images
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Primary Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
                Secondary Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl2}
                onChange={(e) => setImageUrl2(e.target.value)}
                className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
              />
            </div>
          </div>
          <span className="text-[11px] text-charcoal-400 block">
            Tip: You can use high-resolution Unsplash photo links or direct CDN image URLs.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-card transition active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Adding Product...' : 'Publish Product to Storefront'}
        </button>
      </form>
    </div>
  );
};
