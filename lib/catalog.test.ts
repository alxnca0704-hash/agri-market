import { describe, expect, test } from "vitest";
import {
  getCategories,
  getItem,
  getLocations,
  listItems,
} from "./catalog";

describe("getCategories", () => {
  test("returns unique categories in first-appearance order", () => {
    expect(getCategories()).toEqual([
      "Fertilizer",
      "Seeds",
      "Soil Amendment",
      "Animal Feed",
      "Farm Tools",
      "Pesticide",
    ]);
  });

  test("does not include the UI 'All' sentinel", () => {
    expect(getCategories()).not.toContain("All");
  });
});

describe("getLocations", () => {
  test("returns unique locations in first-appearance order", () => {
    expect(getLocations()).toEqual([
      "Nueva Ecija",
      "Isabela",
      "Laguna",
      "Pampanga",
      "Davao City",
      "Bukidnon",
      "Batangas",
      "Bulacan",
      "Quezon",
    ]);
  });
});

describe("getItem", () => {
  test("returns the item with a matching id", () => {
    expect(getItem("urea-001")?.name).toBe("Premium Urea Fertilizer");
  });

  test("returns undefined for an unknown id", () => {
    expect(getItem("does-not-exist")).toBeUndefined();
  });
});

describe("listItems price range", () => {
  test("filters by a minimum price inclusively", () => {
    const result = listItems({ priceMin: 900 });
    expect(result.map((item) => item.id)).toEqual(["urea-001", "feed-021"]);
  });

  test("filters by a maximum price inclusively", () => {
    const result = listItems({ priceMax: 300 });
    expect(result.map((item) => item.id)).toEqual([
      "seed-056",
      "tool-018",
    ]);
  });

  test("filters within a price band", () => {
    const result = listItems({ priceMin: 500, priceMax: 1000 });
    expect(result.map((item) => item.id)).toEqual([
      "seed-014",
      "corn-031",
      "fert-092",
    ]);
  });

  test("returns an empty list when the band excludes everything", () => {
    expect(listItems({ priceMin: 2000, priceMax: 3000 })).toEqual([]);
  });
});

describe("listItems area", () => {
  test("filters by exact location", () => {
    const result = listItems({ area: "Isabela" });
    expect(result.map((item) => item.id)).toEqual(["seed-014"]);
  });

  test("returns an empty list for an unknown area", () => {
    expect(listItems({ area: "Unknown" })).toEqual([]);
  });
});

describe("listItems status", () => {
  test("filters by availability", () => {
    const result = listItems({ status: "low-stock" });
    expect(result.map((item) => item.id)).toEqual([
      "seed-014",
      "seed-056",
      "pest-033",
    ]);
  });

  test("filters by out-of-stock", () => {
    expect(listItems({ status: "out-of-stock" }).map((item) => item.id)).toEqual([
      "soil-007",
    ]);
  });

  test("combines with category and price", () => {
    const result = listItems({
      category: "Seeds",
      status: "low-stock",
      sort: "price-asc",
    });
    expect(result.map((item) => item.id)).toEqual(["seed-056", "seed-014"]);
  });
});

describe("listItems search", () => {
  test("matches against the item name", () => {
    expect(listItems({ search: "urea" }).map((item) => item.id)).toEqual([
      "urea-001",
    ]);
  });

  test("matches against the description", () => {
    const result = listItems({ search: "nitrogen" });
    expect(result.some((item) => item.id === "urea-001")).toBe(true);
  });

  test("matches against the seller", () => {
    expect(listItems({ search: "Maya Seed Farm" }).map((item) => item.id)).toEqual([
      "seed-014",
    ]);
  });

  test("matches against the category", () => {
    const result = listItems({ search: "seeds" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.category === "Seeds")).toBe(true);
  });

  test("is case-insensitive", () => {
    expect(listItems({ search: "UREA" }).map((item) => item.id)).toEqual([
      "urea-001",
    ]);
  });

  test("returns an empty list when nothing matches", () => {
    expect(listItems({ search: "xyzzy" })).toEqual([]);
  });

  test("combines search with category and sort", () => {
    const result = listItems({
      search: "seed",
      category: "Seeds",
      sort: "price-asc",
    });
    expect(result.map((item) => item.name)).toEqual([
      "Vegetable Seeds Bundle",
      "Yellow Corn Seeds",
      "Hybrid Rice Seeds",
    ]);
  });
});

describe("listItems", () => {
  test("returns every item with no query", () => {
    expect(listItems()).toHaveLength(9);
  });

  test("filters by category", () => {
    const result = listItems({ category: "Seeds" });
    expect(result).toHaveLength(3);
    expect(result.every((item) => item.category === "Seeds")).toBe(true);
  });

  test("returns an empty list for an unknown category", () => {
    expect(listItems({ category: "Unknown" })).toEqual([]);
  });

  test("sorts by price ascending", () => {
    const result = listItems({ sort: "price-asc" });
    const prices = result.map((item) => item.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("sorts by price descending", () => {
    const result = listItems({ sort: "price-desc" });
    const prices = result.map((item) => item.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test("sorts by name ascending", () => {
    const result = listItems({ sort: "name-asc" });
    const names = result.map((item) => item.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test("featured keeps the seed order", () => {
    expect(listItems({ sort: "featured" }).map((item) => item.id)).toEqual([
      "urea-001",
      "seed-014",
      "soil-007",
      "corn-031",
      "fert-092",
      "seed-056",
      "feed-021",
      "tool-018",
      "pest-033",
    ]);
  });

  test("combines category filter with sort", () => {
    const result = listItems({ category: "Seeds", sort: "price-asc" });
    expect(result.map((item) => item.name)).toEqual([
      "Vegetable Seeds Bundle",
      "Yellow Corn Seeds",
      "Hybrid Rice Seeds",
    ]);
  });

  test("does not mutate the source items", () => {
    listItems({ sort: "price-asc" });
    expect(listItems({ sort: "featured" }).map((item) => item.id)).toEqual([
      "urea-001",
      "seed-014",
      "soil-007",
      "corn-031",
      "fert-092",
      "seed-056",
      "feed-021",
      "tool-018",
      "pest-033",
    ]);
  });
});
