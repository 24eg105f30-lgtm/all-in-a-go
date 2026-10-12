import React from 'react';
import { Package, ShieldAlert, Truck, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroBanner({ onExplore, onOpenVivaGuide }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl border border-indigo-950">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-3 py-1 text-xs font-semibold text-indigo-300 mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>College Capstone Project: Multi-Inventory System</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 font-['Plus_Jakarta_Sans']">
          Smart Multi-Vendor Inventory with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-300">Automated Stock Alerts</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-normal">
          Designed specifically to manage decentralized warehouses across India. 
          When an order is placed, it automatically splits across vendors with distinct tracking codes, 
          while understocked variants trigger instant reorder alerts.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Low-Stock Warnings</h4>
            <p className="text-xs text-slate-400">
              Auto-flags inventory when physical count drops below safety buffer (<code className="text-amber-300 text-[11px]">qty &le; safety_stock</code>).
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-2">
              <Package className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Multi-Vendor Order Splits</h4>
            <p className="text-xs text-slate-400">
              Single customer cart seamlessly creates isolated <code className="text-indigo-300 text-[11px]">Order_Splits</code> per seller.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-2">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Live Parcel Tracking</h4>
            <p className="text-xs text-slate-400">
              Indian logistics tracking with status timelines: Confirmed, Packed, Shipped, Delivered.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onExplore}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition"
          >
            <span>Browse Products (₹100 - ₹2,000)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenVivaGuide}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-xl font-semibold text-sm border border-white/20 transition"
          >
            <span>View Architecture</span>
          </button>
        </div>
      </div>
    </div>
  );
}
