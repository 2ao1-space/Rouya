"use client";

import { useState } from "react";
import { Account } from "@/types/finance";
import { Modal } from "@/components/finance/Modal";
import { AccountSelector } from "@/components/finance/Accountselector";
import { formatCurrency } from "@/lib/format";

interface ZakatPayModalProps {
  accounts: Account[];
  remaining: number;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    recipient: string;
    accountId: string;
    notes?: string;
    proofFile?: File;
  }) => void;
}

export function ZakatPayModal({
  accounts,
  remaining,
  onClose,
  onSubmit,
}: ZakatPayModalProps) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [accountId, setAccountId] = useState<string | null>(
    accounts[0]?.id ?? null,
  );
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  function handleSubmit() {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return setError("اكتب مبلغ صحيح");
    if (!recipient.trim()) return setError("اكتب الجهة المستفيدة");
    if (!accountId) return setError("اختار الحساب");

    onSubmit({
      amount: numericAmount,
      recipient: recipient.trim(),
      accountId,
      notes: notes.trim() || undefined,
      proofFile: proofFile ?? undefined,
    });
    onClose();
  }

  return (
    <Modal title="دفع الزكاة" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <p className="text-xs text-neutral-500">
          المتبقي حاليًا: {formatCurrency(remaining)}
        </p>

        <div>
          <p className="text-xs text-neutral-500 mb-1.5">المبلغ المدفوع</p>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <p className="text-xs text-neutral-500 mb-1.5">الجهة المستفيدة</p>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
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
          <p className="text-xs text-neutral-500 mb-1.5">
            إثبات الدفع (اختياري)
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
            className="w-full text-xs"
          />
        </div>

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
          تأكيد الدفع
        </button>
      </div>
    </Modal>
  );
}
