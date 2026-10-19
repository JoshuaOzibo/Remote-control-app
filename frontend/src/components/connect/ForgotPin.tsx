const STEPS = [
  "On your laptop, open Phone Remote from the taskbar tray.",
  "Click Reset PIN. The laptop shows a new QR code.",
  "Scan it with this phone's camera and choose a new PIN.",
];

export function ForgotPin() {
  return (
    <details className="rounded-[20px] border border-line bg-card px-[18px] py-3.5">
      <summary className="cursor-pointer list-none text-[14px] font-semibold text-amber [&::-webkit-details-marker]:hidden">
        Forgot PIN?
      </summary>
      <ol className="m-0 mt-3 flex list-decimal flex-col gap-2 pl-5 text-[13px] leading-[1.45] text-muted">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="m-0 mt-3 text-[12px] leading-[1.45] text-dim">
        Running the server from a terminal? Run <span className="font-mono text-text">npm run reset-pin</span>, restart
        it, and open the new setup link it prints.
      </p>
    </details>
  );
}
