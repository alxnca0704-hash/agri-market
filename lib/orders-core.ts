export interface OrderLine {
  id: string;
  itemId: string;
  name: string;
  category?: string;
  image?: string;
  unit: string;
  variant?: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  placedAt: string;
  lines: OrderLine[];
  total: number;
  received: boolean;
}

export type OrdersAction =
  | { type: "place"; order: Order }
  | { type: "mark-received"; id: string; received: boolean }
  | { type: "remove"; id: string };

export function createOrderId(): string {
  return `ord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function orderFromCartLines(
  lines: Array<{
    id?: string;
    item: { id: string; name: string; category?: string; image?: string; unit: string };
    selected: Record<string, string>;
    variant?: string;
    unitPrice: number;
    quantity: number;
  }>,
  now = new Date().toISOString()
): Order {
  const orderLines: OrderLine[] = lines.map((line) => ({
    id: line.id ?? line.item.id,
    itemId: line.item.id,
    name: line.item.name,
    category: line.item.category,
    image: line.item.image,
    unit: line.item.unit,
    variant: line.variant,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
  }));
  return {
    id: createOrderId(),
    placedAt: now,
    lines: orderLines,
    total: orderLines.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0
    ),
    received: false,
  };
}

export function ordersReducer(
  state: Order[],
  action: OrdersAction
): Order[] {
  switch (action.type) {
    case "place":
      return state.some((order) => order.id === action.order.id)
        ? state
        : [action.order, ...state];
    case "mark-received":
      return state.map((order) =>
        order.id === action.id ? { ...order, received: action.received } : order
      );
    case "remove":
      return state.filter((order) => order.id !== action.id);
  }
}

export function getOrderById(state: Order[], id: string): Order | undefined {
  return state.find((order) => order.id === id);
}

export function getPendingOrders(state: Order[]): Order[] {
  return state.filter((order) => !order.received);
}

export function getReceivedOrders(state: Order[]): Order[] {
  return state.filter((order) => order.received);
}

export function getPendingCount(state: Order[]): number {
  return getPendingOrders(state).length;
}

export function getReceivedCount(state: Order[]): number {
  return getReceivedOrders(state).length;
}
