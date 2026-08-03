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
  title: {
    default: "AgriMarket",
    template: "%s | AgriMarket",
  },
  description: "Buy and sell agricultural products",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "AgriMarket",
    description: "Buy and sell agricultural products",
    type: "website",
    siteName: "AgriMarket",
  },
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-green-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
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
