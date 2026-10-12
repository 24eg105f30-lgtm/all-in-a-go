import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, onOpenCheckout }) {
  const { cartItems, updateQuantity, removeFromCart, totalItemsCount, cartSubtotal, vendorBreakdown } = useCart();

  if (!isOpen) return null;

  const vendorCount = Object.keys(vendorBreakdown).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-black text-slate-900">Your Cart ({totalItemsCount})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                  Explore our curated Indian marketplace items ranging between ₹100 and ₹2,000.
                </p>
                <button
                  onClick={onClose}
                  className="bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Multi-Vendor Order Splitting Notice */}
                {vendorCount > 1 && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 text-xs text-indigo-900">
                    <div className="flex items-center gap-2 font-bold mb-1 text-indigo-700">
                      <Layers className="w-4 h-4" />
                      <span>Multi-Vendor Order Notice</span>
                    </div>
                    <p className="text-[11px] text-indigo-800 leading-relaxed">
                      Your cart includes items from <strong>{vendorCount} different vendors</strong>. 
                      Upon checkout, our system will automatically split this into <strong>{vendorCount} independent shipments</strong> with separate tracking numbers!
                    </p>
                  </div>
                )}

                {/* List of items */}
                {cartItems.map((item) => (
                  <div
                    key={item.variant.variantId}
                    className="flex gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-xl bg-white flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-indigo-600 block uppercase truncate">
                        {item.product.brand}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-800 font-mono mt-0.5">
                        ₹{item.variant.price?.toLocaleString('en-IN')} each
                      </p>

                      <div className="flex items-center justify-between mt-2.5">
                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.variant.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-lg transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variant.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-lg transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.variant.variantId)}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Vendor Splitting Preview Breakdown */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Vendor Fulfillment Breakdown ({vendorCount} Splits)
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(vendorBreakdown).map(([vId, vData]) => (
                      <div key={vId} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-slate-700">
                        <span className="truncate max-w-[200px] font-medium">{vData.vendorName}</span>
                        <span className="font-mono font-bold">₹{vData.subtotal?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Subtotal</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  ₹{cartSubtotal?.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>GST Compliant & Secured Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
