"use client";

import { ChevronLeft } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { KeyLink } from "@/components/ui/KeyLink";
import { StatusLine } from "@/components/ui/StatusLine";

export function MoreHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 items-center gap-3">
      <KeyLink href="/" aria-label="Back to remote" className="h-12 w-12 shrink-0 rounded-3xl">
        <ChevronLeft {...icon} />
      </KeyLink>
      <div className="flex min-w-0 grow flex-col gap-1">
        <h1 className="m-0 text-[18px] font-bold tracking-[-0.01em]">{title}</h1>
        <StatusLine />
      </div>
    </header>
  );
}
