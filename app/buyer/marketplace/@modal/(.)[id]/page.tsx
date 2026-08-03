import { notFound } from "next/navigation";
import ItemDetailModal from "@/components/item/ItemDetailModal";
import { getItem, listItems } from "@/lib/catalog";

export function generateStaticParams() {
  return listItems().map((item) => ({ id: item.id }));
}

export default async function ItemModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItem(id);
  if (!item) notFound();

  return <ItemDetailModal item={item} />;
}
