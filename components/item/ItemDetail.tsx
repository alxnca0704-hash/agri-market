"use client";
import { App, Avatar, Button, Input, InputNumber, Rate, Segmented } from "antd";
import {
  EnvironmentOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { Item, Review } from "@/lib/catalog";
import {
  buildDefaultSelection,
  getItemOptionLabel,
  getItemOptionPrice,
} from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { formatPrice } from "./formatPrice";
import StatusBadge from "./StatusBadge";
import FavoriteButton from "./FavoriteButton";
import ImageGallery from "./ImageGallery";

interface ItemDetailProps {
  item: Item;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ItemDetail({ item }: ItemDetailProps) {
  const { addItem } = useCart();
  const { message } = App.useApp();
  const [reviews, setReviews] = useState<Review[]>(item.reviews ?? []);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    buildDefaultSelection(item)
  );
  const [qty, setQty] = useState(1);

  const unitPrice = getItemOptionPrice(item, selection);
  const lineTotal = unitPrice * qty;

  const {
    name,
    description,
    unit,
    image = "/store.png",
    images,
    category,
    location,
    seller,
    rating,
    quantity,
    status,
  } = item;
  const isOutOfStock = status === "out-of-stock";
  const galleryImages = images && images.length > 0 ? images : [image];
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : rating;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => Math.round(review.rating) === star).length;
    return {
      star,
      count,
      pct: reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0,
    };
  });

  function handleSubmitReview() {
    const trimmedAuthor = author.trim();
    const trimmedComment = comment.trim();
    if (!trimmedAuthor || !trimmedComment) {
      message.warning("Add your name and a short comment first");
      return;
    }
    const newReview: Review = {
      id: `local-${Date.now()}`,
      author: trimmedAuthor,
      rating: formRating,
      date: new Date().toISOString().slice(0, 10),
      comment: trimmedComment,
    };
    setReviews((prev) => [newReview, ...prev]);
    setAuthor("");
    setComment("");
    setFormRating(5);
    message.success("Thanks for the review");
  }

  function handleOptionChange(optionId: string, value: string) {
    setSelection((prev) => ({ ...prev, [optionId]: value }));
  }

  function handleAddToCart() {
    addItem(item, selection, qty);
    const variant = getItemOptionLabel(item, selection);
    message.success(
      variant
        ? `${item.name} (${variant}) added to cart`
        : `${item.name} added to cart`
    );
  }

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        <ImageGallery images={galleryImages} alt={name} />

        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              {category && (
                <p className="text-sm font-medium text-green-700">{category}</p>
              )}
              <h1 className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-gray-900 text-balance sm:text-3xl md:text-4xl">
                {name}
              </h1>
            </div>
            <StatusBadge status={status} />
          </div>

          {rating != null && (
            <div className="flex items-center gap-2">
              <Rate
                disabled
                allowHalf
                value={averageRating ?? 0}
                style={{ fontSize: 14 }}
              />
              <span className="text-sm font-semibold tabular-nums text-gray-900">
                {averageRating?.toFixed(1) ?? "—"}
              </span>
              {reviewCount > 0 && (
                <span className="text-sm text-gray-400">
                  ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
              )}
            </div>
          )}

          <p className="max-w-prose text-base leading-relaxed text-gray-600">
            {description}
          </p>

          <dl className="grid grid-cols-1 gap-5 rounded-2xl bg-gray-100/70 p-5 sm:grid-cols-2">
            {seller && (
              <div>
                <dt className="text-xs font-medium text-gray-400">Seller</dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900">{seller}</dd>
              </div>
            )}
            {location && (
              <div>
                <dt className="text-xs font-medium text-gray-400">Origin</dt>
                <dd className="mt-0.5 flex items-center gap-1 text-sm font-medium text-gray-900">
                  <EnvironmentOutlined className="text-gray-400" />
                  {location}
                </dd>
              </div>
            )}
            {category && (
              <div>
                <dt className="text-xs font-medium text-gray-400">Category</dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900">{category}</dd>
              </div>
            )}
            {unit && (
              <div>
                <dt className="text-xs font-medium text-gray-400">Packaging</dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900">{unit}</dd>
              </div>
            )}
            {quantity != null && (
              <div>
                <dt className="text-xs font-medium text-gray-400">Availability</dt>
                <dd
                  className={`mt-0.5 text-sm font-medium ${
                    quantity === 0 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {quantity === 0
                    ? "Out of stock"
                    : `${quantity} ${quantity === 1 ? "unit" : "units"} left`}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-auto flex flex-col gap-5 border-t border-gray-100 pt-5">
            {item.options?.map((option) => (
              <div key={option.id}>
                <p className="text-sm font-medium text-gray-700">
                  {option.label}
                </p>
                <Segmented
                  block
                  value={selection[option.id]}
                  disabled={isOutOfStock}
                  onChange={(value) =>
                    handleOptionChange(option.id, String(value))
                  }
                  options={option.choices.map((choice) => ({
                    value: choice.value,
                    label: (
                      <span className="flex flex-col items-center py-0.5 leading-tight">
                        <span>{choice.label}</span>
                        <span className="text-xs font-normal text-gray-500">
                          {formatPrice(choice.price)}
                        </span>
                      </span>
                    ),
                  }))}
                  className="mt-2"
                />
              </div>
            ))}

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="mt-0.5 font-mono text-3xl font-semibold tabular-nums text-gray-900">
                  {formatPrice(lineTotal)}
                </p>
                <p className="mt-1 text-sm text-gray-400">{unit}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Qty</span>
                  <InputNumber
                    min={1}
                    max={item.quantity}
                    value={qty}
                    disabled={isOutOfStock}
                    onChange={(value) => setQty(value ?? 1)}
                  />
                </div>
                <FavoriteButton itemId={item.id} />
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  disabled={isOutOfStock}
                  className="flex-1 sm:flex-none"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-gray-100 pt-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            Reviews
          </h2>
          {reviewCount > 0 && (
            <span className="rounded-md bg-green-100 px-2.5 py-0.5 font-mono text-sm font-semibold tabular-nums text-green-800">
              {reviewCount}
            </span>
          )}
        </div>

        {reviewCount > 0 ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
            <div>
              <p className="font-mono text-5xl font-semibold tabular-nums text-gray-900">
                {averageRating?.toFixed(1)}
              </p>
              <Rate
                disabled
                allowHalf
                value={averageRating ?? 0}
                style={{ fontSize: 16, marginTop: 8 }}
              />
              <div className="mt-4 space-y-1.5">
                {distribution.map((row) => (
                  <div key={row.star} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-3 tabular-nums">{row.star}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-green-600"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <article key={review.id} className="flex gap-3">
                  <Avatar
                    src={review.avatar}
                    icon={<UserOutlined />}
                    shape="square"
                    className="bg-green-600"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {review.author}
                      </span>
                      <Rate
                        disabled
                        value={review.rating}
                        style={{ fontSize: 12 }}
                      />
                      <span className="text-xs text-gray-400">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            No reviews yet. Be the first to leave one.
          </p>
        )}

        <div className="mt-8 rounded-2xl bg-gray-100/70 p-5 ring-1 ring-gray-200/50">
          <h3 className="text-sm font-semibold text-gray-900">Leave a review</h3>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-500">Your rating</span>
            <Rate value={formRating} onChange={setFormRating} />
          </div>
          <Input
            placeholder="Your name"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="mt-3"
          />
          <Input.TextArea
            rows={3}
            maxLength={300}
            showCount
            placeholder="Share your experience with this product"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="mt-3"
          />
          <Button type="primary" className="mt-3" onClick={handleSubmitReview}>
            Submit review
          </Button>
        </div>
      </section>
    </div>
  );
}
