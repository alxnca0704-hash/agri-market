"use client";
import { App, Button, Empty, InputNumber } from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { getItemOptionLabel } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/components/item/formatPrice";

export default function CartPage() {
  const { lineItems, total, updateQuantity, removeItem, clear } = useCart();
  const { message } = App.useApp();

  if (lineItems.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 text-balance">
          Cart
        </h1>
        <div className="rounded-3xl border border-dashed border-gray-300 bg-paper py-20 shadow-soft">
          <Empty description="Your cart is empty">
            <Link href="/buyer/marketplace">
              <Button type="primary" icon={<ShoppingCartOutlined />}>
                Browse items
              </Button>
            </Link>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 text-balance">
          Cart
        </h1>
        <Button
          type="text"
          danger
          onClick={() => {
            clear();
            message.info("Cart cleared");
          }}
        >
          Clear cart
        </Button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-4">
          {lineItems.map((line) => (
            <div
              key={line.key}
              className="flex gap-4 rounded-2xl bg-paper p-4 shadow-soft ring-1 ring-gray-200/50"
            >
              <Link
                href={`/buyer/marketplace/${line.item.id}`}
                className="shrink-0"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={line.item.image ?? "/store.png"}
                    alt={line.item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/buyer/marketplace/${line.item.id}`}
                      className="font-semibold text-gray-900 transition-colors hover:text-green-700"
                    >
                      {line.item.name}
                    </Link>
                    <p className="text-sm text-gray-400">
                      {line.item.unit}
                      {(() => {
                        const variant = getItemOptionLabel(
                          line.item,
                          line.selected
                        );
                        return variant ? ` \u00b7 ${variant}` : "";
                      })()}
                    </p>
                  </div>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    aria-label={`Remove ${line.item.name}`}
                    onClick={() => removeItem(line.key)}
                  />
                </div>

                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <InputNumber
                      min={1}
                      max={line.item.quantity}
                      value={line.quantity}
                      onChange={(value) => updateQuantity(line.key, value ?? 1)}
                    />
                    <span className="text-sm text-gray-500">
                      {formatPrice(line.unitPrice)} each
                    </span>
                  </div>
                  <p className="font-mono text-lg font-semibold tabular-nums text-gray-900">
                    {formatPrice(line.unitPrice * line.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-80">
          <div className="rounded-2xl bg-paper p-6 shadow-soft ring-1 ring-gray-200/50 lg:sticky lg:top-[88px]">
            <h2 className="text-lg font-semibold text-gray-900">
              Order summary
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Items</dt>
                <dd className="font-mono font-medium tabular-nums text-gray-900">
                  {lineItems.length}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-mono text-lg font-semibold tabular-nums text-gray-900">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>
            <Button
              type="primary"
              size="large"
              block
              className="mt-5"
              onClick={() => message.info("Checkout is coming soon")}
            >
              Proceed to Checkout
            </Button>
            <p className="mt-3 text-center text-xs text-gray-400">
              Checkout coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
