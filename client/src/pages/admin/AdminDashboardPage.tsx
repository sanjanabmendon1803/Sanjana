import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SellerProfile, Product, Order } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'metrics' | 'sellers' | 'products' | 'orders'>('metrics');
  const [metrics, setMetrics] = useState<any>(null);
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, sellersRes, prodsRes, ordersRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminSellers(),
        api.getAdminProducts(),
        api.getAdminOrders(),
      ]);

      if (metricsRes.success) setMetrics(metricsRes.data);
      if (sellersRes.success) setSellers(sellersRes.data);
      if (prodsRes.success) setProducts(prodsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateSellerStatus = async (id: string, isApproved: boolean, isActive?: boolean) => {
    try {
      const res = await api.updateAdminSellerStatus(id, isApproved, isActive);
      if (res.success) {
        setMessage(`Seller approval status updated.`);
        setTimeout(() => setMessage(null), 3000);
        setSellers(prev =>
          prev.map(s => (s.id === id ? { ...s, is_approved: isApproved, is_active: isActive !== undefined ? isActive : s.is_active } : s))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update seller.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Moderate and remove listing "${name}"?`)) return;

    try {
      const res = await api.deleteAdminProduct(id);
      if (res.success) {
        setMessage(`Product "${name}" removed by moderation.`);
        setTimeout(() => setMessage(null), 3000);
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to remove product.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D3]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-charcoal-900 text-turmeric-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">
              Platform Governance Dashboard
            </h1>
            <p className="text-xs text-charcoal-500">
              Moderate makers, review community orders, and enforce authenticity standards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs font-semibold text-charcoal-600 hover:text-forest-700"
          >
            Marketplace
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'metrics'
              ? 'bg-charcoal-900 text-white shadow-sm'
              : 'text-charcoal-600 hover:bg-cream-200'
          }`}
        >
          Overview & Metrics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sellers')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'sellers'
              ? 'bg-charcoal-900 text-white shadow-sm'
              : 'text-charcoal-600 hover:bg-cream-200'
          }`}
        >
          Manage Sellers ({sellers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'products'
              ? 'bg-charcoal-900 text-white shadow-sm'
              : 'text-charcoal-600 hover:bg-cream-200'
          }`}
        >
          Moderate Listings ({products.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'orders'
              ? 'bg-charcoal-900 text-white shadow-sm'
              : 'text-charcoal-600 hover:bg-cream-200'
          }`}
        >
          All Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E8E1D3] shadow-soft space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Gross Platform Volume</span>
              <span className="font-serif font-bold text-2xl text-forest-700 block font-sans pt-1">
                ₹{metrics?.grossVolume || 0}
              </span>
              <span className="text-[11px] text-charcoal-400">Total verified transactions</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8E1D3] shadow-soft space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Approved Makers</span>
              <span className="font-serif font-bold text-2xl text-charcoal-900 block pt-1">
                {metrics?.approvedSellers || 0} <span className="text-xs font-normal text-charcoal-400">/ {metrics?.totalSellers || 0} total</span>
              </span>
              <span className="text-[11px] text-charcoal-400">Independent store storefronts</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8E1D3] shadow-soft space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Active Listings</span>
              <span className="font-serif font-bold text-2xl text-charcoal-900 block pt-1">
                {metrics?.activeProducts || 0} <span className="text-xs font-normal text-charcoal-400">/ {metrics?.totalProducts || 0}</span>
              </span>
              <span className="text-[11px] text-charcoal-400">Homemade products listed</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8E1D3] shadow-soft space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Total Customer Orders</span>
              <span className="font-serif font-bold text-2xl text-charcoal-900 block pt-1">
                {metrics?.totalOrders || 0}
              </span>
              <span className="text-[11px] text-charcoal-400">Placed via guest checkout</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE SELLERS */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-3xl border border-[#E8E1D3] overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/80 border-b border-[#E8E1D3] text-charcoal-600 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Seller & Storefront</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">City / Location</th>
                  <th className="py-3.5 px-4 font-bold">Contact</th>
                  <th className="py-3.5 px-4 font-bold">Approval Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {sellers.map((s) => (
                  <tr key={s.id} className="hover:bg-cream-50/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.logo_url}
                          alt={s.business_name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E8E1D3] shrink-0"
                        />
                        <div>
                          <span className="font-serif font-bold text-charcoal-900 block">
                            {s.business_name}
                          </span>
                          <span className="text-[10px] text-charcoal-400 font-mono">
                            /store/{s.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-charcoal-700">{s.business_category}</td>
                    <td className="py-3 px-4 text-charcoal-700">{s.city} ({s.pin_code})</td>
                    <td className="py-3 px-4 text-charcoal-700 font-mono">{s.phone_number}</td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        s.is_approved
                          ? 'bg-forest-100 text-forest-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {s.is_approved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/store/${s.slug}`}
                          target="_blank"
                          className="p-1.5 text-charcoal-400 hover:text-forest-700 transition"
                          title="View Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {s.is_approved ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateSellerStatus(s.id, false, false)}
                            className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-[10px] font-bold transition"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpdateSellerStatus(s.id, true, true)}
                            className="px-2.5 py-1 rounded-lg bg-forest-600 text-white hover:bg-forest-700 text-[10px] font-bold transition"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MODERATE PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-[#E8E1D3] overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/80 border-b border-[#E8E1D3] text-charcoal-600 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Product</th>
                  <th className="py-3.5 px-4 font-bold">Seller</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Price</th>
                  <th className="py-3.5 px-4 font-bold">Stock</th>
                  <th className="py-3.5 px-4 font-bold text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50/50 transition">
                    <td className="py-3 px-4 font-serif font-bold text-charcoal-900">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 text-charcoal-700">
                      {p.seller?.business_name || 'Independent Maker'}
                    </td>
                    <td className="py-3 px-4 text-charcoal-600">
                      {p.category?.name || 'General'}
                    </td>
                    <td className="py-3 px-4 font-bold font-sans">
                      ₹{p.price}
                    </td>
                    <td className="py-3 px-4">
                      {p.stock_quantity}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-[10px] font-bold transition"
                      >
                        Remove Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ALL ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E8E1D3] overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/80 border-b border-[#E8E1D3] text-charcoal-600 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Order Ref</th>
                  <th className="py-3.5 px-4 font-bold">Customer</th>
                  <th className="py-3.5 px-4 font-bold">Location</th>
                  <th className="py-3.5 px-4 font-bold">Suborders</th>
                  <th className="py-3.5 px-4 font-bold">Amount</th>
                  <th className="py-3.5 px-4 font-bold">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream-50/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-charcoal-900">
                      {o.order_reference}
                    </td>
                    <td className="py-3 px-4 text-charcoal-800">
                      {o.customer_name}
                    </td>
                    <td className="py-3 px-4 text-charcoal-600">
                      {o.delivery_city} ({o.delivery_pin_code})
                    </td>
                    <td className="py-3 px-4 text-charcoal-600">
                      {o.suborders?.length || 1} independent maker packages
                    </td>
                    <td className="py-3 px-4 font-bold text-forest-700 font-sans">
                      ₹{o.grand_total}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-200 text-charcoal-700">
                        {o.payment_method} ({o.payment_status})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
