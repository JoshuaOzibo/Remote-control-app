import type { ConnectionError } from "@/types";

const CONNECTION_ERROR_TEXT: Record<ConnectionError, string> = {
  "wrong-pin": "Wrong PIN",
  locked: "Too many wrong PINs. Wait a few minutes",
  replaced: "Another device took over",
  unreachable: "Can't reach your laptop",
  "not-set-up": "Laptop needs a new PIN. Scan its setup QR",
  "setup-expired": "Setup code expired. Reset the PIN on the laptop",
};

const CONNECTION_ERROR_HELP: Record<ConnectionError, string[]> = {
  "wrong-pin": ["Check the 4 digits and try again.", "Forgot it? Open “Forgot PIN?” below."],
  locked: ["Wait a few minutes, then try again with the right PIN."],
  replaced: ["Another phone is using the remote now. Press Connect to take it back."],
  unreachable: [
    "Is Phone Remote open on the laptop?",
    "Are the phone and the laptop on the same Wi-Fi?",
    "Scan the QR code on the laptop again.",
  ],
  "not-set-up": ["Open Phone Remote on the laptop and scan the setup QR code it shows."],
  "setup-expired": ["On the laptop, open Phone Remote, click Reset PIN, then scan the new QR code."],
};

export function connectionErrorText(error: ConnectionError | null) {
  return CONNECTION_ERROR_TEXT[error ?? "unreachable"];
}

export function connectionErrorHelp(error: ConnectionError | null) {
  return CONNECTION_ERROR_HELP[error ?? "unreachable"];
}
