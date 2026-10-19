export const STORAGE_KEYS = {
  address: "remote.address",
  pin: "remote.pin",
  recent: "remote.recent",
  mode: "remote.mode",
  autoConnect: "remote.autoConnect",
} as const;

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}
