"use client";

import { Keyboard } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { sendKey } from "@/hooks/useRemote";
import type { KeyName } from "@/lib/protocol";

const DIGITS: KeyName[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Keypad({ onOpenKeyboard }: { onOpenKeyboard: () => void }) {
  return (
    <section aria-label="Keypad" className="flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-2.5 font-mono text-[18px] font-medium">
        {DIGITS.map((d) => (
          <Key key={d} onPress={() => sendKey(d)} className="h-[52px] rounded-[14px] font-mono">
            {d}
          </Key>
        ))}
        <Key onPress={() => sendKey("tab")} className="h-[52px] rounded-[14px] font-mono text-[12px] tracking-[0.1em]">
          TAB
        </Key>
        <Key onPress={() => sendKey("0")} className="h-[52px] rounded-[14px] font-mono">
          0
        </Key>
        <Key aria-label="Open keyboard to type" onPress={onOpenKeyboard} className="h-[52px] rounded-[14px]">
          <Keyboard {...icon} />
        </Key>
      </div>
    </section>
  );
}
