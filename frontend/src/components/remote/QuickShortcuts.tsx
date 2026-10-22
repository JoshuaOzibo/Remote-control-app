"use client";

import { Key } from "@/components/ui/Key";
import { KeyLink } from "@/components/ui/KeyLink";
import { sendKey } from "@/hooks/useRemote";
import type { KeyName } from "@/lib/protocol";

const SHORTCUTS: { k: KeyName; label: string; color: string }[] = [
  { k: "snip", label: "Snip", color: "#E5484D" },
  { k: "newtab", label: "New tab", color: "#3FB868" },
  { k: "closetab", label: "Close tab", color: "#F2C94C" },
];

const MORE_BAR_COLOR = "#5B616E";

export function QuickShortcuts({ onMore }: { onMore?: () => void }) {
  const moreContent = (
    <>
      <span className="h-[5px] w-7 rounded-[3px]" style={{ background: MORE_BAR_COLOR }} />
      <span className="cap text-text">More</span>
    </>
  );
  return (
    <section aria-label="Quick shortcuts" className="flex flex-col gap-2.5">
      <div className="label">Quick shortcuts</div>
      <div className="grid grid-cols-4 gap-2.5">
        {SHORTCUTS.map(({ k, label, color }) => (
          <Key key={k} onPress={() => sendKey(k)} className="h-16 gap-2 rounded-2xl">
            <span className="h-[5px] w-7 rounded-[3px]" style={{ background: color }} />
            <span className="cap text-text">{label}</span>
          </Key>
        ))}
        {onMore ? (
          <Key onPress={onMore} aria-label="More shortcuts" className="h-16 gap-2 rounded-2xl">
            {moreContent}
          </Key>
        ) : (
          <KeyLink href="/more/shortcuts/" aria-label="More shortcuts" className="h-16 gap-2 rounded-2xl">
            {moreContent}
          </KeyLink>
        )}
      </div>
    </section>
  );
}
