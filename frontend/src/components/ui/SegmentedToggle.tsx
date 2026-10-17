"use client";

import { CircleDot, PanelBottom } from "lucide-react";
import { vibrate } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { useRemoteStore } from "@/store/remoteStore";
import type { Mode } from "@/types";

const OPTIONS: { mode: Mode; label: string; Icon: typeof CircleDot }[] = [
  { mode: "dial", label: "Dial", Icon: CircleDot },
  { mode: "trackpad", label: "Trackpad", Icon: PanelBottom },
];

/** Dial | Trackpad switch. */
export function SegmentedToggle() {
  const mode = useRemoteStore((s) => s.mode);
  const setMode = useRemoteStore((s) => s.setMode);

  return (
    <div
      role="group"
      aria-label="Control mode"
      className="flex gap-1 rounded-2xl bg-card p-1 shadow-[inset_0_2px_6px_rgba(0,0,0,.5)]"
    >
      {OPTIONS.map(({ mode: value, label, Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => {
              if (active) return;
              vibrate(10);
              setMode(value);
            }}
            className={cn(
              "flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border-0 font-sans text-[13px] font-semibold transition-colors",
              active ? "bg-[#2A2E36] text-text shadow-[0_2px_0_#0A0B0E]" : "bg-transparent text-muted",
            )}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden className={active ? "text-amber" : undefined} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
