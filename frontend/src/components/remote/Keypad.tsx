"use client";

import { CornerDownLeft, Keyboard, Mic } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { sendKey } from "@/hooks/useRemote";
import type { KeyName } from "@/lib/protocol";

const DIGITS: KeyName[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Keypad({ onOpenKeyboard }: { onOpenKeyboard: () => void }) {
  return (
    <section aria-label="Type" className="flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_96px] gap-3">
        <Key
          variant="amber"
          onPress={onOpenKeyboard}
          className="h-[68px] flex-row gap-3 rounded-[18px] text-[16px] font-bold"
        >
          <Keyboard size={24} strokeWidth={2} aria-hidden />
          Type on laptop
        </Key>
        <Key onPress={() => sendKey("voice")} aria-label="Speak to type" className="h-[68px]">
          <Mic {...icon} />
          <span className="cap">Speak</span>
        </Key>
      </div>

      <div className="label mt-1">Numbers</div>
      <div className="grid grid-cols-3 gap-2.5 font-mono text-[20px] font-medium">
        {DIGITS.map((d) => (
          <Key key={d} onPress={() => sendKey(d)} className="h-[54px] rounded-[14px] font-mono">
            {d}
          </Key>
        ))}
        <Key onPress={() => sendKey("tab")} aria-label="Next box (Tab)" className="h-[54px] rounded-[14px] gap-0.5">
          <span className="font-sans text-[13px] font-semibold">Next box</span>
          <span className="font-mono text-[10px] text-dim">Tab</span>
        </Key>
        <Key onPress={() => sendKey("0")} className="h-[54px] rounded-[14px] font-mono">
          0
        </Key>
        <Key onPress={() => sendKey("enter")} aria-label="Enter" className="h-[54px] flex-row gap-1.5 rounded-[14px]">
          <CornerDownLeft size={18} strokeWidth={2} aria-hidden />
          <span className="font-sans text-[13px] font-semibold">Enter</span>
        </Key>
      </div>
    </section>
  );
}
