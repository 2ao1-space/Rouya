"use client";

import { useRef } from "react";
import { Eraser } from "lucide-react";

interface DrawingPadProps {
  onSave: (blob: Blob) => void;
}

export function DrawingPad({ onSave }: DrawingPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    const pos = getPos(e);
    ctx?.beginPath();
    ctx?.moveTo(pos.x, pos.y);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#18181b";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function handlePointerUp() {
    isDrawing.current = false;
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function handleSave() {
    canvasRef.current?.toBlob((blob) => {
      if (blob) onSave(blob);
    }, "image/png");
  }

  return (
    <div className="flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        width={320}
        height={220}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full rounded-lg border border-neutral-200 bg-white touch-none"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs"
        >
          <Eraser size={13} />
          مسح
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-lg bg-neutral-900 py-1.5 text-xs text-white"
        >
          حفظ الرسمة
        </button>
      </div>
    </div>
  );
}
