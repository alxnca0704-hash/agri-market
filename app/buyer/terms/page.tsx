export const metadata = {
  title: "Terms of service",
  description: "The terms that apply when you use AgriMarket.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 text-balance">
        Terms of service
      </h1>
      <p className="mt-2 text-sm text-gray-500">Last updated August 3, 2026</p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Using the marketplace
          </h2>
          <p className="mt-2">
            AgriMarket connects buyers with agricultural product sellers. By
            using the marketplace you agree to browse listings honestly and not
            interfere with other buyers or sellers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Listings and prices
          </h2>
          <p className="mt-2">
            Product details, stock levels, and prices are provided by sellers
            and may change without notice. Availability shown on a listing is
            an estimate, not a guarantee.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Purchases
          </h2>
          <p className="mt-2">
            Checkout and payment are handled outside this site. Terms for a
            specific purchase are agreed between you and the seller.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Changes to these terms
          </h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use of the
            marketplace after changes means you accept the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
