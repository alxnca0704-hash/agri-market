import { describe, expect, test } from "vitest";
import {
  getOrderById,
  getPendingCount,
  getPendingOrders,
  getReceivedCount,
  getReceivedOrders,
  orderFromCartLines,
  ordersReducer,
  type Order,
  type OrderLine,
} from "./orders-core";

function makeLine(overrides: Partial<OrderLine> = {}): OrderLine {
  return {
    id: "urea-001::size=50kg",
    itemId: "urea-001",
    name: "Premium Urea Fertilizer",
    category: "Fertilizer",
    image: "https://picsum.photos/seed/fertilizer/800/600",
    unit: "per 50kg bag",
    variant: "50 kg bag",
    unitPrice: 1240.5,
    quantity: 2,
    ...overrides,
  };
}

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ord-1",
    placedAt: "2026-08-04T08:00:00.000Z",
    lines: [makeLine()],
    total: 2481,
    received: false,
    ...overrides,
  };
}

describe("orderFromCartLines", () => {
  test("maps cart lines into an order with received false", () => {
    const order = orderFromCartLines(
      [
        {
          item: {
            id: "urea-001",
            name: "Premium Urea Fertilizer",
            category: "Fertilizer",
            image: "/img.png",
            unit: "per 50kg bag",
          },
          selected: { size: "50kg" },
          variant: "50 kg bag",
          unitPrice: 1240.5,
          quantity: 2,
        },
      ],
      "2026-08-04T08:00:00.000Z"
    );
    expect(order.received).toBe(false);
    expect(order.placedAt).toBe("2026-08-04T08:00:00.000Z");
    expect(order.total).toBe(2481);
    expect(order.lines[0]).toMatchObject({
      itemId: "urea-001",
      name: "Premium Urea Fertilizer",
      category: "Fertilizer",
      variant: "50 kg bag",
      unitPrice: 1240.5,
      quantity: 2,
    });
    expect(order.lines[0].id).toBe("urea-001");
  });
});

describe("ordersReducer place", () => {
  test("prepends a new order", () => {
    const order = makeOrder();
    const state = ordersReducer([], { type: "place", order });
    expect(state).toEqual([order]);
  });

  test("does not duplicate an order with the same id", () => {
    const order = makeOrder();
    const once = ordersReducer([], { type: "place", order });
    expect(ordersReducer(once, { type: "place", order })).toEqual([order]);
  });
});

describe("ordersReducer mark-received", () => {
  test("marks an order as received", () => {
    const state = [makeOrder()];
    const updated = ordersReducer(state, {
      type: "mark-received",
      id: "ord-1",
      received: true,
    });
    expect(updated[0].received).toBe(true);
  });

  test("toggles an order back to pending", () => {
    const state = [makeOrder({ received: true })];
    const updated = ordersReducer(state, {
      type: "mark-received",
      id: "ord-1",
      received: false,
    });
    expect(updated[0].received).toBe(false);
  });

  test("ignores unknown ids", () => {
    const state = [makeOrder()];
    expect(
      ordersReducer(state, {
        type: "mark-received",
        id: "missing",
        received: true,
      })
    ).toEqual(state);
  });
});

describe("ordersReducer remove", () => {
  test("removes an order by id", () => {
    const state = [makeOrder({ id: "a" }), makeOrder({ id: "b" })];
    expect(ordersReducer(state, { type: "remove", id: "a" })).toEqual([
      state[1],
    ]);
  });

  test("remove is a no-op for an unknown id", () => {
    const state = [makeOrder()];
    expect(ordersReducer(state, { type: "remove", id: "zzz" })).toEqual(state);
  });
});

describe("order selectors", () => {
  test("getOrderById finds an order or returns undefined", () => {
    const state = [makeOrder({ id: "a" })];
    expect(getOrderById(state, "a")?.id).toBe("a");
    expect(getOrderById(state, "zzz")).toBeUndefined();
  });

  test("getPendingOrders and getReceivedOrders split by status", () => {
    const state = [
      makeOrder({ id: "a", received: false }),
      makeOrder({ id: "b", received: true }),
      makeOrder({ id: "c", received: false }),
    ];
    expect(getPendingOrders(state).map((o) => o.id)).toEqual(["a", "c"]);
    expect(getReceivedOrders(state).map((o) => o.id)).toEqual(["b"]);
  });

  test("getPendingCount and getReceivedCount count each bucket", () => {
    const state = [
      makeOrder({ received: false }),
      makeOrder({ received: true }),
      makeOrder({ received: true }),
    ];
    expect(getPendingCount(state)).toBe(1);
    expect(getReceivedCount(state)).toBe(2);
  });
});
