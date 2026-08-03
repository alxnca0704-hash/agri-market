"use client";
import { App, Button } from "antd";
import {
  EnvironmentOutlined,
  ShoppingCartOutlined,
  StarFilled,
} from "@ant-design/icons";
import Image from "next/image";
import type { Item } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { formatPrice } from "./formatPrice";
import StatusBadge from "./StatusBadge";
import FavoriteButton from "./FavoriteButton";

interface ItemDetailProps {
  item: Item;
}

export default function ItemDetail({ item }: ItemDetailProps) {
  const { addItem } = useCart();
  const { message } = App.useApp();
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

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            {category && (
              <p className="text-sm font-medium text-green-700">{category}</p>
            )}
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              {name}
            </h1>
          </div>
          <StatusBadge status={status} />
        </div>

        <p className="text-base leading-relaxed text-gray-600">
          {description}
        </p>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          {seller && (
            <p className="flex items-center gap-1.5">
              <span>{seller}</span>
              {rating != null && (
                <>
                  <span className="inline-flex items-center gap-0.5 text-amber-500">
                    <StarFilled className="text-xs" />
                    <span className="font-medium text-gray-700">
                      {rating.toFixed(1)}
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">
                    ({rating.toFixed(1)} rating)
                  </span>
                </>
              )}
            </p>
          )}
          {location && (
            <p className="flex items-center gap-1.5">
              <EnvironmentOutlined className="text-gray-400" />
              {location}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-3xl font-bold tabular-nums text-gray-900">
              {formatPrice(price)}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {unit}
              {quantity != null && ` \u00b7 ${quantity} left`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton itemId={item.id} />
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              color="yellow"
              disabled={isOutOfStock}
              onClick={() => {
                addItem(item);
                message.success(`${item.name} added to cart`);
              }}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
