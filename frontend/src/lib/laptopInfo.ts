import { normalizeAddress } from "@/lib/network";

type LaptopInfo = { name: string; version: string };

function isLaptopInfo(value: unknown): value is LaptopInfo {
  return typeof value === "object" && value !== null && typeof (value as LaptopInfo).name === "string";
}

export async function fetchLaptopName(address: string) {
  if (normalizeAddress(address) !== window.location.host) return null;
  try {
    const response = await fetch("/api/info", { cache: "no-store" });
    if (!response.ok) return null;
    const info: unknown = await response.json();
    return isLaptopInfo(info) && info.name.trim() ? info.name.trim() : null;
  } catch {
    return null;
  }
}
