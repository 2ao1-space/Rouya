"use client";

interface NawafilCheckboxesProps {
  rakats: number;
  totalRakats: number;
  onChange: (rakats: number) => void;
}

// 🔧 كل مربع = ٢ ركعة
export function NawafilCheckboxes({
  rakats,
  totalRakats,
  onChange,
}: NawafilCheckboxesProps) {
  const boxCount = totalRakats / 2;
  if (boxCount === 0) return <div style={{ height: 14 }} />;

  const checkedBoxes = rakats / 2;

  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: boxCount }, (_, i) => {
        const isChecked = i < checkedBoxes;
        return (
          <button
            key={i}
            type="button"
            aria-label={isChecked ? "إلغاء ركعتين" : "٢ ركعة"}
            onClick={() => onChange(isChecked ? rakats - 2 : rakats + 2)}
            className={`w-3.5 h-3.5 rounded-[3px] ${
              isChecked ? "bg-green-600" : "border border-neutral-300"
            }`}
          />
        );
      })}
    </div>
  );
}
