import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';

export const SellerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadProducts = () => {
    setLoading(true);
    api.getSellerOwnProducts()
      .then(res => {
        if (res.success) setProducts(res.data);
      })
      .catch(err => console.error('Failed to load seller products', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await api.deleteSellerProduct(id);
      if (res.success) {
        setActionMessage(`"${name}" was deleted successfully.`);
        setProducts(prev => prev.filter(p => p.id !== id));
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const handleToggleStock = async (product: Product) => {
    const newStock = product.stock_quantity > 0 ? 0 : 25;
    try {
      const res = await api.updateSellerProduct(product.id, {
        stock_quantity: newStock,
      });
      if (res.success) {
        setProducts(prev =>
          prev.map(p => (p.id === product.id ? { ...p, stock_quantity: newStock } : p))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update stock.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D3]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            My Products ({products.length})
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Manage your homemade items, pricing, inventory stock, and availability.
          </p>
        </div>

        <Link
          to="/seller/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-card transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-charcoal-500">Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E1D3] overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/80 border-b border-[#E8E1D3] text-charcoal-600 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Product</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Price</th>
                  <th className="py-3.5 px-4 font-bold">Stock</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {products.map((product) => {
                  const image =
                    product.images?.find(i => i.is_primary)?.image_url ||
                    product.images?.[0]?.image_url ||
                    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&auto=format&fit=crop&q=80';

                  return (
                    <tr key={product.id} className="hover:bg-cream-50/50 transition">
                      {/* Product Name & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E8E1D3] shrink-0"
                          />
                          <div>
                            <Link
                              to={`/product/${product.id}`}
                              target="_blank"
                              className="font-serif font-bold text-charcoal-900 hover:text-forest-600 transition block truncate max-w-xs"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-charcoal-400">
                              Prep: {product.preparation_time || 'Fresh batch'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-charcoal-600">
                        {product.category?.name || 'General'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-charcoal-900 font-sans">
                        ₹{product.price}
                      </td>

                      {/* Stock Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(product)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                            product.stock_quantity > 0
                              ? 'bg-forest-100 text-forest-800 hover:bg-forest-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                          title="Click to toggle in/out of stock"
                        >
                          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                        </button>
                      </td>

                      {/* Active Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                          product.is_active ? 'bg-forest-600' : 'bg-charcoal-400'
                        }`} />
                        <span className="text-charcoal-600">
                          {product.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            target="_blank"
                            className="p-1.5 text-charcoal-400 hover:text-forest-600 transition"
                            title="Preview Public Listing"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 text-charcoal-400 hover:text-red-600 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-200 text-charcoal-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-charcoal-800">
            No Products Added Yet
          </h3>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
            Start listing your homemade pickles, snacks, baked goods, or crafts to receive orders.
          </p>
          <Link
            to="/seller/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest-600 text-white font-semibold text-xs shadow-card"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Your First Product</span>
          </Link>
        </div>
      )}
    </div>
  );
};
