import { Account, Transaction } from "@/types/finance";
import { formatCurrency, formatTime } from "@/lib/format";
import { Pencil, Trash2 } from "lucide-react";

interface TransactionsListProps {
  transactions: Transaction[];
  accounts: Account[];
  onViewAll: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const positiveTypes = new Set(["income", "salary", "debt"]);
const reasonPrefix: Partial<Record<Transaction["type"], string>> = {
  debt: "دين من ",
  loan: "قرض لـ ",
};

function getAccountName(accounts: Account[], id: string) {
  return accounts.find((a) => a.id === id)?.name ?? "—";
}

export function TransactionsList({
  transactions,
  accounts,
  onViewAll,
  onEdit,
  onDelete,
}: TransactionsListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-neutral-500">معاملات اليوم</p>
        <button
          type="button"
          onClick={onViewAll}
          className="rounded-lg border border-neutral-200 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50"
        >
          عرض كل المعاملات
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
          لسه مفيش معاملات النهاردة
        </p>
      ) : (
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          {transactions.map((tx, index) => {
            const isPositive = positiveTypes.has(tx.type);
            const label = `${reasonPrefix[tx.type] ?? ""}${tx.reason}`;
            return (
              <div
                key={tx.id}
                className={`flex items-center justify-between px-4 py-2.5 ${
                  index !== transactions.length - 1
                    ? "border-b border-neutral-100"
                    : ""
                }`}
              >
                <div>
                  <p className="text-sm text-neutral-900">{label}</p>
                  <p className="text-xs text-neutral-400">
                    {getAccountName(accounts, tx.accountId)} ·{" "}
                    {formatTime(tx.date)}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-sm font-medium ${
                      tx.type === "transfer"
                        ? "text-neutral-500"
                        : isPositive
                          ? "text-green-700"
                          : "text-red-700"
                    }`}
                  >
                    {tx.type === "transfer" ? "" : isPositive ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEdit(tx)}
                    aria-label="تعديل"
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <Pencil className="text-sm" aria-hidden="true" />{" "}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(tx)}
                    aria-label="حذف"
                    className="text-neutral-400 hover:text-red-600"
                  >
                    <Trash2 className="text-sm" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
