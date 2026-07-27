"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Modal } from "@/components/finance/Modal";
import { formatCurrency } from "@/lib/format";

function useFullMonthlyReport() {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const monthEnd = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth() + 1,
    0,
  )
    .toISOString()
    .split("T")[0];

  return useQuery({
    queryKey: ["fullMonthlyReport", monthStart],
    queryFn: async () => {
      const [txRes, prayerRes, quranRes, habitsRes, habitLogsRes, tasksRes] =
        await Promise.all([
          supabase
            .from("transactions")
            .select("*")
            .gte("date", monthStart)
            .lte("date", `${monthEnd}T23:59:59`),
          supabase
            .from("prayer_logs")
            .select("*")
            .gte("date", monthStart)
            .lte("date", monthEnd),
          supabase
            .from("quran_logs")
            .select("*")
            .gte("date", monthStart)
            .lte("date", monthEnd),
          supabase.from("habits").select("*").is("archived_at", null),
          supabase
            .from("habit_logs")
            .select("*")
            .gte("date", monthStart)
            .lte("date", monthEnd),
          supabase
            .from("daily_tasks")
            .select("*")
            .gte("date", monthStart)
            .lte("date", monthEnd),
        ]);

      const income =
        txRes.data
          ?.filter((t) => ["income", "salary", "debt"].includes(t.type))
          .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0;
      const expense =
        txRes.data
          ?.filter((t) => ["expense", "loan"].includes(t.type))
          .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0;

      const prayedTotal =
        prayerRes.data?.filter((r) => r.status === "prayed").length ?? 0;
      const missedTotal =
        prayerRes.data?.filter((r) => r.status === "missed").length ?? 0;

      const quranTotalPages =
        quranRes.data?.reduce((sum, r) => sum + r.pages_read, 0) ?? 0;
      const daysReadQuran =
        quranRes.data?.filter((r) => r.did_read || r.pages_read > 0).length ??
        0;

      const habitsSummary = (habitsRes.data ?? []).map((h) => ({
        name: h.name,
        doneDays:
          habitLogsRes.data?.filter((l) => l.habit_id === h.id && l.done)
            .length ?? 0,
      }));

      const tasksDone = tasksRes.data?.filter((t) => t.done).length ?? 0;
      const tasksTotal = tasksRes.data?.length ?? 0;

      return {
        monthLabel: lastMonth.toLocaleDateString("ar-EG", {
          month: "long",
          year: "numeric",
        }),
        income,
        expense,
        prayedTotal,
        missedTotal,
        quranTotalPages,
        daysReadQuran,
        habitsSummary,
        tasksDone,
        tasksTotal,
      };
    },
  });
}

export function MonthlyFullReportModal({ onClose }: { onClose: () => void }) {
  const { data: report, isLoading } = useFullMonthlyReport();

  return (
    <Modal title="تقرير الشهر الكامل" onClose={onClose}>
      {isLoading || !report ? (
        <p className="text-center text-sm text-neutral-400 py-6">
          بنجهز التقرير...
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium">{report.monthLabel}</p>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-neutral-50 p-3">
              <p className="text-[11px] text-neutral-500">إجمالي الدخل</p>
              <p className="text-sm font-semibold text-green-700">
                {formatCurrency(report.income)}
              </p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-3">
              <p className="text-[11px] text-neutral-500">إجمالي المصروف</p>
              <p className="text-sm font-semibold text-red-700">
                {formatCurrency(report.expense)}
              </p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-3">
              <p className="text-[11px] text-neutral-500">الصلوات</p>
              <p className="text-sm font-semibold">
                {report.prayedTotal} صليت · {report.missedTotal} فاتت
              </p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-3">
              <p className="text-[11px] text-neutral-500">القرآن</p>
              <p className="text-sm font-semibold">
                {report.quranTotalPages} صفحة في {report.daysReadQuran} يوم
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-neutral-500 mb-2">العادات</p>
            {report.habitsSummary.map((h) => (
              <div key={h.name} className="flex justify-between text-xs py-1">
                <span>{h.name}</span>
                <span className="text-neutral-500">{h.doneDays} يوم</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-neutral-50 p-3 flex justify-between text-sm">
            <span className="text-neutral-500">المهام</span>
            <span className="font-medium">
              {report.tasksDone} / {report.tasksTotal}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
