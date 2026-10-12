import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  X, Truck, Search, CheckCircle2, Circle, Clock, 
  MapPin, Package, Building2, AlertCircle, Loader2 
} from 'lucide-react';

export default function OrderTrackerModal({ isOpen, onClose, initialTrackingNumber }) {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || 'AG-V1-984210');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTrackingNumber) {
      setTrackingNumber(initialTrackingNumber);
      handleTrack(initialTrackingNumber);
    } else if (isOpen) {
      handleTrack(trackingNumber);
    }
  }, [isOpen, initialTrackingNumber]);

  const handleTrack = async (numToTrack) => {
    const num = (numToTrack || trackingNumber).trim();
    if (!num) return;

    setLoading(true);
    setError('');
    try {
      const data = await api.trackOrder(num);
      setTrackingData(data);
    } catch (err) {
      setError(err.message || 'Tracking number not found');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-['Plus_Jakarta_Sans']">
                Live Order Tracking
              </h2>
              <p className="text-xs text-slate-500">Real-Time Multi-Vendor Logistics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Tracking Number (e.g. AG-V1-984210)..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono font-medium focus:border-indigo-500 outline-none shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Track</span>
            </button>
          </form>

          {/* Quick Demo tracking shortcuts */}
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
            <span>Quick Demo:</span>
            <button 
              type="button"
              onClick={() => {
                setTrackingNumber('AG-V1-984210');
                handleTrack('AG-V1-984210');
              }}
              className="text-indigo-600 hover:underline font-mono font-bold"
            >
              AG-V1-984210 (Shipped)
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => {
                setTrackingNumber('AG-V2-883194');
                handleTrack('AG-V2-883194');
              }}
              className="text-indigo-600 hover:underline font-mono font-bold"
            >
              AG-V2-883194 (Packed)
            </button>
          </div>
        </div>

        {/* Tracking Details View */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold">Tracking Error</p>
                <p className="text-[11px] text-red-600">{error}</p>
              </div>
            </div>
          )}

          {trackingData && (
            <>
              {/* Parcel Summary Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                      Tracking Number
                    </span>
                    <span className="text-base font-black font-mono tracking-wide">
                      {trackingData.trackingNumber}
                    </span>
                  </div>
                  <span className="bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {trackingData.shippingStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-white/10">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Carrier</span>
                    <span className="font-bold">{trackingData.carrier}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Est. Delivery</span>
                    <span className="font-bold text-emerald-300">{trackingData.estimatedDelivery}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Vendor</span>
                    <span className="font-bold truncate block">{trackingData.vendorName}</span>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Shipment Status Timeline
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {trackingData.timelineSteps?.map((step, idx) => (
                    <div key={step.status} className="relative flex items-start gap-3">
                      <div className={`absolute -left-6 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-50' 
                          : 'bg-white border-2 border-slate-300 text-slate-300'
                      }`}>
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Circle className="w-3 h-3" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${
                            step.current ? 'text-indigo-600 font-black' : step.completed ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {step.status.replace(/_/g, ' ')}
                          </p>
                          {step.current && (
                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              Active Stage
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {step.status === 'CONFIRMED' && 'Order received and inventory allocated from warehouse'}
                          {step.status === 'PACKED' && 'Package inspected and boxed at vendor warehouse'}
                          {step.status === 'SHIPPED' && `Handed over to ${trackingData.carrier} fulfillment hub`}
                          {step.status === 'OUT_FOR_DELIVERY' && 'Courier out for final mile delivery'}
                          {step.status === 'DELIVERED' && 'Delivered to recipient address'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contents of this Split */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-indigo-600" />
                  <span>Items In This Parcel Split</span>
                </h4>
                <div className="space-y-2">
                  {trackingData.items?.map((item) => (
                    <div key={item.itemId} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-800">{item.productTitle}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity} • {item.variantDetails}</p>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{item.totalPrice?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span className="truncate">Destination: {trackingData.shippingAddress}</span>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
