"use client";

import { QiyamData } from "@/hooks/useQiyam";

interface QiyamCardProps {
  data: QiyamData;
  onChange: (data: QiyamData) => void;
}

export function QiyamCard({ data, onChange }: QiyamCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-700">عدد الركعات</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onChange({ ...data, rakats: Math.max(0, data.rakats - 2) })
            }
            className="w-7 h-7 rounded-full border border-neutral-200 text-sm"
          >
            −
          </button>
          <span className="text-sm w-5 text-center">{data.rakats}</span>
          <button
            type="button"
            onClick={() => onChange({ ...data, rakats: data.rakats + 2 })}
            className="w-7 h-7 rounded-full border border-neutral-200 text-sm"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...data, shafa: !data.shafa })}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs ${
            data.shafa
              ? "bg-green-600 text-white"
              : "border border-neutral-200 text-neutral-700"
          }`}
        >
          {data.shafa && (
            <i className="ti ti-check text-sm" aria-hidden="true" />
          )}
          الشفع
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...data, witr: !data.witr })}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs ${
            data.witr
              ? "bg-green-600 text-white"
              : "border border-neutral-200 text-neutral-700"
          }`}
        >
          {data.witr && (
            <i className="ti ti-check text-sm" aria-hidden="true" />
          )}
          الوتر
        </button>
      </div>
    </div>
  );
}
