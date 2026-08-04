import { describe, expect, test } from "vitest";
import {
  getInventoryStatus,
  getItemById,
  getLowStockCount,
  getOutOfStockCount,
  getTotalItemCount,
  inventoryReducer,
  type InventoryItem,
} from "./inventory-core";

function makeItem(overrides: Partial<InventoryItem> = {}): InventoryItem {
  return {
    id: "item-1",
    name: "Urea Fertilizer",
    category: "Fertilizer",
    quantity: 10,
    unit: "50kg bag",
    lowStockThreshold: 3,
    ...overrides,
  };
}

describe("inventoryReducer add", () => {
  test("adds a new item", () => {
    const item = makeItem();
    expect(inventoryReducer([], { type: "add", item })).toEqual([item]);
  });

  test("does not duplicate an item with the same id", () => {
    const item = makeItem();
    const once = inventoryReducer([], { type: "add", item });
    expect(inventoryReducer(once, { type: "add", item })).toEqual([item]);
  });
});

describe("inventoryReducer update", () => {
  test("updates fields of a matching item", () => {
    const state = [makeItem()];
    const updated = inventoryReducer(state, {
      type: "update",
      id: "item-1",
      changes: { quantity: 25, lowStockThreshold: 5 },
    });
    expect(updated[0]).toMatchObject({
      quantity: 25,
      lowStockThreshold: 5,
    });
  });

  test("ignores updates for an unknown id", () => {
    const state = [makeItem()];
    expect(
      inventoryReducer(state, {
        type: "update",
        id: "missing",
        changes: { quantity: 99 },
      })
    ).toEqual(state);
  });

  test("clamps a negative quantity to zero", () => {
    const state = [makeItem()];
    const updated = inventoryReducer(state, {
      type: "update",
      id: "item-1",
      changes: { quantity: -4 },
    });
    expect(updated[0].quantity).toBe(0);
  });
});

describe("inventoryReducer remove / clear", () => {
  test("removes an item by id", () => {
    const state = [makeItem({ id: "a" }), makeItem({ id: "b" })];
    expect(inventoryReducer(state, { type: "remove", id: "a" })).toEqual([
      state[1],
    ]);
  });

  test("remove is a no-op for an unknown id", () => {
    const state = [makeItem()];
    expect(inventoryReducer(state, { type: "remove", id: "zzz" })).toEqual(
      state
    );
  });

  test("clears all items", () => {
    const state = [makeItem({ id: "a" }), makeItem({ id: "b" })];
    expect(inventoryReducer(state, { type: "clear" })).toEqual([]);
  });
});

describe("inventoryReducer adjust-quantity", () => {
  test("increases quantity by a positive delta", () => {
    const state = [makeItem({ quantity: 4 })];
    const adjusted = inventoryReducer(state, {
      type: "adjust-quantity",
      id: "item-1",
      delta: 6,
    });
    expect(adjusted[0].quantity).toBe(10);
  });

  test("decreases quantity by a negative delta", () => {
    const state = [makeItem({ quantity: 10 })];
    const adjusted = inventoryReducer(state, {
      type: "adjust-quantity",
      id: "item-1",
      delta: -4,
    });
    expect(adjusted[0].quantity).toBe(6);
  });

  test("clamps at zero", () => {
    const state = [makeItem({ quantity: 2 })];
    const adjusted = inventoryReducer(state, {
      type: "adjust-quantity",
      id: "item-1",
      delta: -5,
    });
    expect(adjusted[0].quantity).toBe(0);
  });

  test("does not touch other items", () => {
    const state = [makeItem({ id: "a", quantity: 1 }), makeItem({ id: "b", quantity: 1 })];
    const adjusted = inventoryReducer(state, {
      type: "adjust-quantity",
      id: "a",
      delta: 5,
    });
    expect(adjusted[1].quantity).toBe(1);
  });
});

describe("inventory selectors", () => {
  test("getInventoryStatus reflects quantity against threshold", () => {
    expect(getInventoryStatus(makeItem({ quantity: 10, lowStockThreshold: 3 }))).toBe("ok");
    expect(getInventoryStatus(makeItem({ quantity: 3, lowStockThreshold: 3 }))).toBe("low");
    expect(getInventoryStatus(makeItem({ quantity: 1, lowStockThreshold: 3 }))).toBe("low");
    expect(getInventoryStatus(makeItem({ quantity: 0, lowStockThreshold: 3 }))).toBe("out");
  });

  test("getItemById finds an item or returns undefined", () => {
    const state = [makeItem({ id: "a" })];
    expect(getItemById(state, "a")?.id).toBe("a");
    expect(getItemById(state, "zzz")).toBeUndefined();
  });

  test("getTotalItemCount sums quantities", () => {
    const state = [
      makeItem({ id: "a", quantity: 4 }),
      makeItem({ id: "b", quantity: 6 }),
    ];
    expect(getTotalItemCount(state)).toBe(10);
  });

  test("getLowStockCount counts low and out items", () => {
    const state = [
      makeItem({ id: "a", quantity: 10, lowStockThreshold: 3 }),
      makeItem({ id: "b", quantity: 2, lowStockThreshold: 3 }),
      makeItem({ id: "c", quantity: 0, lowStockThreshold: 3 }),
    ];
    expect(getLowStockCount(state)).toBe(2);
  });

  test("getOutOfStockCount counts empty items", () => {
    const state = [
      makeItem({ id: "a", quantity: 0 }),
      makeItem({ id: "b", quantity: 0 }),
      makeItem({ id: "c", quantity: 5 }),
    ];
    expect(getOutOfStockCount(state)).toBe(2);
  });
});
