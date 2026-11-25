import { createStagger } from '@/pages/ideas/utils/stagger';

describe('createStagger', () => {
  const at = (time: number) => vi.spyOn(performance, 'now').mockReturnValue(time);

  afterEach(() => vi.restoreAllMocks());

  it('should delay rows that mount together one step apart', () => {
    at(1000);
    const stagger = createStagger(150);
    expect([0, 1, 2].map(stagger)).toEqual([0, 150, 300]);
  });

  it('should give every tile of a row the same slot', () => {
    at(1000);
    const stagger = createStagger(150);
    stagger(0);
    stagger(1);
    at(1050);
    expect(stagger(1)).toBe(100);
  });

  it('should start a row that mounts later at once', () => {
    at(1000);
    const stagger = createStagger(150);
    stagger(0);
    at(5000);
    expect(stagger(1)).toBe(0);
    expect(stagger(2)).toBe(150);
  });
});
