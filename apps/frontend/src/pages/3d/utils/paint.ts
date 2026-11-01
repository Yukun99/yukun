const encode = (state: number, out: number[]) => {
  if (state < 3) {
    out.push(state << 2);
    return;
  }
  out.push(12);
  for (let extra = Math.floor((state - 3) / 15); extra > 0; extra--) out.push(15);
  out.push((state - 3) % 15);
};

export const remapPaint = (paint: string, index: (state: number) => number): string | null => {
  if (!/^[0-9A-F]+$/.test(paint)) return null;
  const codes = Array.from(paint, (char) => parseInt(char, 16)).reverse();
  const out: number[] = [];
  let pos = 0;
  const next = () => {
    if (pos >= codes.length) throw new RangeError('Truncated paint');
    return codes[pos++];
  };
  const node = () => {
    const code = next();
    const split = code & 3;
    if (split) {
      out.push(code);
      for (let i = split; i >= 0; i--) node();
      return;
    }
    let state = code >> 2;
    if ((code & 12) === 12) {
      let n = next();
      let extra = 0;
      while (n === 15) {
        extra++;
        n = next();
      }
      state = n + 15 * extra + 3;
    }
    encode(state === 0 ? 0 : index(state), out);
  };
  try {
    node();
  } catch (error) {
    if (error instanceof RangeError) return null;
    throw error;
  }
  if (pos !== codes.length) return null;
  return out.reverse().map((code) => code.toString(16).toUpperCase()).join('');
};
