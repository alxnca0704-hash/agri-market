import BuyerLayout from "@/components/layout/BuyerLayout";

export default function BuyerRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <BuyerLayout>{children}</BuyerLayout>;
}
