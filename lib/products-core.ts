export type ProductStatus = "available" | "out-of-stock";

export interface SellerProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit?: string;
  quantity: number;
  category?: string;
  location?: string;
  image?: string;
}

export type ProductAction =
  | { type: "add"; product: SellerProduct }
  | { type: "update"; id: string; changes: Partial<Omit<SellerProduct, "id">> }
  | { type: "remove"; id: string }
  | { type: "adjust-quantity"; id: string; delta: number }
  | { type: "clear" };

export function createProductId(): string {
  return `prd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function productsReducer(
  state: SellerProduct[],
  action: ProductAction
): SellerProduct[] {
  switch (action.type) {
    case "add":
      return state.some((product) => product.id === action.product.id)
        ? state
        : [...state, action.product];
    case "update":
      return state.map((product) =>
        product.id === action.id
          ? {
              ...product,
              ...action.changes,
              quantity: normalizeQuantity(
                action.changes.quantity ?? product.quantity
              ),
            }
          : product
      );
    case "remove":
      return state.filter((product) => product.id !== action.id);
    case "adjust-quantity":
      return state.map((product) => {
        if (product.id !== action.id) {
          return product;
        }
        return {
          ...product,
          quantity: Math.max(0, product.quantity + action.delta),
        };
      });
    case "clear":
      return [];
  }
}

function normalizeQuantity(quantity: number): number {
  return Math.max(0, quantity);
}

export function getProductStatus(product: SellerProduct): ProductStatus {
  return product.quantity <= 0 ? "out-of-stock" : "available";
}

export function getProductById(
  state: SellerProduct[],
  id: string
): SellerProduct | undefined {
  return state.find((product) => product.id === id);
}

export function getProductCount(state: SellerProduct[]): number {
  return state.length;
}

export function getInStockCount(state: SellerProduct[]): number {
  return state.filter(
    (product) => getProductStatus(product) === "available"
  ).length;
}

export function getOutOfStockCount(state: SellerProduct[]): number {
  return state.filter(
    (product) => getProductStatus(product) === "out-of-stock"
  ).length;
}
