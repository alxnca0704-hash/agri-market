"use client";

import { Avatar, Badge, Button, Dropdown, Input } from "antd";
import type { MenuProps } from "antd";
import {
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
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
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

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-4.5 w-4.5" aria-hidden>
      <path
        d="M32 50v-16"
        stroke="#fbfaf8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M32 34c0-8-6-13-14-13 0 8 6 13 14 13z" fill="#fbfaf8" />
      <path d="M32 34c0-8 6-13 14-13 0 8-6 13-14 13z" fill="#fbfaf8" />
    </svg>
  );
}

export default function BuyerHeader({ onMenuClick }: BuyerHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const { count: favoriteCount } = useFavorites();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200/70 bg-paper/85 px-4 backdrop-blur-md sm:px-6">
      <div className="md:hidden">
        <Button
          type="text"
          icon={<MenuOutlined />}
          aria-label="Open menu"
          onClick={onMenuClick}
        />
      </div>

      <Link href="/buyer/marketplace" className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-600 shadow-soft transition-transform duration-200 hover:scale-105">
          <BrandMark />
        </span>
        <span className="hidden text-lg font-semibold tracking-tight text-gray-900 sm:block">
          AgriMarket
        </span>
      </Link>

      <div className="ml-2 hidden md:block">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search products..."
          className="w-56 lg:w-72"
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

      <div className="ml-auto flex items-center gap-1.5">
        <Badge count={favoriteCount} size="small">
          <Link href="/buyer/favorites">
            <Button
              type="text"
              shape="circle"
              icon={<HeartOutlined style={{ fontSize: 19 }} />}
              aria-label="Favorites"
              className="text-gray-600"
            />
          </Link>
        </Badge>
        <Badge count={cartCount} size="small">
          <Link href="/buyer/cart">
            <Button
              type="text"
              shape="circle"
              icon={<ShoppingCartOutlined style={{ fontSize: 19 }} />}
              aria-label="Cart"
              className="text-gray-600"
            />
          </Link>
        </Badge>
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: ({ key }) => {
              if (key === "logout") {
                logout();
                router.push("/login");
              }
            },
          }}
          placement="bottomRight"
        >
          <button
            type="button"
            className="ml-1 flex cursor-pointer items-center gap-2.5 rounded-full p-1 pr-2 transition-colors hover:bg-gray-100/80"
          >
            <Avatar size={38} className="bg-green-600" icon={<UserOutlined />} />
            <span className="hidden text-left lg:block">
              <span className="block text-sm font-medium leading-tight text-gray-900">
                {user?.name ?? "Guest"}
              </span>
              <span className="block text-xs leading-tight text-gray-400">
                {user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Buyer"}
              </span>
            </span>
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
