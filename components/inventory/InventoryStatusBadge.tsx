import type { InventoryStatus } from "@/lib/inventory-core";

const STATUS_CONFIG: Record<
  InventoryStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  ok: {
    label: "In stock",
    dotClass: "bg-green-600",
    badgeClass: "bg-green-100 text-green-800",
  },
  low: {
    label: "Low stock",
    dotClass: "bg-amber-500",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  out: {
    label: "Out of stock",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-100 text-red-700",
  },
};

export default function InventoryStatusBadge({
  status,
}: {
  status: InventoryStatus;
}) {
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
