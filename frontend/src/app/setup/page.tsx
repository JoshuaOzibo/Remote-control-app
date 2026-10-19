import type { Metadata } from "next";
import { SetPinForm } from "@/components/connect/SetPinForm";
import { Screen } from "@/components/ui/Screen";

export const metadata: Metadata = {
  title: "Set PIN · Remote",
};

export default function SetupPage() {
  return (
    <Screen className="gap-6">
      <SetPinForm />
    </Screen>
  );
}
