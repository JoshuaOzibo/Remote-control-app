import type { ConnectionError } from "@/types";

const CONNECTION_ERROR_TEXT: Record<ConnectionError, string> = {
  "wrong-pin": "Wrong PIN",
  locked: "Too many wrong PINs. Wait a few minutes",
  replaced: "Another device took over",
  unreachable: "Can't reach laptop",
  "not-set-up": "Laptop needs a new PIN. Scan its setup QR",
  "setup-expired": "Setup code expired. Reset the PIN on the laptop",
};

export function connectionErrorText(error: ConnectionError | null) {
  return CONNECTION_ERROR_TEXT[error ?? "unreachable"];
}
