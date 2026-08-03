"use client";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  favoritesReducer,
  getFavoriteCount,
  isFavorite,
} from "./favorites-core";

interface FavoritesContextValue {
  ids: string[];
  count: number;
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      ids: state,
      count: getFavoriteCount(state),
      isFavorite: (id) => isFavorite(state, id),
      toggle: (id) => dispatch({ type: "toggle", id }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
