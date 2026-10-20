import { execFile } from 'child_process';

const PROFILES_COMMAND =
  'Get-NetConnectionProfile | ForEach-Object { [pscustomobject]@{ alias = $_.InterfaceAlias; category = $_.NetworkCategory.ToString() } } | ConvertTo-Json -Compress';
const TIMEOUT_MS = 10000;

function readProfiles() {
  return new Promise((resolve) => {
    execFile(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', PROFILES_COMMAND],
      { windowsHide: true, timeout: TIMEOUT_MS },
      (error, stdout) => {
        if (error || !stdout.trim()) return resolve([]);
        try {
          const parsed = JSON.parse(stdout);
          resolve(Array.isArray(parsed) ? parsed : [parsed]);
        } catch {
          resolve([]);
        }
      },
    );
  });
}

async function isPublicNetwork(adapterName) {
  if (!adapterName) return false;
  const profiles = await readProfiles();
  return profiles.some(({ alias, category }) => alias === adapterName && category === 'Public');
}

export { isPublicNetwork };
