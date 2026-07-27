"use client";

import { useState } from "react";
import { DocumentRecord } from "@/types/documents";
import { getDocumentSignedUrl } from "@/lib/supabase/documentsStorage";
import { getDocumentIcon } from "@/lib/documents";

interface DocumentCardProps {
  doc: DocumentRecord;
  onDelete: () => void;
}

export function DocumentCard({ doc, onDelete }: DocumentCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isImage = doc.fileType.startsWith("image/");

  async function handleView() {
    setIsLoading(true);
    try {
      const url = await getDocumentSignedUrl(doc.filePath);
      window.open(url, "_blank");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleShare() {
    setIsLoading(true);
    try {
      const url = await getDocumentSignedUrl(doc.filePath);
      if (navigator.share) {
        await navigator.share({ title: doc.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("اتنسخ الرابط - صلاحيته ساعة");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      <button
        type="button"
        onClick={handleView}
        disabled={isLoading}
        className="w-full h-[90px] bg-neutral-50 flex items-center justify-center"
      >
        <i
          className={`ti ${getDocumentIcon(doc.fileType)} text-3xl text-neutral-400`}
          aria-hidden="true"
        />
      </button>
      <div className="p-2.5">
        <p className="text-xs font-medium text-neutral-900 truncate mb-1.5">
          {doc.name}
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handleView}
            aria-label="عرض"
            className="text-neutral-400 hover:text-neutral-700"
          >
            <i className="ti ti-eye text-sm" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="مشاركة"
            className="text-neutral-400 hover:text-neutral-700"
          >
            <i className="ti ti-share text-sm" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`متأكد إنك عايز تحذف "${doc.name}"؟`))
                onDelete();
            }}
            aria-label="حذف"
            className="text-neutral-400 hover:text-red-600"
          >
            <i className="ti ti-trash text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
