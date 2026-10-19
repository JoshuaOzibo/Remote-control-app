"use client";

import { ChevronLeft, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { isCompletePin, PinInput } from "@/components/ui/PinInput";
import { connect, useRemote } from "@/hooks/useRemote";
import { connectionErrorText } from "@/lib/connectionErrors";
import { isPageLaptop, laptopPageUrl, pageLaptopAddress } from "@/lib/network";
import { useRemoteStore } from "@/store/remoteStore";
import type { RecentLaptop } from "@/types";
import { ForgotPin } from "./ForgotPin";
import { RecentLaptops } from "./RecentLaptops";

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

  if (hydrated && !prefilled) {
    setPrefilled(true);
    setAddress(savedAddress || pageLaptopAddress());
    setPin(savedPin);
  }

  const goHome = () => router.push("/");

  const start = (addr: string, code: string) => {
    if (!addr.trim() || !isCompletePin(code)) return;
    setSubmitted(true);
    connect(addr.trim(), code, goHome);
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
  const message = submitted && status === "error" ? connectionErrorText(error) : null;

  return (
    <>
      <header className="flex h-14 items-center gap-3">
        <Key aria-label="Back to remote" onPress={goHome} className="h-12 w-12 shrink-0 rounded-3xl">
          <ChevronLeft {...icon} />
        </Key>
        <h1 className="m-0 text-[18px] font-bold">Enter PIN</h1>
      </header>

      <div className="flex items-center gap-3.5 rounded-[20px] border border-line bg-card p-[18px]">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#1F2228] text-amber">
          <Laptop size={26} strokeWidth={1.8} aria-hidden />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[15px] font-semibold">Open Phone Remote on your laptop</div>
          <div className="text-[13px] leading-[1.45] text-muted">
            Scan its QR code with your phone&apos;s camera, or enter the PIN you chose for this laptop. Use the same
            Wi-Fi as the laptop, or the laptop&apos;s hotspot.
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="contents">
        <div className="flex flex-col gap-2.5">
          <div className="label" id="pinlabel">
            PIN
          </div>
          <PinInput value={pin} onChange={setPin} labelledBy="pinlabel" />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="label" htmlFor="addr">
            Laptop address
          </label>
          <input
            id="addr"
            className="field"
            type="text"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="192.168.1.23:3001"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Key
            type="submit"
            variant="amber"
            disabled={loading}
            className="h-[60px] w-full rounded-[20px] text-[16px] font-bold"
          >
            {loading ? "Connecting…" : "Connect"}
          </Key>
          {message && (
            <p role="alert" className="m-0 text-center text-[13px] font-semibold text-power">
              {message}
            </p>
          )}
        </div>
      </form>

      <ForgotPin />

      <RecentLaptops onPick={pick} />
    </>
  );
}
