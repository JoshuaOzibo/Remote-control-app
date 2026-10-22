"use client";

import { ActionGrid } from "@/components/more/ActionGrid";
import type { ActionGroup } from "@/components/more/moreActions";
import { Key } from "@/components/ui/Key";
import { cn } from "@/lib/utils";

const TABS: { group: ActionGroup; label: string }[] = [
  { group: "shortcuts", label: "Shortcuts" },
  { group: "laptop", label: "Laptop" },
];

export function MoreSheet({ group, onChange }: { group: ActionGroup | null; onChange: (group: ActionGroup | null) => void }) {
  if (!group) return null;
  const close = () => onChange(null);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="More controls"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[82%] w-full max-w-[430px] flex-col gap-4 rounded-t-[28px] border-t border-line bg-card px-5 pt-5"
        style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-[#2A2E36]" aria-hidden />
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-well p-1" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.group}
              type="button"
              role="tab"
              aria-selected={tab.group === group}
              onClick={() => onChange(tab.group)}
              className={cn(
                "h-10 rounded-xl font-sans text-[14px] font-semibold text-muted",
                tab.group === group && "bg-[#232730] text-text",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="demo-scroll -mx-1 overflow-y-auto px-1 pb-1">
          <ActionGrid group={group} />
        </div>
        <Key onPress={close} className="h-[52px] shrink-0 text-[14px] font-semibold">
          Done
        </Key>
      </div>
    </div>
  );
}
