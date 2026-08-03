import { describe, expect, test } from "vitest";
import { cartReducer, getCartCount, getCartTotal } from "./cart-core";
import type { Item } from "./catalog";

const itemA: Item = {
  id: "a",
  name: "Item A",
  description: "desc",
  price: 100,
  unit: "each",
  status: "available",
};

const itemB: Item = {
  id: "b",
  name: "Item B",
  description: "desc",
  price: 50,
  unit: "each",
  status: "available",
};

describe("cartReducer add", () => {
  test("adds a new item with quantity 1", () => {
    const state = cartReducer([], { type: "add", item: itemA });
    expect(state).toEqual([{ item: itemA, quantity: 1 }]);
  });

  test("increments quantity when adding the same item again", () => {
    const once = cartReducer([], { type: "add", item: itemA });
    const twice = cartReducer(once, { type: "add", item: itemA });
    expect(twice).toEqual([{ item: itemA, quantity: 2 }]);
  });

  test("keeps distinct items as separate lines", () => {
    const state = cartReducer(
      cartReducer([], { type: "add", item: itemA }),
      { type: "add", item: itemB }
    );
    expect(state).toHaveLength(2);
  });
});

describe("cartReducer remove / update / clear", () => {
  test("removes an item by id", () => {
    const start = cartReducer(cartReducer([], { type: "add", item: itemA }), {
      type: "add",
      item: itemB,
    });
    expect(cartReducer(start, { type: "remove", id: "a" })).toEqual([
      { item: itemB, quantity: 1 },
    ]);
  });

  test("updates quantity", () => {
    const start = cartReducer([], { type: "add", item: itemA });
    const state = cartReducer(start, {
      type: "update-quantity",
      id: "a",
      quantity: 5,
    });
    expect(state[0].quantity).toBe(5);
  });

  test("removes the line when quantity is set to 0", () => {
    const start = cartReducer([], { type: "add", item: itemA });
    const state = cartReducer(start, {
      type: "update-quantity",
      id: "a",
      quantity: 0,
    });
    expect(state).toEqual([]);
  });

  test("removes the line when quantity is negative", () => {
    const start = cartReducer([], { type: "add", item: itemA });
    const state = cartReducer(start, {
      type: "update-quantity",
      id: "a",
      quantity: -2,
    });
    expect(state).toEqual([]);
  });

  test("clears the cart", () => {
    const start = cartReducer(cartReducer([], { type: "add", item: itemA }), {
      type: "add",
      item: itemB,
    });
    expect(cartReducer(start, { type: "clear" })).toEqual([]);
  });
});

describe("cart selectors", () => {
  test("count sums quantities across lines", () => {
    const state = cartReducer(cartReducer([], { type: "add", item: itemA }), {
      type: "add",
      item: itemA,
    });
    expect(getCartCount(state)).toBe(2);
  });

  test("total sums price times quantity", () => {
    let state = cartReducer([], { type: "add", item: itemA });
    state = cartReducer(state, { type: "add", item: itemB });
    state = cartReducer(state, { type: "add", item: itemB });
    expect(getCartTotal(state)).toBe(200);
  });

  test("count and total are 0 for an empty cart", () => {
    expect(getCartCount([])).toBe(0);
    expect(getCartTotal([])).toBe(0);
  });
});
