"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const storageKey = "warung-biru-cart";
const maxCartQuantity = 99;

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(savedCart)) setCart(savedCart);
    } catch {
      localStorage.removeItem(storageKey);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, ready]);

  const addToCart = useCallback(
    (product) => {
      const stock = Number(product.stock ?? product.quantity ?? 0);
      if (stock <= 0) return false;

      const existing = cart.find((item) => item.id === product.id);
      if (existing && existing.quantity >= maxCartQuantity) return false;

      setCart((current) => {
        const currentItem = current.find((item) => item.id === product.id);
        if (currentItem) {
          return current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...current, { ...product, stock, quantity: 1 }];
      });
      return true;
    },
    [cart]
  );

  const removeFromCart = useCallback((productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const nextQuantity = Math.min(
      maxCartQuantity,
      Math.max(0, Math.floor(Number(quantity) || 0))
    );
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== productId) return [item];
        if (nextQuantity === 0) return [];
        return [{ ...item, quantity: nextQuantity }];
      })
    );
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const value = useMemo(
    () => ({ cart, cartCount, addToCart, removeFromCart, updateQuantity }),
    [cart, cartCount, addToCart, removeFromCart, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart harus digunakan di dalam CartProvider.");
  return context;
}
