const COPIED_FOR_MS = 1500;

const TEXT = {
  setup: {
    badge: "Setup",
    title: "Set up your phone",
    lead: "Scan this with your phone's camera, then choose a PIN. Your phone must be on the same Wi-Fi.",
  },
  ready: {
    badge: "Ready",
    title: "Ready",
    lead: "Scan to open the remote on your phone, then enter your PIN.",
  },
  offline: {
    title: "No Wi-Fi",
    lead: "Connect this laptop to Wi-Fi, or turn on Mobile hotspot. The QR code appears here.",
  },
};

const $ = (id) => document.getElementById(id);

function render(state) {
  const text = TEXT[state.mode];
  const online = Boolean(state.url);

  document.body.dataset.mode = state.mode;
  document.body.dataset.phone = state.controller ? "on" : "off";
  $("badge").textContent = text.badge;
  $("title").textContent = online ? text.title : TEXT.offline.title;
  $("lead").textContent = online ? text.lead : TEXT.offline.lead;

  $("qr-card").hidden = !online;
  if (state.qr) $("qr").src = state.qr;

  $("setup-code-box").hidden = state.mode !== "setup" || !online;
  $("setup-code").textContent = state.setupCode ?? "";
  $("url").hidden = state.mode !== "ready" || !online;
  $("url").textContent = state.url ?? "";

  $("copy").disabled = !online;
  $("warning").hidden = !state.publicNetwork;
  $("reset").hidden = state.mode !== "ready";
  $("phone").textContent = state.controller ? `Phone connected · ${state.controller}` : "No phone connected";
  $("version").textContent = `v${state.version} · port ${state.port}`;
  $("update").hidden = !state.update;
  $("update").textContent = state.update ? `· Update to v${state.update}` : "";
}

$("copy").addEventListener("click", async () => {
  const button = $("copy");
  if (!(await window.phoneRemote.copyLink())) return;
  button.textContent = "Copied";
  setTimeout(() => {
    button.textContent = "Copy link";
  }, COPIED_FOR_MS);
});
$("reset").addEventListener("click", () => window.phoneRemote.resetPin());
$("wifi-settings").addEventListener("click", () => window.phoneRemote.openWifiSettings());
$("update").addEventListener("click", () => window.phoneRemote.openUpdate());

window.phoneRemote.onState(render);
