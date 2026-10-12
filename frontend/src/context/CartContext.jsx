import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('allinago_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('allinago_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.variant.variantId === variant.variantId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          product,
          variant,
          quantity
        }];
      }
    });
  };

  const updateQuantity = (variantId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.variant.variantId === variantId ? { ...item, quantity: newQty } : item
    ));
  };

  const removeFromCart = (variantId) => {
    setCartItems(prev => prev.filter(item => item.variant.variantId !== variantId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.variant.price * item.quantity), 0);

  // Group items by vendor to preview multi-vendor order splits before placing!
  const vendorBreakdown = cartItems.reduce((acc, item) => {
    const vendorId = item.product.vendorId;
    if (!acc[vendorId]) {
      acc[vendorId] = {
        vendorName: item.product.vendorName || `Vendor #${vendorId}`,
        items: [],
        subtotal: 0
      };
    }
    acc[vendorId].items.push(item);
    acc[vendorId].subtotal += item.variant.price * item.quantity;
    return acc;
  }, {});

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItemsCount,
      cartSubtotal,
      vendorBreakdown
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
