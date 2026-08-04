"use client";
import { useMemo } from "react";
import { Button, Empty } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import Link from "next/link";
import ItemCard from "@/components/ui/ItemCard";
import { getItem } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites";

export default function FavoritesPage() {
  const { ids } = useFavorites();

  const items = useMemo(
    () =>
      ids
        .map((id) => getItem(id))
        .filter((item): item is NonNullable<typeof item> => item !== undefined),
    [ids]
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 text-balance">
          Favorites
        </h1>
        <div className="rounded-3xl border border-dashed border-gray-300 bg-paper py-20 shadow-soft">
          <Empty description="You haven't saved any items yet">
            <Link href="/buyer/marketplace">
              <Button type="primary" icon={<HeartOutlined />}>
                Browse items
              </Button>
            </Link>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 text-balance">
          Favorites
        </h1>
        <p className="mt-1 font-mono text-sm tabular-nums text-gray-500">
          {items.length} saved item{items.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            href={`/buyer/marketplace/${item.id}`}
          />
        ))}
      </div>
    </div>
  );
}
