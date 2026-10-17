"use client";

import { Keyboard, Volume1, Volume2 } from "lucide-react";
import { icon, PlayPauseIcon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { send, sendKey } from "@/hooks/useRemote";

/** Left/Right click keys, then Vol −, Play/Pause, Vol +, Keyboard. */
export function ClickBar({ onOpenKeyboard }: { onOpenKeyboard: () => void }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Key onPress={() => send({ t: "click", b: "left" })} className="h-[60px] text-[14px] font-semibold">
          Left click
        </Key>
        <Key onPress={() => send({ t: "click", b: "right" })} className="h-[60px] text-[14px] font-semibold">
          Right click
        </Key>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Key aria-label="Volume down" repeat onPress={() => sendKey("voldown")} className="h-14 rounded-2xl">
          <Volume1 {...icon} />
        </Key>
        <Key
          variant="amber"
          aria-label="Play or pause"
          onPress={() => sendKey("playpause")}
          className="h-14 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_6px_0_#A85E1C] data-[pressed]:shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_2px_0_#A85E1C]"
        >
          <PlayPauseIcon />
        </Key>
        <Key aria-label="Volume up" repeat onPress={() => sendKey("volup")} className="h-14 rounded-2xl">
          <Volume2 {...icon} />
        </Key>
        <Key aria-label="Open keyboard to type" onPress={onOpenKeyboard} className="h-14 rounded-2xl">
          <Keyboard {...icon} />
        </Key>
      </div>
    </>
  );
}
