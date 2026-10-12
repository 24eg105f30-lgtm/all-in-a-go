import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  ShieldAlert, Package, Truck, Plus, RefreshCw, CheckCircle2, 
  AlertTriangle, ArrowUpRight, Warehouse, Save, Edit3, X, Loader2
} from 'lucide-react';

export default function VendorPortal({ onOpenVivaGuide }) {
  const { user, switchToDemoRole } = useAuth();
  const vendorId = user?.vendorId || 1;

  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [splits, setSplits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Editing state for inventory
  const [editingInvId, setEditingInvId] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [editSafety, setEditSafety] = useState('');

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('UrbanCraft');
  const [newCategory, setNewCategory] = useState('Home, Living & Lifestyle');
  const [newPrice, setNewPrice] = useState(499);
  const [newStock, setNewStock] = useState(20);
  const [newSafetyStock, setNewSafetyStock] = useState(5);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alertData, prodData, splitData] = await Promise.all([
        api.getLowStockAlerts(vendorId),
        api.getProducts({}),
        api.getVendorSplits(vendorId),
      ]);
      setAlerts(alertData);
      setProducts(prodData.filter(p => p.product.vendorId === vendorId));
      setSplits(splitData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vendorId]);

  const showNotification = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 4000);
  };

  // Quick Restock USP Action
  const handleQuickRestock = async (inventoryId, title) => {
    try {
      await api.quickRestock(inventoryId, 15);
      showNotification(`Restocked 15 units for "${title}". Warning resolved!`);
      fetchData();
    } catch (err) {
      alert('Failed to restock: ' + err.message);
    }
  };

  // Save manual inventory edit
  const handleSaveInventory = async (inventoryId) => {
    try {
      await api.updateInventory(inventoryId, Number(editQty), Number(editSafety));
      setEditingInvId(null);
      showNotification('Inventory stock updated successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to update inventory: ' + err.message);
    }
  };

  // Update order split shipping status
  const handleUpdateSplitStatus = async (splitId, newStatus) => {
    try {
      await api.updateSplitStatus(splitId, { shippingStatus: newStatus });
      showNotification(`Order split status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Add Product submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const sku = 'SKU-' + Date.now().toString().slice(-6);
      await api.createProduct({
        vendorId,
        title: newTitle,
        brand: newBrand,
        globalSku: 'GLB-' + sku,
        taxClass: 'GST_18',
        category: newCategory,
        description: `Premium high-durability ${newTitle} sourced for All in a Go marketplace.`,
        imageUrl: newImageUrl,
        vendorSku: sku,
        barcode: '890' + Math.floor(100000000 + Math.random() * 900000000),
        attributesJson: '{"color": "Classic", "grade": "A"}',
        price: Number(newPrice),
        initialStock: Number(newStock),
        safetyStock: Number(newSafetyStock),
        warehouseId: vendorId, // matches warehouse
      });

      setShowAddModal(false);
      setNewTitle('');
      showNotification('New product added with inventory tracking!');
      fetchData();
    } catch (err) {
      alert('Error creating product: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner & Vendor Selector */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
              Vendor Management Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">Vendor ID #{vendorId}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            {user?.vendorName || (vendorId === 1 ? 'Apex Lifestyle & Home' : vendorId === 2 ? 'Urban Trendz Fashion' : 'NextGen Tech & Hobbies')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor real-time warehouse inventory, manage low-stock thresholds, and fulfill orders.
          </p>
        </div>

        {/* Fast Switcher between Vendors for Viva */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">Switch Seller:</span>
          {[
            { id: 1, label: 'Apex (Home)', role: 'VENDOR' },
            { id: 2, label: 'Urban Trendz (Fashion)', role: 'VENDOR' },
            { id: 3, label: 'NextGen (Tech)', role: 'VENDOR_2' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => switchToDemoRole(v.role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                vendorId === v.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {v.label}
            </button>
          ))}
          <button
            onClick={fetchData}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Refresh vendor data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Action Feedback Notification */}
      {actionMsg && (
        <div className="bg-emerald-600 text-white text-xs font-bold p-3.5 rounded-2xl shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg('')} className="text-white/80 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Low-Stock Warnings Alert Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Low-Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-amber-950 font-mono">
            {alerts.length}
          </span>
          <p className="text-[11px] text-amber-700 mt-1">
            {alerts.length > 0 ? 'Action required: Understock buffer breached' : 'All SKUs above safety stock'}
          </p>
        </div>

        {/* KPI 2: Products Count */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Catalog Items
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 font-mono">
            {products.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Active Indian catalog listings</p>
        </div>

        {/* KPI 3: Total Stock Units */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Stock on Hand
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Warehouse className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 font-mono">
            {products.reduce((acc, p) => acc + (p.totalStock || 0), 0)}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Units stored across regional hubs</p>
        </div>

        {/* KPI 4: Pending Splits */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assigned Order Splits
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 font-mono">
            {splits.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Customer shipments to fulfill</p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 🔴 SECTION 1: LOW-STOCK WARNING ALERT CENTER (COLLEGE USP)     */}
      {/* ============================================================== */}
      <div className="bg-white border border-amber-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <span>Low-Stock Warning Center</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  College USP Feature
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Triggered automatically when <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-700 text-[11px]">qty_on_hand &le; safety_stock</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              {alerts.length} Critical SKU{alerts.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-emerald-900">Inventory Levels Healthy</h4>
            <p className="text-xs text-emerald-700 mt-1">
              All product variants for this vendor maintain quantities above their safety stock threshold.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-amber-100">
                <tr>
                  <th className="py-3 px-4">Product & SKU</th>
                  <th className="py-3 px-4">Warehouse Location</th>
                  <th className="py-3 px-4 text-center">Current Stock</th>
                  <th className="py-3 px-4 text-center">Safety Buffer</th>
                  <th className="py-3 px-4 text-center">Shortfall</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Instant Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alerts.map((alert) => (
                  <tr key={alert.inventoryId} className="hover:bg-amber-50/30 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{alert.productTitle}</p>
                      <p className="text-[11px] font-mono text-slate-500">SKU: {alert.vendorSku}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {alert.warehouseLocation}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-red-600">
                      {alert.qtyOnHand} units
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                      {alert.safetyStock} units
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-700">
                      -{alert.shortfall} units
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-red-100 text-red-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {alert.severity === 'CRITICAL_OUT_OF_STOCK' ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleQuickRestock(alert.inventoryId, alert.productTitle)}
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-xl shadow-sm transition inline-flex items-center gap-1"
                        title="Calls /api/inventory/{id}/restock to replenish stock"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Quick Restock (+15)</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 📦 SECTION 2: VENDOR INVENTORY MANAGEMENT TABLE                */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-['Plus_Jakarta_Sans']">
              Warehouse Inventory & Safety Buffers
            </h2>
            <p className="text-xs text-slate-500">
              Manage physical stock and adjust safety buffer thresholds to calibrate automated warnings.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product Listing</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4 text-center">Physical Stock</th>
                <th className="py-3 px-4 text-center">Safety Threshold</th>
                <th className="py-3 px-4 text-center">Stock State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((pDTO) => {
                const p = pDTO.product;
                const vDetail = pDTO.variants?.[0] || {};
                const variant = vDetail.variant || {};
                const isEditing = editingInvId === variant.variantId;

                return (
                  <tr key={p.productId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{p.title}</p>
                          <p className="text-[11px] text-slate-500">{p.brand} • SKU: {variant.vendorSku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {p.category.split(',')[0]}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{variant.price?.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editQty}
                          onChange={(e) => setEditQty(e.target.value)}
                          className="w-16 p-1 border border-indigo-400 rounded text-center text-xs font-mono"
                        />
                      ) : (
                        <span className="font-mono font-bold text-slate-800">
                          {vDetail.qtyOnHand} units
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editSafety}
                          onChange={(e) => setEditSafety(e.target.value)}
                          className="w-16 p-1 border border-indigo-400 rounded text-center text-xs font-mono"
                        />
                      ) : (
                        <span className="font-mono text-slate-600">
                          {vDetail.safetyStock} units
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {vDetail.isLowStock ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Understocked
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Adequate
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveInventory(variant.variantId)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-lg"
                            title="Save changes"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingInvId(null)}
                            className="bg-slate-200 text-slate-600 p-1.5 rounded-lg"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingInvId(variant.variantId);
                            setEditQty(vDetail.qtyOnHand);
                            setEditSafety(vDetail.safetyStock);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-lg hover:bg-indigo-50 transition"
                          title="Edit Stock or Safety Threshold"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 🚚 SECTION 3: ORDER SPLITS FULFILLMENT TABLE                   */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            Vendor Order Splits & Fulfillment
          </h2>
          <p className="text-xs text-slate-500">
            Fulfill and update live parcel tracking numbers for shipments assigned to your store.
          </p>
        </div>

        {splits.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No order splits assigned yet. Place an order from the Storefront to see multi-vendor partitioning in action!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Split ID</th>
                  <th className="py-3 px-4">Parent Order</th>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Carrier</th>
                  <th className="py-3 px-4">Subtotal</th>
                  <th className="py-3 px-4">Shipping Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {splits.map((split) => (
                  <tr key={split.splitId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      #{split.splitId}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      Order #{split.parentOrderId}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {split.trackingNumber}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {split.carrier}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{split.subtotal?.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        split.shippingStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : split.shippingStatus === 'SHIPPED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : split.shippingStatus === 'PACKED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {split.shippingStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={split.shippingStatus}
                        onChange={(e) => handleUpdateSplitStatus(split.splitId, e.target.value)}
                        className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:border-indigo-500 outline-none"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD PRODUCT LISTING                                     */}
      {/* ============================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add New Marketplace Product</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Ergonomic Wooden Study Desk Organizer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">College Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Home, Living & Lifestyle">Home, Living & Lifestyle</option>
                    <option value="Apparel, Fashion & Accessories">Apparel, Fashion & Accessories</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Hobbies, Toys & Entertainment">Hobbies, Toys & Entertainment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹100-₹2000)</label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="1"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Safety Buffer</label>
                  <input
                    type="number"
                    min="1"
                    value={newSafetyStock}
                    onChange={(e) => setNewSafetyStock(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Save & Publish Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
