import type { Metadata } from "next";
import { DemoExperience } from "@/components/demo/DemoExperience";

export const metadata: Metadata = {
  title: "Live demo · Phone Remote",
  description: "Try the Phone Remote controls in your browser: the real remote drives a pretend laptop.",
};

export default function DemoPage() {
  return <DemoExperience />;
}
