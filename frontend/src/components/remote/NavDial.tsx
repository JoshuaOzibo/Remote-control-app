"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { icon } from "@/components/ui/icons";
import { sendKey } from "@/hooks/useRemote";
import { vibrate } from "@/lib/haptics";
import type { KeyName } from "@/lib/protocol";

const big = { ...icon, size: 28 };
const TAP_MAX_MOVE = 8;
const DEAD_ZONE = 14;
const MAX_TILT = 10;
const REPEAT_DELAY = 400;
const REPEAT_INTERVAL = 120;

const DIRS = ["up", "right", "down", "left"] as const satisfies readonly KeyName[];
const DIR_LABELS = ["Up", "Right", "Down", "Left"];
const DIR_ICONS = [ChevronUp, ChevronRight, ChevronDown, ChevronLeft];
const DIR_POSITIONS: CSSProperties[] = [
  { left: 109, top: 6 },
  { right: 6, top: 109 },
  { left: 109, bottom: 6 },
  { left: 6, top: 109 },
];
const KEY_TO_DIR: Record<string, number> = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
const dirOf = (quarter: number) => ((quarter % 4) + 4) % 4;
const shortest = (deg: number) => ((((deg % 360) + 540) % 360) - 180);

type Dial = ReturnType<typeof useDial>;

function useDial() {
  const [quarter, setQuarter] = useState(0);
  const spin = useRef(0);
  const turned = useRef(0);
  const repeat = useRef<{ delay?: number; every?: number }>({});

  const stopRepeat = useCallback(() => {
    clearTimeout(repeat.current.delay);
    clearInterval(repeat.current.every);
    repeat.current = {};
  }, []);

  useEffect(() => stopRepeat, [stopRepeat]);

  const turnTo = (deg: number) => {
    spin.current = deg;
    const q = Math.round(deg / 90);
    if (q === turned.current) return false;
    turned.current = q;
    setQuarter(q);
    return true;
  };

  const face = (dir: number) => turnTo(spin.current + shortest(dir * 90 - spin.current));

  const press = (holdToRepeat: boolean) => {
    const key = DIRS[dirOf(turned.current)];
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

  return { quarter, spin, turnTo, face, press, stopRepeat };
}

export function NavDial() {
  const dial = useDial();
  const lit = dirOf(dial.quarter);

  return (
    <section aria-label="Arrows" className="flex flex-col items-center gap-4 py-2">
      <div className="dial-ring">
        {DIRS.map((key, dir) => (
          <Arrow key={key} dir={dir} lit={lit === dir} dial={dial} />
        ))}
        <Knob dial={dial} />
        <span aria-hidden className="dial-pointer" style={{ transform: `rotate(${dial.quarter * 90}deg)` }}>
          <span className="dial-dot" />
        </span>
      </div>
      <div className="cap text-center">Tap an arrow to move · Tap the middle for OK</div>
    </section>
  );
}

function Arrow({ dir, lit, dial }: { dir: number; lit: boolean; dial: Dial }) {
  const [pressed, setPressed] = useState(false);
  const Icon = DIR_ICONS[dir];

  const release = () => {
    setPressed(false);
    dial.stopRepeat();
  };

  return (
    <button
      type="button"
      className="arrow"
      style={DIR_POSITIONS[dir]}
      aria-label={DIR_LABELS[dir]}
      data-lit={lit ? "" : undefined}
      data-pressed={pressed ? "" : undefined}
      onPointerDown={(e: PointerEvent<HTMLButtonElement>) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        setPressed(true);
        dial.face(dir);
        dial.press(true);
      }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onClick={(e: MouseEvent) => {
        if (e.detail !== 0) return;
        dial.face(dir);
        dial.press(false);
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Icon {...big} />
    </button>
  );
}

type Drag = {
  cx: number;
  cy: number;
  radius: number;
  x: number;
  y: number;
  travelled: number;
  steering: boolean;
};

function Knob({ dial }: { dial: Dial }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);
  const drag = useRef<Drag | null>(null);

  const tilt = (nx: number, ny: number) => {
    ref.current?.style.setProperty("--tilt-x", `${(-ny * MAX_TILT).toFixed(2)}deg`);
    ref.current?.style.setProperty("--tilt-y", `${(nx * MAX_TILT).toFixed(2)}deg`);
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
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
    const changed = dial.turnTo(dial.spin.current + shortest(angle - dial.spin.current));

    if (changed || !d.steering) dial.press(true);
    d.steering = true;
  };

  const end = (tap: boolean) => {
    if (tap && drag.current && drag.current.travelled < TAP_MAX_MOVE) sendKey("enter");
    drag.current = null;
    dial.stopRepeat();
    tilt(0, 0);
    setPressed(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = KEY_TO_DIR[e.key];
    if (dir === undefined) return;
    e.preventDefault();
    dial.face(dir);
    dial.press(false);
  };

  return (
    <button
      ref={ref}
      type="button"
      className="knob"
      style={{ "--spin": `${dial.quarter * 90}deg` } as CSSProperties}
      aria-label="OK"
      data-pressed={pressed ? "" : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => end(true)}
      onPointerCancel={() => end(false)}
      onClick={(e: MouseEvent) => {
        if (e.detail === 0) sendKey("enter");
      }}
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="knob-face">
        <span className="knob-mark" />
      </span>
      <span className="knob-ok" aria-hidden>
        OK
      </span>
      <span className="knob-gloss" />
    </button>
  );
}
