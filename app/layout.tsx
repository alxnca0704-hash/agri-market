import type { Metadata } from "next";
import { App, ConfigProvider } from "antd";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriMarket",
  description: "Buy and sell agricultural products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConfigProvider
          theme={{
            token: { colorPrimary: "#16a34a" },
            components: {
              Menu: {
                itemSelectedBg: "#f0fdf4",
                itemSelectedColor: "#16a34a",
                itemHoverBg: "#f9fafb",
                itemBorderRadius: 8,
                activeBarWidth: 0,
                activeBarHeight: 0,
              },
            },
          }}
        >
          <App>{children}</App>
        </ConfigProvider>
      </body>
    </html>
  );
}
