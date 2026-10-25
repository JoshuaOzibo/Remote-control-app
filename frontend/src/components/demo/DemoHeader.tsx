"use client";

import { CircleHelp, RotateCcw } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { StatusDot } from "@/components/ui/StatusLine";
import { useDemoStore } from "@/store/demoStore";

export function DemoHeader({ onOpenHelp }: { onOpenHelp: () => void }) {
  const reset = useDemoStore((s) => s.reset);

  return (
    <header className="flex h-14 items-center gap-3">
      <div className="key h-14 min-w-0 grow flex-row justify-start gap-3 rounded-[22px] px-4">
        <StatusDot color="#4ADE80" glow="0 0 8px rgba(74,222,128,.6)" />
        <span className="flex min-w-0 grow flex-col gap-0.5">
          <span className="truncate text-[15px] font-bold tracking-[-0.01em]">Demo laptop</span>
          <span className="truncate text-[12px] text-muted">Connected</span>
        </span>
      </div>

      <Key aria-label="Restart the demo" onPress={reset} className="h-12 w-12 shrink-0 rounded-3xl">
        <RotateCcw {...icon} />
      </Key>
      <Key aria-label="How to use the remote" onPress={onOpenHelp} className="h-12 w-12 shrink-0 rounded-3xl">
        <CircleHelp {...icon} />
      </Key>
    </header>
  );
}
