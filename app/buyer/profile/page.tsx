import { Empty } from "antd";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 text-balance">
        Profile
      </h1>
      <Empty description="Account settings coming soon" />
    </div>
  );
}
