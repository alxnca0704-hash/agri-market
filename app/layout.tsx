import type { Metadata } from "next";
import { App, ConfigProvider } from "antd";
import { Outfit, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline",
  subsets: ["latin"],
  display: "swap",
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
      className={`${outfit.variable} ${splineMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-green-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#3e6b4d",
              colorInfo: "#3e6b4d",
              colorBgLayout: "#f3f1ed",
              colorBgContainer: "#fbfaf8",
              colorText: "#262320",
              colorTextSecondary: "#56504a",
              colorTextTertiary: "#8b857c",
              colorBorder: "#e7e4df",
              colorBorderSecondary: "#f2f0ed",
              colorSplit: "#e7e4df",
              borderRadius: 10,
              fontFamily:
                "var(--font-outfit), ui-sans-serif, system-ui, sans-serif",
            },
            components: {
              Menu: {
                itemSelectedBg: "#e3ebe4",
                itemSelectedColor: "#335740",
                itemHoverBg: "#f2f0ed",
                itemHoverColor: "#335740",
                itemBorderRadius: 8,
                activeBarWidth: 3,
              },
              Button: {
                fontWeight: 500,
                contentFontSizeLG: 15,
              },
              Badge: {
                colorPrimary: "#3e6b4d",
              },
              Segmented: {
                itemSelectedBg: "#3e6b4d",
                itemSelectedColor: "#ffffff",
              },
              Input: {
                activeShadow: "0 0 0 2px rgba(62, 107, 77, 0.15)",
              },
              InputNumber: {
                activeShadow: "0 0 0 2px rgba(62, 107, 77, 0.15)",
              },
              Rate: {
                starColor: "#c79c4f",
                starSize: 16,
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
