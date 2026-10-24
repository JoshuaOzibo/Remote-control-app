import { SETUP_CODE_FORMAT } from "@/lib/launchParams";

export type LaptopLink = { url: string; address: string; setupCode: string | null };

export function parseLaptopLink(text: string): LaptopLink | null {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" || !url.host || url.pathname !== "/") return null;
  const setupCode = url.searchParams.get("setup");
  if (setupCode !== null && !SETUP_CODE_FORMAT.test(setupCode)) return null;
  return { url: url.href, address: url.host, setupCode };
}
