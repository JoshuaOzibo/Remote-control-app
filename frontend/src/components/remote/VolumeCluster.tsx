"use client";

import { ChevronDown, ChevronUp, Mic, Minus, Plus, VolumeX } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { Rocker } from "@/components/ui/Rocker";
import { sendKey } from "@/hooks/useRemote";

const big = { ...icon, size: 26 };

/** VOL rocker, Mute + Voice, PAGE rocker. */
export function VolumeCluster() {
  return (
    <section aria-label="Volume and paging" className="flex items-center justify-between px-1.5">
      <Rocker
        caption="Vol"
        up={{ icon: <Plus {...big} />, label: "Volume up", onPress: () => sendKey("volup") }}
        down={{ icon: <Minus {...big} />, label: "Volume down", onPress: () => sendKey("voldown") }}
      />

      <div className="flex flex-col items-center gap-[18px]">
        <Key aria-label="Mute" onPress={() => sendKey("mute")} className="h-[72px] w-[72px] rounded-[36px]">
          <VolumeX {...icon} />
        </Key>
        <Key aria-label="Voice typing" onPress={() => sendKey("voice")} className="h-[100px] w-[72px] rounded-[36px]">
          <Mic {...icon} />
          <span className="cap">Voice</span>
        </Key>
      </div>

      <Rocker
        caption="Page"
        up={{ icon: <ChevronUp {...big} />, label: "Page up", onPress: () => sendKey("pageup") }}
        down={{ icon: <ChevronDown {...big} />, label: "Page down", onPress: () => sendKey("pagedown") }}
      />
    </section>
  );
}
