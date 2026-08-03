import { describe, expect, test } from "vitest";
import { cartReducer, getCartItemCount, getCartTotal } from "./cart-core";
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

const itemC: Item = {
  id: "c",
  name: "Item C",
  description: "desc",
  price: 100,
  unit: "each",
  status: "available",
  quantity: 5,
  options: [
    {
      id: "size",
      label: "Size",
      choices: [
        { value: "small", label: "Small", price: 100 },
        { value: "large", label: "Large", price: 200 },
      ],
    },
  ],
};

describe("cartReducer add", () => {
  test("adds a new item with the requested quantity", () => {
    const state = cartReducer([], {
      type: "add",
      item: itemA,
      selected: {},
      quantity: 3,
    });
    expect(state).toEqual([
      {
        key: "a",
        item: itemA,
        selected: {},
        unitPrice: 100,
        quantity: 3,
      },
    ]);
  });

  test("increments quantity when adding the same variant again", () => {
    const once = cartReducer([], {
      type: "add",
      item: itemA,
      selected: {},
      quantity: 1,
    });
    const twice = cartReducer(once, {
      type: "add",
      item: itemA,
      selected: {},
      quantity: 2,
    });
    expect(twice).toEqual([
      {
        key: "a",
        item: itemA,
        selected: {},
        unitPrice: 100,
        quantity: 3,
      },
    ]);
  });

  test("keeps distinct items as separate lines", () => {
    const state = cartReducer(
      cartReducer([], {
        type: "add",
        item: itemA,
        selected: {},
        quantity: 1,
      }),
      { type: "add", item: itemB, selected: {}, quantity: 1 }
    );
    expect(state).toHaveLength(2);
  });

  test("uses the selected variant price as unit price", () => {
    const state = cartReducer([], {
      type: "add",
      item: itemC,
      selected: { size: "large" },
      quantity: 1,
    });
    expect(state[0].key).toBe("c::size=large");
    expect(state[0].unitPrice).toBe(200);
  });

  test("keeps different variants of the same item as separate lines", () => {
    const small = cartReducer([], {
      type: "add",
      item: itemC,
      selected: { size: "small" },
      quantity: 1,
    });
    const both = cartReducer(small, {
      type: "add",
      item: itemC,
      selected: { size: "large" },
      quantity: 1,
    });
    expect(both).toHaveLength(2);
    expect(both.map((line) => line.key)).toEqual([
      "c::size=small",
      "c::size=large",
    ]);
  });

  test("caps merged quantity at the item stock", () => {
    const start = cartReducer([], {
      type: "add",
      item: itemC,
      selected: { size: "small" },
      quantity: 3,
    });
    const state = cartReducer(start, {
      type: "add",
      item: itemC,
      selected: { size: "small" },
      quantity: 5,
    });
    expect(state[0].quantity).toBe(5);
  });
});

describe("cartReducer remove / update / clear", () => {
  test("removes a line by composite key", () => {
    const start = cartReducer(
      cartReducer([], {
        type: "add",
        item: itemA,
        selected: {},
        quantity: 1,
      }),
      { type: "add", item: itemC, selected: { size: "small" }, quantity: 1 }
    );
    expect(cartReducer(start, { type: "remove", key: "a" })).toHaveLength(1);
    expect(
      cartReducer(start, { type: "remove", key: "a" })[0].key
    ).toBe("c::size=small");
  });

  test("updates quantity by key", () => {
    const start = cartReducer([], {
      type: "add",
      item: itemA,
      selected: {},
      quantity: 1,
    });
    const state = cartReducer(start, {
      type: "update-quantity",
      key: "a",
      quantity: 5,
    });
    expect(state[0].quantity).toBe(5);
  });

  test("caps updated quantity at the item stock", () => {
    const start = cartReducer([], {
      type: "add",
      item: itemC,
      selected: { size: "small" },
      quantity: 1,
    });
    const state = cartReducer(start, {
      type: "update-quantity",
      key: "c::size=small",
      quantity: 99,
    });
    expect(state[0].quantity).toBe(5);
  });

  test("removes the line when quantity is set to 0", () => {
    const start = cartReducer([], {
      type: "add",
      item: itemA,
      selected: {},
      quantity: 1,
    });
    const state = cartReducer(start, {
      type: "update-quantity",
      key: "a",
      quantity: 0,
    });
    expect(state).toEqual([]);
  });

  test("removes the line when quantity is negative", () => {
    const start = cartReducer([], {
      type: "add",
      item: itemA,
      selected: {},
      quantity: 1,
    });
    const state = cartReducer(start, {
      type: "update-quantity",
      key: "a",
      quantity: -2,
    });
    expect(state).toEqual([]);
  });

  test("clears the cart", () => {
    const start = cartReducer(
      cartReducer([], {
        type: "add",
        item: itemA,
        selected: {},
        quantity: 1,
      }),
      { type: "add", item: itemB, selected: {}, quantity: 1 }
    );
    expect(cartReducer(start, { type: "clear" })).toEqual([]);
  });
});

describe("cart selectors", () => {
  test("count counts distinct items, not quantity", () => {
    const state = cartReducer(
      cartReducer([], {
        type: "add",
        item: itemA,
        selected: {},
        quantity: 2,
      }),
      { type: "add", item: itemA, selected: {}, quantity: 2 }
    );
    expect(getCartItemCount(state)).toBe(1);
  });

  test("counts different items as separate lines", () => {
    const state = cartReducer(
      cartReducer([], {
        type: "add",
        item: itemA,
        selected: {},
        quantity: 4,
      }),
      { type: "add", item: itemB, selected: {}, quantity: 1 }
    );
    expect(getCartItemCount(state)).toBe(2);
  });

  test("total sums unit price times quantity", () => {
    let state = cartReducer([], {
      type: "add",
      item: itemA,
      selected: {},
      quantity: 1,
    });
    state = cartReducer(state, {
      type: "add",
      item: itemC,
      selected: { size: "large" },
      quantity: 2,
    });
    expect(getCartTotal(state)).toBe(100 + 400);
  });

  test("count and total are 0 for an empty cart", () => {
    expect(getCartItemCount([])).toBe(0);
    expect(getCartTotal([])).toBe(0);
  });
});
