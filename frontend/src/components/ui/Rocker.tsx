"use client";

import type { ReactNode } from "react";
import { useRepeatPress } from "@/hooks/useRepeatPress";

type RockerProps = {
  caption: string;
  up: { icon: ReactNode; label: string; onPress: () => void };
  down: { icon: ReactNode; label: string; onPress: () => void };
};

/** Tall pill with two hold-to-repeat halves (VOL, PAGE). */
export function Rocker({ caption, up, down }: RockerProps) {
  return (
    <div className="rocker">
      <RockerButton {...up} />
      <span className="cap">{caption}</span>
      <RockerButton {...down} />
    </div>
  );
}

function RockerButton({ icon, label, onPress }: RockerProps["up"]) {
  const { handlers, pressedAttr } = useRepeatPress(onPress, { repeat: true });
  return (
    <button type="button" className="rk" aria-label={label} {...handlers} {...pressedAttr}>
      {icon}
    </button>
  );
}
