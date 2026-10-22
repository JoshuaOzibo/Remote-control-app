"use client";

import { Check } from "lucide-react";
import { useDemoStore, type DemoGoal } from "@/store/demoStore";
import { cn } from "@/lib/utils";

const GOALS: { goal: DemoGoal; label: string; hint: string }[] = [
  { goal: "moved", label: "Move the cursor", hint: "Trackpad tab, then drag on the pad" },
  { goal: "skippedAd", label: "Skip the ad", hint: "Put the cursor on “Skip ad”, then tap the pad" },
  { goal: "volume", label: "Change the volume", hint: "VOL + or −, or mute" },
  { goal: "typed", label: "Type a note", hint: "Keypad tab, then the keyboard key" },
];

export function DemoChecklist() {
  const goals = useDemoStore((s) => s.goals);
  const done = GOALS.filter(({ goal }) => goals[goal]).length;
  const next = GOALS.find(({ goal }) => !goals[goal]);

  return (
    <section aria-label="Things to try" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="label">Try it</span>
        <span className="font-mono text-[12px] text-muted" data-testid="demo-progress">
          {done} / {GOALS.length} done
        </span>
      </div>

      <p className="m-0 text-[13px] text-muted lg:hidden">
        {next ? (
          <>
            <span className="font-semibold text-text">Next: {next.label}.</span> {next.hint}.
          </>
        ) : (
          <span className="font-semibold text-ok">All done. That&apos;s the real remote, driving a pretend laptop.</span>
        )}
      </p>

      <ul className="m-0 hidden list-none grid-cols-2 gap-2.5 p-0 lg:grid">
        {GOALS.map(({ goal, label, hint }) => (
          <li
            key={goal}
            data-goal={goal}
            data-done={goals[goal] || undefined}
            className={cn(
              "flex items-start gap-3 rounded-2xl border border-line bg-card p-3.5",
              goals[goal] && "border-[#2E6B45]",
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-edge text-transparent",
                goals[goal] && "border-ok bg-ok text-[#06240F]",
              )}
            >
              <Check size={14} strokeWidth={3} aria-hidden />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[14px] font-semibold">{label}</span>
              <span className="text-[12px] leading-[1.4] text-muted">{hint}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
