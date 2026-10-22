"use client";

import { Check, RotateCcw } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { useDemoStore } from "@/store/demoStore";

export function DemoHeader() {
  const reset = useDemoStore((s) => s.reset);

  return (
    <header className="flex h-14 items-center gap-3">
      <Key aria-label="Restart the demo" onPress={reset} className="h-12 w-12 shrink-0 rounded-3xl text-power">
        <RotateCcw {...icon} />
      </Key>

      <div className="flex min-w-0 grow flex-col gap-1">
        <div className="text-[18px] font-bold tracking-[-0.01em]">Remote</div>
        <div className="flex items-center gap-1.5 text-[12px] text-muted">
          <span className="h-2 w-2 shrink-0 rounded-full bg-ok shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
          <span className="truncate">Demo laptop</span>
        </div>
      </div>

      <span className="flex h-11 items-center gap-2 rounded-[22px] border border-[#2E6B45] bg-card px-4 text-[14px] font-semibold text-ok">
        <Check size={18} strokeWidth={1.8} aria-hidden />
        Demo
      </span>
    </header>
  );
}
