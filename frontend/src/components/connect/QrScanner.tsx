"use client";

import { Camera, ScanLine, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type ReactNode } from "react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { decodePhoto, decodeVideoFrame } from "@/lib/qrDecode";

const SCAN_EVERY_MS = 150;
const NO_CODE_IN_PHOTO = "No QR code found in that photo. Try again, a little closer and straight on.";
const BUTTON_CLASS = "h-[60px] w-full flex-row gap-3 rounded-[20px] text-[15px] font-semibold";

type ScanProps = { onResult: (text: string) => void; onError: (message: string) => void };

const subscribeNever = () => () => {};
const liveCameraAvailable = () => window.isSecureContext && Boolean(navigator.mediaDevices?.getUserMedia);

function useLiveCamera() {
  return useSyncExternalStore(subscribeNever, liveCameraAvailable, () => false);
}

function PhotoPicker({
  className,
  children,
  onPhoto,
  testId,
}: {
  className: string;
  children: ReactNode;
  onPhoto: (file: File) => void;
  testId: string;
}) {
  const choose = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onPhoto(file);
  };

  return (
    <label className={className}>
      {children}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        data-testid={testId}
        onChange={choose}
      />
    </label>
  );
}

function CameraSheet({ onClose, onResult, onPhoto }: { onClose: () => void; onResult: (text: string) => void; onPhoto: (file: File) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const resultHandler = useRef(onResult);
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    resultHandler.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    let stream: MediaStream | null = null;
    let frame = 0;
    let lastScan = 0;
    let cancelled = false;

    const scan = (time: number) => {
      if (cancelled) return;
      if (time - lastScan >= SCAN_EVERY_MS && video.current) {
        lastScan = time;
        const text = decodeVideoFrame(video.current, canvas);
        if (text) {
          resultHandler.current(text);
          return;
        }
      }
      frame = requestAnimationFrame(scan);
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then(async (media) => {
        if (cancelled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = media;
        const element = video.current;
        if (!element) return;
        element.srcObject = media;
        await element.play();
        frame = requestAnimationFrame(scan);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const blocked = error instanceof DOMException && error.name === "NotAllowedError";
        setProblem(
          blocked
            ? "Camera access is blocked. Allow the camera for this site, or take a photo instead."
            : "The camera couldn't start. Take a photo instead.",
        );
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div role="dialog" aria-modal="true" aria-label="Scan the QR code" className="fixed inset-0 z-50 flex flex-col bg-black">
      <video ref={video} playsInline muted className="absolute inset-0 h-full w-full object-cover" />

      <div className="relative flex items-center justify-between px-5" style={{ paddingTop: "max(20px, env(safe-area-inset-top))" }}>
        <span className="text-[16px] font-semibold text-white drop-shadow">Scan the QR code</span>
        <button
          type="button"
          aria-label="Close the scanner"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white"
        >
          <X {...icon} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <div className="relative aspect-square w-[min(72vw,300px)] rounded-[28px] shadow-[0_0_0_100vmax_rgba(0,0,0,0.45)]">
          <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-[28px] border-l-4 border-t-4 border-amber" />
          <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-[28px] border-r-4 border-t-4 border-amber" />
          <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-[28px] border-b-4 border-l-4 border-amber" />
          <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-[28px] border-b-4 border-r-4 border-amber" />
        </div>
        {problem && (
          <p role="alert" className="absolute inset-x-6 m-0 rounded-2xl bg-black/80 p-4 text-center text-[14px] text-white">
            {problem}
          </p>
        )}
      </div>

      <div
        className="relative flex flex-col items-center gap-3 px-6 text-center"
        style={{ paddingBottom: "max(28px, env(safe-area-inset-bottom))" }}
      >
        <span className="text-[14px] text-white/85 drop-shadow">Point at the QR code in the Phone Remote window on your laptop.</span>
        <PhotoPicker
          testId="qr-photo-sheet"
          onPhoto={onPhoto}
          className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-black/55 px-4 text-[14px] font-semibold text-white"
        >
          <Camera size={18} strokeWidth={1.8} aria-hidden />
          Take a photo instead
        </PhotoPicker>
      </div>
    </div>
  );
}

export function QrScanButton({ onResult, onError }: ScanProps) {
  const live = useLiveCamera();
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState(false);

  const readPhoto = async (file: File) => {
    setOpen(false);
    setReading(true);
    try {
      const text = await decodePhoto(file);
      if (text) onResult(text);
      else onError(NO_CODE_IN_PHOTO);
    } catch {
      onError("That photo couldn't be read. Try again.");
    } finally {
      setReading(false);
    }
  };

  const label = (
    <>
      <ScanLine {...icon} className="text-amber" />
      {reading ? "Reading the photo…" : "Scan the QR code on your laptop"}
    </>
  );

  return (
    <>
      {live ? (
        <Key onPress={() => setOpen(true)} className={BUTTON_CLASS} data-testid="qr-scan">
          {label}
        </Key>
      ) : (
        <PhotoPicker testId="qr-photo" onPhoto={readPhoto} className={`key cursor-pointer ${BUTTON_CLASS}`}>
          {label}
        </PhotoPicker>
      )}
      {open && (
        <CameraSheet
          onClose={() => setOpen(false)}
          onResult={(text) => {
            setOpen(false);
            onResult(text);
          }}
          onPhoto={readPhoto}
        />
      )}
    </>
  );
}
