"use client";
import { useMemo } from "react";
import { Button } from "antd";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { getItem } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { useInventory } from "@/lib/inventory";
import { getInventoryStatus } from "@/lib/inventory-core";
import { formatPrice } from "@/components/item/formatPrice";
import StatCard from "@/components/ui/StatCard";
import ItemCard from "@/components/ui/ItemCard";
import InventoryStatusBadge from "@/components/inventory/InventoryStatusBadge";

const QUICK_ACTIONS = [
  {
    title: "Browse supplies",
    description: "Seeds, fertilizer, feed, and tools from local sellers.",
    icon: <ShopOutlined />,
    href: "/buyer/marketplace",
    cta: "Go to marketplace",
  },
  {
    title: "Manage inventory",
    description: "Track what you have on hand and what needs restocking.",
    icon: <InboxOutlined />,
    href: "/buyer/inventory",
    cta: "Open inventory",
  },
  {
    title: "Review your cart",
    description: "Items you've chosen to buy are waiting for checkout.",
    icon: <ShoppingCartOutlined />,
    href: "/buyer/cart",
    cta: "View cart",
  },
];

export default function DashboardClient() {
  const cart = useCart();
  const favorites = useFavorites();
  const inventory = useInventory();

  const favoriteItems = useMemo(
    () =>
      favorites.ids
        .map((id) => getItem(id))
        .filter((item): item is NonNullable<typeof item> => item !== undefined),
    [favorites.ids]
  );

  const lowStockItems = inventory.items.filter(
    (item) => getInventoryStatus(item) !== "ok"
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-balance">
          Welcome back, Juan Cruz
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening on your farm today.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          label="Inventory items"
          value={`${inventory.count} item${inventory.count === 1 ? "" : "s"}`}
          hint={`${inventory.totalUnits} unit${inventory.totalUnits === 1 ? "" : "s"} on hand`}
          href="/buyer/inventory"
        />
        <StatCard
          label="Low stock alerts"
          value={inventory.lowStockCount}
          hint="At or below alert level"
          accent={inventory.lowStockCount > 0 ? "amber" : "green"}
          href="/buyer/inventory"
        />
        <StatCard
          label="Cart total"
          value={formatPrice(cart.total)}
          hint={`${cart.count} line item${cart.count === 1 ? "" : "s"}`}
          href="/buyer/cart"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section
          aria-label="Low stock alerts"
          className="rounded-2xl border border-gray-200 bg-white p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Low stock alerts
              </h2>
              {lowStockItems.length > 0 && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-amber-700">
                  {lowStockItems.length}
                </span>
              )}
            </div>
            <Link
              href="/buyer/inventory"
              className="text-sm font-medium text-green-700 transition-colors hover:text-green-800"
            >
              Manage inventory
            </Link>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-xl bg-green-50/60 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-green-700">
                <CheckCircleOutlined />
                Everything&apos;s stocked up
              </p>
              <p className="text-sm text-gray-500">
                No items are at or below their alert level. Track supplies in
                your inventory to keep it that way.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {lowStockItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.image ?? "/store.png"}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.category ?? "No category"}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm tabular-nums text-gray-500">
                    {item.quantity} {item.unit ?? "unit"} on hand
                    {item.lowStockThreshold > 0 && (
                      <span className="text-gray-400">
                        {" "}
                        · alert below {item.lowStockThreshold}
                      </span>
                    )}
                  </p>
                  <InventoryStatusBadge status={getInventoryStatus(item)} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-6">
          <section aria-label="Quick actions" className="space-y-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-[border-color,box-shadow] duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/[0.06]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg text-green-700">
                  {action.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">
                    {action.title}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {action.description}
                  </span>
                </span>
                <ArrowRightOutlined className="shrink-0 text-gray-300 transition-colors group-hover:text-green-600" />
              </Link>
            ))}
          </section>

          <section
            aria-label="Orders"
            className="rounded-2xl border border-dashed border-gray-300 bg-white p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
            <p className="mt-1 text-sm text-gray-500">
              You have no orders yet. Checkout is coming soon.
            </p>
          </section>
        </div>
      </div>

      {favoriteItems.length > 0 && (
        <section aria-label="Saved items">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Saved for later
            </h2>
            <Link
              href="/buyer/favorites"
              className="text-sm font-medium text-green-700 transition-colors hover:text-green-800"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {favoriteItems.slice(0, 4).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                href={`/buyer/marketplace/${item.id}`}
              />
            ))}
          </div>
        </section>
      )}

      {inventory.count === 0 && (
        <section
          aria-label="Getting started"
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Start tracking your farm inventory
              </h2>
              <p className="mt-1 max-w-xl text-sm text-gray-500">
                Add the supplies you have on hand and set alert levels, so you
                always know what to restock before planting season.
              </p>
            </div>
            <Link href="/buyer/inventory">
              <Button type="primary" icon={<InboxOutlined />}>
                Set up inventory
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
