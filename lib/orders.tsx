"use client";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartLineItem } from "./cart-core";
import { getItemOptionLabel } from "./catalog";
import {
  getPendingCount,
  getReceivedCount,
  getReceivedOrders,
  orderFromCartLines,
  ordersReducer,
  type Order,
} from "./orders-core";

interface OrdersContextValue {
  orders: Order[];
  receivedOrders: Order[];
  pendingCount: number;
  receivedCount: number;
  placeOrder: (lines: CartLineItem[]) => void;
  markReceived: (id: string, received: boolean) => void;
  removeOrder: (id: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ordersReducer, []);

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders: state,
      receivedOrders: getReceivedOrders(state),
      pendingCount: getPendingCount(state),
      receivedCount: getReceivedCount(state),
      placeOrder: (lines) =>
        dispatch({
          type: "place",
          order: orderFromCartLines(
            lines.map((line) => ({
              id: line.key,
              item: line.item,
              selected: line.selected,
              variant: getItemOptionLabel(line.item, line.selected),
              unitPrice: line.unitPrice,
              quantity: line.quantity,
            }))
          ),
        }),
      markReceived: (id, received) =>
        dispatch({ type: "mark-received", id, received }),
      removeOrder: (id) => dispatch({ type: "remove", id }),
    }),
    [state]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return ctx;
}
