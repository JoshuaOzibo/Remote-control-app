"use client";

import { Check, Laptop, Power } from "lucide-react";
import Link from "next/link";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { sendKey, useRemote } from "@/hooks/useRemote";
import { useRepeatPress } from "@/hooks/useRepeatPress";
import { useRemoteStore } from "@/store/remoteStore";

/** Power (sleep/lock), title with connection status, and the Connect / Connected pill. */
export function RemoteHeader() {
  const { status, error } = useRemote();
  const laptopName = useRemoteStore((s) => s.recent[0]?.name ?? "My laptop");
  const connectPress = useRepeatPress();

  const line = statusLine(status, error, laptopName);

  return (
    <header className="flex h-14 items-center gap-3">
      <Key
        aria-label="Sleep or lock laptop"
        onPress={() => sendKey("lock")}
        className="h-12 w-12 shrink-0 rounded-3xl text-power"
      >
        <Power {...icon} />
      </Key>

      <div className="flex min-w-0 grow flex-col gap-1">
        <div className="text-[18px] font-bold tracking-[-0.01em]">Remote</div>
        <div className="flex items-center gap-1.5 text-[12px] text-muted">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: line.color, boxShadow: line.glow }} />
          <span className="truncate">{line.text}</span>
        </div>
      </div>

      {status === "connected" ? (
        <Link
          href="/connect/"
          className="flex h-11 items-center gap-2 rounded-[22px] border border-[#2E6B45] bg-card px-4 text-[14px] font-semibold text-ok"
        >
          <Check size={18} strokeWidth={1.8} aria-hidden />
          Connected
        </Link>
      ) : (
        <Link
          href="/connect/"
          className="btn-amber pill h-11 gap-2 rounded-[22px] px-4 text-[14px] font-semibold"
          {...connectPress.handlers}
          {...connectPress.pressedAttr}
        >
          <Laptop size={18} strokeWidth={1.8} aria-hidden />
          Connect
        </Link>
      )}
    </header>
  );
}

function statusLine(
  status: ReturnType<typeof useRemote>["status"],
  error: ReturnType<typeof useRemote>["error"],
  laptopName: string,
) {
  switch (status) {
    case "connected":
      return { text: laptopName, color: "#4ADE80", glow: "0 0 8px rgba(74,222,128,.6)" };
    case "connecting":
      return { text: "Connecting…", color: "#FF9F43", glow: "0 0 8px rgba(255,159,67,.6)" };
    case "error":
      return {
        text: error === "wrong-pin" ? "Wrong PIN" : "Can't reach laptop",
        color: "#F0524F",
        glow: "none",
      };
    default:
      return { text: "Not connected", color: "#6B7280", glow: "none" };
  }
}
