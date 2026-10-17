/** Short haptic tick. No-op where vibration isn't supported (e.g. iOS Safari). */
export function vibrate(ms = 10) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // Some browsers throw when vibrate is called without a user gesture.
  }
}
