"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { icon } from "@/components/ui/icons";
import { sendKey } from "@/hooks/useRemote";
import { vibrate } from "@/lib/haptics";
import type { KeyName } from "@/lib/protocol";

const big = { ...icon, size: 26 };
const TAP_MAX_MOVE = 8;
/** Near the centre the finger has no clear direction, so it doesn't turn the ball. */
const DEAD_ZONE = 14;
const MAX_TILT = 10;
const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 120;

/** Clockwise from the top, so quarter turn n faces DIRS[n mod 4]. */
const DIRS = ["up", "right", "down", "left"] as const satisfies readonly KeyName[];
const KEY_TO_DIR: Record<string, number> = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
const dirOf = (quarter: number) => ((quarter % 4) + 4) % 4;

/**
 * The hero dial. The knob is the only control: turn the ball to face an arrow and that
 * arrow lights up and its key is sent (held there, it repeats). Tap the ball for OK.
 */
export function NavDial() {
  // Unwrapped quarter turns (…, -1, 0, 1, 2, …) so the pointer always takes the short way round.
  const [quarter, setQuarter] = useState(0);
  const lit = dirOf(quarter);

  return (
    <section aria-label="Navigation dial" className="flex flex-col items-center gap-4 py-2">
      <div className="dial-ring">
        <Arrow lit={lit === 0} style={{ left: 109, top: 6 }}>
          <ChevronUp {...big} />
        </Arrow>
        <Arrow lit={lit === 2} style={{ left: 109, bottom: 6 }}>
          <ChevronDown {...big} />
        </Arrow>
        <Arrow lit={lit === 3} style={{ left: 6, top: 109 }}>
          <ChevronLeft {...big} />
        </Arrow>
        <Arrow lit={lit === 1} style={{ right: 6, top: 109 }}>
          <ChevronRight {...big} />
        </Arrow>
        <Knob onQuarter={setQuarter} />
        <span aria-hidden className="dial-pointer" style={{ transform: `rotate(${quarter * 90}deg)` }}>
          <span className="dial-dot" />
        </span>
      </div>
      <div className="cap text-dim">Press = OK · Turn = arrows</div>
    </section>
  );
}

/** Not a button: the arrows only show which way the ball is turned. */
function Arrow({ lit, style, children }: { lit: boolean; style: CSSProperties; children: ReactNode }) {
  return (
    <span aria-hidden className="arrow" style={style} data-lit={lit ? "" : undefined}>
      {children}
    </span>
  );
}

/** Signed shortest difference between two angles, in -180..180. */
const shortest = (deg: number) => ((((deg % 360) + 540) % 360) - 180);

type Drag = {
  cx: number;
  cy: number;
  radius: number;
  x: number;
  y: number;
  travelled: number;
  /** True once the finger has left the dead zone and the ball follows it. */
  steering: boolean;
};

/**
 * Tap = Enter. Dragging spins the ball to face the finger, all the way round. Each time it
 * comes to face a new arrow (and on the first turn of a drag) that arrow key is sent;
 * holding it there repeats. While held, the ball tilts toward the finger.
 */
function Knob({ onQuarter }: { onQuarter: (quarter: number) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);
  const spin = useRef(0); // finger angle, unwrapped degrees, 0 = up, clockwise positive
  const quarter = useRef(0);
  const drag = useRef<Drag | null>(null);
  const repeat = useRef<{ delay?: number; every?: number }>({});

  const stopRepeat = () => {
    clearTimeout(repeat.current.delay);
    clearInterval(repeat.current.every);
    repeat.current = {};
  };

  useEffect(() => stopRepeat, []);

  const setVar = (name: string, value: string) => ref.current?.style.setProperty(name, value);

  const tilt = (nx: number, ny: number) => {
    setVar("--tilt-x", `${(-ny * MAX_TILT).toFixed(2)}deg`);
    setVar("--tilt-y", `${(nx * MAX_TILT).toFixed(2)}deg`);
  };

  /** Sends the arrow the ball faces now, then repeats it while the finger stays down. */
  const press = (holdToRepeat: boolean) => {
    const key = DIRS[dirOf(quarter.current)];
    stopRepeat();
    sendKey(key);
    vibrate(12);
    if (!holdToRepeat) return;
    repeat.current.delay = window.setTimeout(() => {
      repeat.current.every = window.setInterval(() => {
        sendKey(key);
        vibrate(6);
      }, REPEAT_INTERVAL);
    }, REPEAT_DELAY);
  };

  /**
   * Tracks the finger at `deg`, but the face only ever rests on the nearest arrow.
   * Returns true when that brings a different arrow into line.
   */
  const turnTo = (deg: number) => {
    spin.current = deg;
    const q = Math.round(deg / 90);
    if (q === quarter.current) return false;
    quarter.current = q;
    setVar("--spin", `${q * 90}deg`);
    onQuarter(q);
    return true;
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // Measure before tilting, so the transform doesn't skew the centre.
    const r = e.currentTarget.getBoundingClientRect();
    drag.current = {
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      radius: r.width / 2,
      x: e.clientX,
      y: e.clientY,
      travelled: 0,
      steering: false,
    };
    setPressed(true);
    vibrate(10);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    d.travelled += Math.hypot(e.clientX - d.x, e.clientY - d.y);
    d.x = e.clientX;
    d.y = e.clientY;

    const dx = e.clientX - d.cx;
    const dy = e.clientY - d.cy;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v / d.radius));
    tilt(clamp(dx), clamp(dy));

    if (d.travelled < TAP_MAX_MOVE || Math.hypot(dx, dy) < DEAD_ZONE) return;
    const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const changed = turnTo(spin.current + shortest(angle - spin.current));

    // The first turn of a drag always counts, even toward the arrow already lit.
    if (changed || !d.steering) press(true);
    d.steering = true;
  };

  const end = (tap: boolean) => {
    if (tap && drag.current && drag.current.travelled < TAP_MAX_MOVE) sendKey("enter");
    drag.current = null;
    stopRepeat();
    tilt(0, 0);
    setPressed(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = KEY_TO_DIR[e.key];
    if (dir === undefined) return;
    e.preventDefault();
    turnTo(spin.current + shortest(dir * 90 - spin.current));
    press(false);
  };

  return (
    <button
      ref={ref}
      type="button"
      className="knob"
      aria-label="OK — press to select, turn toward an arrow to send it"
      data-pressed={pressed ? "" : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => end(true)}
      onPointerCancel={() => end(false)}
      onClick={(e: MouseEvent) => {
        if (e.detail === 0) sendKey("enter"); // keyboard activation
      }}
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="knob-face">
        <span className="knob-mark" />
        <span className="wheel" />
      </span>
      <span className="knob-gloss" />
    </button>
  );
}
