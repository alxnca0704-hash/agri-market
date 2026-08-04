import { ProductsProvider } from "@/lib/products";
import AuthGuard from "@/components/auth/AuthGuard";
import SellerLayout from "@/components/seller/SellerLayout";

export default function SellerRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard role="seller">
      <ProductsProvider>
        <SellerLayout>{children}</SellerLayout>
      </ProductsProvider>
    </AuthGuard>
  );
}
