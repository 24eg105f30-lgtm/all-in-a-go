import React, { useState, useEffect, useRef } from 'react';
import { api } from './services/api';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import PriceFilter from './components/PriceFilter';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import VendorPortal from './components/VendorPortal';
import VivaCheatSheetModal from './components/VivaCheatSheetModal';
import { Loader2, PackageX, Sparkles, Filter, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('storefront'); // 'storefront' | 'vendor'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeTrackingNumber, setActiveTrackingNumber] = useState('AG-V1-984210');
  const [isVivaGuideOpen, setIsVivaGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  const productSectionRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory,
        search: searchQuery,
        minPrice: 100,
        maxPrice: maxPrice
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'storefront') {
      fetchProducts();
    }
  }, [selectedCategory, maxPrice, searchQuery, activeTab]);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Navigation Header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => {
          setActiveTrackingNumber('AG-V1-984210');
          setIsTrackerOpen(true);
        }}
        onOpenVivaGuide={() => setIsVivaGuideOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'vendor' ? (
          <VendorPortal onOpenVivaGuide={() => setIsVivaGuideOpen(true)} />
        ) : (
          <>
            {/* Hero Section */}
            <HeroBanner 
              onExplore={scrollToProducts} 
              onOpenVivaGuide={() => setIsVivaGuideOpen(true)} 
            />

            {/* Catalog Browser Section */}
            <div ref={productSectionRef} className="space-y-6">
              
              {/* Category Pills Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Browse By College Categories</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    Showing {products.length} products
                  </span>
                </div>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              {/* Price Filter (Strictly ₹100 - ₹2,000) */}
              <PriceFilter
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />

              {/* Product Grid */}
              {loading ? (
                <div className="py-24 text-center">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-500">Loading catalog from Spring Boot API...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <PackageX className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">No products found</h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Try adjusting the price slider or clearing your search filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setMaxPrice(2000);
                      setSearchQuery('');
                    }}
                    className="bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((pDTO) => (
                    <ProductCard
                      key={pDTO.product.productId}
                      productDTO={pDTO}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-slate-900 text-base">All in a Go</span>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Java Spring Boot + React
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Multi-Inventory Management System with Low-Stock Early Warnings & Multi-Vendor Order Splitting.
              </p>
            </div>

            {/* Tech Stack Pills for College Examiner */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md">
                Java 21
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md">
                Spring Boot 3
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md">
                Hibernate / JPA
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md">
                H2 Database
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md">
                React 18 + Vite
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md">
                Tailwind CSS
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 All in a Go. Built for College Engineering Capstone & Viva.</p>
            <button
              onClick={() => setIsVivaGuideOpen(true)}
              className="text-indigo-600 hover:underline font-bold"
            >
              Open System Architecture & Specifications
            </button>
          </div>
        </div>
      </footer>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={(orderResp) => {
          setLastPlacedOrder(orderResp);
        }}
      />

      {/* Order Success Modal */}
      {lastPlacedOrder && (
        <OrderSuccessModal
          orderResponse={lastPlacedOrder}
          onClose={() => setLastPlacedOrder(null)}
          onTrackNumber={(num) => {
            setActiveTrackingNumber(num);
            setIsTrackerOpen(true);
          }}
        />
      )}

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialTrackingNumber={activeTrackingNumber}
      />

      {/* Product Specs Quick View Modal */}
      <ProductDetailModal
        productDTO={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Viva Cheat Sheet Modal */}
      <VivaCheatSheetModal
        isOpen={isVivaGuideOpen}
        onClose={() => setIsVivaGuideOpen(false)}
      />

    </div>
  );
}
