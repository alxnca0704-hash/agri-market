export type InventoryStatus = "ok" | "low" | "out";

export interface InventoryItem {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  unit?: string;
  lowStockThreshold: number;
  notes?: string;
  image?: string;
}

export type InventoryAction =
  | { type: "add"; item: InventoryItem }
  | { type: "update"; id: string; changes: Partial<Omit<InventoryItem, "id">> }
  | { type: "remove"; id: string }
  | { type: "adjust-quantity"; id: string; delta: number }
  | { type: "clear" };

export function createInventoryId(): string {
  return `inv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function inventoryReducer(
  state: InventoryItem[],
  action: InventoryAction
): InventoryItem[] {
  switch (action.type) {
    case "add":
      return state.some((item) => item.id === action.item.id)
        ? state
        : [...state, action.item];
    case "update":
      return state.map((item) =>
        item.id === action.id
          ? { ...item, ...action.changes, quantity: normalizeQuantity(action.changes.quantity ?? item.quantity) }
          : item
      );
    case "remove":
      return state.filter((item) => item.id !== action.id);
    case "adjust-quantity": {
      return state.map((item) => {
        if (item.id !== action.id) {
          return item;
        }
        return {
          ...item,
          quantity: Math.max(0, item.quantity + action.delta),
        };
      });
    }
    case "clear":
      return [];
  }
}

function normalizeQuantity(quantity: number): number {
  return Math.max(0, quantity);
}

export function getInventoryStatus(item: InventoryItem): InventoryStatus {
  if (item.quantity <= 0) {
    return "out";
  }
  if (item.quantity <= item.lowStockThreshold) {
    return "low";
  }
  return "ok";
}

export function getItemById(
  state: InventoryItem[],
  id: string
): InventoryItem | undefined {
  return state.find((item) => item.id === id);
}

export function getTotalItemCount(state: InventoryItem[]): number {
  return state.reduce((sum, item) => sum + item.quantity, 0);
}

export function getLowStockCount(state: InventoryItem[]): number {
  return state.filter(
    (item) => getInventoryStatus(item) !== "ok"
  ).length;
}

export function getOutOfStockCount(state: InventoryItem[]): number {
  return state.filter((item) => getInventoryStatus(item) === "out").length;
}
