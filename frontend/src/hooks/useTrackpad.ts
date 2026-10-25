"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { vibrate } from "@/lib/haptics";
import type { ClientMsg } from "@/lib/protocol";
import { useRemoteStore } from "@/store/remoteStore";

const TAP_MAX_MOVE = 8;
const TAP_MAX_MS = 250;
const STRIP_TICK_PX = 24;
const COAST_MS = 320;
const COAST_FRICTION = 0.9;
const COAST_IDLE_MS = 80;

type Roll = { offset: number; ticked: number; velocity: number; at: number; frame: number };

type Gesture = {
  pointers: Map<number, { x: number; y: number }>;
  startedAt: number;
  maxPointers: number;
  travelled: number;
};

/**
 * Turns touches on the trackpad into protocol messages:
 * one-finger drag = move, tap = left click, two-finger tap = right click,
 * two-finger drag (or the scroll strip) = scroll. Messages are batched per animation frame.
 */
export function useTrackpad(send: (msg: ClientMsg) => void) {
  const sensitivity = useRemoteStore((s) => s.sensitivity);
  const [touched, setTouched] = useState(false);

  const gesture = useRef<Gesture>({ pointers: new Map(), startedAt: 0, maxPointers: 0, travelled: 0 });
  const pending = useRef({ dx: 0, dy: 0, scroll: 0 });
  const frame = useRef(0);
  const stripY = useRef<number | null>(null);
  const strip = useRef<HTMLSpanElement>(null);
  const roll = useRef<Roll>({ offset: 0, ticked: 0, velocity: 0, at: 0, frame: 0 });

  const flush = useCallback(() => {
    frame.current = 0;
    const p = pending.current;
    if (p.dx || p.dy) send({ t: "move", dx: round(p.dx), dy: round(p.dy) });
    if (p.scroll) send({ t: "scroll", dy: round(p.scroll) });
    pending.current = { dx: 0, dy: 0, scroll: 0 };
  }, [send]);

  const schedule = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(flush);
  }, [flush]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      cancelAnimationFrame(roll.current.frame);
    },
    [],
  );

  const rollStrip = useCallback((dy: number, tick: boolean) => {
    const r = roll.current;
    r.offset += dy;
    strip.current?.style.setProperty("--roll", `${r.offset.toFixed(1)}px`);
    if (!tick) return;
    r.ticked += Math.abs(dy);
    if (r.ticked < STRIP_TICK_PX) return;
    r.ticked %= STRIP_TICK_PX;
    vibrate(4);
  }, []);

  const stopCoast = () => {
    cancelAnimationFrame(roll.current.frame);
    roll.current.frame = 0;
  };

  const coast = () => {
    const r = roll.current;
    const idle = performance.now() - r.at > COAST_IDLE_MS;
    if (idle || Math.abs(r.velocity) < 0.05 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const started = performance.now();
    let last = started;
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      r.velocity *= Math.pow(COAST_FRICTION, dt / 16);
      rollStrip(r.velocity * dt, false);
      r.frame = now - started < COAST_MS && Math.abs(r.velocity) > 0.02 ? requestAnimationFrame(step) : 0;
    };
    r.frame = requestAnimationFrame(step);
  };

  const holdStrip = (held: boolean) => {
    const el = strip.current;
    if (!el) return;
    if (held) el.dataset.active = "";
    else delete el.dataset.active;
  };

  const padHandlers = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const g = gesture.current;
      if (g.pointers.size === 0) {
        g.startedAt = performance.now();
        g.maxPointers = 0;
        g.travelled = 0;
      }
      g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      g.maxPointers = Math.max(g.maxPointers, g.pointers.size);
      setTouched(true);
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const g = gesture.current;
      const last = g.pointers.get(e.pointerId);
      if (!last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      g.travelled += Math.hypot(dx, dy);

      if (g.pointers.size === 1) {
        pending.current.dx += dx * sensitivity;
        pending.current.dy += dy * sensitivity;
      } else {
        pending.current.scroll += dy / g.pointers.size;
        rollStrip(dy / g.pointers.size, false);
      }
      schedule();
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => endPointer(e.pointerId),
    onPointerCancel: (e: PointerEvent<HTMLElement>) => endPointer(e.pointerId, true),
  };

  function endPointer(id: number, cancelled = false) {
    const g = gesture.current;
    if (!g.pointers.delete(id) || g.pointers.size > 0 || cancelled) return;
    const quick = performance.now() - g.startedAt < TAP_MAX_MS;
    if (quick && g.travelled < TAP_MAX_MOVE) {
      vibrate(10);
      send({ t: "click", b: g.maxPointers >= 2 ? "right" : "left" });
    }
  }

  const stripHandlers = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      stripY.current = e.clientY;
      stopCoast();
      roll.current.velocity = 0;
      roll.current.at = performance.now();
      holdStrip(true);
      setTouched(true);
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      e.stopPropagation();
      if (stripY.current === null) return;
      const dy = e.clientY - stripY.current;
      const now = performance.now();
      const r = roll.current;
      r.velocity = r.velocity * 0.4 + (dy / Math.max(1, now - r.at)) * 0.6;
      r.at = now;
      pending.current.scroll += dy;
      stripY.current = e.clientY;
      rollStrip(dy, true);
      schedule();
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => {
      e.stopPropagation();
      stripY.current = null;
      holdStrip(false);
      coast();
    },
    onPointerCancel: (e: PointerEvent<HTMLElement>) => {
      e.stopPropagation();
      stripY.current = null;
      holdStrip(false);
    },
  };

  return { touched, padHandlers, stripHandlers, stripRef: strip };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
