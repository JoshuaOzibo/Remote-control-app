const QUESTIONS: { question: string; answer: string }[] = [
  {
    question: "My phone can't connect",
    answer:
      "Put the phone and the laptop on the same Wi-Fi (not a guest network or mobile data), set the laptop's Wi-Fi to Private, and check that Phone Remote is running in the tray. Some hotel and office networks block devices from each other: turn on the laptop's Mobile hotspot and join that instead.",
  },
  {
    question: "I forgot my PIN",
    answer:
      "On the laptop, right-click the Phone Remote tray icon and choose Reset PIN. A new QR code appears: scan it and choose a new PIN.",
  },
  {
    question: "The remote on my home screen stopped working",
    answer:
      "The laptop's address on your Wi-Fi probably changed. Open Phone Remote on the laptop and scan the new QR code. To stop it happening, give the laptop a fixed address in your router (often called DHCP reservation).",
  },
  {
    question: "Does it work on iPhone and Android?",
    answer:
      "Yes, in any modern browser. Add it to your home screen to open it like an app. On Android the shortcut opens in a browser tab, because the remote is served over your local network rather than https.",
  },
  {
    question: "How do I update?",
    answer:
      "When a new version is out, the tray menu shows Update available. Download the new installer and run it; your PIN and settings are kept.",
  },
  {
    question: "Mac or Linux?",
    answer: "Not yet. The laptop app is Windows 10 and 11 only. The phone side works on any phone.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto flex w-full max-w-[820px] scroll-mt-20 flex-col gap-8 px-5 py-20 sm:px-8">
      <div className="flex flex-col gap-3">
        <span className="label">FAQ</span>
        <h2 className="m-0 text-[30px] font-bold tracking-[-0.02em] sm:text-[38px]">Questions</h2>
      </div>
      <div className="flex flex-col gap-3">
        {QUESTIONS.map(({ question, answer }) => (
          <details key={question} className="group rounded-[20px] border border-line bg-card px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
              {question}
              <span className="text-[22px] font-normal text-amber transition-transform group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="m-0 mt-3 text-[15px] leading-[1.6] text-muted">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
