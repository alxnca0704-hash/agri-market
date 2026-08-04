import type { Metadata } from "next";
import SellerProductsClient from "@/components/seller/SellerProductsClient";

export const metadata: Metadata = { title: "Products" };

export default function SellerProductsPage() {
  return <SellerProductsClient />;
}
