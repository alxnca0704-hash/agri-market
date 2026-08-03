import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ItemDetail from "@/components/item/ItemDetail";
import { getItem, listItems } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return listItems().map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = getItem(id);
  return { title: item ? item.name : "Item details" };
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItem(id);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/buyer/marketplace"
        className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M10 3 5 8l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to marketplace
      </Link>
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg shadow-green-900/[0.04] sm:p-6 md:p-10">
        <ItemDetail item={item} />
      </div>
    </div>
  );
}
