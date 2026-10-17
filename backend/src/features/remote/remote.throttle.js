function createThrottle(limit, windowMs) {
  let windowStart = 0;
  let count = 0;

  return function allow() {
    const now = Date.now();
    if (now - windowStart >= windowMs) {
      windowStart = now;
      count = 0;
    }
    count += 1;
    return count <= limit;
  };
}

export { createThrottle };
