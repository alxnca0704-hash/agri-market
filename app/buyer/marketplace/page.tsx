import { Suspense } from "react";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-gray-100 motion-reduce:animate-none" />
      <div className="space-y-2 p-3 sm:p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-100 motion-reduce:animate-none" />
        <div className="h-3 w-1/2 animate-pulse rounded-md bg-gray-100 motion-reduce:animate-none" />
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 p-3 sm:p-4">
        <div className="h-4 w-1/3 animate-pulse rounded-md bg-gray-100 motion-reduce:animate-none" />
        <div className="h-3 w-1/6 animate-pulse rounded-md bg-gray-100 motion-reduce:animate-none" />
      </div>
    </div>
  );
}

function MarketplaceGridFallback() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-100 motion-reduce:animate-none" />
        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-100 motion-reduce:animate-none" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1800px]:grid-cols-5 min-[2200px]:grid-cols-6">
        {Array.from({ length: 10 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
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
