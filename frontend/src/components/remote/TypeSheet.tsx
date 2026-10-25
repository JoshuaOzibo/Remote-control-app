"use client";

import { CornerDownLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Key } from "@/components/ui/Key";
import { send } from "@/hooks/useRemote";

const MAX_TYPED_LENGTH = 499;

/** Bottom sheet with a text box; Enter types the text on the laptop and presses Enter, like a search box expects. */
export function TypeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const box = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) box.current?.focus();
  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (text) send({ t: "type", text: `${text}\n` });
    else send({ t: "key", k: "enter" });
    setText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="type-sheet-title"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[430px] flex-col gap-4 rounded-t-[28px] border-t border-line bg-card px-5 pt-5"
        style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-[#2A2E36]" aria-hidden />
        <div id="type-sheet-title" className="label">
          Type on laptop
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
          placeholder="Type, then tap Enter…"
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
      </div>
    </div>
  );
}
