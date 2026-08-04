import { SignIn, SignUp } from "@clerk/nextjs";
import { authAppearance } from "./clerkAppearance";

function BrandMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M32 50v-16"
        stroke="#fbfaf8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M32 34c0-8-6-13-14-13 0 8 6 13 14 13z" fill="#fbfaf8" />
      <path d="M32 34c0-8 6-13 14-13 0 8-6 13-14 13z" fill="#fbfaf8" />
    </svg>
  );
}

const FEATURES = [
  {
    title: "Direct from local farms",
    description: "Source fresh produce straight from trusted growers.",
  },
  {
    title: "Live community pricing",
    description: "See real market prices across your region.",
  },
  {
    title: "Verified buyers & sellers",
    description: "Trade with a marketplace you can rely on.",
  },
];

function BrandPanel() {
  return (
    <section
      aria-label="About AgriMarket"
      className="hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-green-700 via-green-800 to-green-950 p-12 text-white lg:flex"
    >
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
          <BrandMark className="h-6 w-6" />
        </span>
        <h2 className="mt-8 max-w-md text-4xl font-semibold tracking-tight text-balance">
          The market for farm-fresh produce
        </h2>
        <p className="mt-3 max-w-md text-green-100/90">
          AgriMarket connects local growers with the people who feed their
          communities.
        </p>
      </div>

      <ul className="space-y-5">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-400/20 text-green-200 ring-1 ring-green-300/30">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                <path
                  d="m3.5 8.5 3 3 6-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <span className="block font-semibold text-white">
                {feature.title}
              </span>
              <span className="mt-0.5 block text-sm text-green-100/80">
                {feature.description}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AuthShell({
  mode,
}: {
  mode: "sign-in" | "sign-up";
}) {
  const isSignIn = mode === "sign-in";

  return (
    <main className="grid min-h-[100dvh] bg-gradient-to-br from-green-50 via-paper to-paper lg:grid-cols-2">
      <BrandPanel />

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 shadow-soft lg:hidden">
              <BrandMark />
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 text-balance sm:mt-5 lg:mt-0 lg:text-4xl">
              {isSignIn
                ? "Sign in to AgriMarket"
                : "Create your AgriMarket account"}
            </h1>
            <p className="mt-1.5 max-w-sm text-sm text-gray-500">
              {isSignIn
                ? "Welcome back — continue with email or a social provider."
                : "Sign up with email, Google, Facebook, or Apple."}
            </p>
          </div>

          {isSignIn ? (
            <SignIn
              path="/login"
              appearance={authAppearance}
              signUpUrl="/signup"
              forceRedirectUrl="/"
            />
          ) : (
            <SignUp
              path="/signup"
              appearance={authAppearance}
              signInUrl="/login"
              forceRedirectUrl="/onboarding"
            />
          )}
        </div>
      </section>
    </main>
  );
}
