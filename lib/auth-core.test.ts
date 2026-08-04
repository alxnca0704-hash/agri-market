import { describe, expect, test } from "vitest";
import {
  AUTH_STORAGE_KEY,
  authenticate,
  DEMO_ACCOUNTS,
  parseStoredUser,
  type AuthUser,
} from "./auth-core";

describe("authenticate", () => {
  test("authenticates the buyer account", () => {
    expect(authenticate("buyer", "buyer123")).toMatchObject({
      username: "buyer",
      role: "buyer",
    });
  });

  test("authenticates the seller account", () => {
    expect(authenticate("seller", "seller123")).toMatchObject({
      username: "seller",
      role: "seller",
    });
  });

  test("returns undefined for a wrong password", () => {
    expect(authenticate("buyer", "wrong")).toBeUndefined();
  });

  test("returns undefined for an unknown username", () => {
    expect(authenticate("nobody", "buyer123")).toBeUndefined();
  });

  test("matches usernames case-insensitively", () => {
    expect(authenticate("BUYER", "buyer123")).toMatchObject({
      username: "buyer",
    });
  });

  test("trims surrounding whitespace from the username", () => {
    expect(authenticate("  buyer  ", "buyer123")).toMatchObject({
      username: "buyer",
    });
  });

  test("never returns the password", () => {
    const user = authenticate("seller", "seller123");
    expect(user).toBeDefined();
    expect("password" in (user as AuthUser & { password?: string })).toBe(false);
  });
});

describe("demo accounts", () => {
  test("exposes one buyer and one seller account", () => {
    const roles = DEMO_ACCOUNTS.map((account) => account.role).sort();
    expect(roles).toEqual(["buyer", "seller"]);
  });

  test("each account authenticates with its own credentials", () => {
    for (const account of DEMO_ACCOUNTS) {
      expect(
        authenticate(account.username, account.password)
      ).toBeDefined();
    }
  });
});

describe("parseStoredUser", () => {
  test("parses a valid stored user", () => {
    const raw = JSON.stringify({
      name: "Juan Cruz",
      role: "buyer",
      username: "buyer",
    });
    expect(parseStoredUser(raw)).toMatchObject({
      name: "Juan Cruz",
      role: "buyer",
    });
  });

  test("returns undefined for null or empty input", () => {
    expect(parseStoredUser(null)).toBeUndefined();
    expect(parseStoredUser("")).toBeUndefined();
  });

  test("returns undefined for invalid JSON", () => {
    expect(parseStoredUser("{not-json")).toBeUndefined();
  });

  test("returns undefined for a malformed shape", () => {
    expect(parseStoredUser(JSON.stringify({ foo: "bar" }))).toBeUndefined();
    expect(
      parseStoredUser(JSON.stringify({ name: "x", role: "admin", username: "y" }))
    ).toBeUndefined();
  });
});

describe("AUTH_STORAGE_KEY", () => {
  test("is a versioned key", () => {
    expect(AUTH_STORAGE_KEY).toMatch(/^agrimarket\.auth\.v\d+$/);
  });
});
