"use client";

import type { PointerEvent } from "react";
import { Key } from "@/components/ui/Key";
import { send } from "@/hooks/useRemote";
import { useTrackpad } from "@/hooks/useTrackpad";
import { cn } from "@/lib/utils";

const keepFromPad = (e: PointerEvent<HTMLElement>) => e.stopPropagation();

export function Trackpad() {
  const { touched, padHandlers, stripHandlers, stripRef } = useTrackpad(send);

  return (
    <div
      className="pad flex h-[420px] items-center justify-center"
      role="application"
      aria-label="Mouse pad"
      {...padHandlers}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none mb-16 mr-10 flex flex-col items-center gap-2.5 text-center transition-opacity duration-500",
          touched && "opacity-0",
        )}
      >
        <span
          className="h-11 w-11 rounded-full bg-[rgba(255,159,67,.14)]"
          style={{ boxShadow: "0 0 0 1px rgba(255,159,67,.5), 0 0 24px rgba(255,159,67,.25)" }}
        />
        <span className="cap leading-[1.7]">
          Slide a finger to move
          <br />
          Tap to click
          <br />
          Use the strip to scroll
        </span>
      </div>

      <div
        className="absolute bottom-2.5 left-2.5 right-[54px] grid grid-cols-2 gap-2.5"
        onPointerDown={keepFromPad}
        onPointerMove={keepFromPad}
        onPointerUp={keepFromPad}
        onPointerCancel={keepFromPad}
      >
        <Key onPress={() => send({ t: "click", b: "left" })} className="h-14 rounded-[16px] text-[14px] font-semibold">
          Left click
        </Key>
        <Key onPress={() => send({ t: "click", b: "right" })} className="h-14 rounded-[16px] text-[14px] font-semibold">
          Right click
        </Key>
      </div>

      <span ref={stripRef} className="strip" aria-hidden {...stripHandlers} />
    </div>
  );
}
