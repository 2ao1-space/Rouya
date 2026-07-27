"use client";

import { MapPin } from "lucide-react";
import { useLocation, useDetectLocation } from "@/hooks/useLocation";

export function LocationCard() {
  const { data: location } = useLocation();
  const detectLocation = useDetectLocation();

  return (
    <div className="rounded-xl bg-neutral-50 p-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-neutral-900 mb-0.5">
          موقعك لمواقيت الصلاة
        </p>
        <p className="text-xs text-neutral-500">
          {location
            ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`
            : "مش محدد - المواقيت مش هتظهر"}
        </p>
        {detectLocation.isError && (
          <p className="text-xs text-red-600 mt-1">
            فشل تحديد الموقع - تأكد إنك سمحت للمتصفح
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => detectLocation.mutate()}
        disabled={detectLocation.isPending}
        className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm whitespace-nowrap disabled:opacity-50"
      >
        <MapPin size={14} />
        {detectLocation.isPending ? "بيحدد..." : "تحديد موقعي"}
      </button>
    </div>
  );
}
