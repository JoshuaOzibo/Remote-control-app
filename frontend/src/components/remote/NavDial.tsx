"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { icon } from "@/components/ui/icons";
import { send, sendKey } from "@/hooks/useRemote";
import { useRepeatPress } from "@/hooks/useRepeatPress";
import { vibrate } from "@/lib/haptics";
import type { KeyName } from "@/lib/protocol";

const big = { ...icon, size: 26 };
const TAP_MAX_MOVE = 8;
const TICK_PX = 12;

/** The hero dial: hold-to-repeat arrows on the ring, a press-for-OK knob with a scroll wheel. */
export function NavDial() {
  return (
    <section aria-label="Navigation dial" className="flex flex-col items-center gap-4 py-2">
      <div className="dial-ring">
        <Arrow k="up" label="Up" style={{ left: 109, top: 6 }}>
          <ChevronUp {...big} />
        </Arrow>
        <Arrow k="down" label="Down" style={{ left: 109, bottom: 6 }}>
          <ChevronDown {...big} />
        </Arrow>
        <Arrow k="left" label="Left" style={{ left: 6, top: 109 }}>
          <ChevronLeft {...big} />
        </Arrow>
        <Arrow k="right" label="Right" style={{ right: 6, top: 109 }}>
          <ChevronRight {...big} />
        </Arrow>
        <Knob />
        <span
          aria-hidden
          className="absolute h-2 w-2 rounded-full bg-amber"
          style={{ left: 141, top: 62, boxShadow: "0 0 10px rgba(255,159,67,.8)" }}
        />
      </div>
      <div className="cap text-dim">Press = OK · Roll = scroll</div>
    </section>
  );
}

function Arrow({ k, label, style, children }: { k: KeyName; label: string; style: CSSProperties; children: ReactNode }) {
  const { handlers, pressedAttr } = useRepeatPress(() => sendKey(k), { repeat: true });
  return (
    <button type="button" className="arrow" aria-label={label} style={style} {...handlers} {...pressedAttr}>
      {children}
    </button>
  );
}

/** Tap = Enter. Drag vertically = scroll, and the ribbed wheel rolls with the finger. */
function Knob() {
  const [pressed, setPressed] = useState(false);
  const [roll, setRoll] = useState(0);
  const drag = useRef<{ y: number; travelled: number; sinceTick: number } | null>(null);
  const pending = useRef(0);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const flush = () => {
    frame.current = 0;
    if (pending.current) send({ t: "scroll", dy: Math.round(pending.current * 100) / 100 });
    pending.current = 0;
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, travelled: 0, sinceTick: 0 };
    setPressed(true);
    vibrate(10);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.y;
    d.y = e.clientY;
    d.travelled += Math.abs(dy);
    if (d.travelled < TAP_MAX_MOVE) return;

    setRoll((r) => r + dy);
    pending.current += dy;
    if (!frame.current) frame.current = requestAnimationFrame(flush);

    d.sinceTick += Math.abs(dy);
    if (d.sinceTick >= TICK_PX) {
      d.sinceTick = 0;
      vibrate(4);
    }
  };

  const end = (tap: boolean) => {
    if (tap && drag.current && drag.current.travelled < TAP_MAX_MOVE) sendKey("enter");
    drag.current = null;
    setPressed(false);
  };

  return (
    <button
      type="button"
      className="knob"
      aria-label="OK — press to select, roll to scroll"
      data-pressed={pressed ? "" : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => end(true)}
      onPointerCancel={() => end(false)}
      onClick={(e: MouseEvent) => {
        if (e.detail === 0) sendKey("enter"); // keyboard activation
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="wheel" style={{ backgroundPositionY: roll }} />
    </button>
  );
}
