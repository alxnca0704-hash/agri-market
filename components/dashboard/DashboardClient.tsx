"use client";
import { useMemo } from "react";
import { Button } from "antd";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { getItem } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { useInventory } from "@/lib/inventory";
import { getInventoryStatus } from "@/lib/inventory-core";
import { useOrders } from "@/lib/orders";
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
  const orders = useOrders();

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
      <section
        aria-label="Welcome"
        className="relative mb-8 overflow-hidden rounded-3xl bg-paper shadow-soft ring-1 ring-gray-200/50"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-green-100/80 via-paper to-paper"
        />
        <div aria-hidden className="absolute inset-y-0 right-0 w-full max-w-xl">
          <Image
            src="https://picsum.photos/seed/agri-rice-field/1200/480"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover opacity-[0.07]"
          />
        </div>
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-sm font-medium text-green-800">
            Central Luzon &middot; Wet season
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 text-balance sm:text-4xl">
            Welcome back, Juan
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
            Here&apos;s what&apos;s happening on your farm today.
          </p>
        </div>
      </section>

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
          className="rounded-2xl bg-paper p-5 shadow-soft ring-1 ring-gray-200/50 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Low stock alerts
              </h2>
              {lowStockItems.length > 0 && (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-amber-800">
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
            <div className="flex flex-col items-start gap-3 rounded-xl bg-green-50/70 p-4">
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
                  <p className="shrink-0 font-mono text-sm tabular-nums text-gray-500">
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
                className="group flex items-center gap-4 rounded-2xl bg-paper p-4 shadow-soft ring-1 ring-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-lg text-green-700 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">
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
            className="rounded-2xl bg-paper p-5 shadow-soft ring-1 ring-gray-200/50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <UnorderedListOutlined />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-gray-900">
                  Orders
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  {orders.orders.length === 0
                    ? "No orders yet. Place one from your cart."
                    : `${orders.pendingCount} pending \u00b7 ${orders.receivedCount} received`}
                </p>
              </div>
            </div>
            {orders.orders.length > 0 && (
              <Link
                href="/buyer/orders"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 transition-colors hover:text-green-800"
              >
                View orders
                <ArrowRightOutlined className="text-xs" />
              </Link>
            )}
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
          className="rounded-2xl bg-paper p-6 shadow-soft ring-1 ring-gray-200/50"
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
