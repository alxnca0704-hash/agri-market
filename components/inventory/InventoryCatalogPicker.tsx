"use client";
import { Input, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useMemo, useState } from "react";
import { listItems, type Item } from "@/lib/catalog";
import { formatPrice } from "@/components/item/formatPrice";

interface InventoryCatalogPickerProps {
  open: boolean;
  onCancel: () => void;
  onSelect: (item: Item) => void;
}

export default function InventoryCatalogPicker({
  open,
  onCancel,
  onSelect,
}: InventoryCatalogPickerProps) {
  const [query, setQuery] = useState("");

  const items = useMemo(
    () =>
      listItems({ search: query, sort: "name-asc" }).filter(
        (item) => (item.quantity ?? 0) > 0
      ),
    [query]
  );

  return (
    <Modal
      title="Add from catalog"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={560}
    >
      <Input
        prefix={<SearchOutlined className="text-gray-400" />}
        placeholder="Search products..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mb-3 rounded-lg"
        allowClear
      />
      <ul className="max-h-96 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-green-50"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={item.image ?? "/store.png"}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.name}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {[item.category, item.unit].filter(Boolean).join(" · ") ||
                    "Farm supplies"}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                {formatPrice(item.price)}
              </span>
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-2 py-10 text-center text-sm text-gray-500">
            No products match &quot;{query}&quot;
          </li>
        )}
      </ul>
    </Modal>
  );
}
