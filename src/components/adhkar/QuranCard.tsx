"use client";

import { useState } from "react";

type Unit = "page" | "quarter" | "juz";

const UNIT_TO_PAGES: Record<Unit, number> = { page: 1, quarter: 5, juz: 20 };
const UNIT_LABELS: Record<Unit, string> = {
  page: "صفحة",
  quarter: "ربع",
  juz: "جزء",
};
const UNIT_ICONS: Record<Unit, string> = {
  page: "ti-file-text",
  quarter: "ti-stack-2",
  juz: "ti-books",
};

// 🔧 هدف يومي بسيط بس عشان الدايرة تحسب نسبة - غيّره لو حابب
const DAILY_TARGET_PAGES = 20;

interface QuranCardProps {
  pages: number;
  onAdd: (amount: number, unit: Unit) => void;
}

function toJuzLabel(pages: number): string {
  if (pages === 0) return "لسه ما بدأتش";
  const juz = Math.ceil(pages / 20);
  return `≈ جزء ${juz} من ٣٠`;
}

export function QuranCard({ pages, onAdd }: QuranCardProps) {
  const [unit, setUnit] = useState<Unit>("page");
  const [amount, setAmount] = useState("");

  const percent = Math.min((pages / DAILY_TARGET_PAGES) * 100, 100);
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (percent / 100) * circumference;

  function handleAdd() {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return;
    onAdd(numericAmount, unit);
    setAmount("");
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 flex items-center gap-4">
        <div className="relative w-[72px] h-[72px] shrink-0">
          <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="#16a34a"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <i
              className="ti ti-book-2 text-lg text-green-700"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs text-neutral-500 mb-1">القرآن الكريم</p>
          <p className="text-lg font-semibold text-neutral-900">{pages} صفحة</p>
          <p className="text-xs text-neutral-400">{toJuzLabel(pages)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(["page", "quarter", "juz"] as Unit[]).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs ${
              unit === u
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 text-neutral-700"
            }`}
          >
            <i className={`ti ${UNIT_ICONS[u]} text-xs`} aria-hidden="true" />
            {UNIT_LABELS[u]}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`كام ${UNIT_LABELS[unit]}؟`}
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white"
        >
          إضافة
        </button>
      </div>
    </div>
  );
}
