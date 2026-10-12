import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, AlertTriangle, CheckCircle, MapPin, Eye } from 'lucide-react';

export default function ProductCard({ productDTO, onQuickView }) {
  const { addToCart } = useCart();
  const product = productDTO.product;
  const variants = productDTO.variants || [];
  
  // Active selected variant
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const activeVariantDetail = variants[selectedVariantIndex] || {};
  const activeVariant = activeVariantDetail.variant || {};
  const isLowStock = activeVariantDetail.isLowStock;
  const qtyOnHand = activeVariantDetail.qtyOnHand ?? 0;
  const isOutOfStock = qtyOnHand === 0;

  const [addedAnim, setAddedAnim] = useState(false);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, activeVariant, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.category.split(',')[0]}
          </span>
        </div>

        {/* USP Stock Warning Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              Low Stock: Only {qtyOnHand} left!
            </span>
          ) : (
            <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {qtyOnHand} in stock
            </span>
          )}
        </div>

        {/* Quick View Floating Button */}
        <button
          onClick={() => onQuickView(productDTO)}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
          title="Quick view product specs & warehouse"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Vendor Attribution */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
            <span className="text-indigo-600 font-bold uppercase tracking-wider">{product.brand}</span>
            <span className="truncate max-w-[140px] text-slate-400">by {productDTO.vendorName}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Warehouse fulfillment note */}
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <MapPin className="w-3 h-3 text-indigo-500 flex-shrink-0" />
            <span className="truncate">Ships from: {activeVariantDetail.warehouseName || 'Primary Hub'}</span>
          </div>

          {/* Variant Selector (if multiple variants) */}
          {variants.length > 1 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {variants.map((vDet, idx) => (
                <button
                  key={vDet.variant.variantId}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition ${
                    selectedVariantIndex === idx
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Variant {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing and Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Indian Price</span>
            <span className="text-lg font-black text-slate-900 font-mono">
              ₹{activeVariant.price?.toLocaleString('en-IN') || '---'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : addedAnim
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-indigo-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : addedAnim ? 'Added!' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
