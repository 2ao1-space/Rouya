"use client"

import { supabase } from "@/lib/supabase/client"

interface GoogleSyncCardProps {
  email: string | null
}

export function GoogleSyncCard({ email }: GoogleSyncCardProps) {
  async function handleLinkGoogle() {
    // 🔧 linkIdentity بيحافظ على نفس user_id، فبياناتك الحالية (الأنونيميوس) هتفضل زي ما هي وتترفع للسحابة
    await supabase.auth.linkIdentity({ provider: "google" })
  }

  return (
    <div className="rounded-xl bg-neutral-50 p-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-neutral-900 mb-0.5">
          {email ? "متزامن بالسحابة" : "مش متزامن دلوقتي"}
        </p>
        <p className="text-xs text-neutral-500">{email ?? "بياناتك محفوظة على الجهاز ده بس"}</p>
      </div>
      {!email && (
        <button
          type="button"
          onClick={handleLinkGoogle}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm whitespace-nowrap"
        >
          <i className="ti ti-brand-google text-sm" aria-hidden="true" />
          ربط بجوجل
        </button>
      )}
    </div>
  )
}