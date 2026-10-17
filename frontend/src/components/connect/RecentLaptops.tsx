"use client";

import { ChevronRight } from "lucide-react";
import { useRemoteStore } from "@/store/remoteStore";
import type { RecentLaptop } from "@/types";

/** Laptops connected to before. Tapping one reconnects with the saved PIN. */
export function RecentLaptops({ onPick }: { onPick: (laptop: RecentLaptop) => void }) {
  const recent = useRemoteStore((s) => s.recent);
  const status = useRemoteStore((s) => s.status);
  const current = useRemoteStore((s) => s.address);

  if (recent.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="label">Recent</div>
      {recent.map((laptop) => {
        const live = status === "connected" && laptop.address === current;
        return (
          <button
            key={laptop.address}
            type="button"
            onClick={() => onPick(laptop)}
            className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3.5 text-left font-sans text-text"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={
                live
                  ? { background: "#4ADE80", boxShadow: "0 0 8px rgba(74,222,128,.6)" }
                  : { background: "#6B7280" }
              }
            />
            <span className="flex grow flex-col gap-0.5">
              <span className="text-[14px] font-semibold">{laptop.name}</span>
              <span className="font-mono text-[12px] font-medium text-muted">{laptop.address}</span>
            </span>
            <ChevronRight size={18} strokeWidth={1.8} aria-hidden className="text-dim" />
          </button>
        );
      })}
    </div>
  );
}
