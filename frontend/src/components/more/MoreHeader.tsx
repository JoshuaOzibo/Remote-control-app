"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { icon } from "@/components/ui/icons";
import { KeyLink } from "@/components/ui/KeyLink";
import { StatusLine } from "@/components/ui/StatusLine";
import { cn } from "@/lib/utils";
import { GROUP_ORDER, GROUP_TITLES, type ActionGroup } from "./moreActions";

const GROUP_PATHS: Record<ActionGroup, string> = { laptop: "/more/laptop/", shortcuts: "/more/shortcuts/" };

export function MoreHeader({ group }: { group: ActionGroup }) {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex h-14 items-center gap-3">
        <KeyLink href="/" aria-label="Back to remote" className="h-12 w-12 shrink-0 rounded-3xl">
          <ChevronLeft {...icon} />
        </KeyLink>
        <div className="flex min-w-0 grow flex-col gap-1">
          <h1 className="m-0 text-[18px] font-bold tracking-[-0.01em]">More controls</h1>
          <StatusLine />
        </div>
      </header>

      <nav
        aria-label="Control groups"
        className="grid grid-cols-2 gap-1 rounded-2xl bg-card p-1 shadow-[inset_0_2px_6px_rgba(0,0,0,.5)]"
      >
        {GROUP_ORDER.map((item) => (
          <Link
            key={item}
            href={GROUP_PATHS[item]}
            replace
            aria-current={item === group ? "page" : undefined}
            className={cn(
              "flex h-12 items-center justify-center rounded-xl text-[14px] font-semibold",
              item === group ? "bg-[#2A2E36] text-text shadow-[0_2px_0_#0A0B0E]" : "text-muted",
            )}
          >
            {GROUP_TITLES[item]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
