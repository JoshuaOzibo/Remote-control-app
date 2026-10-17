"use client";

import { send } from "@/hooks/useRemote";
import { useTrackpad } from "@/hooks/useTrackpad";
import { cn } from "@/lib/utils";

/** Dotted touch surface with a scroll strip on the right edge. The hint fades after the first touch. */
export function Trackpad() {
  const { touched, padHandlers, stripHandlers } = useTrackpad(send);

  return (
    <div
      className="pad flex h-[420px] items-center justify-center"
      role="application"
      aria-label="Trackpad surface"
      {...padHandlers}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none mr-10 flex flex-col items-center gap-2.5 text-center transition-opacity duration-500",
          touched && "opacity-0",
        )}
      >
        <span
          className="h-11 w-11 rounded-full bg-[rgba(255,159,67,.14)]"
          style={{ boxShadow: "0 0 0 1px rgba(255,159,67,.5), 0 0 24px rgba(255,159,67,.25)" }}
        />
        <span className="cap leading-[1.8]">
          Drag to move
          <br />
          Tap to click
          <br />
          Two fingers to scroll
        </span>
      </div>
      <span className="strip" aria-hidden {...stripHandlers} />
    </div>
  );
}
