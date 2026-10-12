import React from 'react';
import { CheckCircle2, Truck, ExternalLink, Package, ArrowRight, X } from 'lucide-react';

export default function OrderSuccessModal({ orderResponse, onClose, onTrackNumber }) {
  if (!orderResponse) return null;

  const { order, splits = [], items = [] } = orderResponse;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Success Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-8 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-black mb-1 font-['Plus_Jakarta_Sans']">
            Order Placed Successfully!
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm">
            Parent Order #{order.parentOrderId} • Total: ₹{order.totalAmount?.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Multi-Vendor Splits Details */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 text-xs text-emerald-950">
            <span className="font-bold block mb-1">🎉 Multi-Vendor Fulfillment Activated:</span>
            <p className="text-[11px] text-emerald-800">
              Your cart has been split into <strong>{splits.length} separate vendor fulfillment shipments</strong>. 
              Each vendor has been notified and issued a dedicated tracking number!
            </p>
          </div>

          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Generated Order Splits ({splits.length})
          </h4>

          <div className="space-y-3">
            {splits.map((split, idx) => (
              <div 
                key={split.splitId}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      Split #{split.splitId} (Vendor #{split.vendorId})
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      ₹{split.subtotal?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                    <Package className="w-3.5 h-3.5 text-indigo-600" />
                    Tracking: <span className="text-indigo-600">{split.trackingNumber}</span>
                  </p>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Carrier: {split.carrier} • Est. Delivery: {split.estimatedDelivery}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onTrackNumber(split.trackingNumber);
                  }}
                  className="flex items-center justify-center gap-1.5 bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Parcel</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}
