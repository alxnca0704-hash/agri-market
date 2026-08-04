"use client";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  createProductId,
  getInStockCount,
  getOutOfStockCount,
  getProductById,
  getProductCount,
  productsReducer,
  type SellerProduct,
} from "./products-core";

interface ProductsContextValue {
  products: SellerProduct[];
  count: number;
  inStockCount: number;
  outOfStockCount: number;
  addProduct: (product: Omit<SellerProduct, "id">) => void;
  updateProduct: (
    id: string,
    changes: Partial<Omit<SellerProduct, "id">>
  ) => void;
  removeProduct: (id: string) => void;
  adjustQuantity: (id: string, delta: number) => void;
  clear: () => void;
  getProduct: (id: string) => SellerProduct | undefined;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, []);

  const value = useMemo<ProductsContextValue>(
    () => ({
      products: state,
      count: getProductCount(state),
      inStockCount: getInStockCount(state),
      outOfStockCount: getOutOfStockCount(state),
      addProduct: (product) =>
        dispatch({ type: "add", product: { ...product, id: createProductId() } }),
      updateProduct: (id, changes) =>
        dispatch({ type: "update", id, changes }),
      removeProduct: (id) => dispatch({ type: "remove", id }),
      adjustQuantity: (id, delta) =>
        dispatch({ type: "adjust-quantity", id, delta }),
      clear: () => dispatch({ type: "clear" }),
      getProduct: (id) => getProductById(state, id),
    }),
    [state]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return ctx;
}
