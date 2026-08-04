"use client";
import { useMemo } from "react";
import { Button, Select } from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import ItemCard from "@/components/ui/ItemCard";
import MarketplaceFilterPanel from "./MarketplaceFilterPanel";
import { listItems, type SortKey } from "@/lib/catalog";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
];

const ALL = "All";

interface FilterParams {
  category?: string;
  sort?: string;
  q?: string;
  priceMin?: number;
  priceMax?: number;
  area?: string;
}

function buildUrl(params: FilterParams): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category && params.category !== ALL) {
    search.set("category", params.category);
  }
  if (params.sort && params.sort !== "featured") {
    search.set("sort", params.sort);
  }
  if (params.priceMin != null) search.set("priceMin", String(params.priceMin));
  if (params.priceMax != null) search.set("priceMax", String(params.priceMax));
  if (params.area) search.set("area", params.area);
  const qs = search.toString();
  return qs ? `/buyer/marketplace?${qs}` : "/buyer/marketplace";
}

function parseOptionalNumber(value: string | null): number | undefined {
  if (value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export default function MarketplaceGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? ALL;
  const sortKey = (searchParams.get("sort") as SortKey) ?? "featured";
  const priceMin = parseOptionalNumber(searchParams.get("priceMin"));
  const priceMax = parseOptionalNumber(searchParams.get("priceMax"));
  const area = searchParams.get("area") ?? undefined;

  const filteredItems = useMemo(
    () =>
      listItems({
        category: category === ALL ? undefined : category,
        sort: sortKey,
        search: q,
        priceMin,
        priceMax,
        area,
      }).filter((item) => (item.quantity ?? 0) > 0),
    [category, sortKey, q, priceMin, priceMax, area]
  );

  const apply = (updates: FilterParams) =>
    router.replace(
      buildUrl({
        category,
        sort: sortKey,
        q,
        priceMin,
        priceMax,
        area,
        ...updates,
      })
    );

  const setCategory = (cat: string) => apply({ category: cat });
  const setSortKey = (key: SortKey) => apply({ sort: key });
  const setPrice = (min?: number, max?: number) =>
    apply({ priceMin: min, priceMax: max });
  const setArea = (nextArea?: string) => apply({ area: nextArea });
  const clearFilters = () =>
    apply({ category: ALL, priceMin: undefined, priceMax: undefined, area: undefined });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 text-balance">
              Marketplace
            </h1>
            {q && (
              <p className="mt-1 text-sm text-gray-500">
                Results for &quot;{q}&quot;
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm tabular-nums text-gray-500">
              {filteredItems.length} item
              {filteredItems.length === 1 ? "" : "s"}
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
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <MarketplaceFilterPanel
          key={`${priceMin ?? ""}-${priceMax ?? ""}`}
          category={category}
          priceMin={priceMin}
          priceMax={priceMax}
          area={area}
          onCategoryChange={setCategory}
          onPriceChange={setPrice}
          onAreaChange={setArea}
          onClear={clearFilters}
        />

        <div className="min-w-0 flex-1">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5 min-[2200px]:grid-cols-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  href={`/buyer/marketplace/${item.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 rounded-3xl bg-paper px-6 py-20 text-center shadow-soft ring-1 ring-gray-200/50">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl text-green-700">
                <SearchOutlined />
              </span>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {q ? `No results for "${q}"` : "No items match your filters"}
                </p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                  {q
                    ? "Try a different search term, or clear your filters and browse the full catalog."
                    : "Try widening your price range or choosing a different area."}
                </p>
              </div>
              <Button onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
