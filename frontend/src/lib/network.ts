const WINDOWS_HOTSPOT = /^192\.168\.137\./;

export function isHotspotAddress(address: string) {
  return WINDOWS_HOTSPOT.test(address.trim().replace(/^(https?|wss?):\/\//, ""));
}

export function laptopNameFor(address: string) {
  return isHotspotAddress(address) ? "Laptop hotspot" : "My laptop";
}
