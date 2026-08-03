import { describe, expect, test } from "vitest";
import {
  favoritesReducer,
  getFavoriteCount,
  isFavorite,
} from "./favorites-core";

describe("favoritesReducer toggle", () => {
  test("adds an id that is not present", () => {
    expect(favoritesReducer([], { type: "toggle", id: "a" })).toEqual(["a"]);
  });

  test("removes an id that is present", () => {
    const state = favoritesReducer([], { type: "toggle", id: "a" });
    expect(favoritesReducer(state, { type: "toggle", id: "a" })).toEqual([]);
  });

  test("keeps other ids when toggling", () => {
    const state = favoritesReducer(
      favoritesReducer([], { type: "toggle", id: "a" }),
      { type: "toggle", id: "b" }
    );
    const toggled = favoritesReducer(state, { type: "toggle", id: "a" });
    expect(toggled).toEqual(["b"]);
  });

  test("does not duplicate ids", () => {
    const once = favoritesReducer([], { type: "toggle", id: "a" });
    expect(favoritesReducer(once, { type: "toggle", id: "a" })).toEqual([]);
  });
});

describe("favoritesReducer remove / clear", () => {
  test("removes an id by id", () => {
    const state = ["a", "b", "c"];
    expect(favoritesReducer(state, { type: "remove", id: "b" })).toEqual([
      "a",
      "c",
    ]);
  });

  test("remove is a no-op for an unknown id", () => {
    expect(favoritesReducer(["a"], { type: "remove", id: "zzz" })).toEqual([
      "a",
    ]);
  });

  test("clears all ids", () => {
    expect(favoritesReducer(["a", "b"], { type: "clear" })).toEqual([]);
  });
});

describe("favorites selectors", () => {
  test("isFavorite reports membership", () => {
    expect(isFavorite([], "a")).toBe(false);
    expect(isFavorite(["a", "b"], "a")).toBe(true);
  });

  test("getFavoriteCount counts ids", () => {
    expect(getFavoriteCount([])).toBe(0);
    expect(getFavoriteCount(["a", "b", "c"])).toBe(3);
  });
});
