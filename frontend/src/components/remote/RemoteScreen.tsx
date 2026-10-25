"use client";

import { useEffect, useState } from "react";
import { ConnectionSheet } from "@/components/remote/ConnectionSheet";
import { HelpSheet } from "@/components/remote/HelpSheet";
import { Keypad } from "@/components/remote/Keypad";
import { NavDial } from "@/components/remote/NavDial";
import { OfflineBanner } from "@/components/remote/OfflineBanner";
import { RemoteHeader } from "@/components/remote/RemoteHeader";
import { SystemRow } from "@/components/remote/SystemRow";
import { TypeSheet } from "@/components/remote/TypeSheet";
import { WatchCard } from "@/components/remote/WatchCard";
import { Trackpad } from "@/components/trackpad/Trackpad";
import { Screen } from "@/components/ui/Screen";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { load, save, STORAGE_KEYS } from "@/lib/storage";
import { useRemoteStore } from "@/store/remoteStore";

type Sheet = "type" | "connection" | "help" | null;

export function RemoteScreen() {
  const mode = useRemoteStore((s) => s.mode);
  const [sheet, setSheet] = useState<Sheet>(null);
  const close = () => setSheet(null);

  useEffect(() => {
    let shown = false;
    return useRemoteStore.subscribe((state) => {
      if (shown || state.status !== "connected" || load(STORAGE_KEYS.seenGuide, false)) return;
      shown = true;
      save(STORAGE_KEYS.seenGuide, true);
      setSheet((open) => open ?? "help");
    });
  }, []);

  return (
    <Screen className="gap-[22px]">
      <div className="flex flex-col gap-3">
        <RemoteHeader onOpenConnection={() => setSheet("connection")} onOpenHelp={() => setSheet("help")} />
        <OfflineBanner />
      </div>
      <WatchCard />
      <SegmentedToggle />

      {mode === "dial" && <NavDial />}
      {mode === "trackpad" && <Trackpad />}
      {mode === "keypad" && <Keypad onOpenKeyboard={() => setSheet("type")} />}

      <SystemRow />

      <TypeSheet open={sheet === "type"} onClose={close} />
      <ConnectionSheet open={sheet === "connection"} onClose={close} onHelp={() => setSheet("help")} />
      <HelpSheet open={sheet === "help"} onClose={close} />
    </Screen>
  );
}
