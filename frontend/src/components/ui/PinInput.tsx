"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

const LENGTH = 4;

// Empty boxes are stored as spaces so a gap (e.g. boxes 1 and 3 filled) keeps its position.
const pack = (digits: string[]) => digits.map((d) => d || " ").join("").trimEnd();

/** True when all four boxes hold a digit. */
export const isCompletePin = (pin: string) => /^\d{4}$/.test(pin);

type PinInputProps = {
  value: string;
  onChange: (value: string) => void;
  labelledBy?: string;
};

/** Four single-digit boxes with auto-advance, backspace-to-previous and paste. */
export function PinInput({ value, onChange, labelledBy }: PinInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => (value[i] ?? "").trim());

  const focus = (i: number) => refs.current[Math.max(0, Math.min(LENGTH - 1, i))]?.focus();

  const setDigit = (i: number, digit: string) => {
    const next = [...digits];
    next[i] = digit;
    onChange(pack(next));
  };

  const handleInput = (i: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return setDigit(i, "");
    if (typed.length > 1) return fill(typed, i);
    setDigit(i, typed);
    if (i < LENGTH - 1) focus(i + 1);
  };

  // Fills from box `start` onwards (paste, or autofill dropping several digits in one box).
  const fill = (text: string, start = 0) => {
    const next = [...digits];
    const incoming = text.replace(/\D/g, "").slice(0, LENGTH - start);
    for (let j = 0; j < incoming.length; j++) next[start + j] = incoming[j];
    onChange(pack(next));
    focus(start + incoming.length);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      setDigit(i - 1, "");
      focus(i - 1);
    } else if (e.key === "ArrowLeft") {
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      focus(i + 1);
    }
  };

  const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    fill(e.clipboardData.getData("text"), i);
  };

  return (
    <div role="group" aria-labelledby={labelledBy} className="grid grid-cols-4 gap-3">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="pin"
          type="tel"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`PIN digit ${i + 1}`}
          value={digit}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
