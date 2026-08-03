import type { Item } from "./catalog";

export interface CartLineItem {
  item: Item;
  quantity: number;
}

export type CartAction =
  | { type: "add"; item: Item }
  | { type: "remove"; id: string }
  | { type: "update-quantity"; id: string; quantity: number }
  | { type: "clear" };

export function cartReducer(
  state: CartLineItem[],
  action: CartAction
): CartLineItem[] {
  switch (action.type) {
    case "add": {
      const existing = state.find((line) => line.item.id === action.item.id);
      if (existing) {
        return state.map((line) =>
          line.item.id === action.item.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }
      return [...state, { item: action.item, quantity: 1 }];
    }
    case "remove":
      return state.filter((line) => line.item.id !== action.id);
    case "update-quantity": {
      if (action.quantity <= 0) {
        return state.filter((line) => line.item.id !== action.id);
      }
      return state.map((line) =>
        line.item.id === action.id
          ? { ...line, quantity: action.quantity }
          : line
      );
    }
    case "clear":
      return [];
  }
}

export function getCartCount(state: CartLineItem[]): number {
  return state.reduce((sum, line) => sum + line.quantity, 0);
}

export function getCartTotal(state: CartLineItem[]): number {
  return state.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
}
