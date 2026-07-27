"use client";

import { useState } from "react";
import { Account } from "@/types/finance";
import { Modal } from "@/components/finance/Modal";
import { AccountSelector } from "@/components/finance/Accountselector";
import { ReasonInput } from "@/components/finance/ReasonInput";

interface IncomeExpenseModalProps {
  type: "income" | "expense";
  accounts: Account[];
  reasonSuggestions: string[];
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    accountId: string;
    reason: string;
    notes?: string;
    date: string;
  }) => void;
}

export function IncomeExpenseModal({
  type,
  accounts,
  reasonSuggestions,
  onClose,
  onSubmit,
}: IncomeExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState<string | null>(
    accounts[0]?.id ?? null,
  );
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const title = type === "income" ? "إضافة دخل" : "إضافة مصروف";

  function handleSubmit() {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return setError("اكتب مبلغ صحيح");
    if (!accountId) return setError("اختار الحساب");
    if (!reason.trim()) return setError("اكتب السبب");

    onSubmit({
      amount: numericAmount,
      accountId,
      reason: reason.trim(),
      notes: notes.trim() || undefined,
      date: new Date().toISOString(),
    });
    onClose();
  }

  return (
    <Modal title={title} onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">المبلغ</p>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="٠"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>

        <AccountSelector
          accounts={accounts}
          selectedId={accountId}
          onSelect={setAccountId}
        />

        <ReasonInput
          value={reason}
          onChange={setReason}
          suggestions={reasonSuggestions}
        />

        <div>
          <p className="text-xs text-neutral-500 mb-1.5">ملاحظات (اختياري)</p>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white"
        >
          حفظ
        </button>
      </div>
    </Modal>
  );
}
