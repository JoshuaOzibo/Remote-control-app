"use client";

import { useEffect } from "react";
import { DownloadButton } from "@/components/site/DownloadButton";
import { SiteBrand } from "@/components/site/SiteBrand";
import { setTransport } from "@/hooks/useRemote";
import { demoTransport } from "@/lib/demoTransport";
import { DemoChecklist } from "./DemoChecklist";
import { DemoRemote } from "./DemoRemote";
import { FakeLaptop } from "./FakeLaptop";

export function DemoExperience() {
  useEffect(() => {
    setTransport(demoTransport);
    return () => setTransport(null);
  }, []);

  return (
    <div className="min-h-dvh bg-bg">
      <header className="mx-auto flex w-full max-w-[1320px] items-center gap-4 px-4 py-3 lg:px-8 lg:py-4">
        <SiteBrand />
        <span className="hidden text-[13px] text-muted md:inline">
          Live demo: the real remote, driving a pretend laptop. Nothing to install, nothing leaves your browser.
        </span>
        <DownloadButton size="small" className="ml-auto" />
      </header>

      <main className="mx-auto grid w-full max-w-[1320px] lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:pb-12">
        <section
          aria-label="Demo laptop"
          className="sticky top-0 z-20 flex flex-col gap-3 bg-bg/95 px-4 pb-3 pt-1 backdrop-blur lg:static lg:order-2 lg:gap-6 lg:bg-transparent lg:px-0 lg:pt-2 lg:backdrop-blur-none"
        >
          <div className="lg:sticky lg:top-6 lg:flex lg:flex-col lg:gap-6">
            <FakeLaptop />
            <div className="mt-3 lg:mt-0">
              <DemoChecklist />
            </div>
          </div>
        </section>

        <section aria-label="Phone remote" className="lg:order-1">
          <div className="mx-auto w-full max-w-[430px] lg:h-[min(860px,calc(100dvh-110px))] lg:overflow-hidden lg:rounded-[52px] lg:border-[10px] lg:border-[#1C1F25] lg:shadow-[0_0_0_1px_#2A2E36,0_40px_80px_rgba(0,0,0,0.55)] lg:[transform:translateZ(0)]">
            <div className="demo-scroll h-full lg:overflow-y-auto">
              <DemoRemote />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
