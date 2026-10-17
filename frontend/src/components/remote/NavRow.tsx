"use client";

import { ArrowRightToLine, Menu, Undo2, ZoomIn } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { sendKey } from "@/hooks/useRemote";

/** Back, Switch, Menu, Zoom. */
export function NavRow() {
  return (
    <section aria-label="Navigation" className="grid grid-cols-4 gap-3">
      <Key onPress={() => sendKey("back")} className="h-[72px]">
        <Undo2 {...icon} />
        <span className="cap">Back</span>
      </Key>
      <Key onPress={() => sendKey("switch")} className="h-[72px]">
        <ArrowRightToLine {...icon} />
        <span className="cap">Switch</span>
      </Key>
      <Key onPress={() => sendKey("menu")} className="h-[72px]">
        <Menu {...icon} />
        <span className="cap">Menu</span>
      </Key>
      <Key onPress={() => sendKey("zoomin")} className="h-[72px]">
        <ZoomIn {...icon} />
        <span className="cap">Zoom</span>
      </Key>
    </section>
  );
}
