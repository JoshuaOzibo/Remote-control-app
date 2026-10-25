"use client";

import { ArrowLeft, Ellipsis, House } from "lucide-react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { KeyLink } from "@/components/ui/KeyLink";
import { sendKey } from "@/hooks/useRemote";

export function SystemRow({ onMore }: { onMore?: () => void }) {
  const moreContent = (
    <>
      <Ellipsis {...icon} />
      <span className="cap">More</span>
    </>
  );

  return (
    <section aria-label="Everyday keys" className="grid grid-cols-4 gap-3">
      <Key onPress={() => sendKey("back")} aria-label="Go back" className="h-[72px]">
        <ArrowLeft {...icon} />
        <span className="cap">Back</span>
      </Key>
      <Key onPress={() => sendKey("desktop")} aria-label="Show desktop" className="h-[72px]">
        <House {...icon} />
        <span className="cap">Desktop</span>
      </Key>
      <Key onPress={() => sendKey("esc")} aria-label="Escape, cancel" className="h-[72px]">
        <span className="font-mono text-[15px] font-medium">Esc</span>
        <span className="cap">Cancel</span>
      </Key>
      {onMore ? (
        <Key onPress={onMore} aria-label="More controls" className="h-[72px]">
          {moreContent}
        </Key>
      ) : (
        <KeyLink href="/more/laptop/" aria-label="More controls" className="h-[72px]">
          {moreContent}
        </KeyLink>
      )}
    </section>
  );
}
