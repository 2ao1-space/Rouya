import type { ComponentType } from "react";
import { Account } from "@/types/finance";
import { formatCurrency } from "@/lib/format";

interface AccountChipsProps {
  accounts: Account[];
}

export function AccountChips({ accounts }: AccountChipsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {accounts.map((account) => {
        const Icon = account.icon as unknown as ComponentType<{
          className?: string;
          "aria-hidden"?: string;
        }>;

        return (
          <div
            key={account.id}
            className="rounded-xl border border-neutral-200 bg-white p-3"
          >
            <p className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
              <Icon className="text-sm" aria-hidden="true" />
              {account.name}
            </p>
            <p className="text-sm font-medium text-neutral-900">
              {formatCurrency(account.balance)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
