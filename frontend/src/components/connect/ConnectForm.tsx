"use client";

import { ChevronLeft, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { isCompletePin, PinInput } from "@/components/ui/PinInput";
import { connect, useRemote } from "@/hooks/useRemote";
import { connectionErrorText } from "@/lib/connectionErrors";
import { useRemoteStore } from "@/store/remoteStore";
import { RecentLaptops } from "./RecentLaptops";

/** The page the laptop serves is on the same host; in dev the page runs on :3000 and the server on :3001. */
function defaultAddress() {
  if (process.env.NODE_ENV === "development") return `${window.location.hostname}:3001`;
  return window.location.host;
}

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

  // Prefill once saved values are loaded (client only, so window is available).
  if (hydrated && !prefilled) {
    setPrefilled(true);
    setAddress(savedAddress || defaultAddress());
    setPin(savedPin);
  }

  const goHome = () => router.push("/");

  const start = (addr: string, code: string) => {
    if (!addr.trim() || !isCompletePin(code)) return;
    setSubmitted(true);
    connect(addr.trim(), code, goHome);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    start(address, pin);
  };

  const loading = submitted && status === "connecting";
  const message = submitted && status === "error" ? connectionErrorText(error) : null;

  return (
    <>
      <header className="flex h-14 items-center gap-3">
        <Key aria-label="Back to remote" onPress={goHome} className="h-12 w-12 shrink-0 rounded-3xl">
          <ChevronLeft {...icon} />
        </Key>
        <h1 className="m-0 text-[18px] font-bold">Connect to laptop</h1>
      </header>

      <div className="flex items-center gap-3.5 rounded-[20px] border border-line bg-card p-[18px]">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#1F2228] text-amber">
          <Laptop size={26} strokeWidth={1.8} aria-hidden />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[15px] font-semibold">Start the server on your laptop</div>
          <div className="text-[13px] leading-[1.45] text-muted">
            Run <span className="font-mono font-medium text-text">npm start</span>, then enter the address and PIN
            it shows. Both devices must be on the same Wi-Fi.
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="contents">
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

        <div className="flex flex-col gap-2.5">
          <div className="label" id="pinlabel">
            PIN
          </div>
          <PinInput value={pin} onChange={setPin} labelledBy="pinlabel" />
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

      <RecentLaptops
        onPick={(laptop) => {
          setAddress(laptop.address);
          start(laptop.address, isCompletePin(pin) ? pin : savedPin);
        }}
      />
    </>
  );
}
