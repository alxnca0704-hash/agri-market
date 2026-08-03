"use client";
import { App, Avatar, Button, Input, Rate } from "antd";
import {
  EnvironmentOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { Item, Review } from "@/lib/catalog";
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

  const {
    name,
    description,
    price,
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
              <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
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

          <dl className="grid grid-cols-1 gap-5 rounded-2xl bg-gray-50 p-5 sm:grid-cols-2">
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

          <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div>
              <p className="text-3xl font-bold tabular-nums text-gray-900">
                {formatPrice(price)}
              </p>
              <p className="mt-1 text-sm text-gray-400">{unit}</p>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton itemId={item.id} />
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                disabled={isOutOfStock}
                className="flex-1 sm:flex-none"
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

      <section className="border-t border-gray-100 pt-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            Reviews
          </h2>
          {reviewCount > 0 && (
            <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-medium text-green-700">
              {reviewCount}
            </span>
          )}
        </div>

        {reviewCount > 0 ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
            <div>
              <p className="text-5xl font-bold tabular-nums text-gray-900">
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
                        className="h-full rounded-full bg-amber-400"
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

        <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
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
