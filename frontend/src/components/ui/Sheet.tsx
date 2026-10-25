"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  label?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

export function Sheet({ open, onClose, label, labelledBy, className, children }: SheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex w-full max-w-[430px] flex-col gap-4 rounded-t-[28px] border-t border-line bg-card px-5 pt-5",
          className,
        )}
        style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-[#2A2E36]" aria-hidden />
        {children}
      </div>
    </div>
  );
}
