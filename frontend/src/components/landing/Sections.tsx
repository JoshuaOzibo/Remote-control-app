import {
  CircleDot,
  Download,
  KeyRound,
  Keyboard,
  Laptop,
  LockKeyhole,
  MonitorSmartphone,
  MousePointer2,
  Play,
  QrCode,
  ShieldCheck,
  Volume2,
  WifiOff,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { DownloadButton } from "@/components/site/DownloadButton";
import { REPO_URL } from "@/lib/site";
import { LatestVersion } from "./LatestVersion";

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto flex w-full max-w-[1120px] scroll-mt-20 flex-col gap-10 px-5 py-20 sm:px-8">
      <div className="flex max-w-[640px] flex-col gap-3">
        <span className="label">{eyebrow}</span>
        <h2 className="m-0 text-[30px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[38px]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function IconTile({ Icon }: { Icon: LucideIcon }) {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line bg-[#1F2228] text-amber">
      <Icon size={22} strokeWidth={1.8} aria-hidden />
    </span>
  );
}

const STEPS: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Download, title: "Install on your laptop", text: "Download PhoneRemote-Setup.exe and run it once. It lives in the Windows tray." },
  { Icon: QrCode, title: "Scan the QR code", text: "Point your phone's camera at the code on the laptop and choose a 4-digit PIN." },
  { Icon: MousePointer2, title: "Control it from the couch", text: "Trackpad, arrows, volume, typing and shortcuts. Next time it reconnects by itself." },
];

export function HowItWorks() {
  return (
    <Section id="how" eyebrow="How it works" title="Three steps, about a minute.">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_340px]">
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {STEPS.map(({ Icon, title, text }, index) => (
            <li key={title} className="flex gap-4 rounded-[22px] border border-line bg-card p-5">
              <IconTile Icon={Icon} />
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[12px] text-dim">Step {index + 1}</span>
                <span className="text-[17px] font-semibold">{title}</span>
                <span className="text-[15px] leading-[1.55] text-muted">{text}</span>
              </div>
            </li>
          ))}
        </ol>
        <Image
          src="/site/laptop-window.png"
          alt="The Phone Remote window on the laptop, showing the QR code to scan"
          width={503}
          height={899}
          className="mx-auto h-auto w-full max-w-[300px] rounded-[22px] border border-line shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
        />
      </div>
    </Section>
  );
}

const FEATURES: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: MousePointer2, title: "Trackpad", text: "Drag to move, tap to click, two-finger tap to right-click, two fingers to scroll." },
  { Icon: CircleDot, title: "Navigation dial", text: "Arrows and OK on a 3D dial with hold-to-repeat. Made for menus and players." },
  { Icon: Volume2, title: "Media and volume", text: "Volume, mute, play and pause, next track, full screen and voice typing." },
  { Icon: Keyboard, title: "Type from your phone", text: "Send text to the laptop, emoji and accents included." },
  { Icon: Zap, title: "Shortcuts", text: "Snip, tabs, switch windows, snap, lock, task manager, copy and paste, and more." },
  { Icon: MonitorSmartphone, title: "Feels like an app", text: "Add it to your home screen. The laptop side sits quietly in the tray." },
];

export function Features() {
  return (
    <Section id="features" eyebrow="Features" title="Everything you'd reach for the keyboard to do.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ Icon, title, text }) => (
          <div key={title} className="flex flex-col gap-3 rounded-[22px] border border-line bg-card p-6">
            <IconTile Icon={Icon} />
            <span className="text-[17px] font-semibold">{title}</span>
            <span className="text-[15px] leading-[1.55] text-muted">{text}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function DemoBand() {
  return (
    <section className="mx-auto w-full max-w-[1120px] px-5 py-6 sm:px-8">
      <div className="flex flex-col items-start gap-6 rounded-[28px] border border-[#6B4A22] bg-[radial-gradient(120%_140%_at_0%_0%,rgba(255,159,67,0.18),transparent_60%),#16181D] p-8 sm:flex-row sm:items-center sm:p-10">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-[24px] font-bold tracking-[-0.01em]">Try it right here, no install.</span>
          <span className="text-[15px] leading-[1.55] text-muted">
            The live demo runs the real remote in your browser and drives a pretend laptop: move the cursor, skip an
            ad, change the volume.
          </span>
        </div>
        <Link href="/demo/" className="btn-amber h-14 shrink-0 gap-2.5 rounded-[18px] px-6 text-[16px] font-bold no-underline">
          <Play size={18} strokeWidth={2} aria-hidden />
          Open the live demo
        </Link>
      </div>
    </section>
  );
}

const PRIVACY: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: WifiOff, title: "Nothing leaves your network", text: "No cloud, no account, no tracking. The phone talks straight to the laptop." },
  { Icon: KeyRound, title: "Your PIN, never stored", text: "You choose it; the laptop keeps only a scrambled hash of it." },
  { Icon: LockKeyhole, title: "Only you can reset it", text: "Setting or resetting the PIN needs a one-time code shown on the laptop screen." },
  { Icon: ShieldCheck, title: "Guessing is blocked", text: "Five wrong PINs lock that device out for a minute. Other websites can't connect." },
];

export function Privacy() {
  return (
    <Section id="privacy" eyebrow="Privacy and security" title="Private by design.">
      <div className="grid gap-4 sm:grid-cols-2">
        {PRIVACY.map(({ Icon, title, text }) => (
          <div key={title} className="flex gap-4 rounded-[22px] border border-line bg-card p-5">
            <IconTile Icon={Icon} />
            <div className="flex flex-col gap-1">
              <span className="text-[17px] font-semibold">{title}</span>
              <span className="text-[15px] leading-[1.55] text-muted">{text}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function DownloadSection() {
  return (
    <Section id="download" eyebrow="Download" title="Get Phone Remote for Windows.">
      <div className="grid gap-6 rounded-[28px] border border-line bg-card p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <DownloadButton />
          <LatestVersion className="font-mono text-[12px] text-dim" />
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] text-muted">
            <li className="flex items-center gap-2.5">
              <Laptop size={18} strokeWidth={1.8} className="text-dim" aria-hidden /> Windows 10 or 11, 64-bit · about 110 MB
            </li>
            <li className="flex items-center gap-2.5">
              <MonitorSmartphone size={18} strokeWidth={1.8} className="text-dim" aria-hidden /> Any phone with a modern browser
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck size={18} strokeWidth={1.8} className="text-dim" aria-hidden /> Free · source on{" "}
              <a href={REPO_URL} className="text-amber">
                GitHub
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-[14px] leading-[1.6] text-muted">
          <div className="rounded-2xl border border-line bg-well p-4">
            <span className="font-semibold text-text">&ldquo;Windows protected your PC&rdquo;?</span> The app isn&apos;t
            code-signed yet, so Windows asks first. Click <span className="text-text">More info</span> →{" "}
            <span className="text-text">Run anyway</span>.
          </div>
          <div className="rounded-2xl border border-line bg-well p-4">
            <span className="font-semibold text-text">Same Wi-Fi, that&apos;s all.</span> Your phone just needs to be on
            the same Wi-Fi as the laptop, or on the laptop&apos;s hotspot. Public or Private networks both work; nothing
            to set up in Windows.
          </div>
        </div>
      </div>
    </Section>
  );
}
