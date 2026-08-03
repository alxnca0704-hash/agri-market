"use client";

import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

interface BuyerSidebarProps {
  onNavigate?: () => void;
}

export default function BuyerSidebar({ onNavigate }: BuyerSidebarProps) {
  const pathname = usePathname();

  const items = [
    {
      key: "/buyer/marketplace",
      icon: <ShopOutlined />,
      label: <Link href="/buyer/marketplace">Marketplace</Link>,
    },
    {
      key: "/buyer/orders",
      icon: <UnorderedListOutlined />,
      label: <Link href="/buyer/orders">Orders</Link>,
    },
    {
      key: "/buyer/favorites",
      icon: <HeartOutlined />,
      label: <Link href="/buyer/favorites">Favorites</Link>,
    },
  ];

  return (
    <aside aria-label="Buyer navigation" className="flex h-full flex-col overflow-y-auto">
      <p className="px-6 pb-1 pt-4 text-xs text-gray-400">Buyer</p>
      <Menu
        mode="inline"
        items={items}
        selectedKeys={[pathname]}
        onClick={onNavigate ? () => onNavigate() : undefined}
        className="!border-e-0"
      />
    </aside>
  );
}
