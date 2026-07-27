"use client";

import { useState } from "react";
import { Account } from "@/types/finance";
import { Modal } from "@/components/finance/Modal";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  useZakatPayments,
  useDeleteZakatPayment,
  ZakatPaymentRecord,
} from "@/hooks/useZakat";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

function getAccountName(accounts: Account[], id: string) {
  return accounts.find((a) => a.id === id)?.name ?? "—";
}

export function ZakatHistoryModal({
  accounts,
  onClose,
  onEdit,
}: {
  accounts: Account[];
  onClose: () => void;
  onEdit: (payment: ZakatPaymentRecord) => void;
}) {
  const { data: payments = [] } = useZakatPayments();
  const deletePayment = useDeleteZakatPayment();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <Modal title="تفاصيل الزكاة" onClose={onClose}>
      <div className="flex flex-col gap-3">
        {payments.length === 0 ? (
          <p className="text-center text-sm text-neutral-400 py-6">
            لسه مفيش دفعات زكاة
          </p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-xl border border-neutral-200 p-3 flex gap-3"
            >
              {payment.proofImageUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewImage(payment.proofImageUrl)}
                  className="shrink-0"
                >
                  <Image
                    src={payment.proofImageUrl}
                    alt="إثبات الدفع"
                    className="w-14 h-14 rounded-lg object-cover border border-neutral-200"
                  />
                </button>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                  {payment.recipient}
                </p>
                <p className="text-xs text-neutral-500">
                  {getAccountName(accounts, payment.accountId)} ·{" "}
                  {formatDate(payment.date)}
                </p>
                {payment.notes && (
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {payment.notes}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-sm font-medium text-red-700">
                  -{formatCurrency(payment.amount)}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(payment)}
                    aria-label="تعديل"
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <Pencil className="text-sm" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm("متأكد إنك عايز تحذف دفعة الزكاة دي؟")
                      ) {
                        deletePayment.mutate(payment.id);
                      }
                    }}
                    aria-label="حذف"
                    className="text-neutral-400 hover:text-red-600"
                  >
                    <Trash2 className="text-sm" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <Image
            src={previewImage}
            alt="إثبات الدفع بالحجم الكامل"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </Modal>
  );
}
