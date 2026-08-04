"use client";
import { StarFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/lib/catalog";
import { formatPrice } from "@/components/item/formatPrice";
import FavoriteButton from "@/components/item/FavoriteButton";
import StatusBadge from "@/components/item/StatusBadge";

interface ItemCardProps {
  item: Item;
  href?: string;
  className?: string;
}

export default function ItemCard({ item, href, className }: ItemCardProps) {
  const {
    name,
    description,
    price,
    unit,
    image = "/store.png",
    location,
    seller,
    rating,
    quantity,
    status,
  } = item;
  const hasOptions = (item.options?.length ?? 0) > 0;
  const isOutOfStock = status === "out-of-stock";

  const cardClasses = [
    "group relative flex flex-col overflow-hidden rounded-2xl bg-paper shadow-soft ring-1 ring-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-within:ring-2 focus-within:ring-green-600/60",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={[
            "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
            isOutOfStock && "grayscale",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {status !== "available" && (
          <div className="absolute left-2.5 top-2.5 z-10">
            <StatusBadge status={status} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-2.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-gray-900 sm:text-base">
            {name}
          </h3>
        </div>

        {(seller || location) && (
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            {seller && <span>{seller}</span>}
            {seller && location && <span aria-hidden="true">·</span>}
            {location && <span>{location}</span>}
            {rating != null && (
              <span className="inline-flex items-center gap-1 text-gray-600">
                <StarFilled className="text-[11px] text-amber-500" />
                <span className="font-medium tabular-nums">
                  {rating.toFixed(1)}
                </span>
              </span>
            )}
          </p>
        )}

        {description && (
          <p className="hidden text-sm leading-relaxed text-gray-500 sm:line-clamp-2 sm:block">
            {description}
          </p>
        )}
      </div>
    </>
  );

  const footer = (
    <footer className="flex items-end justify-between gap-3 p-3 pt-1 sm:p-4 sm:pt-1">
      <div className="min-w-0">
        <p className="font-mono text-base font-semibold tabular-nums tracking-tight text-gray-900 sm:text-lg">
          {hasOptions && (
            <span className="text-xs font-medium text-gray-500 sm:text-sm">
              from{" "}
            </span>
          )}
          {formatPrice(price)}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{unit}</p>
      </div>
      {quantity != null && (
        <p className="shrink-0 text-xs font-medium tabular-nums text-gray-500">
          {quantity} left
        </p>
      )}
    </footer>
  );

  return (
    <article className={cardClasses}>
      {href ? (
        <Link href={href} className="flex flex-1 flex-col">
          {body}
          {footer}
        </Link>
      ) : (
        <div className="flex flex-1 flex-col">
          {body}
          {footer}
        </div>
      )}

      <FavoriteButton
        itemId={item.id}
        className="absolute right-2.5 top-2.5 z-10 bg-paper/90 ring-1 ring-gray-200/70 backdrop-blur-sm sm:right-3 sm:top-3"
      />
    </article>
  );
}
