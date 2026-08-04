import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-mist px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm font-semibold tracking-[0.18em] text-green-700">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 text-balance sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          The page you are looking for does not exist or has been moved. Head
          back to the marketplace to keep browsing.
        </p>
        <Link
          href="/buyer/marketplace"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Back to marketplace
        </Link>
      </div>
    </div>
  );
}
