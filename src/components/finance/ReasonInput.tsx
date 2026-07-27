"use client";

import { useState } from "react";

interface ReasonInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  label?: string;
}

export function ReasonInput({
  value,
  onChange,
  suggestions,
  label = "السبب",
}: ReasonInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <div className="relative">
      <p className="text-xs text-neutral-500 mb-1.5">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder="مواصلات، أكل، راتب..."
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
      />
      {isOpen && value && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-sm max-h-40 overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => {
                onChange(s);
                setIsOpen(false);
              }}
              className="block w-full text-right px-3 py-2 text-sm hover:bg-neutral-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
