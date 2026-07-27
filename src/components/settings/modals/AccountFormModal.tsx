"use client"

import { useState } from "react"
import { Modal } from "@/components/finance/Modal"
import { AccountType } from "@/types/finance"

interface AccountFormModalProps {
  initial?: { name: string; type: AccountType }
  onClose: () => void
  onSubmit: (data: { name: string; type: AccountType; icon: string }) => void
}

const typeOptions: { type: AccountType; label: string; icon: string }[] = [
  { type: "cash", label: "كاش", icon: "ti-cash" },
  { type: "mobile_wallet", label: "محفظة موبايل", icon: "ti-device-mobile" },
  { type: "card", label: "فيزا/بطاقة", icon: "ti-credit-card" },
  { type: "bank", label: "حساب بنك", icon: "ti-building-bank" },
]

export function AccountFormModal({ initial, onClose, onSubmit }: AccountFormModalProps) {
  const [name, setName] = useState(initial?.name ?? "")
  const [type, setType] = useState<AccountType>(initial?.type ?? "cash")
  const [error, setError] = useState("")

  function handleSubmit() {
    if (!name.trim()) return setError("اكتب اسم الحساب")
    const icon = typeOptions.find((t) => t.type === type)?.icon ?? "ti-wallet"
    onSubmit({ name: name.trim(), type, icon })
    onClose()
  }

  return (
    <Modal title={initial ? "تعديل الحساب" : "إضافة حساب"} onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div>
          <p className="text-xs text-neutral-500 mb-1.5">اسم الحساب</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: فودافون كاش"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <p className="text-xs text-neutral-500 mb-1.5">نوع الحساب</p>
          <div className="flex gap-2 flex-wrap">
            {typeOptions.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setType(opt.type)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm border ${
                  type === opt.type
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                <i className={`ti ${opt.icon} text-sm`} aria-hidden="true" />
                {opt.label}
              </button>
            ))}
          </div>
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
  )
}