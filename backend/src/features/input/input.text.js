const TYPEABLE = /^[\x20-\x7e\t]$/;

function kindOf(char) {
  if (char === '\n') return 'enter';
  return TYPEABLE.test(char) ? 'type' : 'paste';
}

function segmentText(text) {
  const segments = [];
  for (const char of text.replace(/\r\n?/g, '\n')) {
    const kind = kindOf(char);
    const last = segments.at(-1);
    if (kind !== 'enter' && last?.kind === kind) last.text += char;
    else segments.push({ kind, text: char });
  }
  return segments;
}

export { segmentText };
