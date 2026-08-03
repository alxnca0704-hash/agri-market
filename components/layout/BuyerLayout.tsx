"use client";

import { Drawer, Layout } from "antd";
import Image from "next/image";
import { useState } from "react";
import BuyerHeader from "./BuyerHeader";
import BuyerSidebar from "./BuyerSidebar";

const { Content, Sider } = Layout;

export default function BuyerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Layout className="min-h-screen">
      <BuyerHeader onMenuClick={() => setDrawerOpen(true)} />
      <Layout className="flex-1">
        <Sider
          theme="light"
          width={232}
          breakpoint="md"
          collapsedWidth={0}
          trigger={null}
          className="border-r border-gray-200 bg-white"
          style={{ position: "sticky", top: 64, height: "calc(100vh - 64px)" }}
        >
          <BuyerSidebar />
        </Sider>
        <Content className="min-w-0 bg-gray-50 p-6">{children}</Content>
      </Layout> 
      <Drawer
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={232}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-4">
          <Image
            src="/store.png"
            alt="AgriMarket logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Agri<span className="text-green-600">Market</span>
          </span>
        </div>
        <BuyerSidebar onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </Layout>
  );
}
