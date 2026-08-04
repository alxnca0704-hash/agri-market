import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favorites";
import { InventoryProvider } from "@/lib/inventory";
import BuyerLayout from "@/components/layout/BuyerLayout";

export default function BuyerRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <InventoryProvider>
      <CartProvider>
        <FavoritesProvider>
          <BuyerLayout>{children}</BuyerLayout>
        </FavoritesProvider>
      </CartProvider>
    </InventoryProvider>
  );
}
