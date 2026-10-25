"use client";

import { CircleDot, Ellipsis, Keyboard, MousePointer2, Play, type LucideIcon } from "lucide-react";
import { Key } from "@/components/ui/Key";
import { Sheet } from "@/components/ui/Sheet";

const TIPS: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Play, title: "Watch", text: "Play or pause, rewind, skip ahead and change the volume of what's on the laptop." },
  { Icon: CircleDot, title: "Arrows", text: "Move around menus and pages. Tap an arrow, and tap the middle to choose." },
  {
    Icon: MousePointer2,
    title: "Mouse",
    text: "Slide one finger to move the pointer. Tap the pad or press Left click to click. Use the strip on the right to scroll.",
  },
  { Icon: Keyboard, title: "Type", text: "Write on the laptop, for example a YouTube search, then press Enter." },
  { Icon: Ellipsis, title: "More", text: "Everything else, like closing an app, zooming in or locking the laptop." },
];

export function HelpSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="help-sheet-title" className="max-h-[88%]">
      <div id="help-sheet-title" className="text-[17px] font-bold">
        How to use the remote
      </div>
      <ul className="m-0 flex list-none flex-col gap-2.5 overflow-y-auto p-0">
        {TIPS.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3.5 rounded-2xl border border-line bg-well p-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F2228] text-amber">
              <Icon size={20} strokeWidth={1.8} aria-hidden />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold">{title}</span>
              <span className="text-[13px] leading-[1.45] text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
      <Key variant="amber" onPress={onClose} className="h-[52px] shrink-0 rounded-[18px] text-[15px] font-bold">
        Got it
      </Key>
    </Sheet>
  );
}
