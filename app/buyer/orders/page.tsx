"use client";
import { App, Button, Empty, Switch } from "antd";
import { DeleteOutlined, ShopOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useOrders } from "@/lib/orders";
import type { Order } from "@/lib/orders-core";
import { formatPrice } from "@/components/item/formatPrice";
import StatCard from "@/components/ui/StatCard";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function OrderCard({
  order,
  number,
  onToggleReceived,
  onRemove,
}: {
  order: Order;
  number: number;
  onToggleReceived: (received: boolean) => void;
  onRemove: () => void;
}) {
  const { modal } = App.useApp();

  const confirmRemove = () => {
    modal.confirm({
      title: `Remove order ${number}?`,
      content: "This only removes the order from your list. Items already added to inventory stay.",
      okText: "Remove order",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: onRemove,
    });
  };

  return (
    <article className="rounded-2xl bg-paper shadow-soft ring-1 ring-gray-200/50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-base font-semibold text-gray-900">
            Order {number}
          </h2>
          <span className="font-mono text-xs tabular-nums text-gray-400">
            {formatDate(order.placedAt)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold tabular-nums text-gray-900">
            {formatPrice(order.total)}
          </span>
          <label className="flex cursor-pointer items-center gap-2">
            <Switch
              size="small"
              checked={order.received}
              onChange={onToggleReceived}
            />
            <span
              className={
                order.received ? "text-sm font-medium text-green-700" : "text-sm text-gray-500"
              }
            >
              Received
            </span>
          </label>
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            aria-label={`Remove order ${number}`}
            onClick={confirmRemove}
          />
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        {order.lines.map((line) => (
          <li key={line.id} className="flex items-center gap-3 px-5 py-3">
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
                {[line.variant, line.unit].filter(Boolean).join(" \u00b7 ")}
              </p>
            </div>
            <p className="shrink-0 text-sm text-gray-500">
              {line.quantity} &times;{" "}
              <span className="font-mono tabular-nums">
                {formatPrice(line.unitPrice)}
              </span>
            </p>
            <p className="w-24 shrink-0 text-right font-mono text-sm font-semibold tabular-nums text-gray-900">
              {formatPrice(line.unitPrice * line.quantity)}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function OrdersPage() {
  const { orders, pendingCount, receivedCount, markReceived, removeOrder } =
    useOrders();

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 text-balance">
          Orders
        </h1>
        <div className="rounded-3xl border border-dashed border-gray-300 bg-paper py-20 shadow-soft">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="You have no orders yet"
          >
            <p className="mx-auto max-w-sm pb-4 text-sm text-gray-500">
              Place an order from your cart and track it here. Once your
              supplies arrive, mark the order as received so you can add them
              to your farm inventory.
            </p>
            <Link href="/buyer/marketplace">
              <Button type="primary" icon={<ShopOutlined />}>
                Browse marketplace
              </Button>
            </Link>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 text-balance">
          Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Mark orders as received to add their items to your inventory.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatCard
          label="Pending"
          value={pendingCount}
          hint="Awaiting delivery"
          href="/buyer/orders"
        />
        <StatCard
          label="Received"
          value={receivedCount}
          hint="Ready for inventory"
          accent="green"
          href="/buyer/inventory"
        />
        <StatCard
          label="All orders"
          value={orders.length}
          hint={`${pendingCount} pending \u00b7 ${receivedCount} received`}
          href="/buyer/orders"
        />
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <OrderCard
            key={order.id}
            order={order}
            number={orders.length - index}
            onToggleReceived={(received) => markReceived(order.id, received)}
            onRemove={() => removeOrder(order.id)}
          />
        ))}
      </div>

      {receivedCount === 0 && (
        <p className="mt-6 flex items-center gap-2 rounded-xl bg-gray-100/70 p-4 text-sm text-gray-500">
          <UnorderedListOutlined />
          No received orders yet. Once you mark an order as received, its items
          will appear under &quot;Add from orders&quot; in your inventory.
        </p>
      )}
    </div>
  );
}
