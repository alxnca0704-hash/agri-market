"use client";
import { Button, InputNumber, Select } from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import { getCategories, getLocations } from "@/lib/catalog";

const ALL = "All";
const CATEGORIES = [ALL, ...getCategories()];
const LOCATIONS = getLocations();

interface MarketplaceFilterPanelProps {
  category: string;
  priceMin?: number;
  priceMax?: number;
  area?: string;
  onCategoryChange: (category: string) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onAreaChange: (area?: string) => void;
  onClear: () => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-semibold text-gray-500">{children}</p>;
}

export default function MarketplaceFilterPanel({
  category,
  priceMin,
  priceMax,
  area,
  onCategoryChange,
  onPriceChange,
  onAreaChange,
  onClear,
}: MarketplaceFilterPanelProps) {
  const [draftMin, setDraftMin] = useState<number | null>(priceMin ?? null);
  const [draftMax, setDraftMax] = useState<number | null>(priceMax ?? null);

  const commitPrice = () => {
    let min = draftMin;
    let max = draftMax;
    if (min != null && max != null && min > max) {
      [min, max] = [max, min];
    }
    onPriceChange(
      min != null && min >= 0 ? min : undefined,
      max != null && max >= 0 ? max : undefined
    );
  };

  const hasActiveFilters =
    category !== ALL ||
    priceMin !== undefined ||
    priceMax !== undefined ||
    area !== undefined;

  const priceLabel =
    draftMin != null || draftMax != null
      ? `${draftMin != null ? `₱${draftMin}` : "≤"}${draftMax != null ? `₱${draftMax}` : "+"}`
      : "Price";

  const areaOptions = LOCATIONS.map((location) => ({
    value: location,
    label: location,
  }));

  return (
    <>
      <div
        aria-label="Item filters"
        className="flex items-center gap-2 overflow-x-auto pb-1 lg:hidden"
      >
        <Select
          value={category}
          options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          onChange={(value) => onCategoryChange(value)}
          suffixIcon={<DownOutlined />}
          popupMatchSelectWidth={false}
          className="min-w-24 shrink-0"
        />
        <Select
          value={priceLabel}
          suffixIcon={<DownOutlined />}
          popupMatchSelectWidth={false}
          options={[]}
          className="min-w-28 shrink-0"
          popupRender={() => (
            <div className="flex items-center gap-2 p-2">
              <InputNumber
                prefix="₱"
                min={0}
                controls={false}
                placeholder="Min"
                value={draftMin}
                onChange={(value) => setDraftMin(value)}
                onBlur={commitPrice}
                onPressEnter={commitPrice}
                className="w-full"
              />
              <span className="text-gray-300">—</span>
              <InputNumber
                prefix="₱"
                min={0}
                controls={false}
                placeholder="Max"
                value={draftMax}
                onChange={(value) => setDraftMax(value)}
                onBlur={commitPrice}
                onPressEnter={commitPrice}
                className="w-full"
              />
            </div>
          )}
        />
        <Select
          allowClear
          placeholder="Area"
          value={area}
          options={areaOptions}
          onChange={(value) => onAreaChange(value)}
          suffixIcon={<DownOutlined />}
          popupMatchSelectWidth={false}
          className="min-w-28 shrink-0"
        />
        {hasActiveFilters && (
          <Button type="link" size="small" onClick={onClear} className="shrink-0">
            Clear
          </Button>
        )}
      </div>

      <aside
        aria-label="Item filters"
        className="hidden h-fit shrink-0 rounded-2xl bg-paper p-5 shadow-soft ring-1 ring-gray-200/50 lg:sticky lg:top-[88px] lg:block lg:w-64"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <FilterOutlined className="text-green-600" />
            Filters
          </p>
          {hasActiveFilters && (
            <Button type="link" size="small" onClick={onClear} className="!px-1">
              Clear all
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <section>
            <SectionTitle>Category</SectionTitle>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  className={
                    cat === category
                      ? "rounded-lg bg-green-600 px-3 py-1.5 text-left text-sm font-medium text-white transition-colors active:scale-[0.98]"
                      : "rounded-lg px-3 py-1.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-green-700"
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle>Price range</SectionTitle>
            <div className="flex items-center gap-2">
              <InputNumber
                prefix="₱"
                min={0}
                controls={false}
                placeholder="Min"
                value={draftMin}
                onChange={(value) => setDraftMin(value)}
                onBlur={commitPrice}
                onPressEnter={commitPrice}
                className="w-full"
              />
              <span className="text-gray-300">—</span>
              <InputNumber
                prefix="₱"
                min={0}
                controls={false}
                placeholder="Max"
                value={draftMax}
                onChange={(value) => setDraftMax(value)}
                onBlur={commitPrice}
                onPressEnter={commitPrice}
                className="w-full"
              />
            </div>
          </section>

          <section>
            <SectionTitle>Area</SectionTitle>
            <Select
              allowClear
              placeholder="Any area"
              value={area}
              options={areaOptions}
              onChange={(value) => onAreaChange(value)}
              className="w-full"
            />
          </section>
        </div>
      </aside>
    </>
  );
}
