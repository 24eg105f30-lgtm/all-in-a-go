import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { X, CheckCircle, Shield, Truck, AlertCircle, Loader2 } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const { user } = useAuth();
  const { cartItems, cartSubtotal, clearCart, vendorBreakdown } = useCart();

  const [customerName, setCustomerName] = useState(user?.name || 'Rahul Sharma');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'customer@allinago.com');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Sunrise Residency, Powai, Mumbai - 400076');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setError('Please provide a complete shipping address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        customerId: user?.userId || 1,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        shippingAddress: shippingAddress.trim(),
        items: cartItems.map(item => ({
          variantId: item.variant.variantId,
          quantity: item.quantity
        }))
      };

      const response = await api.createOrder(orderPayload);
      clearCart();
      onClose();
      onOrderPlaced(response);
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const vendorCount = Object.keys(vendorBreakdown).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Complete Your Order</h2>
            <p className="text-xs text-slate-500">Shipping across India (₹100 - ₹2,000 catalog)</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Multi-Vendor Order Splitting Reminder */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs">
            <span className="font-bold text-slate-800 block mb-1">
              📦 Order Partitioning Notice:
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              This single purchase will be partitioned into <strong>{vendorCount} Order_Splits</strong> in the database. 
              Each vendor will fulfill their portion independently with separate tracking numbers!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Recipient Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address (India)</label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:border-indigo-500 outline-none"
              placeholder="Flat/House No., Street, Landmark, City, State, PIN"
            />
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'UPI', label: 'UPI / QR', desc: 'GPay, PhonePe' },
                { id: 'CARD', label: 'Cards', desc: 'Debit / Credit' },
                { id: 'COD', label: 'Cash on Delivery', desc: 'Pay at door' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPaymentMode(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    paymentMode === m.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <p className="text-xs">{m.label}</p>
                  <p className="text-[10px] text-slate-400 font-normal">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Total & Checkout Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Grand Total</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                ₹{cartSubtotal?.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-200 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Splits...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Order (₹{cartSubtotal?.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
