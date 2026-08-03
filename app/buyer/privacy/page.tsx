export const metadata = {
  title: "Privacy policy",
  description: "How AgriMarket collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-balance">
        Privacy policy
      </h1>
      <p className="mt-2 text-sm text-gray-500">Last updated August 3, 2026</p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            What we collect
          </h2>
          <p className="mt-2">
            We store the information you provide when using AgriMarket: your
            account details, saved favorites, and the contents of your cart. We
            do not collect payment details on this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            How we use it
          </h2>
          <p className="mt-2">
            Your data is used to keep your cart and favorites working across
            sessions and to deliver the marketplace experience you expect. We
            do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Data retention
          </h2>
          <p className="mt-2">
            Cart and favorites data stays in your browser. If you clear your
            browser data, this information is removed and cannot be recovered
            by us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Contact us
          </h2>
          <p className="mt-2">
            If you have questions about this policy, reach out through your
            buyer account or the seller you are purchasing from.
          </p>
        </section>
      </div>
    </div>
  );
}
