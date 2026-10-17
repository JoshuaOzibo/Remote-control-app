"use client";

import { useState } from "react";
import { Keypad } from "@/components/remote/Keypad";
import { NavDial } from "@/components/remote/NavDial";
import { NavRow } from "@/components/remote/NavRow";
import { PlaybackRow } from "@/components/remote/PlaybackRow";
import { QuickShortcuts } from "@/components/remote/QuickShortcuts";
import { RemoteHeader } from "@/components/remote/RemoteHeader";
import { SystemRow } from "@/components/remote/SystemRow";
import { TypeSheet } from "@/components/remote/TypeSheet";
import { VolumeCluster } from "@/components/remote/VolumeCluster";
import { ClickBar } from "@/components/trackpad/ClickBar";
import { Trackpad } from "@/components/trackpad/Trackpad";
import { Screen } from "@/components/ui/Screen";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { useRemoteStore } from "@/store/remoteStore";

export default function RemotePage() {
  const mode = useRemoteStore((s) => s.mode);
  const [typing, setTyping] = useState(false);
  const openKeyboard = () => setTyping(true);

  return (
    <Screen className={mode === "dial" ? "gap-[22px]" : "gap-5"}>
      <RemoteHeader />

      {mode === "dial" ? (
        <>
          <VolumeCluster />
          <SystemRow />
          <SegmentedToggle />
          <NavDial />
          <NavRow />
          <PlaybackRow />
          <QuickShortcuts />
          <Keypad onOpenKeyboard={openKeyboard} />
        </>
      ) : (
        <>
          <SegmentedToggle />
          <Trackpad />
          <ClickBar onOpenKeyboard={openKeyboard} />
        </>
      )}

      <TypeSheet open={typing} onClose={() => setTyping(false)} />
    </Screen>
  );
}
