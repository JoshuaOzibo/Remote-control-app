import type { Metadata } from "next";
import { ActionGrid } from "@/components/more/ActionGrid";
import { MoreHeader } from "@/components/more/MoreHeader";
import { Screen } from "@/components/ui/Screen";

export const metadata: Metadata = {
  title: "Laptop · Remote",
};

export default function MoreLaptopPage() {
  return (
    <Screen className="gap-6">
      <MoreHeader title="Laptop" />
      <ActionGrid group="laptop" />
    </Screen>
  );
}
