"use client";
import { Button, Empty, Input, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useOrders } from "@/lib/orders";
import type { OrderLine } from "@/lib/orders-core";
import { formatPrice } from "@/components/item/formatPrice";

interface InventoryCatalogPickerProps {
  open: boolean;
  onCancel: () => void;
  onSelect: (line: OrderLine) => void;
}

export default function InventoryCatalogPicker({
  open,
  onCancel,
  onSelect,
}: InventoryCatalogPickerProps) {
  const { receivedOrders } = useOrders();
  const [query, setQuery] = useState("");

  const lines = useMemo(() => {
    const term = query.trim().toLowerCase();
    return receivedOrders.flatMap((order) =>
      order.lines.filter((line) =>
        term
          ? [line.name, line.variant, line.category].filter(Boolean).join(" ")
              .toLowerCase()
              .includes(term)
          : true
      )
    );
  }, [receivedOrders, query]);

  const hasOrders = receivedOrders.length > 0;

  return (
    <Modal
      title="Add from received orders"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={560}
    >
      {hasOrders ? (
        <>
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search received items..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mb-3 rounded-lg"
            allowClear
          />
          <ul className="max-h-96 overflow-y-auto">
            {lines.map((line) => (
              <li key={`${line.id}-${line.quantity}-${line.unitPrice}`}>
                <button
                  type="button"
                  onClick={() => onSelect(line)}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={line.image ?? "/store.png"}
                      alt={line.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {line.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {[line.variant, line.unit]
                        .filter(Boolean)
                        .join(" \u00b7 ") || "Farm supplies"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-sm font-semibold tabular-nums text-gray-900">
                      {formatPrice(line.unitPrice)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Ordered {line.quantity} {line.unit}
                    </p>
                  </div>
                </button>
              </li>
            ))}
            {lines.length === 0 && (
              <li className="px-2 py-10 text-center text-sm text-gray-500">
                No received items match &quot;{query}&quot;
              </li>
            )}
          </ul>
        </>
      ) : (
        <div className="py-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No received orders yet"
          >
            <p className="mx-auto max-w-sm pb-4 text-sm text-gray-500">
              Mark an order as received on the Orders page to add its items to
              your inventory.
            </p>
            <Button type="primary" onClick={onCancel}>
              Close
            </Button>
          </Empty>
        </div>
      )}
    </Modal>
  );
}
