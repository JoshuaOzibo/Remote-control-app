"use client";

import { useEffect, useRef, useState } from "react";
import { Key } from "@/components/ui/Key";
import { send } from "@/hooks/useRemote";

/** Bottom sheet with a text box; Send types the text on the laptop. */
export function TypeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const box = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) box.current?.focus();
  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (!text) return;
    send({ t: "type", text });
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
          placeholder="Text to send…"
          className="field h-auto resize-none py-3.5 font-sans text-[15px] placeholder:text-dim"
        />
        <div className="grid grid-cols-2 gap-3">
          <Key onPress={onClose} className="h-[52px] text-[14px] font-semibold">
            Cancel
          </Key>
          <Key
            variant="amber"
            onPress={submit}
            disabled={!text}
            className="h-[52px] rounded-[18px] text-[14px] font-bold disabled:opacity-50"
          >
            Send
          </Key>
        </div>
      </div>
    </div>
  );
}
