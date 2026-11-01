import { hexToRgba, hsvToRgb, rgbaToHex, rgbToHsv } from '@/pages/3d/utils/colour';

describe('hexToRgba', () => {
  it('should read six digits as opaque', () => {
    expect(hexToRgba('ff8000')).toEqual({ r: 255, g: 128, b: 0, a: 255 });
  });

  it('should read eight digits with alpha, a hash and any case', () => {
    expect(hexToRgba('#FF800080')).toEqual({ r: 255, g: 128, b: 0, a: 128 });
  });

  it.each(['', 'ff80', 'ff80000', 'gg0000', 'ff8000800'])('should reject %j', (value) => {
    expect(hexToRgba(value)).toBeNull();
  });
});

describe('rgbaToHex', () => {
  it('should write six lowercase digits when opaque', () => {
    expect(rgbaToHex({ r: 255, g: 128, b: 0, a: 255 })).toBe('ff8000');
  });

  it('should write eight digits otherwise', () => {
    expect(rgbaToHex({ r: 1, g: 2, b: 3, a: 4 })).toBe('01020304');
  });
});

describe('rgbToHsv and hsvToRgb', () => {
  it('should convert primaries', () => {
    expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 1, v: 1 });
    expect(rgbToHsv({ r: 0, g: 255, b: 0 }).h).toBe(120);
    expect(rgbToHsv({ r: 0, g: 0, b: 255 }).h).toBe(240);
    expect(rgbToHsv({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 });
  });

  it('should round trip', () => {
    for (const rgb of [
      { r: 12, g: 200, b: 99 },
      { r: 255, g: 255, b: 255 },
      { r: 130, g: 7, b: 250 },
    ]) {
      const { h, s, v } = rgbToHsv(rgb);
      expect(hsvToRgb(h, s, v)).toEqual(rgb);
    }
  });
});
