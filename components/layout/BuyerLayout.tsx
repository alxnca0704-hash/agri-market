"use client";

import { Drawer, Layout } from "antd";
import Link from "next/link";
import { useState } from "react";
import BuyerHeader from "./BuyerHeader";
import BuyerSidebar from "./BuyerSidebar";

const { Content } = Layout;

export default function BuyerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Layout className="min-h-[100dvh]">
      <BuyerHeader onMenuClick={() => setDrawerOpen(true)} />

      <aside
        aria-label="Buyer navigation"
        className="fixed bottom-0 left-0 top-16 z-20 hidden w-60 flex-col border-r border-gray-200/60 bg-paper/80 backdrop-blur-md lg:flex"
      >
        <BuyerSidebar />
      </aside>

      <Layout className="min-w-0 flex-1 lg:pl-60">
        <Content id="main" className="min-w-0 flex-1 p-6 sm:p-8 lg:p-10">
          {children}
        </Content>

        <footer className="flex flex-col gap-2 border-t border-gray-200/70 bg-paper/60 px-6 py-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>&copy; 2026 AgriMarket. All rights reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-4">
            <Link
              href="/buyer/privacy"
              className="transition-colors hover:text-green-700"
            >
              Privacy
            </Link>
            <Link
              href="/buyer/terms"
              className="transition-colors hover:text-green-700"
            >
              Terms
            </Link>
          </nav>
        </footer>
      </Layout>

      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={232}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green-600">
            <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden>
              <path
                d="M32 50v-16"
                stroke="#fbfaf8"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M32 34c0-8-6-13-14-13 0 8 6 13 14 13z"
                fill="#fbfaf8"
              />
              <path
                d="M32 34c0-8 6-13 14-13 0 8-6 13-14 13z"
                fill="#fbfaf8"
              />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            AgriMarket
          </span>
        </div>
        <BuyerSidebar onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </Layout>
  );
}
