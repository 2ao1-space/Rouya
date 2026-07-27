"use client"

import { useState } from "react"
import { Account, Transaction } from "@/types/finance"
import { Modal } from "@/components/finance/Modal"
import { AccountSelector } from "@/components/finance/Accountselector"
import { ReasonInput } from "@/components/finance/ReasonInput"

interface EditTransactionModalProps {
  transaction: Transaction
  accounts: Account[]
  reasonSuggestions: string[]
  onClose: () => void
  onSave: (updated: {
    amount: number
    accountId: string
    toAccountId?: string
    reason: string
    notes?: string
  }) => void
}

const partyLabel: Partial<Record<Transaction["type"], string>> = {
  debt: "اقترضت من",
  loan: "هتسلف مين",
}

export function EditTransactionModal({
  transaction,
  accounts,
  reasonSuggestions,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const [amount, setAmount] = useState(String(transaction.amount))
  const [accountId, setAccountId] = useState<string | null>(transaction.accountId)
  const [toAccountId, setToAccountId] = useState<string | null>(transaction.toAccountId ?? null)
  const [reason, setReason] = useState(transaction.reason)
  const [notes, setNotes] = useState(transaction.notes ?? "")
  const [error, setError] = useState("")

  const isTransfer = transaction.type === "transfer"
  const isSalary = transaction.type === "salary"
  const isPartyType = transaction.type === "debt" || transaction.type === "loan"

  function handleSubmit() {
    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) return setError("اكتب مبلغ صحيح")
    if (!accountId) return setError("اختار الحساب")
    if (isTransfer && (!toAccountId || toAccountId === accountId)) {
      return setError("اختار حساب وجهة مختلف")
    }
    if (!isSalary && !reason.trim()) return setError("اكتب السبب")

    onSave({
      amount: numericAmount,
      accountId,
      toAccountId: isTransfer ? toAccountId! : undefined,
      reason: isSalary ? "راتب" : reason.trim(),
      notes: notes.trim() || undefined,
    })
    onClose()
  }

  return (
    <Modal title="تعديل المعاملة" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">المبلغ</p>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>

        <AccountSelector
          accounts={accounts}
          selectedId={accountId}
          onSelect={setAccountId}
          label={isTransfer ? "من حساب" : "الحساب"}
        />

        {isTransfer && (
          <AccountSelector
            accounts={accounts.filter((a) => a.id !== accountId)}
            selectedId={toAccountId}
            onSelect={setToAccountId}
            label="إلى حساب"
          />
        )}

        {!isSalary && !isTransfer && !isPartyType && (
          <ReasonInput value={reason} onChange={setReason} suggestions={reasonSuggestions} />
        )}

        {isPartyType && (
          <div>
            <p className="text-xs text-neutral-500 mb-1.5">{partyLabel[transaction.type]}</p>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
        )}

        {!isTransfer && !isSalary && (
          <div>
            <p className="text-xs text-neutral-500 mb-1.5">ملاحظات (اختياري)</p>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white"
        >
          حفظ التعديل
        </button>
      </div>
    </Modal>
  )
}