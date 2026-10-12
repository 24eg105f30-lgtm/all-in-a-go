import React, { useState } from 'react';
import { X, GraduationCap, Database, Code, CheckCircle, ShieldAlert, Layers, HelpCircle, Copy, Check } from 'lucide-react';

export default function VivaCheatSheetModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const copyAnswer = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const vivaQuestions = [
    {
      q: "1. What is the architecture of 'All in a Go'?",
      a: "Our project uses a modern 3-Tier Layered Architecture: Frontend (React.js + Tailwind CSS with Vite), Backend RESTful API (Java 21 with Spring Boot 3), and Database Layer (Spring Data JPA / Hibernate with H2 for local testing and PostgreSQL for production). Communication happens asynchronously over JSON via HTTP/REST."
    },
    {
      q: "2. How does the Multi-Vendor Order Splitting (Order_Splits) feature work?",
      a: "When a customer adds products from different sellers into one cart and checks out, OrderService receives the cart, groups the items by vendorId, creates a single Parent Order (orders table), and creates distinct OrderSplit records (order_splits table)—one per vendor. Each split is assigned an independent tracking number (e.g. AG-V1-984210) so sellers fulfill their own packages independently."
    },
    {
      q: "3. What is the Unique Selling Proposition (USP) of your inventory system?",
      a: "Our USP is the automated Low-Stock Warning System. In the inventory_levels table, each SKU has a safety_stock buffer. The backend continuously evaluates: if (qty_on_hand <= safety_stock), an alert flag is triggered. In the Vendor Portal, sellers receive real-time warning badges with shortfall units and a 1-click Quick Restock capability."
    },
    {
      q: "4. Explain the difference between qty_on_hand, qty_reserved, and qty_allocated.",
      a: "• qty_on_hand: Physical units present on warehouse shelves.\n• qty_reserved: Units temporarily held while customer is in active checkout.\n• qty_allocated: Units committed to confirmed orders awaiting packaging & dispatch.\nAvailable to Sell (ATS) = qty_on_hand - (qty_reserved + qty_allocated)."
    },
    {
      q: "5. Why did you use Spring Boot instead of plain Java Servlets or JSP?",
      a: "Spring Boot eliminates boilerplate XML configuration, provides an embedded Tomcat server, has built-in Spring Data JPA for automatic CRUD operations without writing manual SQL, and facilitates clean separation of concerns using MVC (@RestController, @Service, @Repository)."
    },
    {
      q: "6. How do you deploy Frontend to Vercel and Backend to Render?",
      a: "The frontend is a static single-page application built with Vite (`npm run build`), which deploys natively to Vercel's global CDN. The backend is packaged into an executable JAR via Maven (`./mvnw clean package`) and deployed as a web service on Render with Java 21 environment variables."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <GraduationCap className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-black font-['Plus_Jakarta_Sans']">
                System Architecture & Specifications
              </h2>
              <p className="text-xs text-indigo-200">
                Project: All in a Go — Multi-Inventory Management System
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 text-xs font-bold">
          {[
            { id: 'overview', label: 'Architecture & USP' },
            { id: 'database', label: 'Database Schema (6 Tables)' },
            { id: 'viva_qa', label: 'Q&A' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-3 transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <h3 className="font-bold text-indigo-900 text-sm mb-1 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>3-Tier Software Architecture</span>
                </h3>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>1. Presentation Tier (Frontend):</strong> React 18 SPA styled with Tailwind CSS, utilizing Vite for fast bundling and hosted on <strong>Vercel</strong>.<br/>
                  <strong>2. Business Logic Tier (Backend):</strong> Java 21 REST API built using Spring Boot 3, structured via Controller &rarr; Service &rarr; Repository design pattern.<br/>
                  <strong>3. Data Tier (Database):</strong> H2 In-Memory DB for local zero-setup execution, auto-configurable with PostgreSQL when deployed on <strong>Render</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>USP 1: Low-Stock Warnings</span>
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Evaluated algorithmically in <code className="text-amber-800 font-bold">InventoryService.java</code>:
                    whenever physical stock drops to or below the safety threshold:
                    <br/>
                    <code className="block mt-1 bg-white p-1.5 rounded border border-amber-200 font-mono text-[10px] text-amber-900">
                      if (qty_on_hand &le; safety_stock) &rarr; Warning Flagged
                    </code>
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <h4 className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>USP 2: Multi-Vendor Order Splits</span>
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    A single customer checkout is automatically partitioned into independent <code className="text-emerald-800 font-bold">order_splits</code> by seller. 
                    Vendors only see and fulfill their own parcel split with dedicated tracking IDs.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="font-bold text-slate-900 mb-2">College Category Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>• <strong>Home, Living & Lifestyle</strong> (Rugs, Pots, Vases, Planters)</div>
                  <div>• <strong>Apparel & Fashion</strong> (T-Shirts, Jeans, Shoes, Watches)</div>
                  <div>• <strong>Electronics & Gadgets</strong> (Headphones, Speakers, Power Banks)</div>
                  <div>• <strong>Hobbies & Entertainment</strong> (Board Games, Dumbbells, Guitars)</div>
                </div>
                <div className="mt-2 text-indigo-700 font-bold font-mono">
                  Pricing range: Strictly ₹100 to ₹2,000 INR
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <p className="text-slate-500 text-[11px]">
                The project implements the 6 mandatory database tables specified in your college prompt:
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    name: 'Vendors',
                    keys: 'PK: vendor_id',
                    cols: 'name, status, commission_rate, api_key_hash, email, password'
                  },
                  {
                    name: 'Warehouses',
                    keys: 'PK: warehouse_id | FK: vendor_id',
                    cols: 'location_name, address, is_marketplace_owned'
                  },
                  {
                    name: 'Products',
                    keys: 'PK: product_id | FK: vendor_id',
                    cols: 'title, brand, global_sku, tax_class, category, description, image_url'
                  },
                  {
                    name: 'Product_Variants',
                    keys: 'PK: variant_id | FK: product_id',
                    cols: 'vendor_sku, barcode, attributes_json, price (₹100 - ₹2,000)'
                  },
                  {
                    name: 'Inventory_Levels',
                    keys: 'PK: inventory_id | FK: variant_id, warehouse_id',
                    cols: 'qty_on_hand, qty_reserved, qty_allocated, safety_stock'
                  },
                  {
                    name: 'Order_Splits',
                    keys: 'PK: split_id | FK: parent_order_id, vendor_id',
                    cols: 'subtotal, shipping_status, tracking_number, carrier, estimated_delivery'
                  },
                ].map((t) => (
                  <div key={t.name} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-indigo-700 text-xs">TABLE: {t.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">{t.keys}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono">
                      Fields: {t.cols}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'viva_qa' && (
            <div className="space-y-4">
              <p className="text-slate-500 text-[11px]">
                Frequently Asked Technical Questions & Answers about the system:
              </p>

              <div className="space-y-3">
                {vivaQuestions.map((qa, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 text-xs">{qa.q}</h4>
                      <button
                        onClick={() => copyAnswer(qa.a, idx)}
                        className="text-slate-400 hover:text-indigo-600 p-1 rounded transition"
                        title="Copy answer"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-slate-100 font-sans">
                      {qa.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Architecture Note: Built with Spring Boot Inversion of Control (IoC) & Dependency Injection.</span>
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white font-bold px-4 py-1.5 rounded-xl text-xs hover:bg-indigo-700 transition"
          >
            Got It!
          </button>
        </div>

      </div>
    </div>
  );
}
