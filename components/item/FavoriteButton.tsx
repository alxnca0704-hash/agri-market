"use client";
import { App } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useFavorites } from "@/lib/favorites";

interface FavoriteButtonProps {
  itemId: string;
  className?: string;
}

export default function FavoriteButton({
  itemId,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const { message } = App.useApp();
  const favorited = isFavorite(itemId);

  return (
    <button
      type="button"
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      title={favorited ? "Remove from favorites" : "Save to favorites"}
      className={[
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => {
        toggle(itemId);
        message[favorited ? "info" : "success"](
          favorited ? "Removed from favorites" : "Added to favorites"
        );
      }}
    >
      {favorited ? (
        <HeartFilled className="text-[15px] text-red-500" />
      ) : (
        <HeartOutlined className="text-[15px] text-gray-500" />
      )}
    </button>
  );
}
