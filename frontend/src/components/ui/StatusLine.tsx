"use client";

import { useRemote } from "@/hooks/useRemote";
import { connectionErrorText } from "@/lib/connectionErrors";
import { laptopNameFor } from "@/lib/network";
import { useRemoteStore } from "@/store/remoteStore";
import type { ConnectionError, ConnectionStatus } from "@/types";

function describe(status: ConnectionStatus, error: ConnectionError | null) {
  switch (status) {
    case "connected":
      return { text: "Connected", color: "#4ADE80", glow: "0 0 8px rgba(74,222,128,.6)" };
    case "connecting":
      return { text: "Connecting…", color: "#FF9F43", glow: "0 0 8px rgba(255,159,67,.6)" };
    case "error":
      return { text: connectionErrorText(error), color: "#F0524F", glow: "none" };
    default:
      return { text: "Not connected", color: "#6B7280", glow: "none" };
  }
}

export function useConnectionLine() {
  const { status, error } = useRemote();
  const address = useRemoteStore((s) => s.address);
  const name = useRemoteStore(
    (s) => s.recent.find((laptop) => laptop.address === s.address)?.name ?? (s.address ? laptopNameFor(s.address) : ""),
  );
  return { status, error, address, name: name || "Your laptop", ...describe(status, error) };
}

export function StatusDot({ color, glow }: { color: string; glow: string }) {
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color, boxShadow: glow }} />;
}

export function StatusLine() {
  const line = useConnectionLine();
  const text = line.status === "connected" ? line.name : line.text;

  return (
    <div className="flex items-center gap-1.5 text-[13px] text-muted">
      <StatusDot color={line.color} glow={line.glow} />
      <span className="truncate">{text}</span>
    </div>
  );
}
