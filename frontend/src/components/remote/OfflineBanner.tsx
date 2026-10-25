"use client";

import { Laptop, WifiOff } from "lucide-react";
import Link from "next/link";
import { useConnectionLine } from "@/components/ui/StatusLine";
import { useRepeatPress } from "@/hooks/useRepeatPress";
import { connectionErrorHelp } from "@/lib/connectionErrors";
import { useRemoteStore } from "@/store/remoteStore";

export function OfflineBanner() {
  const line = useConnectionLine();
  const nudgedAt = useRemoteStore((s) => s.offlineNudgeAt);
  const hydrated = useRemoteStore((s) => s.hydrated);
  const connectPress = useRepeatPress();

  if (!hydrated || line.status === "connected") return null;

  const connecting = line.status === "connecting";
  const title = connecting ? "Connecting to your laptop…" : line.text;
  const help = connecting
    ? "Keep Phone Remote open on the laptop."
    : line.status === "error"
      ? connectionErrorHelp(line.error)[0]
      : "Your presses won't reach the laptop until you connect.";

  return (
    <div
      key={nudgedAt}
      role="status"
      data-nudged={nudgedAt ? "" : undefined}
      className="offline-banner flex items-center gap-3 rounded-[20px] border border-[#4A3A26] bg-[#1E1A15] p-3 pl-4"
    >
      <WifiOff size={22} strokeWidth={1.8} aria-hidden className="shrink-0 text-amber" />
      <div className="flex min-w-0 grow flex-col gap-0.5">
        <span className="text-[14px] font-semibold">{title}</span>
        <span className="text-[12px] leading-[1.4] text-muted">{help}</span>
      </div>
      {!connecting && (
        <Link
          href="/connect/"
          className="btn-amber pill h-11 shrink-0 gap-2 rounded-[22px] px-4 text-[14px] font-semibold"
          {...connectPress.handlers}
          {...connectPress.pressedAttr}
        >
          <Laptop size={18} strokeWidth={1.8} aria-hidden />
          Connect
        </Link>
      )}
    </div>
  );
}
