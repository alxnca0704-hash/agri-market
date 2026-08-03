"use client";

import { Avatar, Badge, Button, Dropdown, Input } from "antd";
import type { MenuProps } from "antd";
import {
  BellOutlined,
  HeartOutlined,
  LogoutOutlined,
  MenuOutlined,
  ProfileOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";

interface BuyerHeaderProps {
  onMenuClick: () => void;
}

const userMenuItems: MenuProps["items"] = [
  {
    key: "profile",
    icon: <ProfileOutlined />,
    label: <Link href="/buyer/profile">Profile</Link>,
  },
  {
    key: "orders",
    icon: <UnorderedListOutlined />,
    label: <Link href="/buyer/orders">My Orders</Link>,
  },
  { type: "divider" },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout",
  },
];

export default function BuyerHeader({ onMenuClick }: BuyerHeaderProps) {
  const router = useRouter();
  const { count: cartCount } = useCart();
  const { count: favoriteCount } = useFavorites();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-100 bg-white px-4 shadow-sm">
      <div className="md:hidden">
        <Button
          type="text"
          icon={<MenuOutlined />}
          aria-label="Open menu"
          onClick={onMenuClick}
        />
      </div>

      <Link href="/buyer/marketplace" className="flex items-center gap-2">
        <span className="hidden text-lg font-bold tracking-tight text-gray-900 sm:block">
          Agri<span className="text-green-600">Market</span>
        </span>
      </Link>

      <div className="ml-2 hidden md:block">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search products..."
          className="max-w-xs rounded-full lg:max-w-sm"
          onPressEnter={(e) => {
            const term = e.currentTarget.value.trim();
            router.push(
              term
                ? `/buyer/marketplace?q=${encodeURIComponent(term)}`
                : "/buyer/marketplace"
            );
          }}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Badge count={3} size="small">
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined />}
            aria-label="Notifications"
          />
        </Badge>
        <Badge count={favoriteCount} size="small">
          <Link href="/buyer/favorites">
            <Button
              type="text"
              shape="circle"
              icon={<HeartOutlined />}
              aria-label="Favorites"
            />
          </Link>
        </Badge>
        <Badge count={cartCount} size="small">
          <Link href="/buyer/cart">
            <Button
              type="text"
              shape="circle"
              icon={<ShoppingCartOutlined />}
              aria-label="Cart"
            />
          </Link>
        </Badge>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <button
            type="button"
            className="ml-1 flex cursor-pointer items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-50"
          >
            <Avatar className="bg-green-600" icon={<UserOutlined />} />
            <span className="hidden text-left lg:block">
              <span className="block text-sm font-medium leading-tight text-gray-900">
                Juan Cruz
              </span>
              <span className="block text-xs leading-tight text-gray-400">
                Buyer
              </span>
            </span>
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
