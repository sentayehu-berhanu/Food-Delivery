import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('foodgo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('foodgo_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => {
      // Check if exact same item exists (same id, size, toppings, sauce)
      const existingIndex = prev.findIndex(i => 
        i.foodId === item.foodId && 
        JSON.stringify(i.size) === JSON.stringify(item.size) &&
        JSON.stringify(i.toppings) === JSON.stringify(item.toppings) &&
        JSON.stringify(i.sauce) === JSON.stringify(item.sauce) &&
        i.instructions === item.instructions
      );

      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += item.quantity;
        newCart[existingIndex].totalPrice += item.totalPrice;
        return newCart;
      }
      
      // Give item a unique id in the cart based on timestamp
      return [...prev, { ...item, cartId: Date.now().toString() }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        // Recalculate price
        const basePrice = item.size ? item.size.price : item.basePrice;
        const toppingsPrice = item.toppings.reduce((sum, top) => sum + top.price, 0);
        const newTotal = (basePrice + toppingsPrice) * newQuantity;
        
        return { ...item, quantity: newQuantity, totalPrice: newTotal };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal > 0 ? 3.00 : 0;
  const serviceFee = subtotal > 0 ? 2.00 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + deliveryFee + serviceFee + tax;
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      deliveryFee,
      serviceFee,
      tax,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
