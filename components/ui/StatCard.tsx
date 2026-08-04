import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "green" | "amber" | "red";
  href?: string;
}

const ACCENT_CLASSES = {
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-600",
} as const;

export default function StatCard({
  label,
  value,
  hint,
  accent = "green",
  href,
}: StatCardProps) {
  const dot = <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${ACCENT_CLASSES[accent]}`} />;

  const content = (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/[0.06]">
      <div className="flex items-center gap-2">
        {dot}
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-gray-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
