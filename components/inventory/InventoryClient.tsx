"use client";
import { useMemo, useState } from "react";
import { Button, Empty, Input, Select } from "antd";
import {
  DownOutlined,
  PlusOutlined,
  SearchOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { getCategories } from "@/lib/catalog";
import { useInventory } from "@/lib/inventory";
import type { InventoryItem } from "@/lib/inventory-core";
import type { OrderLine } from "@/lib/orders-core";
import StatCard from "@/components/ui/StatCard";
import InventoryFormModal, {
  type InventoryFormValues,
  type InventoryPrefill,
} from "./InventoryFormModal";
import InventoryCatalogPicker from "./InventoryCatalogPicker";
import InventoryTable from "./InventoryTable";

const ALL = "All";
const CATEGORIES = [ALL, ...getCategories()];

export default function InventoryClient() {
  const {
    items,
    totalUnits,
    lowStockCount,
    outOfStockCount,
    addItem,
    updateItem,
  } = useInventory();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [prefill, setPrefill] = useState<InventoryPrefill | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== ALL && item.category !== category) {
        return false;
      }
      if (term) {
        const haystack = [item.name, item.category, item.unit, item.notes]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [items, search, category]);

  const openAddForm = () => {
    setEditing(null);
    setPrefill(null);
    setFormOpen(true);
  };

  const openEditForm = (item: InventoryItem) => {
    setEditing(item);
    setPrefill(null);
    setFormOpen(true);
  };

  const pickFromOrder = (line: OrderLine) => {
    setPickerOpen(false);
    setEditing(null);
    setPrefill({
      name: line.name,
      category: line.category,
      unit: line.unit,
      image: line.image,
      quantity: line.quantity,
    });
    setFormOpen(true);
  };

  const handleSubmit = (values: InventoryFormValues) => {
    if (editing) {
      updateItem(editing.id, values);
    } else {
      addItem(values);
    }
    setFormOpen(false);
    setEditing(null);
    setPrefill(null);
  };

  const hasItems = items.length > 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 text-balance">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track the supplies on hand at your farm
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={<ShopOutlined />} onClick={() => setPickerOpen(true)}>
            Add from orders
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddForm}
          >
            Add item
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          label="On hand"
          value={`${totalUnits} unit${totalUnits === 1 ? "" : "s"}`}
          hint={`${items.length} item${items.length === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Low stock"
          value={lowStockCount}
          hint="At or below alert level"
          accent="amber"
        />
        <StatCard
          label="Out of stock"
          value={outOfStockCount}
          hint="Restock needed"
          accent="red"
        />
      </div>

      {hasItems && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search inventory..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
            className="rounded-lg sm:max-w-xs"
          />
          <Select
            value={category}
            options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
            onChange={setCategory}
            suffixIcon={<DownOutlined />}
            popupMatchSelectWidth={false}
            className="sm:min-w-40"
          />
        </div>
      )}

      {!hasItems ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-paper py-20 shadow-soft">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Your farm inventory is empty"
          >
            <p className="mx-auto max-w-sm pb-4 text-sm text-gray-500">
              Place an order and mark it as received to add the supplies you
              have on hand, so you always know what needs restocking.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAddForm}
              >
                Add item
              </Button>
              <Button
                icon={<ShopOutlined />}
                onClick={() => setPickerOpen(true)}
              >
                Add from orders
              </Button>
            </div>
          </Empty>
        </div>
      ) : filtered.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`No items match your ${search ? `search for "${search}"` : "filters"}`}
          className="rounded-3xl border border-dashed border-gray-300 bg-paper py-20 shadow-soft"
        />
      ) : (
        <InventoryTable items={filtered} onEdit={openEditForm} />
      )}

      <InventoryFormModal
        open={formOpen}
        initial={editing}
        prefill={prefill}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
          setPrefill(null);
        }}
        onSubmit={handleSubmit}
      />
      <InventoryCatalogPicker
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        onSelect={pickFromOrder}
      />
    </div>
  );
}
