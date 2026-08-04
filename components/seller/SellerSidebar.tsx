"use client";

import { Menu } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SellerSidebarProps {
  onNavigate?: () => void;
}

export default function SellerSidebar({ onNavigate }: SellerSidebarProps) {
  const pathname = usePathname();

  const items = [
    {
      key: "/seller/products",
      icon: <InboxOutlined />,
      label: <Link href="/seller/products">Products</Link>,
    },
  ];

  const selectedKey =
    items.find(
      (item) => pathname === item.key || pathname.startsWith(`${item.key}/`)
    )?.key ?? pathname;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <p className="px-6 pb-1 pt-5 text-xs font-medium text-gray-400">Seller</p>
      <Menu
        mode="inline"
        items={items}
        selectedKeys={[selectedKey]}
        onClick={onNavigate ? () => onNavigate() : undefined}
        className="!border-e-0"
      />
    </div>
  );
}
