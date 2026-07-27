"use client"

import { Account, Transaction } from "@/types/finance"
import { Modal } from "@/components/finance/Modal"
import { formatCurrency, formatDate, formatTime } from "@/lib/format"

interface MonthlyTransactionsModalProps {
  transactions: Transaction[]
  accounts: Account[]
  onClose: () => void
}

const positiveTypes = new Set(["income", "salary", "debt"])
const reasonPrefix: Partial<Record<Transaction["type"], string>> = {
  debt: "دين من ",
  loan: "قرض لـ ",
}

function getAccountName(accounts: Account[], id: string) {
  return accounts.find((a) => a.id === id)?.name ?? "—"
}

export function MonthlyTransactionsModal({
  transactions,
  accounts,
  onClose,
}: MonthlyTransactionsModalProps) {
  const now = new Date()
  const monthTransactions = transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const totalIncome = monthTransactions
    .filter((t) => positiveTypes.has(t.type))
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = monthTransactions
    .filter((t) => t.type === "expense" || t.type === "loan")
    .reduce((sum, t) => sum + t.amount, 0)

  const groupedByDay = monthTransactions.reduce<Record<string, Transaction[]>>((groups, tx) => {
    const dayKey = new Date(tx.date).toDateString()
    if (!groups[dayKey]) groups[dayKey] = []
    groups[dayKey].push(tx)
    return groups
  }, {})

  const sortedDayKeys = Object.keys(groupedByDay).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <Modal title="معاملات الشهر" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {sortedDayKeys.length === 0 ? (
          <p className="text-center text-sm text-neutral-400 py-6">مفيش معاملات الشهر ده</p>
        ) : (
          sortedDayKeys.map((dayKey) => {
            const dayTransactions = groupedByDay[dayKey].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            return (
              <div key={dayKey}>
                <p className="text-xs font-medium text-neutral-500 mb-1.5">{formatDate(dayKey)}</p>
                <div className="rounded-xl border border-neutral-200 overflow-hidden">
                  {dayTransactions.map((tx, index) => {
                    const isPositive = positiveTypes.has(tx.type)
                    const label = `${reasonPrefix[tx.type] ?? ""}${tx.reason}`
                    return (
                      <div
                        key={tx.id}
                        className={`flex items-center justify-between px-4 py-2.5 ${
                          index !== dayTransactions.length - 1 ? "border-b border-neutral-100" : ""
                        }`}
                      >
                        <div>
                          <p className="text-sm text-neutral-900">{label}</p>
                          <p className="text-xs text-neutral-400">
                            {getAccountName(accounts, tx.accountId)} · {formatTime(tx.date)}
                          </p>
                        </div>
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
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}

        <div className="rounded-xl bg-neutral-50 p-4 flex flex-col gap-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">إجمالي الدخل</span>
            <span className="font-medium text-green-700">+{formatCurrency(totalIncome)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">إجمالي المصروف</span>
            <span className="font-medium text-red-700">-{formatCurrency(totalExpense)}</span>
          </div>
          <div className="flex justify-between text-sm pt-1.5 border-t border-neutral-200 mt-1">
            <span className="text-neutral-700 font-medium">الصافي</span>
            <span className="font-medium text-neutral-900">
              {formatCurrency(totalIncome - totalExpense)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  )
}