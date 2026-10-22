"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isCompletePin } from "@/components/ui/PinInput";
import { fetchLaptopName } from "@/lib/laptopInfo";
import { takeLaunchParams } from "@/lib/launchParams";
import { normalizeAddress, pageLaptopAddress } from "@/lib/network";
import { CLOSE_CODE, isServerMsg, type ClientMsg, type KeyName } from "@/lib/protocol";
import { IS_SITE } from "@/lib/site";
import { useRemoteStore } from "@/store/remoteStore";
import type { ConnectionError } from "@/types";

const RETRY_MS = 1000;
const SETUP_PATH = "/setup/";

const CLOSE_ERRORS: Partial<Record<number, ConnectionError>> = {
  [CLOSE_CODE.replaced]: "replaced",
  [CLOSE_CODE.setupExpired]: "setup-expired",
  [CLOSE_CODE.notSetUp]: "not-set-up",
};

type Target = { address: string; pin: string; setupCode: string | null };

export type Transport = { send: (msg: ClientMsg) => boolean };

let socket: WebSocket | null = null;
let target: Target | null = null;
let authed = false;
let everAuthed = false;
let setupAttempts = 0;
let retryWithAuth = false;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let onAuthed: (() => void) | undefined;
let started = false;
let transport: Transport | null = null;

function toSocketUrl(address: string) {
  const scheme = window.location.protocol === "https:" ? "wss" : "ws";
  return `${scheme}://${normalizeAddress(address)}/ws`;
}

function firstMessage({ pin, setupCode }: Target): ClientMsg {
  return setupCode ? { t: "setup", code: setupCode, pin } : { t: "auth", pin };
}

function stopRetrying(reason: ConnectionError) {
  target = null;
  onAuthed = undefined;
  useRemoteStore.getState().setStatus("error", reason);
}

function scheduleRetry() {
  clearTimeout(retryTimer);
  if (target) retryTimer = setTimeout(open, RETRY_MS);
}

function loggedIn(address: string, pin: string) {
  authed = true;
  everAuthed = true;
  if (target) target.setupCode = null;
  const store = useRemoteStore.getState();
  store.remember(address, pin);
  store.setSetupCode(null);
  store.setStatus("connected");
  onAuthed?.();
  onAuthed = undefined;
  fetchLaptopName(address).then((name) => {
    if (name) useRemoteStore.getState().rename(address, name);
  });
}

function open() {
  if (!target) return;
  const { address, pin } = target;

  let ws: WebSocket;
  try {
    ws = new WebSocket(toSocketUrl(address));
  } catch {
    target = null;
    useRemoteStore.getState().setStatus("error", "unreachable");
    return;
  }
  socket = ws;
  authed = false;

  ws.onopen = () => {
    if (ws !== socket || !target) return;
    if (target.setupCode) setupAttempts += 1;
    ws.send(JSON.stringify(firstMessage(target)));
  };

  ws.onmessage = (event) => {
    if (ws !== socket) return;
    let msg: unknown;
    try {
      msg = JSON.parse(String(event.data));
    } catch {
      return;
    }
    if (!isServerMsg(msg)) return;

    if (msg.ok) {
      loggedIn(address, pin);
    } else if (msg.t === "setup" && msg.reason === "setup-expired" && setupAttempts > 1 && target) {
      target.setupCode = null;
      retryWithAuth = true;
    } else {
      stopRetrying(msg.reason ?? "wrong-pin");
      ws.close();
    }
  };

  ws.onclose = (event) => {
    if (ws !== socket) return;
    socket = null;
    authed = false;
    if (retryWithAuth) {
      retryWithAuth = false;
      open();
      return;
    }
    const closeError = CLOSE_ERRORS[event.code];
    if (closeError) stopRetrying(closeError);
    if (!target) return;
    if (everAuthed) useRemoteStore.getState().setStatus("connecting");
    else useRemoteStore.getState().setStatus("error", "unreachable");
    scheduleRetry();
  };
}

function begin(next: Target, onSuccess?: () => void) {
  clearTimeout(retryTimer);
  const old = socket;
  socket = null;
  old?.close();

  target = next;
  authed = false;
  everAuthed = false;
  setupAttempts = 0;
  retryWithAuth = false;
  onAuthed = onSuccess;
  useRemoteStore.getState().setStatus("connecting");
  open();
}

export function connect(address: string, pin: string, onSuccess?: () => void) {
  begin({ address, pin, setupCode: null }, onSuccess);
}

export function setUp(address: string, setupCode: string, pin: string, onSuccess?: () => void) {
  begin({ address, pin, setupCode }, onSuccess);
}

export function disconnect() {
  clearTimeout(retryTimer);
  target = null;
  onAuthed = undefined;
  const old = socket;
  socket = null;
  authed = false;
  old?.close();
  useRemoteStore.getState().setStatus("idle");
  useRemoteStore.getState().setAutoConnect(false);
}

export function setTransport(next: Transport | null) {
  transport = next;
}

export function send(msg: ClientMsg) {
  if (transport) return transport.send(msg);
  if (!socket || !authed || socket.readyState !== WebSocket.OPEN) {
    if (process.env.NODE_ENV === "development") console.debug("[remote] not sent (offline)", msg);
    return false;
  }
  socket.send(JSON.stringify(msg));
  return true;
}

export function sendKey(k: KeyName) {
  return send({ t: "key", k });
}

function startUp(goToSetup: () => void) {
  if (started) return;
  started = true;
  const store = useRemoteStore.getState();
  store.hydrate();
  if (transport || IS_SITE) return;

  const launch = takeLaunchParams();
  if (launch.setupCode) {
    store.setSetupCode(launch.setupCode);
    if (window.location.pathname !== SETUP_PATH) goToSetup();
    return;
  }
  if (launch.pin) {
    connect(pageLaptopAddress(), launch.pin);
    return;
  }
  const { address, pin, autoConnect } = useRemoteStore.getState();
  if (autoConnect && !target && address && isCompletePin(pin)) connect(address, pin);
}

export function useRemote() {
  const router = useRouter();
  const status = useRemoteStore((s) => s.status);
  const error = useRemoteStore((s) => s.error);

  useEffect(() => {
    startUp(() => router.replace(SETUP_PATH));
  }, [router]);

  return { status, error, connect, setUp, disconnect, send };
}
