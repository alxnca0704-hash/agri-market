import type { ItemStatus } from "@/lib/catalog";

const STATUS_CONFIG: Record<
  ItemStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  available: {
    label: "Available",
    dotClass: "bg-green-600",
    badgeClass: "bg-green-100 text-green-800",
  },
  "low-stock": {
    label: "Low stock",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  "out-of-stock": {
    label: "Out of stock",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-100 text-red-700",
  },
};

export default function StatusBadge({ status }: { status: ItemStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${config.badgeClass}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}
      />
      {config.label}
    </span>
  );
}
