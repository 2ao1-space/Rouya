"use client";

import { useState } from "react";
import { AppModuleId, AppModuleDefinition } from "@/types/settings";
import { useAccounts } from "@/hooks/useAccounts";
import {
  useProfile,
  useSaveProfile,
  useAppModules,
  useSaveAppModules,
  useAddAccount,
  useEditAccount,
  useDeleteAccount,
  useDeleteAllData,
} from "@/hooks/useSettings";

import { ProfileForm } from "@/components/settings/ProfileForm";
import { GoogleSyncCard } from "@/components/settings/GoogleSyncCard";
import { AccountsManager } from "@/components/settings/AccountsManager";
import { ModuleSelector } from "@/components/settings/ModuleSelector";
import { DeleteAllDataModal } from "@/components/settings/modals/DeleteAllDataModal";
import { ALL_MODULES } from "@/lib/modules";
import { LocationCard } from "@/components/settings/LocationCard";

export default function SettingsPage() {
  const { data: profile } = useProfile();
  const saveProfile = useSaveProfile();

  const { data: accounts = [] } = useAccounts();
  const addAccount = useAddAccount();
  const editAccount = useEditAccount();
  const deleteAccount = useDeleteAccount();

  const { data: selectedModuleIds = [] } = useAppModules();
  const saveModules = useSaveAppModules();

  const deleteAllData = useDeleteAllData();
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-lg px-4 py-6 pb-24 flex flex-col gap-6"
    >
      <div>
        <p className="text-sm text-neutral-500 mb-2">البيانات الشخصية</p>
        <ProfileForm
          name={profile?.name ?? ""}
          birthDate={profile?.birthDate ?? null}
          onSave={(data) => saveProfile.mutate(data)}
        />
        <LocationCard />
      </div>

      <div>
        <p className="text-sm text-neutral-500 mb-2">المزامنة السحابية</p>
        <GoogleSyncCard email={profile?.email ?? null} />
      </div>

      <AccountsManager
        accounts={accounts}
        onAdd={(data) => addAccount.mutate(data)}
        onEdit={(id, data) => editAccount.mutate({ accountId: id, ...data })}
        onArchive={(id) => deleteAccount.mutate(id)}
      />

      <ModuleSelector
        allModules={ALL_MODULES as unknown as AppModuleDefinition[]}
        selectedIds={selectedModuleIds}
        onChange={(ids: AppModuleId[]) => saveModules.mutate(ids)}
      />

      <div>
        <p className="text-sm text-red-600 mb-2">منطقة الخطر</p>
        <div className="rounded-xl border border-red-200 p-4 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            حذف كل بياناتك نهائيًا من الجهاز والسحابة
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteAllModal(true)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 whitespace-nowrap"
          >
            حذف كل البيانات
          </button>
        </div>
      </div>

      {showDeleteAllModal && (
        <DeleteAllDataModal
          onClose={() => setShowDeleteAllModal(false)}
          onConfirm={() => {
            deleteAllData.mutate();
            setShowDeleteAllModal(false);
          }}
        />
      )}
    </div>
  );
}
