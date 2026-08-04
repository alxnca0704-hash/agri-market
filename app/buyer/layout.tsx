import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favorites";
import { InventoryProvider } from "@/lib/inventory";
import { OrdersProvider } from "@/lib/orders";
import AuthGuard from "@/components/auth/AuthGuard";
import BuyerLayout from "@/components/layout/BuyerLayout";

export default function BuyerRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard role="buyer">
      <InventoryProvider>
        <OrdersProvider>
          <CartProvider>
            <FavoritesProvider>
              <BuyerLayout>{children}</BuyerLayout>
            </FavoritesProvider>
          </CartProvider>
        </OrdersProvider>
      </InventoryProvider>
    </AuthGuard>
  );
}
