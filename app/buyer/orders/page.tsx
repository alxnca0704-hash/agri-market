import { Empty } from "antd";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 text-balance">
        Orders
      </h1>
      <Empty description="You have no orders yet" />
    </div>
  );
}
