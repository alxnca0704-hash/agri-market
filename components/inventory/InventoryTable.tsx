"use client";
import { App, Button, InputNumber } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import type { InventoryItem } from "@/lib/inventory-core";
import { getInventoryStatus } from "@/lib/inventory-core";
import { useInventory } from "@/lib/inventory";
import InventoryStatusBadge from "./InventoryStatusBadge";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
}

export default function InventoryTable({
  items,
  onEdit,
}: InventoryTableProps) {
  const { updateItem, adjustQuantity, removeItem } = useInventory();
  const { modal } = App.useApp();

  const confirmDelete = (item: InventoryItem) => {
    modal.confirm({
      title: `Remove ${item.name}?`,
      content: "This removes the item from your farm inventory.",
      okText: "Remove",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => removeItem(item.id),
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const status = getInventoryStatus(item);

        return (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={item.image ?? "/store.png"}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <InventoryStatusBadge status={status} />
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  {[item.category, item.unit].filter(Boolean).join(" · ") ||
                    "No category"}
                  {item.lowStockThreshold > 0 && (
                    <span className="text-gray-400">
                      {" "}
                      · alert below {item.lowStockThreshold}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
              <div className="flex items-center gap-2">
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  aria-label={`Decrease quantity of ${item.name}`}
                  onClick={() => adjustQuantity(item.id, -1)}
                />
                <InputNumber
                  min={0}
                  value={item.quantity}
                  className="w-20"
                  aria-label={`Quantity of ${item.name}`}
                  onChange={(quantity) =>
                    updateItem(item.id, { quantity: quantity ?? 0 })
                  }
                />
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  aria-label={`Increase quantity of ${item.name}`}
                  onClick={() => adjustQuantity(item.id, 1)}
                />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  aria-label={`Edit ${item.name}`}
                  onClick={() => onEdit(item)}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`Remove ${item.name}`}
                  onClick={() => confirmDelete(item)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
