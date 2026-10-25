"use client";

import { useState } from "react";
import type { ActionGroup } from "@/components/more/moreActions";
import { HelpSheet } from "@/components/remote/HelpSheet";
import { Keypad } from "@/components/remote/Keypad";
import { NavDial } from "@/components/remote/NavDial";
import { SystemRow } from "@/components/remote/SystemRow";
import { TypeSheet } from "@/components/remote/TypeSheet";
import { WatchCard } from "@/components/remote/WatchCard";
import { Trackpad } from "@/components/trackpad/Trackpad";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { useRemoteStore } from "@/store/remoteStore";
import { DemoHeader } from "./DemoHeader";
import { MoreSheet } from "./MoreSheet";

export function DemoRemote() {
  const mode = useRemoteStore((s) => s.mode);
  const [typing, setTyping] = useState(false);
  const [help, setHelp] = useState(false);
  const [more, setMore] = useState<ActionGroup | null>(null);

  return (
    <div className="flex flex-col gap-[22px] px-5 pb-8 pt-5">
      <DemoHeader onOpenHelp={() => setHelp(true)} />
      <WatchCard />
      <SegmentedToggle />

      {mode === "dial" && <NavDial />}
      {mode === "trackpad" && <Trackpad />}
      {mode === "keypad" && <Keypad onOpenKeyboard={() => setTyping(true)} />}

      <SystemRow onMore={() => setMore("laptop")} />

      <TypeSheet open={typing} onClose={() => setTyping(false)} />
      <HelpSheet open={help} onClose={() => setHelp(false)} />
      <MoreSheet group={more} onChange={setMore} />
    </div>
  );
}
