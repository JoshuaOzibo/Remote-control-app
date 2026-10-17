"use client";

import { useEffect } from "react";
import { CLOSE_CODE, isServerMsg, type ClientMsg, type KeyName } from "@/lib/protocol";
import { useRemoteStore } from "@/store/remoteStore";
import type { ConnectionError } from "@/types";

const RETRY_MS = 1000;

// One socket for the whole app, so the Remote and Connect screens share a connection.
let socket: WebSocket | null = null;
let target: { address: string; pin: string } | null = null;
let authed = false;
let everAuthed = false;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let onAuthed: (() => void) | undefined;
let autoConnectTried = false;

function toSocketUrl(address: string) {
  const host = address
    .trim()
    .replace(/^(https?|wss?):\/\//, "")
    .replace(/\/ws\/?$/, "")
    .replace(/\/+$/, "");
  const scheme = window.location.protocol === "https:" ? "wss" : "ws";
  return `${scheme}://${host}/ws`;
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

function open() {
  if (!target) return;
  const { address, pin } = target;
  const store = useRemoteStore.getState();

  let ws: WebSocket;
  try {
    ws = new WebSocket(toSocketUrl(address));
  } catch {
    // Malformed address: retrying won't help.
    target = null;
    store.setStatus("error", "unreachable");
    return;
  }
  socket = ws;
  authed = false;

  ws.onopen = () => {
    if (ws !== socket) return;
    ws.send(JSON.stringify({ t: "auth", pin } satisfies ClientMsg));
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
      authed = true;
      everAuthed = true;
      useRemoteStore.getState().remember(address, pin);
      useRemoteStore.getState().setStatus("connected");
      onAuthed?.();
      onAuthed = undefined;
    } else {
      stopRetrying(msg.reason ?? "wrong-pin");
      ws.close();
    }
  };

  ws.onclose = (event) => {
    if (ws !== socket) return;
    socket = null;
    authed = false;
    if (event.code === CLOSE_CODE.replaced) stopRetrying("replaced");
    if (!target) return;
    // A dropped working connection reconnects quietly; a laptop we never reached shows an error.
    if (everAuthed) useRemoteStore.getState().setStatus("connecting");
    else useRemoteStore.getState().setStatus("error", "unreachable");
    scheduleRetry();
  };
}

/** Opens a connection to `address` and authenticates with `pin`. Replaces any current connection. */
export function connect(address: string, pin: string, onSuccess?: () => void) {
  clearTimeout(retryTimer);
  const old = socket;
  socket = null;
  old?.close();

  target = { address, pin };
  authed = false;
  everAuthed = false;
  onAuthed = onSuccess;
  useRemoteStore.getState().setStatus("connecting");
  open();
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
}

/** Sends a message if the socket is open and authenticated. Returns whether it was sent. */
export function send(msg: ClientMsg) {
  if (!socket || !authed || socket.readyState !== WebSocket.OPEN) {
    if (process.env.NODE_ENV === "development") console.debug("[remote] not sent (offline)", msg);
    return false;
  }
  socket.send(JSON.stringify(msg));
  return true;
}

/** Shorthand for `send({ t: "key", k })`. */
export function sendKey(k: KeyName) {
  return send({ t: "key", k });
}

/**
 * Socket state plus actions. The first component to mount loads saved settings and
 * auto-connects to the last laptop.
 */
export function useRemote() {
  const status = useRemoteStore((s) => s.status);
  const error = useRemoteStore((s) => s.error);

  useEffect(() => {
    const store = useRemoteStore.getState();
    store.hydrate();
    if (autoConnectTried) return;
    autoConnectTried = true;
    const { address, pin } = useRemoteStore.getState();
    if (!target && address && /^\d{4}$/.test(pin)) connect(address, pin);
  }, []);

  return { status, error, connect, disconnect, send };
}
