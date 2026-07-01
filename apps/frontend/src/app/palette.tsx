export const GRAY = {
  100: '#000000',
  90: '#1A1A1A',
  80: '#333333',
  70: '#4D4D4D',
  60: '#666666',
  50: '#808080',
  40: '#999999',
  30: '#B3B3B3',
  20: '#CCCCCC',
  10: '#E6E6E6',
  0: '#FFFFFF',
};

export const OPACITY = {
  100: 1,
  95: 0.95,
  90: 0.9,
  85: 0.85,
  80: 0.8,
  75: 0.75,
  70: 0.7,
  65: 0.65,
  60: 0.6,
  55: 0.55,
  50: 0.5,
  45: 0.45,
  40: 0.4,
  35: 0.35,
  30: 0.3,
  25: 0.25,
  20: 0.2,
  15: 0.15,
  10: 0.1,
  5: 0.05,
  0: 0,
};

export const PURPLE = { 0: '#BB36FF', 1: '#AA5FEE', 2: '#A35BDF', 3: '#9865F1', 4: '#8C56E1' };

// Combine hex color + opacity → 8-digit hex (#RRGGBBAA).
export function getColor(hex: string, opacity: number): string {
  const a = Math.round(Math.min(Math.max(opacity, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}
