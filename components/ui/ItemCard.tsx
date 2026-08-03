"use client";
import { StarFilled } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/lib/catalog";
import { formatPrice } from "@/components/item/formatPrice";
import StatusBadge from "@/components/item/StatusBadge";
import FavoriteButton from "@/components/item/FavoriteButton";

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
    category,
    location,
    seller,
    rating,
    quantity,
    status,
  } = item;
  const hasOptions = (item.options?.length ?? 0) > 0;

  const cardClasses = [
    "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm shadow-green-900/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/10",
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
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm shadow-gray-900/5 backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-gray-900">
            {name}
          </h3>
          <StatusBadge status={status} />
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
                  <span className="font-medium text-gray-700">
                    {rating.toFixed(1)}
                  </span>
                </span>
              </>
            )}
          </p>
        )}

        {location && <p className="text-xs text-gray-400">{location}</p>}
      </div>
    </>
  );

  return (
    <article className={cardClasses}>
      {href ? (
        <Link href={href} className="flex flex-1 flex-col">
          {body}
        </Link>
      ) : (
        <div className="flex flex-1 flex-col">{body}</div>
      )}

      <FavoriteButton
        itemId={item.id}
        className="absolute right-3 top-3 z-10 bg-white/90 shadow-sm shadow-gray-900/10 backdrop-blur-sm"
      />

      <div className="flex items-end justify-between gap-3 border-t border-gray-100 p-4 pt-3">
        <div>
          <p className="text-lg font-bold tabular-nums text-gray-900">
            {hasOptions && <span className="text-sm font-medium text-gray-400">from </span>}
            {formatPrice(price)}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            {unit}
            {quantity != null && ` \u00b7 ${quantity} left`}
          </p>
        </div>
      </div>
    </article>
  );
}
