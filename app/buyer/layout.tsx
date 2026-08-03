import { CartProvider } from "@/lib/cart";
import { FavoritesProvider } from "@/lib/favorites";
import BuyerLayout from "@/components/layout/BuyerLayout";

export default function BuyerRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <BuyerLayout>{children}</BuyerLayout>
      </FavoritesProvider>
    </CartProvider>
  );
}
