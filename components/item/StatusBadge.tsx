import type { ItemStatus } from "@/lib/catalog";

const STATUS_CONFIG: Record<
  ItemStatus,
  { label: string; badgeClass: string }
> = {
  available: {
    label: "Available",
    badgeClass: "border-green-200 bg-green-50 text-green-700",
  },
  "low-stock": {
    label: "Low stock",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  "out-of-stock": {
    label: "Out of stock",
    badgeClass: "border-red-200 bg-red-50 text-red-600",
  },
};

export default function StatusBadge({ status }: { status: ItemStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`shrink-0 rounded-lg px-2 py-1 text-xs font-medium ${config.badgeClass}`}
    >
      {config.label}
    </span>
  );
}
