"use client";

import { FastForward, Maximize, Pause, Play, Rewind, Volume1, Volume2, VolumeX, type LucideIcon } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { sendKey } from "@/hooks/useRemote";
import type { KeyName } from "@/lib/protocol";

const SOUND: { k: KeyName; label: string; Icon: LucideIcon; repeat?: boolean }[] = [
  { k: "voldown", label: "Quieter", Icon: Volume1, repeat: true },
  { k: "volup", label: "Louder", Icon: Volume2, repeat: true },
  { k: "mute", label: "Mute", Icon: VolumeX },
  { k: "fullscreen", label: "Full screen", Icon: Maximize },
];

export function WatchCard() {
  return (
    <section aria-label="Watch" className="flex flex-col gap-3">
      <div className="label">Watch</div>

      <div className="grid grid-cols-[1fr_1.35fr_1fr] gap-3">
        <Key repeat onPress={() => sendKey("left")} aria-label="Rewind" className="h-[76px]">
          <Rewind {...icon} />
          <span className="cap">Rewind</span>
        </Key>
        <Key
          variant="amber"
          onPress={() => sendKey("playpause")}
          aria-label="Play or pause"
          className="h-[76px] flex-col gap-1.5 rounded-[18px]"
        >
          <span className="flex items-center gap-1" aria-hidden>
            <Play size={22} strokeWidth={2.2} fill="currentColor" />
            <Pause size={22} strokeWidth={2.2} fill="currentColor" />
          </span>
          <span className="text-[13px] font-bold">Play / Pause</span>
        </Key>
        <Key repeat onPress={() => sendKey("right")} aria-label="Skip ahead" className="h-[76px]">
          <FastForward {...icon} />
          <span className="cap">Skip ahead</span>
        </Key>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {SOUND.map(({ k, label, Icon, repeat }) => (
          <Key key={k} repeat={repeat} onPress={() => sendKey(k)} className="h-[68px] px-1 text-center">
            <Icon {...icon} />
            <span className="cap leading-tight">{label}</span>
          </Key>
        ))}
      </div>
    </section>
  );
}
