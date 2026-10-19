"use client";

import { ChevronRight, X } from "lucide-react";
import { isHotspotAddress } from "@/lib/network";
import { useRemoteStore } from "@/store/remoteStore";
import type { RecentLaptop } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function lastUsedText(lastUsed: number) {
  if (!lastUsed) return null;
  const days = Math.round((lastUsed - Date.now()) / DAY_MS);
  return relative.format(days, "day");
}

function metaText(laptop: RecentLaptop) {
  const meta = [isHotspotAddress(laptop.address) ? "Laptop hotspot" : null, lastUsedText(laptop.lastUsed)];
  return meta.filter(Boolean).join(" · ");
}

export function RecentLaptops({ onPick }: { onPick: (laptop: RecentLaptop) => void }) {
  const recent = useRemoteStore((s) => s.recent);
  const status = useRemoteStore((s) => s.status);
  const current = useRemoteStore((s) => s.address);
  const forget = useRemoteStore((s) => s.forget);

  if (recent.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="label">Recent</div>
      {recent.map((laptop) => {
        const live = status === "connected" && laptop.address === current;
        return (
          <div key={laptop.address} className="flex items-stretch rounded-2xl border border-line bg-card">
            <button
              type="button"
              onClick={() => onPick(laptop)}
              className="flex min-w-0 grow items-center gap-3 bg-transparent py-3.5 pl-4 pr-2 text-left font-sans text-text"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={
                  live
                    ? { background: "#4ADE80", boxShadow: "0 0 8px rgba(74,222,128,.6)" }
                    : { background: "#6B7280" }
                }
              />
              <span className="flex min-w-0 grow flex-col gap-0.5">
                <span className="truncate text-[14px] font-semibold">{laptop.name}</span>
                <span className="truncate font-mono text-[12px] font-medium text-muted">{laptop.address}</span>
                {metaText(laptop) && <span className="truncate text-[11px] text-dim">{metaText(laptop)}</span>}
              </span>
              <ChevronRight size={18} strokeWidth={1.8} aria-hidden className="shrink-0 text-dim" />
            </button>
            <button
              type="button"
              aria-label={`Forget ${laptop.name}`}
              onClick={() => forget(laptop.address)}
              className="flex w-11 shrink-0 items-center justify-center border-l border-line bg-transparent text-dim"
            >
              <X size={16} strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
