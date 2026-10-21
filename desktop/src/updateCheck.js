import { net } from 'electron';

const REPOSITORY = 'JoshuaOzibo/Remote-control-app';
const LATEST_RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
const FIRST_CHECK_MS = 10 * 1000;
const CHECK_EVERY_MS = 24 * 60 * 60 * 1000;

function parseVersion(version) {
  const match = String(version).trim().match(/^v?(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : null;
}

function isNewer(candidate, current) {
  const next = parseVersion(candidate);
  const now = parseVersion(current);
  if (!next || !now) return false;
  for (let i = 0; i < next.length; i++) {
    if (next[i] !== now[i]) return next[i] > now[i];
  }
  return false;
}

async function fetchLatestRelease(currentVersion) {
  const response = await net.fetch(LATEST_RELEASE_API, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': `PhoneRemote/${currentVersion}` },
  });
  if (!response.ok) return null;
  const release = await response.json();
  if (release.draft || release.prerelease || !parseVersion(release.tag_name)) return null;
  return { version: release.tag_name.replace(/^v/, ''), url: release.html_url };
}

function watchForUpdates({ currentVersion, onUpdate, onError }) {
  async function check() {
    try {
      const release = await fetchLatestRelease(currentVersion);
      if (release && isNewer(release.version, currentVersion)) onUpdate(release);
    } catch (error) {
      onError?.(error);
    }
  }

  const first = setTimeout(check, FIRST_CHECK_MS);
  const timer = setInterval(check, CHECK_EVERY_MS);
  return () => {
    clearTimeout(first);
    clearInterval(timer);
  };
}

export { isNewer, watchForUpdates };
