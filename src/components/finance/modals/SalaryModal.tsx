"use client";

import { useState } from "react";
import { Account } from "@/types/finance";
import { Modal } from "@/components/finance/Modal";
import { AccountSelector } from "@/components/finance/Accountselector";
import { formatCurrency } from "@/lib/format";

interface SalaryModalProps {
  accounts: Account[];
  onClose: () => void;
  onSubmit: (data: { amount: number; accountId: string }) => void;
}

export function SalaryModal({ accounts, onClose, onSubmit }: SalaryModalProps) {
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState<string | null>(
    accounts[0]?.id ?? null,
  );
  const [error, setError] = useState("");

  const zakatPreview = amount ? Number(amount) * 0.025 : 0;

  function handleSubmit() {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return setError("اكتب مبلغ صحيح");
    if (!accountId) return setError("اختار الحساب");

    onSubmit({ amount: numericAmount, accountId });
    onClose();
  }

  return (
    <Modal title="إضافة راتب" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">مبلغ الراتب</p>
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
          label="هيتضاف على حساب"
        />

        {amount && Number(amount) > 0 && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            الزكاة المستحقة على الراتب ده: {formatCurrency(zakatPreview)}
          </p>
        )}

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
