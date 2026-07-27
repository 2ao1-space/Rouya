"use client";

import { useState } from "react";
import { Account, AccountType } from "@/types/finance";
import { AccountFormModal } from "@/components/settings/modals/AccountFormModal";
import { Pen, Plus, Trash2 } from "lucide-react";

interface AccountsManagerProps {
  accounts: Account[];
  onAdd: (data: { name: string; type: AccountType; icon: string }) => void;
  onEdit: (
    accountId: string,
    data: { name: string; type: AccountType; icon: string },
  ) => void;
  onArchive: (accountId: string) => void;
}

export function AccountsManager({
  accounts,
  onAdd,
  onEdit,
  onArchive,
}: AccountsManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-neutral-500">الحسابات المالية</p>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1 text-xs"
        >
          <Plus className="text-sm" aria-hidden="true" />
          إضافة حساب
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 overflow-hidden">
        {accounts.map((account, index) => (
          <div
            key={account.id}
            className={`flex items-center justify-between px-4 py-2.5 ${
              index !== accounts.length - 1 ? "border-b border-neutral-100" : ""
            }`}
          >
            <span className="flex items-center gap-2 text-sm">
              <i className={`ti ${account.icon} text-sm`} aria-hidden="true" />
              {account.name}
            </span>
            <span className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingAccount(account)}
                aria-label="تعديل"
                className="text-neutral-400 hover:text-neutral-700"
              >
                <Pen className="text-sm" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `متأكد إنك عايز تشيل حساب "${account.name}"؟`,
                    )
                  ) {
                    onArchive(account.id);
                  }
                }}
                aria-label="حذف"
                className="text-neutral-400 hover:text-red-600"
              >
                <Trash2 className="text-sm" aria-hidden="true" />
              </button>
            </span>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AccountFormModal
          onClose={() => setShowAddModal(false)}
          onSubmit={onAdd}
        />
      )}

      {editingAccount && (
        <AccountFormModal
          initial={editingAccount}
          onClose={() => setEditingAccount(null)}
          onSubmit={(data) => onEdit(editingAccount.id, data)}
        />
      )}
    </div>
  );
}
