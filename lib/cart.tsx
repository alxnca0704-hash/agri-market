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
  getCartCount,
  getCartTotal,
  type CartLineItem,
} from "./cart-core";

interface CartContextValue {
  lineItems: CartLineItem[];
  count: number;
  total: number;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lineItems: state,
      count: getCartCount(state),
      total: getCartTotal(state),
      addItem: (item) => dispatch({ type: "add", item }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      updateQuantity: (id, quantity) =>
        dispatch({ type: "update-quantity", id, quantity }),
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
