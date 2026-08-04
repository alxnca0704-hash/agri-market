import type { Metadata } from "next";
import InventoryClient from "@/components/inventory/InventoryClient";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function InventoryPage() {
  return <InventoryClient />;
}
