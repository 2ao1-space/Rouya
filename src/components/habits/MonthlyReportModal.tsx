"use client";

import { Modal } from "@/components/finance/Modal";
import { useMonthlyReport } from "@/hooks/useMonthlyReport";
import { MOOD_OPTIONS } from "@/lib/habits";
import { formatDate } from "@/lib/format";

export function MonthlyReportModal({ onClose }: { onClose: () => void }) {
  const { data: report, isLoading } = useMonthlyReport();

  return (
    <Modal title="تقرير الشهر اللي فات" onClose={onClose}>
      {isLoading || !report ? (
        <p className="text-center text-sm text-neutral-400 py-6">
          بنجهز التقرير...
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-sm font-medium text-neutral-900">
            {report.monthLabel}
          </p>

          <div>
            <p className="text-xs text-neutral-500 mb-2">العادات</p>
            {report.habits.length === 0 ? (
              <p className="text-xs text-neutral-400">مفيش عادات مسجلة</p>
            ) : (
              <div className="flex flex-col gap-2">
                {report.habits.map((habit) => (
                  <div
                    key={habit.habitId}
                    className="rounded-lg border border-neutral-200 p-3"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm flex items-center gap-2">
                        {habit.name}
                        {habit.badge && (
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">
                            {habit.badge.emoji} {habit.badge.label}
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {habit.doneDays} / {habit.totalDays} يوم
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full bg-green-600"
                        style={{
                          width: `${(habit.doneDays / habit.totalDays) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-neutral-500 mb-2">مزاجك خلال الشهر</p>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="flex flex-col items-center gap-1 rounded-lg bg-neutral-50 p-2"
                >
                  <span className="text-lg">{option.emoji}</span>
                  <span className="text-xs font-medium">
                    {report.moodCounts[option.value]}
                  </span>
                </div>
              ))}
            </div>
            {report.dominantMood && (
              <p className="text-xs text-neutral-400 mt-2">
                الغالب على مزاجك الشهر ده كان{" "}
                {
                  MOOD_OPTIONS.find((m) => m.value === report.dominantMood)
                    ?.label
                }
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-neutral-500 mb-2">المهام اليومية</p>
            <div className="rounded-lg bg-neutral-50 p-3 mb-2 flex justify-between text-sm">
              <span className="text-neutral-500">إجمالي المهام</span>
              <span className="font-medium">
                {report.totalTasksDone} / {report.totalTasksCreated} خلصت
              </span>
            </div>
            {report.taskDays.length > 0 && (
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {report.taskDays.map((day) => (
                  <div
                    key={day.date}
                    className="flex justify-between text-xs px-2 py-1"
                  >
                    <span className="text-neutral-500">
                      {formatDate(day.date)}
                    </span>
                    <span
                      className={
                        day.done === day.total
                          ? "text-green-600"
                          : "text-neutral-700"
                      }
                    >
                      {day.done} / {day.total}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
