"use client";

import {
  BatteryFull,
  Grid2x2,
  Play,
  Search,
  Smartphone,
  StickyNote,
  Volume1,
  Volume2,
  VolumeX,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { DEMO_VIDEOS, useDemoStore } from "@/store/demoStore";
import { cn } from "@/lib/utils";

const TOAST_MS = 1800;
const LOCK_MS = 2600;
const SCROLL_GAIN = 1.2;
const PAGE_FRACTION = 0.9;
const TARGET = "data-demo-target";
const CONTEXT_MENU = ["Back", "Reload", "Save as…", "Print…", "Inspect"];

function subscribeClock(onChange: () => void) {
  const timer = setInterval(onChange, 15000);
  return () => clearInterval(timer);
}

const clockNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function useClock() {
  return useSyncExternalStore(subscribeClock, clockNow, () => "");
}

function activateTarget(target: string | null | undefined) {
  if (!target) return;
  const store = useDemoStore.getState();
  if (target === "skip-ad") {
    if (store.adSecondsLeft > 0) store.showToast(`Skip in ${store.adSecondsLeft}`, "Almost…");
    else store.skipAd();
  } else if (target === "player") {
    store.togglePlay();
  } else if (target.startsWith("video-")) {
    store.playVideo(Number(target.slice("video-".length)));
  }
}

function Window({
  title,
  icon,
  className,
  children,
}: {
  title: string;
  icon: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-[0.9cqw] border border-white/10 bg-[#16181D]/95 shadow-[0_1cqw_3cqw_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <div className="flex h-[3cqw] shrink-0 items-center gap-[0.7cqw] border-b border-white/5 px-[1cqw] text-[1.15cqw] text-[#A3A9B4]">
        {icon}
        <span className="truncate">{title}</span>
        <span className="ml-auto flex gap-[0.6cqw]" aria-hidden>
          <span className="h-[0.9cqw] w-[0.9cqw] rounded-full bg-white/15" />
          <span className="h-[0.9cqw] w-[0.9cqw] rounded-full bg-white/15" />
          <span className="h-[0.9cqw] w-[0.9cqw] rounded-full bg-[#F0524F]/70" />
        </span>
      </div>
      {children}
    </div>
  );
}

function VideoPlayer() {
  const adSkipped = useDemoStore((s) => s.adSkipped);
  const adSecondsLeft = useDemoStore((s) => s.adSecondsLeft);
  const playing = useDemoStore((s) => s.playing);
  const nowPlaying = useDemoStore((s) => s.nowPlaying);
  const fullscreen = useDemoStore((s) => s.fullscreen);
  const video = DEMO_VIDEOS[nowPlaying];

  const surface = (
    <div
      className="relative flex-1 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${video.from}, ${video.to})` }}
      {...{ [TARGET]: "player" }}
    >
      <div className={cn("demo-orb left-[12%] top-[18%] h-[60%] w-[40%]", playing && "demo-orb-moving")} />
      <div
        className={cn("demo-orb left-[52%] top-[40%] h-[50%] w-[34%] [animation-delay:-6s]", playing && "demo-orb-moving")}
      />
      <div className="absolute bottom-[2.6cqw] left-[1.6cqw] right-[1.6cqw] flex flex-col gap-[0.4cqw] text-white">
        <span className="text-[2.1cqw] font-bold drop-shadow">{video.title}</span>
        <span className="text-[1.1cqw] text-white/75">{video.meta}</span>
      </div>
      <div className="absolute bottom-[1cqw] left-[1.6cqw] right-[1.6cqw] h-[0.45cqw] overflow-hidden rounded-full bg-white/25">
        <div
          key={nowPlaying}
          className="demo-progress h-full rounded-full bg-[#FF9F43]"
          style={{ animationPlayState: playing ? "running" : "paused" }}
        />
      </div>
      {adSkipped && !playing && (
        <div className="absolute inset-0 grid place-items-center bg-black/30">
          <span className="grid h-[7cqw] w-[7cqw] place-items-center rounded-full bg-black/55 text-white">
            <Play className="h-[3.2cqw] w-[3.2cqw]" fill="currentColor" />
          </span>
        </div>
      )}
      {!adSkipped && (
        <div className="demo-ad absolute inset-0 flex flex-col justify-between p-[1.4cqw] text-white">
          <span className="w-fit rounded-[0.5cqw] bg-[#F2C94C] px-[0.8cqw] py-[0.3cqw] text-[1.1cqw] font-bold text-[#1A1206]">
            Ad · 0:0{adSecondsLeft}
          </span>
          <div className="text-center text-[1.9cqw] font-semibold drop-shadow">Your video plays after this ad</div>
          <button
            type="button"
            tabIndex={-1}
            {...{ [TARGET]: "skip-ad" }}
            className={cn(
              "ml-auto flex items-center gap-[0.6cqw] rounded-[0.6cqw] border border-white/40 bg-black/65 px-[1.4cqw] py-[0.8cqw] text-[1.35cqw] font-semibold",
              adSecondsLeft === 0 && "border-white bg-black/80",
            )}
          >
            {adSecondsLeft > 0 ? `Skip in ${adSecondsLeft}` : "Skip ad ▸"}
          </button>
        </div>
      )}
    </div>
  );

  if (fullscreen) return <div className="absolute inset-0 z-20 flex flex-col">{surface}</div>;

  return (
    <Window
      title="Video player"
      icon={<Play className="h-[1.3cqw] w-[1.3cqw]" />}
      className="left-[2.5cqw] top-[2.5cqw] h-[38.5cqw] w-[63cqw]"
    >
      {surface}
    </Window>
  );
}

function UpNext() {
  const focusIndex = useDemoStore((s) => s.focusIndex);
  const nowPlaying = useDemoStore((s) => s.nowPlaying);
  const scroll = useDemoStore((s) => s.scroll);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = list.current;
    const tile = el?.children[focusIndex] as HTMLElement | undefined;
    if (!el || !tile) return;
    if (tile.offsetTop < el.scrollTop) el.scrollTo({ top: tile.offsetTop, behavior: "smooth" });
    else if (tile.offsetTop + tile.offsetHeight > el.scrollTop + el.clientHeight) {
      el.scrollTo({ top: tile.offsetTop + tile.offsetHeight - el.clientHeight, behavior: "smooth" });
    }
  }, [focusIndex]);

  useEffect(() => {
    const el = list.current;
    if (!el || !scroll) return;
    const amount = scroll.page ? scroll.dy * el.clientHeight * PAGE_FRACTION : scroll.dy * SCROLL_GAIN;
    el.scrollBy({ top: -amount, behavior: scroll.page ? "smooth" : "auto" });
  }, [scroll]);

  return (
    <Window
      title="Up next"
      icon={<Grid2x2 className="h-[1.3cqw] w-[1.3cqw]" />}
      className="left-[67.5cqw] top-[2.5cqw] h-[38.5cqw] w-[30cqw]"
    >
      <div ref={list} className="demo-scroll flex flex-1 flex-col gap-[0.9cqw] overflow-y-auto p-[1cqw]">
        {DEMO_VIDEOS.map((video, index) => (
          <div
            key={video.title}
            {...{ [TARGET]: `video-${index}` }}
            className={cn(
              "flex shrink-0 items-center gap-[0.9cqw] rounded-[0.7cqw] p-[0.6cqw] outline outline-[0.25cqw] outline-transparent",
              index === focusIndex && "bg-white/5 outline-[#FF9F43]",
            )}
          >
            <span
              className="h-[5cqw] w-[8.6cqw] shrink-0 rounded-[0.5cqw]"
              style={{ background: `linear-gradient(135deg, ${video.from}, ${video.to})` }}
            />
            <span className="flex min-w-0 flex-col gap-[0.3cqw]">
              <span className="truncate text-[1.2cqw] font-semibold text-[#ECEDEF]">{video.title}</span>
              <span className="truncate text-[0.95cqw] text-[#8C93A0]">
                {index === nowPlaying ? "▶ Playing" : video.meta}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Window>
  );
}

function Notes() {
  const notes = useDemoStore((s) => s.notes);
  return (
    <Window
      title="Notes"
      icon={<StickyNote className="h-[1.3cqw] w-[1.3cqw]" />}
      className="left-[2.5cqw] top-[43cqw] h-[12.5cqw] w-[63cqw]"
    >
      <div className="flex-1 overflow-hidden whitespace-pre-wrap break-words p-[1.2cqw] font-mono text-[1.25cqw] leading-[1.5] text-[#ECEDEF]">
        {notes ? (
          <>
            {notes.split("\n").slice(-3).join("\n")}
            <span className="demo-caret" />
          </>
        ) : (
          <span className="text-[#8C93A0]">Type on your phone: Keypad → keyboard key, or the number keys</span>
        )}
      </div>
    </Window>
  );
}

function PhoneWidget() {
  const volume = useDemoStore((s) => s.volume);
  const muted = useDemoStore((s) => s.muted);
  return (
    <div className="absolute left-[67.5cqw] top-[43cqw] flex h-[12.5cqw] w-[30cqw] flex-col justify-between rounded-[0.9cqw] border border-white/10 bg-[#16181D]/95 p-[1.2cqw]">
      <div className="flex items-center gap-[0.8cqw] text-[1.2cqw] font-semibold text-[#ECEDEF]">
        <Smartphone className="h-[1.6cqw] w-[1.6cqw] text-[#FF9F43]" />
        Phone Remote
        <span className="ml-auto flex items-center gap-[0.5cqw] text-[1cqw] font-normal text-[#4ADE80]">
          <span className="h-[0.8cqw] w-[0.8cqw] rounded-full bg-[#4ADE80]" />
          connected
        </span>
      </div>
      <div className="flex items-center gap-[0.8cqw] text-[#A3A9B4]">
        {muted ? <VolumeX className="h-[1.6cqw] w-[1.6cqw]" /> : <Volume2 className="h-[1.6cqw] w-[1.6cqw]" />}
        <span className="h-[0.6cqw] flex-1 overflow-hidden rounded-full bg-white/10">
          <span
            className="block h-full rounded-full bg-[#FF9F43] transition-[width] duration-150"
            style={{ width: `${muted ? 0 : volume}%` }}
          />
        </span>
        <span className="w-[3cqw] text-right font-mono text-[1.1cqw]">{muted ? 0 : volume}</span>
      </div>
    </div>
  );
}

function Taskbar() {
  const clock = useClock();
  const muted = useDemoStore((s) => s.muted);
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex h-[4.5cqw] items-center gap-[1.2cqw] border-t border-white/5 bg-[#0D0E11]/90 px-[1.6cqw] text-[#A3A9B4]">
      <Grid2x2 className="h-[1.8cqw] w-[1.8cqw] text-[#ECEDEF]" />
      <span className="flex h-[2.8cqw] w-[18cqw] items-center gap-[0.6cqw] rounded-full bg-white/5 px-[1cqw] text-[1.05cqw]">
        <Search className="h-[1.2cqw] w-[1.2cqw]" />
        Search
      </span>
      <span className="ml-auto flex items-center gap-[1cqw]">
        <Wifi className="h-[1.5cqw] w-[1.5cqw]" />
        {muted ? <VolumeX className="h-[1.5cqw] w-[1.5cqw]" /> : <Volume1 className="h-[1.5cqw] w-[1.5cqw]" />}
        <BatteryFull className="h-[1.5cqw] w-[1.5cqw]" />
        <span className="min-w-[4.5cqw] text-right font-mono text-[1.15cqw] text-[#ECEDEF]">{clock}</span>
      </span>
    </div>
  );
}

function Toast() {
  const toast = useDemoStore((s) => s.toast);
  const clearToast = useDemoStore((s) => s.clearToast);
  const volume = useDemoStore((s) => s.volume);
  const muted = useDemoStore((s) => s.muted);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => clearToast(toast.id), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      role="status"
      className="demo-toast absolute bottom-[6.2cqw] right-[2cqw] z-30 flex w-[26cqw] flex-col gap-[0.6cqw] rounded-[1cqw] border border-white/10 bg-[#1C1F25]/95 p-[1.2cqw] shadow-[0_1cqw_3cqw_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between gap-[1cqw]">
        <span className="truncate text-[1.35cqw] font-semibold text-[#ECEDEF]">{toast.title}</span>
        {toast.detail && toast.kind !== "volume" && (
          <span className="shrink-0 rounded-[0.4cqw] border border-white/15 px-[0.6cqw] py-[0.2cqw] font-mono text-[1cqw] text-[#A3A9B4]">
            {toast.detail}
          </span>
        )}
      </div>
      {toast.kind === "volume" && (
        <div className="flex items-center gap-[0.8cqw] text-[#ECEDEF]">
          {muted ? <VolumeX className="h-[1.6cqw] w-[1.6cqw]" /> : <Volume2 className="h-[1.6cqw] w-[1.6cqw]" />}
          <span className="h-[0.6cqw] flex-1 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full rounded-full bg-[#FF9F43]" style={{ width: `${muted ? 0 : volume}%` }} />
          </span>
          <span className="w-[3cqw] text-right font-mono text-[1.15cqw]">{muted ? 0 : volume}</span>
        </div>
      )}
    </div>
  );
}

function LockScreen() {
  const locked = useDemoStore((s) => s.locked);
  const setLocked = useDemoStore((s) => s.setLocked);
  const clock = useClock();

  useEffect(() => {
    if (!locked) return;
    const timer = setTimeout(() => setLocked(false), LOCK_MS);
    return () => clearTimeout(timer);
  }, [locked, setLocked]);

  if (!locked) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-[1cqw] bg-[#0D0E11]/85 text-[#ECEDEF] backdrop-blur-md">
      <span className="font-mono text-[7cqw] font-medium">{clock}</span>
      <span className="text-[1.5cqw] text-[#A3A9B4]">Locked · press any key on the phone</span>
    </div>
  );
}

export function FakeLaptop() {
  const screen = useRef<HTMLDivElement>(null);
  const cursor = useDemoStore((s) => s.cursor);
  const click = useDemoStore((s) => s.click);
  const adSkipped = useDemoStore((s) => s.adSkipped);
  const adSecondsLeft = useDemoStore((s) => s.adSecondsLeft);
  const tickAd = useDemoStore((s) => s.tickAd);

  useEffect(() => {
    if (adSkipped || adSecondsLeft === 0) return;
    const timer = setTimeout(tickAd, 1000);
    return () => clearTimeout(timer);
  }, [adSkipped, adSecondsLeft, tickAd]);

  useEffect(() => {
    if (!click || click.button === "right" || !screen.current) return;
    const rect = screen.current.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + (rect.width * click.x) / 100, rect.top + (rect.height * click.y) / 100);
    activateTarget(hit?.closest(`[${TARGET}]`)?.getAttribute(TARGET));
  }, [click]);

  return (
    <div>
      <div className="demo-bezel">
      <div
        ref={screen}
        className="demo-screen relative aspect-[16/10] w-full overflow-hidden rounded-[10px] [container-type:inline-size]"
        aria-label="Demo laptop screen"
        role="group"
      >
        <VideoPlayer />
        <UpNext />
        <Notes />
        <PhoneWidget />
        <Taskbar />
        <Toast />
        <LockScreen />

        {click && (
          <span
            key={click.id}
            className="demo-ripple pointer-events-none absolute z-50"
            style={{ left: `${click.x}%`, top: `${click.y}%` }}
          />
        )}
        {click?.button === "right" && (
          <div
            key={`menu-${click.id}`}
            className="demo-menu pointer-events-none absolute z-50 flex w-[16cqw] flex-col rounded-[0.8cqw] border border-white/10 bg-[#1C1F25] py-[0.6cqw] text-[1.15cqw] text-[#ECEDEF] shadow-[0_1cqw_3cqw_rgba(0,0,0,0.5)]"
            style={{ left: `${Math.min(click.x, 82)}%`, top: `${Math.min(click.y, 70)}%` }}
          >
            {CONTEXT_MENU.map((item) => (
              <span key={item} className="px-[1.2cqw] py-[0.45cqw]">
                {item}
              </span>
            ))}
          </div>
        )}
        <svg
          className="demo-cursor pointer-events-none absolute z-50 h-[2.6cqw] w-[2.6cqw]"
          style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M3 2l17 9.5-7.4 1.6-3.7 6.9z" fill="#fff" stroke="#0D0E11" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
      </div>
      <div className="demo-base" aria-hidden />
    </div>
  );
}

