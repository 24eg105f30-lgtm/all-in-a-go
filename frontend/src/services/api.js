const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    return res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  // Inventory & Low-Stock Alerts (USP)
  async getLowStockAlerts(vendorId = null) {
    const url = vendorId 
      ? `${API_BASE}/inventory/low-stock-alerts?vendorId=${vendorId}` 
      : `${API_BASE}/inventory/low-stock-alerts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch low stock alerts');
    return res.json();
  },

  async updateInventory(inventoryId, qtyOnHand, safetyStock) {
    const res = await fetch(`${API_BASE}/inventory/${inventoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qtyOnHand, safetyStock }),
    });
    if (!res.ok) throw new Error('Failed to update inventory');
    return res.json();
  },

  async quickRestock(inventoryId, units = 15) {
    const res = await fetch(`${API_BASE}/inventory/${inventoryId}/restock?units=${units}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to restock item');
    return res.json();
  },

  // Orders & Multi-Vendor Splitting
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },

  async getCustomerOrders(customerId) {
    const res = await fetch(`${API_BASE}/orders/customer/${customerId}`);
    if (!res.ok) throw new Error('Failed to fetch customer orders');
    return res.json();
  },

  async getVendorSplits(vendorId) {
    const res = await fetch(`${API_BASE}/orders/vendor/${vendorId}/splits`);
    if (!res.ok) throw new Error('Failed to fetch vendor splits');
    return res.json();
  },

  // Live Order Tracking (USP)
  async trackOrder(trackingNumber) {
    const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(trackingNumber)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Tracking number not found');
    }
    return res.json();
  },

  async updateSplitStatus(splitId, statusData) {
    const res = await fetch(`${API_BASE}/orders/splits/${splitId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData),
    });
    if (!res.ok) throw new Error('Failed to update split status');
    return res.json();
  },

  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid credentials');
    }
    return res.json();
  },

  async register(registerData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getWarehouses() {
    const res = await fetch(`${API_BASE}/warehouses`);
    if (!res.ok) throw new Error('Failed to fetch warehouses');
    return res.json();
  },

  async getVendors() {
    const res = await fetch(`${API_BASE}/vendors`);
    if (!res.ok) throw new Error('Failed to fetch vendors');
    return res.json();
  }
};
