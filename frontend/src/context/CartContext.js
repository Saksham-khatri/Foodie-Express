import React, { useState, createContext, useEffect } from 'react';

// Context create kiya
export const CartContext = createContext();

// Provider banaya
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  //  First time load par localStorage se cart read karo
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  //  Jab bhi cartItems change ho, localStorage update karo
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart function (increase quantity if already exists)
  const addToCart = (item) => {
    const exists = cartItems.find((i) => i._id === item._id);
    if (exists) {
      setCartItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  };

  // Decrease quantity
  const decreaseQuantity = (idToDecrease) => {
    const exists = cartItems.find((i) => i._id === idToDecrease);
    if (exists) {
      if (exists.quantity === 1) {
        removeFromCart(idToDecrease);
      } else {
        setCartItems((prev) =>
          prev.map((i) =>
            i._id === idToDecrease ? { ...i, quantity: i.quantity - 1 } : i
          )
        );
      }
    }
  };

  // Clear cart (after placing order)
  const clearCart = () => {
    setCartItems([]);
  };

  // Remove item by _id
  const removeFromCart = (idToRemove) => {
    setCartItems((prev) =>
      prev.filter((item) => item._id !== idToRemove)
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, clearCart, removeFromCart, decreaseQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}
