"use client";

import { Maximize, SkipBack, SkipForward } from "lucide-react";
import { icon, PlayPauseIcon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { sendKey } from "@/hooks/useRemote";

/** Prev, Play/Pause, Next, Fullscreen. */
export function PlaybackRow() {
  return (
    <section aria-label="Playback" className="flex items-center justify-between px-1">
      <Key aria-label="Previous" onPress={() => sendKey("prev")} className="h-16 w-16 rounded-[32px]">
        <SkipBack {...icon} />
      </Key>
      <Key
        variant="amber"
        aria-label="Play or pause"
        onPress={() => sendKey("playpause")}
        className="h-16 w-[88px] rounded-[32px]"
      >
        <PlayPauseIcon size={26} />
      </Key>
      <Key aria-label="Next" onPress={() => sendKey("next")} className="h-16 w-16 rounded-[32px]">
        <SkipForward {...icon} />
      </Key>
      <Key aria-label="Fullscreen" onPress={() => sendKey("fullscreen")} className="h-16 w-16 rounded-[32px]">
        <Maximize {...icon} />
      </Key>
    </section>
  );
}
