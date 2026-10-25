"use client";

import { CircleHelp, Laptop, RefreshCw, Unplug } from "lucide-react";
import { isCompletePin } from "@/components/ui/PinInput";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { KeyLink } from "@/components/ui/KeyLink";
import { Sheet } from "@/components/ui/Sheet";
import { StatusDot, useConnectionLine } from "@/components/ui/StatusLine";
import { connect, disconnect } from "@/hooks/useRemote";
import { useRemoteStore } from "@/store/remoteStore";

const ROW = "h-14 flex-row justify-start gap-3 rounded-[18px] px-4 text-[15px] font-semibold";

type ConnectionSheetProps = { open: boolean; onClose: () => void; onHelp: () => void };

export function ConnectionSheet({ open, onClose, onHelp }: ConnectionSheetProps) {
  const line = useConnectionLine();
  const pin = useRemoteStore((s) => s.pin);
  const connected = line.status === "connected";
  const canReconnect = !connected && line.status !== "connecting" && Boolean(line.address) && isCompletePin(pin);

  return (
    <Sheet open={open} onClose={onClose} labelledBy="connection-sheet-title">
      <div className="flex items-center gap-3.5 rounded-[20px] border border-line bg-well p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1F2228] text-amber">
          <Laptop size={24} strokeWidth={1.8} aria-hidden />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <div id="connection-sheet-title" className="truncate text-[16px] font-bold">
            {line.name}
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-muted">
            <StatusDot color={line.color} glow={line.glow} />
            <span className="truncate">{line.text}</span>
          </div>
          {line.address && <div className="truncate font-mono text-[12px] text-dim">{line.address}</div>}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {canReconnect && (
          <Key
            variant="amber"
            onPress={() => {
              connect(line.address, pin);
              onClose();
            }}
            className={ROW}
          >
            <RefreshCw {...icon} />
            Connect again
          </Key>
        )}
        <KeyLink href="/connect/" className={ROW}>
          <Laptop {...icon} className="text-amber" />
          {connected ? "Switch to another laptop" : "Connect with QR code or PIN"}
        </KeyLink>
        <Key
          onPress={() => {
            onClose();
            onHelp();
          }}
          className={ROW}
        >
          <CircleHelp {...icon} className="text-amber" />
          How to use the remote
        </Key>
        {connected && (
          <Key
            onPress={() => {
              disconnect();
              onClose();
            }}
            className={`${ROW} text-power`}
          >
            <Unplug {...icon} />
            Disconnect
          </Key>
        )}
      </div>

      <Key onPress={onClose} className="h-[52px] text-[14px] font-semibold">
        Close
      </Key>
    </Sheet>
  );
}
