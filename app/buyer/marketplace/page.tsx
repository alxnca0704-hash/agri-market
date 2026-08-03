"use client";
import { useMemo, useState } from "react";
import { Empty, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ItemCard from "@/components/ui/ItemCard";
import { categories, items } from "@/lib/data";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
];

export default function MarketplacePage() {
  const [category, setCategory] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("featured");

  const filteredItems = useMemo(() => {
    const result = items.filter(
      (item) => category === "All" || item.category === category
    );
    switch (sortKey) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);
      case "price-desc":
        return result.sort((a, b) => b.price - a.price);
      case "name-asc":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result;
    }
  }, [category, sortKey]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Marketplace
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"}
            </span>
            <Select
              value={sortKey}
              onChange={setSortKey}
              options={SORT_OPTIONS}
              suffixIcon={<DownOutlined />}
              popupMatchSelectWidth={false}
              className="w-48"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={
                cat === category
                  ? "rounded-full bg-green-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors"
                  : "rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-green-300 hover:text-green-700"
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Empty
          description="No items match your filters"
          className="py-20"
        />
      )}
    </div>
  );
}
