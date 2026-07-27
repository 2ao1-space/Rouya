import { TransactionType } from "@/types/finance";
import {
  type LucideIcon,
  Plus,
  Minus,
  Briefcase,
  ArrowDownUpIcon,
  HandCoins,
} from "lucide-react";

interface QuickActionsProps {
  onAction: (type: TransactionType) => void;
}

const actions: { type: TransactionType; label: string; icon: LucideIcon }[] = [
  { type: "income", label: "دخل", icon: Plus },
  { type: "expense", label: "مصروف", icon: Minus },
  { type: "transfer", label: "تحويل", icon: ArrowDownUpIcon },
  { type: "debt", label: "دين", icon: HandCoins },
  { type: "loan", label: "قرض", icon: HandCoins },
  { type: "salary", label: "راتب", icon: Briefcase },
];

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div>
      <p className="text-sm text-neutral-500 mb-2">إجراءات سريعة</p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.type}
              type="button"
              onClick={() => onAction(action.type)}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-3 hover:bg-neutral-50 transition-colors"
            >
              <Icon className="text-lg" aria-hidden="true" />
              <span className="text-xs text-neutral-700">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
