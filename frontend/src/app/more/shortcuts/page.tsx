import type { Metadata } from "next";
import { ActionGrid } from "@/components/more/ActionGrid";
import { MoreHeader } from "@/components/more/MoreHeader";
import { Screen } from "@/components/ui/Screen";

export const metadata: Metadata = {
  title: "Shortcuts · Remote",
};

export default function MoreShortcutsPage() {
  return (
    <Screen className="gap-6">
      <MoreHeader title="Shortcuts" />
      <ActionGrid group="shortcuts" />
    </Screen>
  );
}
