"use client";

import { useState } from "react";
import type { ActionGroup } from "@/components/more/moreActions";
import { Keypad } from "@/components/remote/Keypad";
import { NavDial } from "@/components/remote/NavDial";
import { QuickShortcuts } from "@/components/remote/QuickShortcuts";
import { SystemRow } from "@/components/remote/SystemRow";
import { TypeSheet } from "@/components/remote/TypeSheet";
import { VolumeCluster } from "@/components/remote/VolumeCluster";
import { Trackpad } from "@/components/trackpad/Trackpad";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { useRemoteStore } from "@/store/remoteStore";
import { DemoHeader } from "./DemoHeader";
import { MoreSheet } from "./MoreSheet";

export function DemoRemote() {
  const mode = useRemoteStore((s) => s.mode);
  const [typing, setTyping] = useState(false);
  const [more, setMore] = useState<ActionGroup | null>(null);

  return (
    <div className="flex flex-col gap-[22px] px-5 pb-8 pt-5">
      <DemoHeader />
      <VolumeCluster />
      <QuickShortcuts onMore={() => setMore("shortcuts")} />
      <SegmentedToggle />

      {mode === "dial" && <NavDial />}
      {mode === "trackpad" && <Trackpad />}
      {mode === "keypad" && <Keypad onOpenKeyboard={() => setTyping(true)} />}

      <SystemRow onMore={() => setMore("laptop")} />

      <TypeSheet open={typing} onClose={() => setTyping(false)} />
      <MoreSheet group={more} onChange={setMore} />
    </div>
  );
}
