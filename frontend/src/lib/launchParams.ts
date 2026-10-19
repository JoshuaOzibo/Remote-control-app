const SETUP_CODE_FORMAT = /^[A-Za-z0-9-]{8,9}$/;
const PIN_FORMAT = /^\d{4}$/;
const LAUNCH_KEYS = ["setup", "pin"];

export type LaunchParams = {
  setupCode: string | null;
  pin: string | null;
};

let taken: LaunchParams | null = null;

function pick(params: URLSearchParams, key: string, format: RegExp) {
  const value = params.get(key);
  return value && format.test(value) ? value : null;
}

export function takeLaunchParams(): LaunchParams {
  if (taken) return taken;
  const url = new URL(window.location.href);
  taken = {
    setupCode: pick(url.searchParams, "setup", SETUP_CODE_FORMAT),
    pin: pick(url.searchParams, "pin", PIN_FORMAT),
  };
  if (LAUNCH_KEYS.some((key) => url.searchParams.has(key))) {
    for (const key of LAUNCH_KEYS) url.searchParams.delete(key);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }
  return taken;
}

export function formatSetupCode(code: string) {
  const plain = code.replaceAll("-", "").toUpperCase();
  return `${plain.slice(0, 4)}-${plain.slice(4)}`;
}
