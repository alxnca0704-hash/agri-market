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
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
          Favorites
        </h1>
        <Empty description="You haven't saved any items yet">
          <Link href="/buyer/marketplace">
            <Button type="primary" color="yellow" icon={<HeartOutlined />}>
              Browse items
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Favorites
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {items.length} saved item{items.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
