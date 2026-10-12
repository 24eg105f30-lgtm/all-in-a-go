import React from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, ShieldCheck, MapPin, Tag, Barcode, Box } from 'lucide-react';

export default function ProductDetailModal({ productDTO, onClose }) {
  const { addToCart } = useCart();
  if (!productDTO) return null;

  const product = productDTO.product;
  const variantDetail = productDTO.variants?.[0] || {};
  const variant = variantDetail.variant || {};
  const isOutOfStock = (variantDetail.qtyOnHand ?? 0) === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="relative aspect-video sm:aspect-[21/9] overflow-hidden bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-sm transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span className="text-indigo-600 font-bold uppercase">{product.brand}</span>
            <span>Vendor: <strong className="text-slate-800">{productDTO.vendorName}</strong></span>
          </div>

          <h2 className="text-xl font-black text-slate-900 mb-2 font-['Plus_Jakarta_Sans']">
            {product.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* College Database Specs Grid */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-indigo-600" />
              <span>Database Schema Attributes</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Global SKU</span>
                <span className="font-mono font-bold text-slate-800">{product.globalSku}</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Vendor SKU</span>
                <span className="font-mono font-bold text-slate-800">{variant.vendorSku}</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Barcode</span>
                <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                  <Barcode className="w-3 h-3 text-slate-400" />
                  {variant.barcode}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Tax Class</span>
                <span className="font-bold text-slate-800">{product.taxClass}</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Warehouse Hub</span>
                <span className="font-bold text-slate-800 truncate block">
                  {variantDetail.warehouseName || 'Mumbai Central Hub'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Safety Stock Buffer</span>
                <span className="font-bold text-indigo-700">{variantDetail.safetyStock} units</span>
              </div>
            </div>

            {variant.attributesJson && (
              <div className="mt-3 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Attributes JSON</span>
                <code className="text-xs text-indigo-700 font-mono">{variant.attributesJson}</code>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-bold block uppercase">Indian Price</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                ₹{variant.price?.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Close
              </button>

              <button
                onClick={() => {
                  addToCart(product, variant, 1);
                  onClose();
                }}
                disabled={isOutOfStock}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
