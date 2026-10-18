"use client";

import { useState } from "react";
import { Keypad } from "@/components/remote/Keypad";
import { NavDial } from "@/components/remote/NavDial";
import { QuickShortcuts } from "@/components/remote/QuickShortcuts";
import { RemoteHeader } from "@/components/remote/RemoteHeader";
import { SystemRow } from "@/components/remote/SystemRow";
import { TypeSheet } from "@/components/remote/TypeSheet";
import { VolumeCluster } from "@/components/remote/VolumeCluster";
import { Trackpad } from "@/components/trackpad/Trackpad";
import { Screen } from "@/components/ui/Screen";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { useRemoteStore } from "@/store/remoteStore";

export default function RemotePage() {
  const mode = useRemoteStore((s) => s.mode);
  const [typing, setTyping] = useState(false);

  return (
    <Screen className="gap-[22px]">
      <RemoteHeader />
      <VolumeCluster />
      <QuickShortcuts />
      <SegmentedToggle />

      {mode === "dial" && <NavDial />}
      {mode === "trackpad" && <Trackpad />}
      {mode === "keypad" && <Keypad onOpenKeyboard={() => setTyping(true)} />}

      <SystemRow />

      <TypeSheet open={typing} onClose={() => setTyping(false)} />
    </Screen>
  );
}
