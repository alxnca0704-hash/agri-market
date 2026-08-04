import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "green" | "amber" | "red";
  href?: string;
}

const ACCENT_CLASSES = {
  green: "bg-green-600",
  amber: "bg-amber-500",
  red: "bg-red-500",
} as const;

export default function StatCard({
  label,
  value,
  hint,
  accent = "green",
  href,
}: StatCardProps) {
  const dot = (
    <span
      aria-hidden
      className={`h-2 w-2 shrink-0 rounded-full ${ACCENT_CLASSES[accent]}`}
    />
  );

  const content = (
    <div className="group rounded-2xl bg-paper p-5 shadow-soft ring-1 ring-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center gap-2">
        {dot}
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold tabular-nums tracking-tight text-gray-900">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );

  return href ? (
    <Link href={href} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-600">
      {content}
    </Link>
  ) : (
    content
  );
}
