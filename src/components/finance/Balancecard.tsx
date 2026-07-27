import { formatCurrency } from "@/lib/format";

interface BalanceCardProps {
  totalBalance: number;
}

export function BalanceCard({ totalBalance }: BalanceCardProps) {
  return (
    <div className="rounded-xl bg-neutral-50 p-5">
      <p className="text-sm text-neutral-500 mb-1.5">الرصيد الحالي</p>
      <p className="text-3xl font-medium text-neutral-900">
        {formatCurrency(totalBalance)}
      </p>
    </div>
  );
}
