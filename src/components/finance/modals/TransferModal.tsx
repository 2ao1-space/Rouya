"use client";

import { useState } from "react";
import { Account } from "@/types/finance";
import { Modal } from "@/components/finance/Modal";
import { AccountSelector } from "@/components/finance/Accountselector";

interface TransferModalProps {
  accounts: Account[];
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    fromAccountId: string;
    toAccountId: string;
  }) => void;
}

export function TransferModal({
  accounts,
  onClose,
  onSubmit,
}: TransferModalProps) {
  const [amount, setAmount] = useState("");
  const [fromId, setFromId] = useState<string | null>(accounts[0]?.id ?? null);
  const [toId, setToId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function handleSubmit() {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return setError("اكتب مبلغ صحيح");
    if (!fromId || !toId) return setError("اختار الحسابين");
    if (fromId === toId) return setError("لازم الحسابين يكونوا مختلفين");

    onSubmit({
      amount: numericAmount,
      fromAccountId: fromId,
      toAccountId: toId,
    });
    onClose();
  }

  return (
    <Modal title="تحويل بين الحسابات" onClose={onClose}>
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
          selectedId={fromId}
          onSelect={setFromId}
          label="من حساب"
        />
        <AccountSelector
          accounts={accounts.filter((a) => a.id !== fromId)}
          selectedId={toId}
          onSelect={setToId}
          label="إلى حساب"
        />

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white"
        >
          تحويل
        </button>
      </div>
    </Modal>
  );
}
