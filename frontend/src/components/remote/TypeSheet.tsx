"use client";

import { CornerDownLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Key } from "@/components/ui/Key";
import { Sheet } from "@/components/ui/Sheet";
import { send } from "@/hooks/useRemote";

const MAX_TYPED_LENGTH = 499;

/** Bottom sheet with a text box; Enter types the text on the laptop and presses Enter, like a search box expects. */
export function TypeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const box = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) box.current?.focus();
  }, [open]);

  const submit = () => {
    if (text) send({ t: "type", text: `${text}\n` });
    else send({ t: "key", k: "enter" });
    setText("");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} labelledBy="type-sheet-title">
      <div className="flex flex-col gap-1">
        <div id="type-sheet-title" className="text-[17px] font-bold">
          Type on laptop
        </div>
        <div className="text-[13px] leading-[1.45] text-muted">
          Click a search box or a text box on the laptop first, then type here.
        </div>
      </div>
      <textarea
        ref={box}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={3}
        maxLength={MAX_TYPED_LENGTH}
        enterKeyHint="enter"
        placeholder="For example: funny cat videos"
        className="field h-auto resize-none py-3.5 font-sans text-[15px] placeholder:text-dim"
      />
      <div className="grid grid-cols-2 gap-3">
        <Key onPress={onClose} className="h-[52px] text-[14px] font-semibold">
          Cancel
        </Key>
        <Key variant="amber" onPress={submit} className="h-[52px] gap-2 rounded-[18px] text-[14px] font-bold">
          <CornerDownLeft size={17} strokeWidth={2.2} aria-hidden />
          Enter
        </Key>
      </div>
    </Sheet>
  );
}
