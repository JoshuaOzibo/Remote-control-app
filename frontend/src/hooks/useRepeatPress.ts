"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { vibrate } from "@/lib/haptics";

type Options = {
  /** Keep firing while held (arrows, volume, page). */
  repeat?: boolean;
  /** Wait before repeating starts, in ms. */
  delay?: number;
  /** Time between repeats, in ms. */
  interval?: number;
};

/**
 * Press handling for keys: tracks the pressed look, vibrates, and fires `onPress`.
 * With `repeat`, it fires on touch-down and then every `interval` ms while held.
 * Spread `handlers` and `pressedAttr` onto the button.
 */
export function useRepeatPress(onPress?: () => void, { repeat = false, delay = 300, interval = 120 }: Options = {}) {
  const [pressed, setPressed] = useState(false);
  const callback = useRef(onPress);
  const delayTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const repeatTimer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    callback.current = onPress;
  }, [onPress]);

  const stop = useCallback(() => {
    clearTimeout(delayTimer.current);
    clearInterval(repeatTimer.current);
    setPressed(false);
  }, []);

  useEffect(() => stop, [stop]);

  const fire = useCallback(() => {
    vibrate(10);
    callback.current?.();
  }, []);

  const handlers = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      setPressed(true);
      if (!repeat) {
        vibrate(10);
        return;
      }
      fire();
      delayTimer.current = setTimeout(() => {
        repeatTimer.current = setInterval(fire, interval);
      }, delay);
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onClick: (e: MouseEvent<HTMLElement>) => {
      // Repeat keys already fired on pointer-down; only keyboard activation (detail 0) reaches here.
      if (!repeat || e.detail === 0) callback.current?.();
    },
    onContextMenu: (e: MouseEvent<HTMLElement>) => e.preventDefault(),
  };

  return { pressed, handlers, pressedAttr: { "data-pressed": pressed ? "" : undefined } };
}
