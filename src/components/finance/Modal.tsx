"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-5 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-neutral-900">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-neutral-400 w-4 h-4 p-1 rounded-full flex items-center justify-center bg-neutral-100"
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
