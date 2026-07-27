"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { toDateKey, daysInMonth } from "@/lib/habits";
import { PRAYER_ORDER } from "@/lib/prayer";
import { useAnalyticsMonthTiers } from "./hooks/useAnalyticsMonthTiers";
import { useDayTransactions } from "./hooks/useDayTransactions";
import { usePrayerDay } from "@/hooks/usePrayer";
import { useAdhkarItems, useAdhkarProgress } from "@/hooks/useAdhkar";
import { useQiyamDay } from "@/hooks/useQiyam";
import { useQuranDay } from "@/hooks/useQuran";
import { useHabits, useHabitMonthLogs } from "@/hooks/useHabits";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import { AnalyticsCalendar } from "./components/AnalyticsCalendar";
import { DayReportCard } from "./components/DayReportCard";
import { MonthlyFullReportModal } from "./components/MonthlyFullReportModal";

export default function AnalyticsPage() {
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);

  const dateKey = toDateKey(selectedDate);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const monthStart = toDateKey(new Date(year, month, 1));
  const monthEnd = toDateKey(new Date(year, month, totalDays));

  const { data: tiersByDate = {} } = useAnalyticsMonthTiers(
    monthStart,
    monthEnd,
  );
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
  const { data: qiyam } = useQiyamDay(dateKey);
  const { data: quranPages = 0 } = useQuranDay(dateKey);
  const { data: habits = [] } = useHabits();
  const { data: habitLogs = {} } = useHabitMonthLogs(monthStart, monthEnd);
  const { data: tasks = [] } = useDailyTasks(dateKey);

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

  function handleChangeMonth(delta: number) {
    setMonthDate(new Date(year, month + delta, 1));
  }

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-lg px-4 py-6 pb-24 flex flex-col gap-5"
    >
      <AnalyticsCalendar
        monthDate={monthDate}
        tiersByDate={tiersByDate}
        selectedDateKey={dateKey}
        onSelectDate={(key) => setSelectedDate(new Date(key))}
        onChangeMonth={handleChangeMonth}
      />

      {prayers && (
        <DayReportCard
          dateKey={dateKey}
          transactions={transactions}
          prayers={prayers}
          adhkarMorningDone={adhkarMorningDone}
          adhkarEveningDone={adhkarEveningDone}
          qiyamRakats={qiyam?.rakats ?? 0}
          quranPages={quranPages}
          habitsDone={habitsDone}
          habitsTotal={habits.length}
          tasksDone={tasks.filter((t) => t.done).length}
          tasksTotal={tasks.length}
        />
      )}

      <button
        type="button"
        onClick={() => setShowMonthlyReport(true)}
        className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm text-white"
      >
        <FileText size={15} />
        تقرير الشهر الكامل
      </button>

      {showMonthlyReport && (
        <MonthlyFullReportModal onClose={() => setShowMonthlyReport(false)} />
      )}
    </div>
  );
}
