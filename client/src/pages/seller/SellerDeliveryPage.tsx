import React, { useEffect, useState } from 'react';
import { Truck, PlusCircle, Trash2, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SellerDeliveryArea } from '../../types';

export const SellerDeliveryPage: React.FC = () => {
  const { seller, refreshSellerProfile } = useAuth();
  const [areas, setAreas] = useState<SellerDeliveryArea[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [pinCode, setPinCode] = useState('');
  const [localityName, setLocalityName] = useState('');
  const [city, setCity] = useState(seller?.city || 'Bengaluru');
  const [deliveryCharge, setDeliveryCharge] = useState(String(seller?.default_delivery_charge || 40));

  // Global settings
  const [freeThreshold, setFreeThreshold] = useState(String(seller?.free_delivery_threshold || 500));
  const [estTime, setEstTime] = useState(seller?.estimated_delivery_time || '1-2 Days');
  const [pickup, setPickup] = useState(seller?.pickup_available || false);

  const [savingGlobal, setSavingGlobal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchAreas = () => {
    setLoading(true);
    api.getSellerDeliveryAreas()
      .then(res => {
        if (res.success) setAreas(res.data);
      })
      .catch(err => console.error('Failed to load delivery areas', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode || pinCode.length !== 6) {
      alert('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    try {
      const res = await api.addSellerDeliveryArea({
        pinCode: pinCode.trim(),
        localityName: localityName.trim(),
        city: city.trim(),
        deliveryCharge: parseFloat(deliveryCharge) || 40,
      });

      if (res.success) {
        setPinCode('');
        setLocalityName('');
        setMessage(`PIN ${res.data.pin_code} added to your delivery network!`);
        setTimeout(() => setMessage(null), 3000);
        fetchAreas();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add delivery area.');
    }
  };

  const handleRemoveArea = async (id: string, pin: string) => {
    if (!window.confirm(`Remove PIN code ${pin} from your delivery coverage?`)) return;

    try {
      const res = await api.deleteSellerDeliveryArea(id);
      if (res.success) {
        setAreas(prev => prev.filter(a => a.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to remove area.');
    }
  };

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGlobal(true);
    try {
      await api.updateSellerProfile({
        free_delivery_threshold: freeThreshold ? parseFloat(freeThreshold) : null,
        estimated_delivery_time: estTime,
        pickup_available: pickup,
      });
      await refreshSellerProfile();
      setMessage('Delivery preferences updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update preferences.');
    } finally {
      setSavingGlobal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#E8E1D3]">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Delivery Management & Serviceable PIN Codes
        </h1>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Customers can only order if their delivery PIN code is in your covered areas.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-forest-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Global Rules Config */}
      <form onSubmit={handleSaveGlobalSettings} className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-soft space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal-900 pb-2 border-b border-cream-200">
          General Delivery Guidelines
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Estimated Delivery Time
            </label>
            <input
              type="text"
              placeholder="e.g. 1-2 Days"
              value={estTime}
              onChange={(e) => setEstTime(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">
              Free Delivery Order Threshold (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={freeThreshold}
              onChange={(e) => setFreeThreshold(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-charcoal-800 font-semibold">
              <input
                type="checkbox"
                checked={pickup}
                onChange={(e) => setPickup(e.target.checked)}
                className="w-4 h-4 accent-forest-600 rounded"
              />
              <span>Enable Free Customer Pickup</span>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={savingGlobal}
            className="px-5 py-2.5 rounded-xl bg-forest-600 text-white font-semibold text-xs hover:bg-forest-700 transition"
          >
            {savingGlobal ? 'Saving...' : 'Save General Rules'}
          </button>
        </div>
      </form>

      {/* Add New PIN Code Area */}
      <form onSubmit={handleAddArea} className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-soft space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal-900 pb-2 border-b border-cream-200">
          Add Serviceable Delivery Area
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">PIN Code *</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. 560038"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Locality Name</label>
            <input
              type="text"
              placeholder="e.g. Indiranagar"
              value={localityName}
              onChange={(e) => setLocalityName(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">City *</label>
            <input
              type="text"
              required
              placeholder="e.g. Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-charcoal-500 mb-1">Delivery Fee (₹)</label>
            <input
              type="number"
              placeholder="40"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
              className="w-full bg-cream-100 border border-[#D6CCB8] rounded-xl p-3 text-xs outline-none focus:border-forest-600"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Delivery Area</span>
          </button>
        </div>
      </form>

      {/* Covered PIN Codes List */}
      <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-soft space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal-900">
          Currently Covered Delivery Areas ({areas.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-xs text-charcoal-400">Loading areas...</div>
        ) : areas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {areas.map((area) => (
              <div
                key={area.id}
                className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-charcoal-900 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>{area.pin_code}</span>
                  </div>
                  <span className="text-charcoal-500 text-[11px] block mt-0.5">
                    {area.locality_name || area.city} • ₹{area.delivery_charge || 40} fee
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveArea(area.id, area.pin_code)}
                  className="p-1.5 text-charcoal-400 hover:text-red-600 transition"
                  title="Remove PIN coverage"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-charcoal-400">
            No specific delivery PIN codes configured. Add the PIN codes where you can deliver fresh homemade orders.
          </div>
        )}
      </div>
    </div>
  );
};
