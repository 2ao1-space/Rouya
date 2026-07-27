"use client"

import { useState } from "react"
import { Modal } from "@/components/finance/Modal"

const CONFIRM_WORD = "حذف"

export function DeleteAllDataModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void
  onConfirm: () => void
}) {
  const [input, setInput] = useState("")

  return (
    <Modal title="حذف كل البيانات" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <p className="text-sm text-neutral-700">
          هيتمسح كل حاجة نهائيًا (حسابات، معاملات، ديون، قروض، زكاة) ومش هينفع ترجعها تاني.
        </p>
        <p className="text-xs text-neutral-500">
          اكتب كلمة <b className="text-red-600">{CONFIRM_WORD}</b> عشان تأكد
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          disabled={input !== CONFIRM_WORD}
          onClick={onConfirm}
          className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          احذف كل البيانات نهائيًا
        </button>
      </div>
    </Modal>
  )
}