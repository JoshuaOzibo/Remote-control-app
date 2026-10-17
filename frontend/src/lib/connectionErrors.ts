import type { ConnectionError } from "@/types";

const CONNECTION_ERROR_TEXT: Record<ConnectionError, string> = {
  "wrong-pin": "Wrong PIN",
  locked: "Too many wrong PINs. Wait a minute",
  replaced: "Another device took over",
  unreachable: "Can't reach laptop",
};

export function connectionErrorText(error: ConnectionError | null) {
  return CONNECTION_ERROR_TEXT[error ?? "unreachable"];
}
