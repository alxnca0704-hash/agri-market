import { describe, expect, test } from "vitest";
import {
  getInStockCount,
  getOutOfStockCount,
  getProductById,
  getProductCount,
  getProductStatus,
  productsReducer,
  type SellerProduct,
} from "./products-core";

function makeProduct(overrides: Partial<SellerProduct> = {}): SellerProduct {
  return {
    id: "product-1",
    name: "Premium Urea Fertilizer",
    category: "Fertilizer",
    price: 1240.5,
    unit: "50kg bag",
    quantity: 10,
    ...overrides,
  };
}

describe("productsReducer add", () => {
  test("adds a new product", () => {
    const product = makeProduct();
    expect(productsReducer([], { type: "add", product })).toEqual([product]);
  });

  test("does not duplicate a product with the same id", () => {
    const product = makeProduct();
    const once = productsReducer([], { type: "add", product });
    expect(productsReducer(once, { type: "add", product })).toEqual([product]);
  });
});

describe("productsReducer update", () => {
  test("updates fields of a matching product", () => {
    const state = [makeProduct()];
    const updated = productsReducer(state, {
      type: "update",
      id: "product-1",
      changes: { price: 900, quantity: 25 },
    });
    expect(updated[0]).toMatchObject({ price: 900, quantity: 25 });
  });

  test("ignores updates for an unknown id", () => {
    const state = [makeProduct()];
    expect(
      productsReducer(state, {
        type: "update",
        id: "missing",
        changes: { price: 99 },
      })
    ).toEqual(state);
  });

  test("clamps a negative quantity to zero", () => {
    const state = [makeProduct()];
    const updated = productsReducer(state, {
      type: "update",
      id: "product-1",
      changes: { quantity: -4 },
    });
    expect(updated[0].quantity).toBe(0);
  });
});

describe("productsReducer remove / clear", () => {
  test("removes a product by id", () => {
    const state = [makeProduct({ id: "a" }), makeProduct({ id: "b" })];
    expect(productsReducer(state, { type: "remove", id: "a" })).toEqual([
      state[1],
    ]);
  });

  test("remove is a no-op for an unknown id", () => {
    const state = [makeProduct()];
    expect(productsReducer(state, { type: "remove", id: "zzz" })).toEqual(
      state
    );
  });

  test("clears all products", () => {
    const state = [makeProduct({ id: "a" }), makeProduct({ id: "b" })];
    expect(productsReducer(state, { type: "clear" })).toEqual([]);
  });
});

describe("productsReducer adjust-quantity", () => {
  test("increases quantity by a positive delta", () => {
    const state = [makeProduct({ quantity: 4 })];
    const adjusted = productsReducer(state, {
      type: "adjust-quantity",
      id: "product-1",
      delta: 6,
    });
    expect(adjusted[0].quantity).toBe(10);
  });

  test("decreases quantity by a negative delta", () => {
    const state = [makeProduct({ quantity: 10 })];
    const adjusted = productsReducer(state, {
      type: "adjust-quantity",
      id: "product-1",
      delta: -4,
    });
    expect(adjusted[0].quantity).toBe(6);
  });

  test("clamps at zero", () => {
    const state = [makeProduct({ quantity: 2 })];
    const adjusted = productsReducer(state, {
      type: "adjust-quantity",
      id: "product-1",
      delta: -5,
    });
    expect(adjusted[0].quantity).toBe(0);
  });

  test("does not touch other products", () => {
    const state = [
      makeProduct({ id: "a", quantity: 1 }),
      makeProduct({ id: "b", quantity: 1 }),
    ];
    const adjusted = productsReducer(state, {
      type: "adjust-quantity",
      id: "a",
      delta: 5,
    });
    expect(adjusted[1].quantity).toBe(1);
  });
});

describe("product selectors", () => {
  test("getProductStatus reflects quantity", () => {
    expect(getProductStatus(makeProduct({ quantity: 3 }))).toBe("available");
    expect(getProductStatus(makeProduct({ quantity: 0 }))).toBe(
      "out-of-stock"
    );
  });

  test("getProductById finds a product or returns undefined", () => {
    const state = [makeProduct({ id: "a" })];
    expect(getProductById(state, "a")?.id).toBe("a");
    expect(getProductById(state, "zzz")).toBeUndefined();
  });

  test("getProductCount counts products", () => {
    const state = [makeProduct({ id: "a" }), makeProduct({ id: "b" })];
    expect(getProductCount(state)).toBe(2);
  });

  test("getInStockCount counts available products", () => {
    const state = [
      makeProduct({ id: "a", quantity: 5 }),
      makeProduct({ id: "b", quantity: 0 }),
    ];
    expect(getInStockCount(state)).toBe(1);
  });

  test("getOutOfStockCount counts empty products", () => {
    const state = [
      makeProduct({ id: "a", quantity: 0 }),
      makeProduct({ id: "b", quantity: 0 }),
      makeProduct({ id: "c", quantity: 5 }),
    ];
    expect(getOutOfStockCount(state)).toBe(2);
  });
});
