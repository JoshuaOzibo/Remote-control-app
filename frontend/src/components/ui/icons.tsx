import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/** Default icon look from the design: 22px, 1.8 stroke. */
export const icon = { size: 22, strokeWidth: 1.8, "aria-hidden": true } as const;

/** Lucide has no combined play/pause glyph, so this pairs the two. */
export function PlayPauseIcon({ size = 22, className }: { size?: number; className?: string }) {
  const part = Math.round(size * 0.82);
  return (
    <span aria-hidden className={cn("flex items-center", className)}>
      <Play size={part} strokeWidth={2.2} className="-mr-[3px]" />
      <Pause size={part} strokeWidth={2.2} />
    </span>
  );
}
