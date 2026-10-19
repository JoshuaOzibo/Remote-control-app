"use client";

import { ChevronLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { KeyLink } from "@/components/ui/KeyLink";
import { isCompletePin, PinInput } from "@/components/ui/PinInput";
import { setUp, useRemote } from "@/hooks/useRemote";
import { connectionErrorText } from "@/lib/connectionErrors";
import { formatSetupCode } from "@/lib/launchParams";
import { pageLaptopAddress } from "@/lib/network";
import { useRemoteStore } from "@/store/remoteStore";

export function SetPinForm() {
  const router = useRouter();
  const { status, error } = useRemote();
  const setupCode = useRemoteStore((s) => s.setupCode);
  const hydrated = useRemoteStore((s) => s.hydrated);

  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!setupCode || !isCompletePin(pin) || !isCompletePin(confirm)) return;
    if (pin !== confirm) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    setSubmitted(true);
    setUp(pageLaptopAddress(), setupCode, pin, () => router.replace("/"));
  };

  const loading = submitted && status === "connecting";
  const message = mismatch
    ? "The two PINs don't match"
    : submitted && status === "error"
      ? connectionErrorText(error)
      : null;

  return (
    <>
      <header className="flex h-14 items-center gap-3">
        <KeyLink href="/" aria-label="Back to remote" className="h-12 w-12 shrink-0 rounded-3xl">
          <ChevronLeft {...icon} />
        </KeyLink>
        <h1 className="m-0 text-[18px] font-bold">Set your PIN</h1>
      </header>

      {hydrated && !setupCode ? (
        <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-card p-[18px]">
          <div className="text-[15px] font-semibold">Scan the setup QR code on the laptop</div>
          <div className="text-[13px] leading-[1.45] text-muted">
            Setting a PIN needs the one-time code the laptop shows. Open Phone Remote on the laptop and scan its QR
            code with this phone&apos;s camera.
          </div>
          <Link href="/connect/" className="text-[14px] font-semibold text-amber">
            I already have a PIN
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="contents">
          <div className="flex items-center gap-3.5 rounded-[20px] border border-line bg-card p-[18px]">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#1F2228] text-amber">
              <KeyRound size={26} strokeWidth={1.8} aria-hidden />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[15px] font-semibold">Choose a 4-digit PIN</div>
              <div className="text-[13px] leading-[1.45] text-muted">
                You&apos;ll use it to connect to this laptop. Setup code{" "}
                <span className="font-mono font-medium text-text">{setupCode ? formatSetupCode(setupCode) : "…"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="label" id="newpinlabel">
              New PIN
            </div>
            <PinInput value={pin} onChange={setPin} labelledBy="newpinlabel" />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="label" id="confirmpinlabel">
              Confirm PIN
            </div>
            <PinInput value={confirm} onChange={setConfirm} labelledBy="confirmpinlabel" />
          </div>

          <div className="flex flex-col gap-3">
            <Key
              type="submit"
              variant="amber"
              disabled={loading || !setupCode}
              className="h-[60px] w-full rounded-[20px] text-[16px] font-bold"
            >
              {loading ? "Saving…" : "Save and connect"}
            </Key>
            {message && (
              <p role="alert" className="m-0 text-center text-[13px] font-semibold text-power">
                {message}
              </p>
            )}
          </div>
        </form>
      )}
    </>
  );
}
