export type Rgba = { r: number; g: number; b: number; a: number };

export const hex = (value: unknown) => {
  const match = /^#?([0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(typeof value === 'string' ? value.trim() : '');
  return match ? match[1].toLowerCase() : null;
};

export const hexToRgba = (hex: string): Rgba | null => {
  const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i.exec(hex.trim());
  if (!match) return null;
  const [r, g, b, a] = [match[1], match[2], match[3], match[4] ?? 'ff'].map((part) =>
    parseInt(part, 16),
  );
  return { r, g, b, a };
};

const pair = (value: number) => value.toString(16).padStart(2, '0');

export const rgbaToHex = ({ r, g, b, a }: Rgba) =>
  pair(r) + pair(g) + pair(b) + (a === 255 ? '' : pair(a));

export const rgbToHsv = ({ r, g, b }: Pick<Rgba, 'r' | 'g' | 'b'>) => {
  const [red, green, blue] = [r / 255, g / 255, b / 255];
  const max = Math.max(red, green, blue);
  const delta = max - Math.min(red, green, blue);
  let h = 0;
  if (delta) {
    if (max === red) h = ((green - blue) / delta) % 6;
    else if (max === green) h = (blue - red) / delta + 2;
    else h = (red - green) / delta + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? delta / max : 0, v: max };
};

export const hsvToRgb = (h: number, s: number, v: number) => {
  const channel = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };
  return { r: channel(5), g: channel(3), b: channel(1) };
};
