const WINDOWS_HOTSPOT = /^192\.168\.137\./;
const DEV_SERVER_PORT = 3001;

export function normalizeAddress(address: string) {
  return address
    .trim()
    .replace(/^(https?|wss?):\/\//, "")
    .replace(/\/ws\/?$/, "")
    .replace(/\/+$/, "");
}

export function isHotspotAddress(address: string) {
  return WINDOWS_HOTSPOT.test(normalizeAddress(address));
}

export function laptopNameFor(address: string) {
  return isHotspotAddress(address) ? "Laptop hotspot" : "My laptop";
}

export function pageLaptopAddress() {
  if (process.env.NODE_ENV === "development") return `${window.location.hostname}:${DEV_SERVER_PORT}`;
  return window.location.host;
}

export function isPageLaptop(address: string) {
  return normalizeAddress(address) === pageLaptopAddress();
}

export function laptopPageUrl(address: string, pin: string) {
  const base = `http://${normalizeAddress(address)}/`;
  return /^\d{4}$/.test(pin) ? `${base}?pin=${pin}` : `${base}connect/`;
}
