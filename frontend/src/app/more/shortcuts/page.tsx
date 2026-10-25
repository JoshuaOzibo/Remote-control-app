import type { Metadata } from "next";
import { ActionGrid } from "@/components/more/ActionGrid";
import { MoreHeader } from "@/components/more/MoreHeader";
import { Screen } from "@/components/ui/Screen";

export const metadata: Metadata = {
  title: "Web & editing · Remote",
};

export default function MoreShortcutsPage() {
  return (
    <Screen className="gap-6">
      <MoreHeader group="shortcuts" />
      <ActionGrid group="shortcuts" />
    </Screen>
  );
}
