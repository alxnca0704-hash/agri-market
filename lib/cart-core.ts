import type { Item } from "./catalog";
import { buildCartKey, getItemOptionPrice } from "./catalog";

export interface CartLineItem {
  key: string;
  item: Item;
  selected: Record<string, string>;
  unitPrice: number;
  quantity: number;
}

export type CartAction =
  | {
      type: "add";
      item: Item;
      selected: Record<string, string>;
      quantity: number;
    }
  | { type: "remove"; key: string }
  | { type: "update-quantity"; key: string; quantity: number }
  | { type: "clear" };

function resolveUnitPrice(item: Item, selected: Record<string, string>): number {
  return getItemOptionPrice(item, selected);
}

export function cartReducer(
  state: CartLineItem[],
  action: CartAction
): CartLineItem[] {
  switch (action.type) {
    case "add": {
      const { item, selected, quantity } = action;
      const key = buildCartKey(item, selected);
      const unitPrice = resolveUnitPrice(item, selected);
      const existing = state.find((line) => line.key === key);
      if (existing) {
        const max = item.quantity ?? Number.POSITIVE_INFINITY;
        return state.map((line) =>
          line.key === key
            ? {
                ...line,
                quantity: Math.min(line.quantity + quantity, max),
              }
            : line
        );
      }
      return [
        ...state,
        { key, item, selected, unitPrice, quantity },
      ];
    }
    case "remove":
      return state.filter((line) => line.key !== action.key);
    case "update-quantity": {
      if (action.quantity <= 0) {
        return state.filter((line) => line.key !== action.key);
      }
      return state.map((line) => {
        if (line.key !== action.key) {
          return line;
        }
        const max = line.item.quantity ?? Number.POSITIVE_INFINITY;
        return {
          ...line,
          quantity: Math.min(action.quantity, max),
        };
      });
    }
    case "clear":
      return [];
  }
}

export function getCartCount(state: CartLineItem[]): number {
  return state.reduce((sum, line) => sum + line.quantity, 0);
}

export function getCartTotal(state: CartLineItem[]): number {
  return state.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}
