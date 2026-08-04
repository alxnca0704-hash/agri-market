import { Empty } from "antd";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 text-balance">
        Orders
      </h1>
      <div className="rounded-3xl border border-dashed border-gray-300 bg-paper py-20 shadow-soft">
        <Empty description="You have no orders yet" />
      </div>
    </div>
  );
}
