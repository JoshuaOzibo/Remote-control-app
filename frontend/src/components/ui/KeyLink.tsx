"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useRepeatPress } from "@/hooks/useRepeatPress";
import { cn } from "@/lib/utils";

export function KeyLink({ className, children, ...rest }: ComponentProps<typeof Link>) {
  const { handlers, pressedAttr } = useRepeatPress();
  return (
    <Link className={cn("key", className)} {...rest} {...handlers} {...pressedAttr}>
      {children}
    </Link>
  );
}
