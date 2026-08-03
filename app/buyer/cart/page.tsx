"use client";
import { App, Button, Empty, InputNumber } from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/components/item/formatPrice";

export default function CartPage() {
  const { lineItems, total, updateQuantity, removeItem, clear } = useCart();
  const { message } = App.useApp();

  if (lineItems.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
          Cart
        </h1>
        <Empty description="Your cart is empty">
          <Link href="/buyer/marketplace">
            <Button type="primary" color="yellow" icon={<ShoppingCartOutlined />}>
              Browse items
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
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
              key={line.item.id}
              className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4"
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
                    <p className="text-sm text-gray-400">{line.item.unit}</p>
                  </div>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    aria-label={`Remove ${line.item.name}`}
                    onClick={() => removeItem(line.item.id)}
                  />
                </div>

                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <InputNumber
                      min={1}
                      value={line.quantity}
                      onChange={(value) => updateQuantity(line.item.id, value ?? 1)}
                    />
                    <span className="text-sm text-gray-500">
                      {formatPrice(line.item.price)} each
                    </span>
                  </div>
                  <p className="text-lg font-bold tabular-nums text-gray-900">
                    {formatPrice(line.item.price * line.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-80">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Order summary
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Items</dt>
                <dd className="font-medium text-gray-900">
                  {lineItems.length}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="text-lg font-bold tabular-nums text-gray-900">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>
            <Button
              type="primary"
              color="yellow"
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
