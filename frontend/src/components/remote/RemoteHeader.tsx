"use client";

import { ChevronDown, CircleHelp } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { StatusDot, useConnectionLine } from "@/components/ui/StatusLine";
import { useRepeatPress } from "@/hooks/useRepeatPress";

export function RemoteHeader({ onOpenConnection, onOpenHelp }: { onOpenConnection: () => void; onOpenHelp: () => void }) {
  const line = useConnectionLine();
  const pillPress = useRepeatPress(onOpenConnection);

  return (
    <header className="flex h-14 items-center gap-3">
      <button
        type="button"
        aria-label={`${line.name}: ${line.text}. Connection options`}
        className="key h-14 min-w-0 grow flex-row justify-start gap-3 rounded-[22px] px-4 text-left"
        {...pillPress.handlers}
        {...pillPress.pressedAttr}
      >
        <StatusDot color={line.color} glow={line.glow} />
        <span className="flex min-w-0 grow flex-col gap-0.5">
          <span className="truncate text-[15px] font-bold tracking-[-0.01em]">{line.name}</span>
          <span className="truncate text-[12px] text-muted">{line.text}</span>
        </span>
        <ChevronDown size={18} strokeWidth={1.8} aria-hidden className="shrink-0 text-muted" />
      </button>

      <Key aria-label="How to use the remote" onPress={onOpenHelp} className="h-12 w-12 shrink-0 rounded-3xl">
        <CircleHelp {...icon} />
      </Key>
    </header>
  );
}
