import { formatCurrency } from "@/lib/format";
import { Coins } from "lucide-react";

interface ZakatSectionProps {
  due: number;
  paid: number;
  onPayClick: () => void;
  onDetailsClick: () => void;
}

export function ZakatSection({
  due,
  paid,
  onPayClick,
  onDetailsClick,
}: ZakatSectionProps) {
  const remaining = due - paid;

  const progressPercent = due > 0 ? Math.min((paid / due) * 100, 100) : 0;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2.5">
        <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
          <Coins className="text-base" aria-hidden="true" />
          الزكاة
        </p>
        <div className="flex items-center justify-between mb-2.5">
          <button
            type="button"
            onClick={onPayClick}
            className="rounded-lg border border-neutral-200 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50"
          >
            دفع الزكاة
          </button>
          <button
            type="button"
            onClick={onDetailsClick}
            className="rounded-lg border border-neutral-200 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50"
          >
            التفاصيل
          </button>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-neutral-500 mb-2">
        <span>
          مستحق:{" "}
          <b className="font-medium text-neutral-900">{formatCurrency(due)}</b>
        </span>
        <span>
          مدفوع:{" "}
          <b className="font-medium text-neutral-900">{formatCurrency(paid)}</b>
        </span>
        <span>
          متبقي:{" "}
          <b className="font-medium text-amber-700">
            {formatCurrency(remaining)}
          </b>
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
