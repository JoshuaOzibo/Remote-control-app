import type { Metadata } from "next";
import { ConnectForm } from "@/components/connect/ConnectForm";
import { Screen } from "@/components/ui/Screen";

export const metadata: Metadata = {
  title: "Connect · Remote",
};

export default function ConnectPage() {
  return (
    <Screen className="gap-6">
      <ConnectForm />
    </Screen>
  );
}
