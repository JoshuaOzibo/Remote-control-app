import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DownloadButton } from "@/components/site/DownloadButton";
import { LatestVersion } from "./LatestVersion";

export function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-[1120px] items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
      <div className="flex flex-col gap-6">
        <span className="label">Windows laptop · any phone</span>
        <h1 className="m-0 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[56px]">
          Your phone is your laptop&apos;s <span className="text-amber">remote.</span>
        </h1>
        <p className="m-0 max-w-[520px] text-[17px] leading-[1.6] text-muted">
          Laptop plugged into a big screen across the room? Skip the ad, pause the video, move the cursor and type,
          all from the phone in your hand. No account, no cloud: it works over your own Wi-Fi.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <DownloadButton />
          <Link
            href="/demo/"
            data-testid="try-demo"
            className="key h-14 flex-row gap-2.5 rounded-[18px] px-6 text-[16px] font-semibold no-underline"
          >
            <Play size={18} strokeWidth={2} aria-hidden />
            Try the live demo
          </Link>
        </div>
        <LatestVersion className="font-mono text-[12px] text-dim" />
        <Link href="/connect/" data-testid="scan-link" className="w-fit text-[14px] font-semibold text-amber no-underline">
          Already installed? Scan your laptop&apos;s QR code →
        </Link>
      </div>

      <div className="relative mx-auto flex h-[500px] w-full max-w-[460px] items-center justify-center sm:h-[560px]">
        <div className="absolute inset-[12%] rounded-full bg-amber/20 blur-[90px]" aria-hidden />
        <Image
          src="/site/phone-trackpad.png"
          alt="The remote in trackpad mode"
          width={780}
          height={1688}
          className="absolute left-[4%] top-[10%] h-auto w-[44%] rotate-[-7deg] rounded-[30px] border-[6px] border-[#1C1F25] opacity-90 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        />
        <Image
          src="/site/phone-dial.png"
          alt="The remote with the navigation dial"
          width={780}
          height={1688}
          priority
          className="relative h-auto w-[52%] rounded-[36px] border-[7px] border-[#1C1F25] shadow-[0_40px_80px_rgba(0,0,0,0.65)] sm:left-[10%]"
        />
      </div>
    </section>
  );
}
