import React from 'react';
import { IndianRupee } from 'lucide-react';

export default function PriceFilter({ maxPrice, setMaxPrice }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <IndianRupee className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-900 block">Indian Pricing Filter</span>
          <span className="text-[11px] text-slate-500 font-medium">College Range: ₹100 – ₹2,000</span>
        </div>
      </div>

      {/* Preset pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {[
          { label: 'All (₹2,000)', val: 2000 },
          { label: 'Under ₹500', val: 500 },
          { label: 'Under ₹1,000', val: 1000 },
          { label: 'Under ₹1,500', val: 1500 },
        ].map((btn) => (
          <button
            key={btn.val}
            onClick={() => setMaxPrice(btn.val)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              maxPrice === btn.val
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Range Slider */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <span className="text-xs font-semibold text-slate-400">₹100</span>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
        />
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 whitespace-nowrap">
          Max: ₹{maxPrice}
        </span>
      </div>
    </div>
  );
}
