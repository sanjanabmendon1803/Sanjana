import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Truck
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const SellerOverviewPage: React.FC = () => {
  const { seller } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSellerAnalytics()
      .then(res => {
        if (res.success) setAnalytics(res.data);
      })
      .catch(err => console.error('Failed to load seller analytics', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-charcoal-500">Loading business metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D3]">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-forest-700 block">
            Storefront Dashboard
          </span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Welcome back, {seller?.business_name}!
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Here is what is happening in your kitchen/workshop today.
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

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8E1D3] shadow-soft space-y-1">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Total Verified Sales</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-charcoal-900 font-sans block pt-1">
            ₹{analytics?.totalSales || 0}
          </span>
          <span className="text-[11px] text-charcoal-400">Directly settled revenue</span>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8E1D3] shadow-soft space-y-1">
          <div className="flex items-center justify-between text-terracotta-600">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Active Products</span>
            <Package className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-charcoal-900 block pt-1">
            {analytics?.activeProducts || 0} <span className="text-xs font-normal text-charcoal-400">/ {analytics?.totalProducts || 0}</span>
          </span>
          <span className="text-[11px] text-charcoal-400">Listed on marketplace</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8E1D3] shadow-soft space-y-1">
          <div className="flex items-center justify-between text-turmeric-600">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Pending Orders</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-charcoal-900 block pt-1">
            {analytics?.pendingOrders || 0}
          </span>
          <span className="text-[11px] text-charcoal-400">Requires prep or dispatch</span>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8E1D3] shadow-soft space-y-1">
          <div className="flex items-center justify-between text-forest-600">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Delivered Orders</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-2xl text-charcoal-900 block pt-1">
            {analytics?.completedOrders || 0}
          </span>
          <span className="text-[11px] text-charcoal-400">Successfully fulfilled</span>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <h3 className="font-serif font-bold text-lg text-charcoal-900">
            Recent Orders
          </h3>
          <Link
            to="/seller/orders"
            className="text-xs font-semibold text-forest-700 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
          <div className="divide-y divide-cream-100 text-xs">
            {analytics.recentOrders.map((order: any) => (
              <div key={order.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono font-bold text-charcoal-800">
                    {order.suborder_reference}
                  </span>
                  <span className="text-charcoal-400 block text-[11px]">
                    Placed: {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    order.status === 'Delivered'
                      ? 'bg-forest-100 text-forest-800'
                      : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-terracotta-100 text-terracotta-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-charcoal-900 font-sans block">
                    ₹{order.suborder_total}
                  </span>
                  <Link
                    to="/seller/orders"
                    className="text-[11px] text-forest-700 hover:underline"
                  >
                    Manage Order →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-charcoal-400">
            No incoming customer orders yet. Your products are live on the marketplace!
          </div>
        )}
      </div>
    </div>
  );
};
