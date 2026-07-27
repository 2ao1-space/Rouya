"use client";

import { useState } from "react";
import { History, CheckSquare, Square, Trash2 } from "lucide-react";
import { toDateKey } from "@/lib/habits";
import {
  useDailyTasks,
  useAddDailyTask,
  useToggleDailyTask,
  useDeleteDailyTask,
} from "@/hooks/useDailyTasks";

export function DailyTasksCard() {
  const [viewDate, setViewDate] = useState(new Date());
  const dateKey = toDateKey(viewDate);
  const isToday = dateKey === toDateKey(new Date());

  const { data: tasks = [] } = useDailyTasks(dateKey);
  const addTask = useAddDailyTask(dateKey);
  const toggleTask = useToggleDailyTask(dateKey);
  const deleteTask = useDeleteDailyTask(dateKey);

  const [newTask, setNewTask] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const doneCount = tasks.filter((t) => t.done).length;

  function handleAdd() {
    if (!newTask.trim()) return;
    addTask.mutate(newTask.trim());
    setNewTask("");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-neutral-500">
          مهام {isToday ? "النهاردة" : dateKey}
        </p>
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1 text-xs"
        >
          <History size={12} />
          الأيام السابقة
        </button>
      </div>

      {showHistory && (
        <div className="mb-3 flex items-center gap-2">
          <input
            type="date"
            max={toDateKey(new Date())}
            value={dateKey}
            onChange={(e) => setViewDate(new Date(e.target.value))}
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          />
          {!isToday && (
            <button
              type="button"
              onClick={() => setViewDate(new Date())}
              className="text-xs text-neutral-500 underline"
            >
              رجوع للنهاردة
            </button>
          )}
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 p-4">
        <p className="text-xs text-neutral-500 mb-2">
          {tasks.length === 0
            ? "مفيش مهام"
            : `أنجزت ${doneCount} من ${tasks.length}`}
        </p>

        <div className="flex flex-col gap-1.5">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 py-1">
              <button
                type="button"
                onClick={() =>
                  toggleTask.mutate({ taskId: task.id, done: !task.done })
                }
                aria-label="تم"
              >
                {task.done ? (
                  <CheckSquare size={18} className="text-green-600" />
                ) : (
                  <Square size={18} className="text-neutral-300" />
                )}
              </button>
              <span
                className={`flex-1 text-sm ${task.done ? "line-through text-neutral-400" : "text-neutral-900"}`}
              >
                {task.text}
              </span>
              <button
                type="button"
                onClick={() => deleteTask.mutate(task.id)}
                aria-label="حذف"
                className="text-neutral-300 hover:text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {isToday && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="مهمة جديدة..."
              className="flex-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-xs"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs text-white"
            >
              إضافة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
