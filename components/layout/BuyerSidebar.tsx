"use client";

import { Menu } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardOutlined,
  InboxOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

interface BuyerSidebarProps {
  onNavigate?: () => void;
}

export default function BuyerSidebar({ onNavigate }: BuyerSidebarProps) {
  const pathname = usePathname();

  const items = [
    {
      key: "/buyer/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/buyer/dashboard">Dashboard</Link>,
    },
    {
      key: "/buyer/marketplace",
      icon: <ShopOutlined />,
      label: <Link href="/buyer/marketplace">Marketplace</Link>,
    },
    {
      key: "/buyer/inventory",
      icon: <InboxOutlined />,
      label: <Link href="/buyer/inventory">Inventory</Link>,
    },
    {
      key: "/buyer/orders",
      icon: <UnorderedListOutlined />,
      label: <Link href="/buyer/orders">Orders</Link>,
    },
  ];

  const selectedKey =
    items.find((item) => pathname === item.key || pathname.startsWith(`${item.key}/`))
      ?.key ?? pathname;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <p className="px-6 pb-1 pt-5 text-xs font-medium text-gray-400">Buyer</p>
      <Menu
        mode="inline"
        items={items}
        selectedKeys={[selectedKey]}
        onClick={onNavigate ? () => onNavigate() : undefined}
        className="!border-e-0"
      />

      <div className="mt-auto px-4 pb-5 pt-6">
        <div className="rounded-2xl bg-green-50/80 p-4">
          <p className="text-sm font-semibold text-green-900">
            Planting season is near
          </p>
          <p className="mt-1 text-xs leading-relaxed text-green-800/80">
            Stock up on seeds, fertilizer, and tools before the rains.
          </p>
          <Link
            href="/buyer/marketplace"
            onClick={onNavigate ? () => onNavigate() : undefined}
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-green-700 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-green-800 active:scale-[0.98]"
          >
            Browse supplies
          </Link>
        </div>
      </div>
    </div>
  );
}
