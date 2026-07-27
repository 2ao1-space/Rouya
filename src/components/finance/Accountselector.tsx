import { Account } from "@/types/finance";
import { ComponentType } from "react";

interface AccountSelectorProps {
  accounts: Account[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label?: string;
}

export function AccountSelector({
  accounts,
  selectedId,
  onSelect,
  label = "الحساب",
}: AccountSelectorProps) {
  return (
    <div>
      <p className="text-xs text-neutral-500 mb-1.5">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {accounts.map((account) => {
          const isSelected = account.id === selectedId;
          const Icon = account.icon as unknown as ComponentType<{
            className?: string;
            "aria-hidden"?: string;
          }>;
          return (
            <button
              key={account.id}
              type="button"
              onClick={() => onSelect(account.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm border transition-colors ${
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700"
              }`}
            >
              <Icon className="text-sm" aria-hidden="true" />
              {account.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
