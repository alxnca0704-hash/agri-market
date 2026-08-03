export type FavoritesAction =
  | { type: "toggle"; id: string }
  | { type: "remove"; id: string }
  | { type: "clear" };

export function favoritesReducer(
  state: string[],
  action: FavoritesAction
): string[] {
  switch (action.type) {
    case "toggle":
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id];
    case "remove":
      return state.filter((id) => id !== action.id);
    case "clear":
      return [];
  }
}

export function isFavorite(state: string[], id: string): boolean {
  return state.includes(id);
}

export function getFavoriteCount(state: string[]): number {
  return state.length;
}
