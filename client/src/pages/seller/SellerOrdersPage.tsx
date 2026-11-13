import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  AlertCircle,
  Truck,
  MessageSquare,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { SellerSuborder, SuborderStatus } from '../../types';

export const SellerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<SellerSuborder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    api.getSellerOrders()
      .then(res => {
        if (res.success) setOrders(res.data);
      })
      .catch(err => console.error('Failed to load seller orders', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: SuborderStatus, reason?: string) => {
    try {
      const res = await api.updateSuborderStatus(orderId, newStatus, reason);
      if (res.success) {
        setStatusMessage(`Order updated to "${newStatus}"!`);
        setTimeout(() => setStatusMessage(null), 3000);
        setRejectingId(null);
        setRejectReason('');
        // Refresh orders list
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus, rejection_reason: reason } : o))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D3]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Customer Orders ({orders.length})
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Accept, prepare, and dispatch orders directly from your kitchen or workshop.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-charcoal-500">Loading orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const customer = order.parentOrderSummary;
            const isCancelled = order.status === 'Cancelled';
            const isDelivered = order.status === 'Delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-soft space-y-6"
              >
                {/* Header: Suborder Reference & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cream-200">
                  <div>
                    <span className="font-mono font-bold text-sm text-charcoal-900">
                      {order.suborder_reference}
                    </span>
                    <span className="text-[11px] text-charcoal-400 block mt-0.5">
                      Received: {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'} {order.created_at ? `at ${new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isDelivered
                        ? 'bg-forest-100 text-forest-800'
                        : isCancelled
                        ? 'bg-red-100 text-red-700'
                        : 'bg-terracotta-100 text-terracotta-800'
                    }`}>
                      {order.status}
                    </span>

                    {customer?.payment_method && (
                      <span className="px-2.5 py-1 rounded-full bg-cream-200 text-charcoal-700 text-[10px] font-semibold uppercase">
                        {customer.payment_method} ({customer.payment_status})
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer & Address Details */}
                {customer && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-charcoal-700 bg-cream-50/70 p-4 rounded-2xl border border-cream-200">
                    <div>
                      <strong className="block text-charcoal-900 font-serif text-sm">Customer Details:</strong>
                      <p className="font-semibold text-charcoal-800 mt-0.5">{customer.customer_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3.5 h-3.5 text-forest-600" />
                        <a href={`tel:${customer.customer_phone}`} className="text-forest-700 font-bold hover:underline">
                          +91 {customer.customer_phone}
                        </a>
                        <a
                          href={`https://wa.me/91${customer.customer_phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-semibold"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>

                    <div>
                      <strong className="block text-charcoal-900 font-serif text-sm">Delivery Destination:</strong>
                      <div className="flex items-start gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{customer.delivery_address}</p>
                      </div>
                      {customer.delivery_instructions && (
                        <p className="text-[11px] text-charcoal-500 italic mt-1">
                          Note: "{customer.delivery_instructions}"
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Products in this suborder */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block mb-2">
                    Order Items:
                  </span>
                  <div className="divide-y divide-cream-100 text-xs">
                    {order.items?.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span className="font-bold text-charcoal-900 font-sans">
                          ₹{item.total_price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-cream-200 flex justify-between text-xs font-bold text-charcoal-800">
                    <span>Suborder Total (incl. delivery ₹{order.delivery_charge})</span>
                    <span className="text-base text-forest-700 font-sans">₹{order.suborder_total}</span>
                  </div>
                </div>

                {/* State Machine Status Actions */}
                {!isDelivered && !isCancelled && (
                  <div className="pt-3 border-t border-cream-200 space-y-3">
                    <span className="text-xs font-bold uppercase text-charcoal-500 block">
                      Update Order Status:
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {order.status === 'Order Placed' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'Accepted')}
                            className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-sm transition"
                          >
                            Accept Order
                          </button>
                          <button
                            type="button"
                            onClick={() => setRejectingId(order.id)}
                            className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-xs transition"
                          >
                            Reject Order
                          </button>
                        </>
                      )}

                      {order.status === 'Accepted' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                          className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-sm transition"
                        >
                          Start Preparing Batch
                        </button>
                      )}

                      {order.status === 'Preparing' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'Ready for Dispatch')}
                          className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-sm transition"
                        >
                          Mark Ready for Dispatch
                        </button>
                      )}

                      {order.status === 'Ready for Dispatch' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                          className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-sm transition"
                        >
                          Mark Out for Delivery
                        </button>
                      )}

                      {order.status === 'Out for Delivery' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                          className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-sm transition"
                        >
                          Mark as Delivered ✓
                        </button>
                      )}
                    </div>

                    {/* Rejection reason inline form */}
                    {rejectingId === order.id && (
                      <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-2 mt-2">
                        <label className="block text-xs font-bold text-red-800">
                          Reason for rejecting order (visible to customer):
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Out of seasonal raw mangoes today."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full bg-white border border-red-300 rounded-xl p-2.5 text-xs outline-none"
                        />
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setRejectingId(null)}
                            className="px-3 py-1.5 bg-white text-charcoal-600 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'Cancelled', rejectReason || 'Cancelled by maker')}
                            className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold"
                          >
                            Confirm Rejection
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-200 text-charcoal-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-charcoal-800">
            No Orders Received Yet
          </h3>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
            When customers place orders from your storefront, they will show up here for you to accept and dispatch.
          </p>
        </div>
      )}
    </div>
  );
};
