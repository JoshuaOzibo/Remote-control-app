"use client";

import { House, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { sendKey } from "@/hooks/useRemote";

/** Desktop, Tasks, Settings, ESC. */
export function SystemRow() {
  return (
    <section aria-label="System" className="grid grid-cols-4 gap-3">
      <Key onPress={() => sendKey("desktop")} className="h-[72px]">
        <House {...icon} />
        <span className="cap">Desktop</span>
      </Key>
      <Key onPress={() => sendKey("taskview")} className="h-[72px]">
        <LayoutGrid {...icon} />
        <span className="cap">Tasks</span>
      </Key>
      <Key onPress={() => sendKey("settings")} className="h-[72px]">
        <SlidersHorizontal {...icon} />
        <span className="cap">Settings</span>
      </Key>
      <Key onPress={() => sendKey("esc")} className="h-[72px]">
        <span className="font-mono text-[15px] font-medium">ESC</span>
        <span className="cap">Exit</span>
      </Key>
    </section>
  );
}
