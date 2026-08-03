import { Empty } from "antd";

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
        Favorites
      </h1>
      <Empty description="No saved items yet" />
    </div>
  );
}
