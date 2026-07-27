"use client";

import { useRef, useState } from "react";
import {
  useDocuments,
  useUploadDocument,
  useDeleteDocument,
} from "@/hooks/useDocuments";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { UploadDocumentModal } from "@/components/documents/UploadDocumentModal";

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useDocuments();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = ""; // 🔧 عشان تقدر تختار نفس الملف تاني لو حبيت
  }

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-lg px-4 py-6 pb-24 flex flex-col gap-5"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2.5 text-sm"
        >
          <i className="ti ti-upload text-sm" aria-hidden="true" />
          رفع ملف
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 py-2.5 text-sm text-white"
        >
          <i className="ti ti-camera text-sm" aria-hidden="true" />
          تصوير مستند
        </button>

        {/* input عادي لاختيار أي نوع ملف */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf,.doc,.docx"
          onChange={handleFileChosen}
          className="hidden"
        />
        {/* 🔧 capture="environment" بيفتح كاميرا الموبايل مباشرة (على الديسكتوب بيفتح اختيار ملف عادي) */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChosen}
          className="hidden"
        />
      </div>

      {isLoading ? (
        <p className="text-center text-sm text-neutral-400 py-6">
          بنجهزلك وثائقك...
        </p>
      ) : documents.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-400">
          لسه مفيش وثائق محفوظة
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={() => deleteDocument.mutate(doc)}
            />
          ))}
        </div>
      )}

      {pendingFile && (
        <UploadDocumentModal
          file={pendingFile}
          onClose={() => setPendingFile(null)}
          onSubmit={(name) => {
            uploadDocument.mutate({ file: pendingFile, name });
            setPendingFile(null);
          }}
        />
      )}
    </div>
  );
}
