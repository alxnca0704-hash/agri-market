"use client";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Item } from "./catalog";
import {
  cartReducer,
  getCartItemCount,
  getCartTotal,
  type CartLineItem,
} from "./cart-core";

interface CartContextValue {
  lineItems: CartLineItem[];
  count: number;
  total: number;
  addItem: (item: Item, selected?: Record<string, string>, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lineItems: state,
      count: getCartItemCount(state),
      total: getCartTotal(state),
      addItem: (item, selected = {}, quantity = 1) =>
        dispatch({ type: "add", item, selected, quantity }),
      removeItem: (key) => dispatch({ type: "remove", key }),
      updateQuantity: (key, quantity) =>
        dispatch({ type: "update-quantity", key, quantity }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
