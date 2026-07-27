"use client";

import Link from "next/link";
import {
  Wallet,
  Clock,
  Repeat,
  BookOpen,
  Target,
  ChevronLeft,
} from "lucide-react";
import { toDateKey } from "@/lib/habits";
import { PRAYER_ORDER, PRAYER_LABELS } from "@/lib/prayer";
import { useAccounts } from "@/hooks/useAccounts";
import { useDayTransactions } from "@/hooks/useDayTransactions";
import { usePrayerDay } from "@/hooks/usePrayer";
import { useAdhkarItems, useAdhkarProgress } from "@/hooks/useAdhkar";
import { useQuranDay } from "@/hooks/useQuran";
import { useHabits, useHabitMonthLogs } from "@/hooks/useHabits";
import { useDailyTasks, useToggleDailyTask } from "@/hooks/useDailyTasks";
import { formatCurrency } from "@/lib/format";
import { Navbar } from "@/components/layout/Navbar";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { PrayerTimings } from "@/lib/prayerTimesApi";
import { PrayerName } from "@/types/prayer";

export default function DashboardPage() {
  const today = new Date();
  const dateKey = toDateKey(today);
  const monthStart = toDateKey(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const monthEnd = toDateKey(
    new Date(today.getFullYear(), today.getMonth() + 1, 0),
  );

  const { data: accounts = [] } = useAccounts();
  const { data: transactions = [] } = useDayTransactions(dateKey);
  const { data: prayers } = usePrayerDay(dateKey);
  const { data: morningItems = [] } = useAdhkarItems("morning");
  const { data: eveningItems = [] } = useAdhkarItems("evening");
  const { data: morningProgress = {} } = useAdhkarProgress(
    dateKey,
    morningItems.map((i) => i.id),
  );
  const { data: eveningProgress = {} } = useAdhkarProgress(
    dateKey,
    eveningItems.map((i) => i.id),
  );
  const { data: quranPages = 0 } = useQuranDay(dateKey);
  const { data: habits = [] } = useHabits();
  const { data: habitLogs = {} } = useHabitMonthLogs(monthStart, monthEnd);
  const { data: tasks = [] } = useDailyTasks(dateKey);
  const toggleTask = useToggleDailyTask(dateKey);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const income = transactions
    .filter((t) => ["income", "salary", "debt"].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => ["expense", "loan"].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  // const nextPrayer = prayers
  //   ? PRAYER_ORDER.find((p) => prayers[p] === "pending")
  //   : undefined;

  const adhkarMorningDone =
    morningItems.length > 0 &&
    morningItems.every(
      (item) => (morningProgress[item.id] ?? item.targetCount) <= 0,
    );
  const adhkarEveningDone =
    eveningItems.length > 0 &&
    eveningItems.every(
      (item) => (eveningProgress[item.id] ?? item.targetCount) <= 0,
    );

  const habitsDone = habits.filter(
    (h) => habitLogs[`${h.id}:${dateKey}`],
  ).length;

  const { data: prayerTimes } = usePrayerTimes(today);

  function getNextPrayer(times: PrayerTimings | undefined): PrayerName | null {
    if (!times) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of PRAYER_ORDER) {
      const [h, m] = times[prayer].split(":").map(Number);
      if (h * 60 + m > currentMinutes) return prayer;
    }
    return null;
  }

  const nextPrayer = getNextPrayer(prayerTimes);

  return (
    <div dir="rtl" className="px-4 py-6 pb-24 flex flex-col gap-4">
      <div>
        <p className="text-xs text-neutral-500 mb-1">
          {today.toLocaleDateString("ar-EG", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <p className="text-lg font-semibold">أهلاً 👋</p>
      </div>

      <div className="rounded-2xl bg-neutral-900 text-white p-5">
        <p className="text-xs text-white/55 mb-1">الرصيد الحالي</p>
        <p className="text-xl font-bold mb-2.5">
          {formatCurrency(totalBalance)}
        </p>
        <div className="flex gap-4 text-xs">
          <span className="text-green-300">↑ {formatCurrency(income)} دخل</span>
          <span className="text-red-300">
            ↓ {formatCurrency(expense)} مصروف
          </span>
        </div>
      </div>

      {nextPrayer && (
        <Link
          href="/prayer"
          className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 flex items-center justify-between"
        >
          <span className="flex items-center gap-2.5">
            <Clock size={18} />
            <span>
              <p className="text-sm font-semibold">
                الصلاة الجاية: {PRAYER_LABELS[nextPrayer]}
              </p>
            </span>
            <span>
              <p className="text-sm font-semibold">
                الصلاة الجاية: {PRAYER_LABELS[nextPrayer]}
              </p>
              <p className="text-xs text-neutral-500">
                {prayerTimes?.[nextPrayer]}
              </p>
            </span>
          </span>
          <ChevronLeft size={14} />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/adhkar"
          className="rounded-xl border border-neutral-200 p-3 flex items-center gap-2.5"
        >
          <Repeat
            size={20}
            className={
              adhkarMorningDone && adhkarEveningDone
                ? "text-green-600"
                : "text-neutral-400"
            }
          />
          <div>
            <p className="text-xs font-semibold">
              أذكار الصباح {adhkarMorningDone ? "✓" : ""}
            </p>
            <p className="text-[10px] text-neutral-400">
              أذكار المساء {adhkarEveningDone ? "✓" : "لسه"}
            </p>
          </div>
        </Link>
        <Link
          href="/adhkar"
          className="rounded-xl border border-neutral-200 p-3 flex items-center gap-2.5"
        >
          <BookOpen
            size={20}
            className={quranPages > 0 ? "text-green-600" : "text-neutral-400"}
          />
          <div>
            <p className="text-xs font-semibold">القرآن</p>
            <p className="text-[10px] text-neutral-400">
              {quranPages > 0 ? `${quranPages} صفحات ✓` : "لسه ما قريتش"}
            </p>
          </div>
        </Link>
      </div>

      <div className="rounded-xl border border-neutral-200 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold flex items-center gap-1.5">
            <Target size={14} />
            أهداف اليوم (العادات)
          </p>
          <span className="text-[11px] text-neutral-500">
            {habitsDone} / {habits.length}
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {habits.map((h) => {
            const done = habitLogs[`${h.id}:${dateKey}`];
            return (
              <span
                key={h.id}
                className={`text-[11px] px-2 py-1 rounded-lg ${done ? "bg-green-50 text-green-700" : "bg-neutral-50 text-neutral-500"}`}
              >
                {h.name} {done ? "✓" : ""}
              </span>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 p-3.5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold">مهام اليوم</p>
          <span className="text-[11px] text-neutral-500">
            {tasks.filter((t) => t.done).length} / {tasks.length}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() =>
                toggleTask.mutate({ taskId: task.id, done: !task.done })
              }
              className={`text-xs text-right ${task.done ? "line-through text-neutral-400" : ""}`}
            >
              {task.text}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] text-neutral-400 mb-2 px-0.5">صفحاتك</p>
        <div className="flex gap-2 overflow-x-auto">
          <Link
            href="/finance"
            className="flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 shrink-0"
          >
            <Wallet size={16} />
            <span className="text-[10px]">الماليات</span>
          </Link>
          <Link
            href="/habits"
            className="flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 shrink-0"
          >
            <Target size={16} />
            <span className="text-[10px]">العادات</span>
          </Link>
          <Link
            href="/notes"
            className="flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 shrink-0"
          >
            <BookOpen size={16} />
            <span className="text-[10px]">النوتس</span>
          </Link>
          <Link
            href="/analytics"
            className="flex flex-col items-center gap-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 shrink-0"
          >
            <Repeat size={16} />
            <span className="text-[10px]">التحليلات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
