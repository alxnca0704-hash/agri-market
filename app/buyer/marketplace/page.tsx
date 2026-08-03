import { Suspense } from "react";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";

function MarketplaceGridFallback() {
  return (
    <div className="py-20 text-center text-sm text-gray-400">
      Loading marketplace...
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceGridFallback />}>
      <MarketplaceGrid />
    </Suspense>
  );
}
