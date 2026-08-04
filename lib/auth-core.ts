export type Role = "buyer" | "seller";

export interface AuthUser {
  name: string;
  role: Role;
  username: string;
}

interface DemoAccount extends AuthUser {
  password: string;
}

export const AUTH_STORAGE_KEY = "agrimarket.auth.v1";

export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    username: "buyer",
    password: "buyer123",
    name: "Juan Cruz",
    role: "buyer",
  },
  {
    username: "seller",
    password: "seller123",
    name: "Ana Villar",
    role: "seller",
  },
];

export function authenticate(
  username: string,
  password: string
): AuthUser | undefined {
  const account = DEMO_ACCOUNTS.find(
    (candidate) =>
      candidate.username === username.trim().toLowerCase() &&
      candidate.password === password
  );
  if (!account) {
    return undefined;
  }
  return {
    name: account.name,
    role: account.role,
    username: account.username,
  };
}

export function parseStoredUser(raw: string | null): AuthUser | undefined {
  if (!raw) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isAuthUser(parsed)) {
      return parsed;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.name === "string" &&
    (candidate.role === "buyer" || candidate.role === "seller") &&
    typeof candidate.username === "string"
  );
}
