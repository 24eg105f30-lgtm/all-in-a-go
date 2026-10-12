import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, Search, Truck, ShieldAlert, User, LogOut, 
  Store, GraduationCap, ChevronDown, CheckCircle2, Package
} from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  onOpenCart, 
  onOpenTracker, 
  onOpenVivaGuide, 
  activeTab, 
  setActiveTab 
}) {
  const { user, logout, switchToDemoRole } = useAuth();
  const { totalItemsCount } = useCart();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top micro banner for College Viva */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-900/60 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase">Multi-Inventory Platform</span>
            <span>All in a Go — Multi-Vendor Inventory & Real-Time Tracking System</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('storefront')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Package className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
                All in a Go
              </span>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                Inventory
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Multi-Vendor Marketplace</p>
          </div>
        </div>

        {/* Global Search Bar (when in storefront mode) */}
        {activeTab === 'storefront' && (
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rugs, denim, headphones, guitars (₹100 - ₹2,000)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-indigo-400 rounded-xl pl-10 pr-4 py-2 text-sm transition outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* View Switcher: Storefront vs Vendor Portal */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('storefront')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'storefront'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('vendor');
              if (user?.role !== 'VENDOR') {
                switchToDemoRole('VENDOR');
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'vendor'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Vendor Portal</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Order Tracking Button */}
          <button
            onClick={onOpenTracker}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition"
            title="Track any package by tracking number"
          >
            <Truck className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Track Order</span>
          </button>

          {/* Cart Button */}
          {activeTab === 'storefront' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalItemsCount}
                </span>
              )}
            </button>
          )}

          {/* User & Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium transition"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-[11px] font-semibold text-slate-900 truncate max-w-[120px]">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-[9px] text-slate-500 font-mono uppercase">
                  {user?.role || 'CUSTOMER'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-slate-500 text-[11px]">{user?.email}</p>
                  <span className="inline-block mt-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    Role: {user?.role}
                  </span>
                </div>

                <div className="px-4 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Viva Examiner: Switch Demo Account
                </div>

                <button
                  onClick={() => {
                    switchToDemoRole('CUSTOMER');
                    setActiveTab('storefront');
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">Rahul Sharma</p>
                    <p className="text-[11px] text-slate-500">Customer (Browse & Checkout)</p>
                  </div>
                  {user?.role === 'CUSTOMER' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  onClick={() => {
                    switchToDemoRole('VENDOR');
                    setActiveTab('vendor');
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">Apex Lifestyle & Home</p>
                    <p className="text-[11px] text-slate-500">Vendor 1 (Low Stock Alerts)</p>
                  </div>
                  {user?.vendorId === 1 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  onClick={() => {
                    switchToDemoRole('VENDOR_2');
                    setActiveTab('vendor');
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800">NextGen Tech & Hobbies</p>
                    <p className="text-[11px] text-slate-500">Vendor 3 (Fulfillment & Restock)</p>
                  </div>
                  {user?.vendorId === 3 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>

                <div className="border-t border-slate-100 mt-2 pt-2 px-2">
                  <button
                    onClick={() => {
                      logout();
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
