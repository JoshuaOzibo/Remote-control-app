"use client";

import { Check, Laptop, Power } from "lucide-react";
import Link from "next/link";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { StatusLine } from "@/components/ui/StatusLine";
import { disconnect, useRemote } from "@/hooks/useRemote";
import { useRepeatPress } from "@/hooks/useRepeatPress";

export function RemoteHeader() {
  const { status } = useRemote();
  const connectPress = useRepeatPress();

  return (
    <header className="flex h-14 items-center gap-3">
      <Key
        aria-label="Disconnect from laptop"
        onPress={disconnect}
        disabled={status === "idle"}
        className="h-12 w-12 shrink-0 rounded-3xl text-power disabled:cursor-default disabled:opacity-40"
      >
        <Power {...icon} />
      </Key>

      <div className="flex min-w-0 grow flex-col gap-1">
        <div className="text-[18px] font-bold tracking-[-0.01em]">Remote</div>
        <StatusLine />
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
