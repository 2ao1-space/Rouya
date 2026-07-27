"use client";

import { useState } from "react";
import { Account } from "@/types/finance";
import { Modal } from "@/components/finance/Modal";
import { AccountSelector } from "@/components/finance/Accountselector";

interface LoanModalProps {
  accounts: Account[];
  onClose: () => void;
  onSubmit: (data: {
    personName: string;
    amount: number;
    accountId: string;
    notes?: string;
  }) => void;
}

export function LoanModal({ accounts, onClose, onSubmit }: LoanModalProps) {
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState<string | null>(
    accounts[0]?.id ?? null,
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    const numericAmount = Number(amount);
    if (!personName.trim()) return setError("اكتب اسم اللي هتسلفه");
    if (!numericAmount || numericAmount <= 0) return setError("اكتب مبلغ صحيح");
    if (!accountId) return setError("اختار الحساب");

    onSubmit({
      personName: personName.trim(),
      amount: numericAmount,
      accountId,
      notes: notes.trim() || undefined,
    });
    onClose();
  }

  return (
    <Modal title="تسجيل قرض" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">هتسلف مين</p>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>

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
          label="هيتخصم من حساب"
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
