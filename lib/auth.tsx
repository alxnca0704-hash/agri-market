"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  AUTH_STORAGE_KEY,
  authenticate,
  parseStoredUser,
  type AuthUser,
  type Role,
} from "./auth-core";

interface AuthSnapshot {
  user: AuthUser | null;
  ready: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: Role | null;
  ready: boolean;
  login: (username: string, password: string) => AuthUser | null;
  logout: () => void;
}

const listeners = new Set<() => void>();

const serverSnapshot: AuthSnapshot = { user: null, ready: false };

let currentSnapshot: AuthSnapshot = serverSnapshot;
let initialized = false;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function readStoredUser(): AuthUser | null {
  try {
    return (
      parseStoredUser(window.localStorage.getItem(AUTH_STORAGE_KEY)) ?? null
    );
  } catch {
    return null;
  }
}

function computeSnapshot(): AuthSnapshot {
  return { user: readStoredUser(), ready: true };
}

function getSnapshot(): AuthSnapshot {
  if (!initialized) {
    initialized = true;
    currentSnapshot = computeSnapshot();
  }
  return currentSnapshot;
}

function getServerSnapshot(): AuthSnapshot {
  return serverSnapshot;
}

function handleStorage(event: StorageEvent) {
  if (event.key === AUTH_STORAGE_KEY || event.key === null) {
    currentSnapshot = computeSnapshot();
    emitChange();
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function setSession(user: AuthUser | null) {
  if (user === null) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
  currentSnapshot = { user, ready: true };
  emitChange();
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const login = useCallback(
    (username: string, password: string): AuthUser | null => {
      const authenticated = authenticate(username, password);
      if (!authenticated) {
        return null;
      }
      setSession(authenticated);
      return authenticated;
    },
    []
  );

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: snapshot.user,
      role: snapshot.user?.role ?? null,
      ready: snapshot.ready,
      login,
      logout,
    }),
    [snapshot, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
