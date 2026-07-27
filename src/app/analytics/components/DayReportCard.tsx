"use client";

import {
  Moon,
  Repeat,
  MoonStar,
  BookOpen,
  Target,
  ListChecks,
  AlertCircle,
} from "lucide-react";
import { PrayerName, PrayerStatus } from "@/types/prayer";
import { PRAYER_ORDER, PRAYER_LABELS } from "@/lib/prayer";
import { Transaction } from "@/types/finance";
import { formatCurrency, formatTime, formatDate } from "@/lib/format";
import { useSetPrayerStatus } from "@/hooks/usePrayer";

interface DayReportCardProps {
  dateKey: string;
  transactions: Transaction[];
  prayers: Record<PrayerName, PrayerStatus>;
  adhkarMorningDone: boolean;
  adhkarEveningDone: boolean;
  qiyamRakats: number;
  quranPages: number;
  habitsDone: number;
  habitsTotal: number;
  tasksDone: number;
  tasksTotal: number;
}

export function DayReportCard({
  dateKey,
  transactions,
  prayers,
  adhkarMorningDone,
  adhkarEveningDone,
  qiyamRakats,
  quranPages,
  habitsDone,
  habitsTotal,
  tasksDone,
  tasksTotal,
}: DayReportCardProps) {
  const setPrayerStatus = useSetPrayerStatus(dateKey);

  const income = transactions
    .filter(
      (t) => t.type === "income" || t.type === "salary" || t.type === "debt",
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense" || t.type === "loan")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseByReason = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.reason] = (acc[t.reason] ?? 0) + t.amount;
      return acc;
    }, {});

  const missedPrayers = (Object.keys(prayers) as PrayerName[]).filter(
    (p) => prayers[p] === "missed",
  );
  const prayedCount = (Object.values(prayers) as PrayerStatus[]).filter(
    (s) => s === "prayed",
  ).length;

  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <p className="text-sm font-semibold mb-3">تقرير {formatDate(dateKey)}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg bg-neutral-50 px-2.5 py-2">
          <p className="text-[10px] text-neutral-500">دخل</p>
          <p className="text-sm font-semibold text-green-700 mt-0.5">
            +{formatCurrency(income)}
          </p>
        </div>
        <div className="rounded-lg bg-neutral-50 px-2.5 py-2">
          <p className="text-[10px] text-neutral-500">مصروف</p>
          <p className="text-sm font-semibold text-red-700 mt-0.5">
            -{formatCurrency(expense)}
          </p>
        </div>
      </div>

      {Object.keys(expenseByReason).length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {Object.entries(expenseByReason).map(([reason, amount]) => (
            <span
              key={reason}
              className="text-[10px] bg-neutral-100 rounded-full px-2 py-1"
            >
              {reason} {formatCurrency(amount)}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1.5 border-t border-neutral-100 pt-2.5 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            <Moon size={13} />
            الصلوات
          </span>
          <span>
            {prayedCount} / {PRAYER_ORDER.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            <Repeat size={13} />
            الأذكار
          </span>
          <span>
            صباح {adhkarMorningDone ? "✓" : "✗"} · مساء{" "}
            {adhkarEveningDone ? "✓" : "✗"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            <MoonStar size={13} />
            قيام الليل
          </span>
          <span>{qiyamRakats} ركعة</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            <BookOpen size={13} />
            القرآن
          </span>
          <span>{quranPages} صفحة</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            <Target size={13} />
            العادات
          </span>
          <span>
            {habitsDone} / {habitsTotal}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            <ListChecks size={13} />
            المهام
          </span>
          <span>
            {tasksDone} / {tasksTotal}
          </span>
        </div>
      </div>

      {missedPrayers.map((prayer) => (
        <div
          key={prayer}
          className="rounded-lg bg-red-50 px-2.5 py-2 flex items-center justify-between mb-2"
        >
          <span className="text-[11px] text-red-700 flex items-center gap-1.5">
            <AlertCircle size={13} />
            فاتتك صلاة {PRAYER_LABELS[prayer]}
          </span>
          <button
            type="button"
            onClick={() => setPrayerStatus.mutate({ prayer, status: "prayed" })}
            className="text-[10px] bg-neutral-900 text-white rounded-lg px-2.5 py-1"
          >
            أصليها دلوقتي
          </button>
        </div>
      ))}

      <div className="border-t border-neutral-100 pt-2.5">
        <p className="text-xs font-semibold mb-2">معاملات اليوم</p>
        {transactions.length === 0 ? (
          <p className="text-xs text-neutral-400">مفيش معاملات</p>
        ) : (
          <div className="flex flex-col">
            {transactions.map((tx, index) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between py-1.5 ${
                  index !== transactions.length - 1
                    ? "border-b border-neutral-100"
                    : ""
                }`}
              >
                <div>
                  <p className="text-xs">{tx.reason}</p>
                  <p className="text-[10px] text-neutral-400">
                    {formatTime(tx.date)}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium ${
                    tx.type === "expense" || tx.type === "loan"
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {tx.type === "expense" || tx.type === "loan" ? "-" : "+"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
