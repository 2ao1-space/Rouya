"use client"

import { useState } from "react"

interface ProfileFormProps {
  name: string
  birthDate: string | null
  onSave: (data: { name: string; birthDate: string | null }) => void
}

export function ProfileForm({ name: initialName, birthDate: initialBirthDate, onSave }: ProfileFormProps) {
  const [name, setName] = useState(initialName)
  const [birthDate, setBirthDate] = useState(initialBirthDate ?? "")

  function handleBlur() {
    onSave({ name: name.trim(), birthDate: birthDate || null })
  }

  return (
    <div className="rounded-xl bg-neutral-50 p-4 flex flex-col gap-2.5">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        placeholder="الاسم"
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white"
      />
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        onBlur={handleBlur}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white"
      />
    </div>
  )
}