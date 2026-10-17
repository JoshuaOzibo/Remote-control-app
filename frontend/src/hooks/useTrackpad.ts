"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { vibrate } from "@/lib/haptics";
import type { ClientMsg } from "@/lib/protocol";
import { useRemoteStore } from "@/store/remoteStore";

const TAP_MAX_MOVE = 8;
const TAP_MAX_MS = 250;

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

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

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
        // Average the fingers so two fingers don't scroll twice as fast.
        pending.current.scroll += dy / g.pointers.size;
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
      setTouched(true);
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      e.stopPropagation();
      if (stripY.current === null) return;
      pending.current.scroll += e.clientY - stripY.current;
      stripY.current = e.clientY;
      schedule();
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => {
      e.stopPropagation();
      stripY.current = null;
    },
    onPointerCancel: (e: PointerEvent<HTMLElement>) => {
      e.stopPropagation();
      stripY.current = null;
    },
  };

  return { touched, padHandlers, stripHandlers };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
