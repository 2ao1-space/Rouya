import { formatCurrency } from "@/lib/format";

interface DailySummaryProps {
  todayIncome: number;
  todayExpense: number;
}

export function DailySummary({ todayIncome, todayExpense }: DailySummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-neutral-50 p-4">
        <p className="text-xs text-neutral-500 mb-1">دخل اليوم</p>
        <p className="text-lg font-medium text-green-700">
          +{formatCurrency(todayIncome)}
        </p>
      </div>
      <div className="rounded-xl bg-neutral-50 p-4">
        <p className="text-xs text-neutral-500 mb-1">مصروف اليوم</p>
        <p className="text-lg font-medium text-red-700">
          -{formatCurrency(todayExpense)}
        </p>
      </div>
    </div>
  );
}
