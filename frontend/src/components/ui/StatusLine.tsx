"use client";

import { useRemote } from "@/hooks/useRemote";
import { connectionErrorText } from "@/lib/connectionErrors";
import { laptopNameFor } from "@/lib/network";
import { useRemoteStore } from "@/store/remoteStore";
import type { ConnectionError, ConnectionStatus } from "@/types";

function describe(status: ConnectionStatus, error: ConnectionError | null, laptopName: string) {
  switch (status) {
    case "connected":
      return { text: laptopName, color: "#4ADE80", glow: "0 0 8px rgba(74,222,128,.6)" };
    case "connecting":
      return { text: "Connecting…", color: "#FF9F43", glow: "0 0 8px rgba(255,159,67,.6)" };
    case "error":
      return { text: connectionErrorText(error), color: "#F0524F", glow: "none" };
    default:
      return { text: "Not connected", color: "#6B7280", glow: "none" };
  }
}

export function StatusLine() {
  const { status, error } = useRemote();
  const laptopName = useRemoteStore(
    (s) => s.recent.find((laptop) => laptop.address === s.address)?.name ?? laptopNameFor(s.address),
  );
  const line = describe(status, error, laptopName);

  return (
    <div className="flex items-center gap-1.5 text-[12px] text-muted">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: line.color, boxShadow: line.glow }} />
      <span className="truncate">{line.text}</span>
    </div>
  );
}
