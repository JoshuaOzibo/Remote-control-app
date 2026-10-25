"use client";

import { ChevronLeft, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { isCompletePin, PinInput } from "@/components/ui/PinInput";
import { connect, useRemote } from "@/hooks/useRemote";
import { connectionErrorHelp, connectionErrorText } from "@/lib/connectionErrors";
import { isPageLaptop, laptopPageUrl, pageLaptopAddress } from "@/lib/network";
import { parseLaptopLink } from "@/lib/qrLink";
import { IS_SITE } from "@/lib/site";
import { useRemoteStore } from "@/store/remoteStore";
import type { RecentLaptop } from "@/types";
import { ForgotPin } from "./ForgotPin";
import { QrScanButton } from "./QrScanner";
import { RecentLaptops } from "./RecentLaptops";

const NOT_A_PHONE_REMOTE_CODE =
  "That QR code isn't from Phone Remote. Scan the code in the Phone Remote window on your laptop.";

export function ConnectForm() {
  const router = useRouter();
  const { status, error } = useRemote();
  const savedAddress = useRemoteStore((s) => s.address);
  const savedPin = useRemoteStore((s) => s.pin);
  const hydrated = useRemoteStore((s) => s.hydrated);

  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [scanNote, setScanNote] = useState<{ text: string; ok: boolean } | null>(null);

  if (hydrated && !prefilled) {
    setPrefilled(true);
    setAddress(savedAddress || (IS_SITE ? "" : pageLaptopAddress()));
    setPin(savedPin);
  }

  const goHome = () => router.push("/");

  const start = (addr: string, code: string) => {
    if (!addr.trim() || !isCompletePin(code)) return;
    if (IS_SITE) {
      window.location.href = laptopPageUrl(addr, code);
      return;
    }
    setSubmitted(true);
    connect(addr.trim(), code, goHome);
  };

  const onScan = (text: string) => {
    const link = parseLaptopLink(text);
    if (!link) {
      setScanNote({ text: NOT_A_PHONE_REMOTE_CODE, ok: false });
      return;
    }
    if (IS_SITE || !isPageLaptop(link.address)) {
      setScanNote({ text: `Opening ${link.address}…`, ok: true });
      window.location.href = link.url;
      return;
    }
    if (link.setupCode) {
      useRemoteStore.getState().setSetupCode(link.setupCode);
      router.push("/setup/");
      return;
    }
    setAddress(link.address);
    setScanNote({ text: "Laptop found. Enter your PIN.", ok: true });
  };

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    start(address, pin);
  };

  const pick = (laptop: RecentLaptop) => {
    if (!isPageLaptop(laptop.address)) {
      window.location.href = laptopPageUrl(laptop.address, laptop.pin);
      return;
    }
    setAddress(laptop.address);
    if (isCompletePin(laptop.pin)) setPin(laptop.pin);
    start(laptop.address, isCompletePin(laptop.pin) ? laptop.pin : pin);
  };

  const loading = submitted && status === "connecting";
  const failed = submitted && status === "error";

  return (
    <>
      <header className="flex h-14 items-center gap-3">
        <Key aria-label="Back to remote" onPress={goHome} className="h-12 w-12 shrink-0 rounded-3xl">
          <ChevronLeft {...icon} />
        </Key>
        <h1 className="m-0 text-[18px] font-bold">Connect to your laptop</h1>
      </header>

      <RecentLaptops onPick={pick} />

      <div className="flex items-center gap-3.5 rounded-[20px] border border-line bg-card p-[18px]">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#1F2228] text-amber">
          <Laptop size={26} strokeWidth={1.8} aria-hidden />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[15px] font-semibold">Open Phone Remote on your laptop</div>
          <div className="text-[13px] leading-[1.45] text-muted">
            Then scan the QR code it shows, or type your 4-digit PIN. Keep this phone on the same Wi-Fi as the
            laptop.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <QrScanButton onResult={onScan} onError={(text) => setScanNote({ text, ok: false })} />
        {scanNote && (
          <p
            role={scanNote.ok ? "status" : "alert"}
            data-testid="scan-note"
            className={`m-0 text-center text-[13px] font-semibold ${scanNote.ok ? "text-ok" : "text-power"}`}
          >
            {scanNote.text}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 text-[12px] text-dim" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        or enter your PIN
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={onSubmit} className="contents">
        <div className="flex flex-col gap-2.5">
          <div className="label" id="pinlabel">
            PIN
          </div>
          <PinInput value={pin} onChange={setPin} labelledBy="pinlabel" />
        </div>

        <details open={IS_SITE} className="rounded-[20px] border border-line bg-card px-[18px] py-3.5">
          <summary
            className="cursor-pointer list-none text-[14px] font-semibold text-muted [&::-webkit-details-marker]:hidden"
          >
            Enter the laptop address yourself
          </summary>
          <label className="label mt-3 block" htmlFor="addr">
            Laptop address
          </label>
          <input
            id="addr"
            type="text"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="192.168.1.23:3001"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="field mt-2.5"
          />
          <p className="m-0 mt-2.5 text-[12px] leading-[1.45] text-dim">
            It is the link shown under the QR code on the laptop, for example 192.168.1.23.
          </p>
        </details>

        <div className="flex flex-col gap-3">
          <Key
            type="submit"
            variant="amber"
            disabled={loading}
            className="h-[60px] w-full rounded-[20px] text-[16px] font-bold"
          >
            {loading ? "Connecting…" : "Connect"}
          </Key>
          {failed && (
            <div role="alert" className="flex flex-col gap-2 rounded-[20px] border border-[#5A2A2A] bg-[#1E1515] p-4">
              <p className="m-0 text-[14px] font-semibold text-power">{connectionErrorText(error)}</p>
              <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-[13px] leading-[1.45] text-muted">
                {connectionErrorHelp(error).map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>

      <ForgotPin />
    </>
  );
}
