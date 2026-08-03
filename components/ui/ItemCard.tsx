"use client";
import { Button } from "antd";
import { ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import Image from "next/image";
import type { ItemCardProps, ItemStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  ItemStatus,
  { label: string; badgeClass: string }
> = {
  available: {
    label: "Available",
    badgeClass: "border-green-200 bg-green-50 text-green-700",
  },
  "low-stock": {
    label: "Low stock",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  "out-of-stock": {
    label: "Out of stock",
    badgeClass: "border-red-200 bg-red-50 text-red-600",
  },
};

const formatPrice = (price: number) =>
  price.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  });

export default function ItemCard({
  item,
  onAddToCart,
  className,
}: ItemCardProps) {
  const {
    name,
    description,
    price,
    unit,
    image = "/store.png",
    category,
    location,
    seller,
    rating,
    quantity,
    status,
  } = item;
  const isOutOfStock = status === "out-of-stock";
  const statusConfig = STATUS_CONFIG[status];

  const cardClasses = [
    "group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg hover:shadow-green-900/10",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClasses}>
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-gray-900">
            {name}
          </h3>
          <span
            className={`shrink-0 rounded-lg  px-2 py-1 text-xs font-medium ${statusConfig.badgeClass}`}
          >
            {statusConfig.label}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
          {description}
        </p>

        {seller && (
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <span>{seller}</span>
            {rating != null && (
              <>
                <span className="inline-block h-0.5 w-0.5 rounded-full bg-gray-300" />
                <span className="inline-flex items-center gap-0.5 text-amber-500">
                  <StarFilled className="text-[11px]" />
                  <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
                </span>
              </>
            )}
          </p>
        )}

        {location && (
          <p className="text-xs text-gray-400">{location}</p>
        )}

        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-lg font-bold tabular-nums text-gray-900">
              {formatPrice(price)}
            </p>
            <p className="text-xs text-gray-400">
              {unit}
              {quantity != null && ` \u00b7 ${quantity} left`}
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            color="yellow"
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(item)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}
