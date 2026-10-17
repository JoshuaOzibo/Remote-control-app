"use client";

import type { ButtonHTMLAttributes } from "react";
import { useRepeatPress } from "@/hooks/useRepeatPress";
import { cn } from "@/lib/utils";

type KeyProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  onPress?: () => void;
  /** Fire repeatedly while held. */
  repeat?: boolean;
  variant?: "key" | "amber";
};

/** The 3D key. Sizes and radii come from `className`; the look comes from `.key` / `.btn-amber`. */
export function Key({ onPress, repeat, variant = "key", className, type = "button", children, ...rest }: KeyProps) {
  const { handlers, pressedAttr } = useRepeatPress(onPress, { repeat });
  return (
    <button
      type={type}
      className={cn(variant === "amber" ? "btn-amber" : "key", className)}
      {...rest}
      {...handlers}
      {...pressedAttr}
    >
      {children}
    </button>
  );
}
