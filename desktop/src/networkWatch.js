const CHECK_EVERY_MS = 3000;

function watchNetwork(findAddress, onChange) {
  let current;
  let checking = false;

  async function check() {
    if (checking) return;
    checking = true;
    try {
      const address = await findAddress();
      if (address !== current) {
        current = address;
        onChange(address);
      }
    } finally {
      checking = false;
    }
  }

  check();
  const timer = setInterval(check, CHECK_EVERY_MS);
  return () => clearInterval(timer);
}

export { watchNetwork };
