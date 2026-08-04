"use client";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  createInventoryId,
  getItemById,
  getLowStockCount,
  getOutOfStockCount,
  getTotalItemCount,
  inventoryReducer,
  type InventoryItem,
} from "./inventory-core";

interface InventoryContextValue {
  items: InventoryItem[];
  count: number;
  totalUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
  addItem: (item: Omit<InventoryItem, "id">) => void;
  updateItem: (id: string, changes: Partial<Omit<InventoryItem, "id">>) => void;
  removeItem: (id: string) => void;
  adjustQuantity: (id: string, delta: number) => void;
  clear: () => void;
  getItem: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, []);

  const value = useMemo<InventoryContextValue>(
    () => ({
      items: state,
      count: state.length,
      totalUnits: getTotalItemCount(state),
      lowStockCount: getLowStockCount(state),
      outOfStockCount: getOutOfStockCount(state),
      addItem: (item) =>
        dispatch({ type: "add", item: { ...item, id: createInventoryId() } }),
      updateItem: (id, changes) => dispatch({ type: "update", id, changes }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      adjustQuantity: (id, delta) =>
        dispatch({ type: "adjust-quantity", id, delta }),
      clear: () => dispatch({ type: "clear" }),
      getItem: (id) => getItemById(state, id),
    }),
    [state]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return ctx;
}
