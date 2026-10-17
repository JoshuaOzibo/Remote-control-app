import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Phone-width column with the design's 20/20/32 padding plus safe-area insets. */
export function Screen({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <main
      className={cn("mx-auto flex min-h-dvh w-full max-w-[430px] flex-col", className)}
      style={{
        paddingTop: "max(20px, env(safe-area-inset-top))",
        paddingRight: "max(20px, env(safe-area-inset-right))",
        paddingBottom: "max(32px, env(safe-area-inset-bottom))",
        paddingLeft: "max(20px, env(safe-area-inset-left))",
      }}
    >
      {children}
    </main>
  );
}
